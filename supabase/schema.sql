-- ==============================================================================
-- SkillConnect Database Schema - Supabase PostgreSQL
-- Community Skill-Building Workshop Management System
--
-- Safe, Non-Destructive, Idempotent Execution for Supabase SQL Editor
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked with Supabase Auth users)
-- Preserves existing user profiles; new users default strictly to 'participant'
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. WORKSHOPS TABLE
-- Preserves existing workshop catalog
CREATE TABLE IF NOT EXISTS public.workshops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    venue TEXT NOT NULL,
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. REGISTRATIONS TABLE
-- Preserves existing participant registrations
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
    participant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age < 120),
    village TEXT NOT NULL,
    attendance_status TEXT NOT NULL DEFAULT 'Registered' CHECK (attendance_status IN ('Registered', 'Present', 'Absent')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_workshop_participant_email UNIQUE (workshop_id, email)
);

-- 5. PERFORMANCE INDEXES (Idempotent)
CREATE INDEX IF NOT EXISTS idx_workshops_date ON public.workshops(date);
CREATE INDEX IF NOT EXISTS idx_workshops_category ON public.workshops(category);
CREATE INDEX IF NOT EXISTS idx_registrations_workshop_id ON public.registrations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_attendance ON public.registrations(attendance_status);

-- 6. SECURE HELPER FUNCTION TO CHECK IF CURRENT CALLER IS ADMINISTRATOR
-- Enforces fixed search_path to prevent search-path hijacking attacks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 7. ROW LEVEL SECURITY (RLS) ACTIVATION
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 8. ROW LEVEL SECURITY POLICIES (Idempotent Drop & Recreate)

-- 8A. PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
CREATE POLICY "Admins can manage profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 8B. WORKSHOPS POLICIES
-- Anyone (public visitors & authenticated users) can view published workshops
DROP POLICY IF EXISTS "Public can view workshops" ON public.workshops;
CREATE POLICY "Public can view workshops"
    ON public.workshops FOR SELECT
    TO anon, authenticated
    USING (true);

-- Only authenticated administrators can create new workshops
DROP POLICY IF EXISTS "Admins can insert workshops" ON public.workshops;
CREATE POLICY "Admins can insert workshops"
    ON public.workshops FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Only authenticated administrators can update existing workshops
DROP POLICY IF EXISTS "Admins can update workshops" ON public.workshops;
CREATE POLICY "Admins can update workshops"
    ON public.workshops FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only authenticated administrators can delete workshops
DROP POLICY IF EXISTS "Admins can delete workshops" ON public.workshops;
CREATE POLICY "Admins can delete workshops"
    ON public.workshops FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 8C. REGISTRATIONS POLICIES
-- Public visitors can submit workshop registrations
DROP POLICY IF EXISTS "Public can register for workshops" ON public.registrations;
CREATE POLICY "Public can register for workshops"
    ON public.registrations FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Public cannot view registrations; only authenticated administrators can access private records
DROP POLICY IF EXISTS "Only admins can view registrations" ON public.registrations;
CREATE POLICY "Only admins can view registrations"
    ON public.registrations FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Only authenticated administrators can update registrations (e.g. mark attendance)
DROP POLICY IF EXISTS "Only admins can update registrations" ON public.registrations;
CREATE POLICY "Only admins can update registrations"
    ON public.registrations FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only authenticated administrators can delete registrations
DROP POLICY IF EXISTS "Only admins can delete registrations" ON public.registrations;
CREATE POLICY "Only admins can delete registrations"
    ON public.registrations FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 9. SAFE WORKSHOPS STATISTICS VIEW
-- Exposes remaining seat calculations publicly without leaking personal participant information
CREATE OR REPLACE VIEW public.workshops_with_stats AS
SELECT 
    w.id,
    w.title,
    w.category,
    w.description,
    w.date,
    w.time,
    w.venue,
    w.total_seats,
    w.image_url,
    w.created_at,
    COALESCE(COUNT(r.id), 0)::INTEGER AS registered_count,
    GREATEST(0, (w.total_seats - COALESCE(COUNT(r.id), 0)))::INTEGER AS available_seats
FROM public.workshops w
LEFT JOIN public.registrations r ON w.id = r.workshop_id
GROUP BY w.id;

GRANT SELECT ON public.workshops_with_stats TO anon, authenticated;

-- 10. ATOMIC CONCURRENCY-SAFE REGISTRATION FUNCTION
-- Uses FOR UPDATE row locking on workshops to eliminate race conditions and prevent overbooking
CREATE OR REPLACE FUNCTION public.register_for_workshop(
    p_workshop_id UUID,
    p_participant_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_age INTEGER,
    p_village TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_total_seats INTEGER;
    v_registered_count INTEGER;
    v_new_reg RECORD;
BEGIN
    -- 1. Check if workshop exists and lock row with FOR UPDATE to serialize concurrent requests
    SELECT total_seats INTO v_total_seats
    FROM public.workshops
    WHERE id = p_workshop_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Workshop not found.');
    END IF;

    -- 2. Prevent duplicate registration with same email for the same workshop
    IF EXISTS (
        SELECT 1 FROM public.registrations
        WHERE workshop_id = p_workshop_id AND LOWER(TRIM(email)) = LOWER(TRIM(p_email))
    ) THEN
        RETURN json_build_object('success', false, 'error', 'You are already registered for this workshop with this email address.');
    END IF;

    -- 3. Calculate registered count and enforce seat capacity
    SELECT COUNT(*) INTO v_registered_count
    FROM public.registrations
    WHERE workshop_id = p_workshop_id;

    IF v_registered_count >= v_total_seats THEN
        RETURN json_build_object('success', false, 'error', 'This workshop is fully booked. No available seats remaining.');
    END IF;

    -- 4. Insert participant registration atomically
    INSERT INTO public.registrations (
        workshop_id,
        participant_name,
        email,
        phone,
        age,
        village,
        attendance_status
    ) VALUES (
        p_workshop_id,
        TRIM(p_participant_name),
        LOWER(TRIM(p_email)),
        TRIM(p_phone),
        p_age,
        TRIM(p_village),
        'Registered'
    )
    RETURNING id, workshop_id, participant_name, email, phone, age, village, attendance_status, created_at
    INTO v_new_reg;

    RETURN json_build_object(
        'success', true,
        'registration', row_to_json(v_new_reg),
        'remaining_seats', (v_total_seats - v_registered_count - 1)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_for_workshop TO anon, authenticated;

-- 11. AUTOMATIC PROFILE TRIGGER ON SUPABASE AUTH SIGNUP
-- Security Rule: New users ALWAYS receive 'participant' role.
-- Never trust user metadata for role assignment.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        new.id,
        COALESCE(NULLIF(TRIM(new.raw_user_meta_data->>'full_name'), ''), 'Community Member'),
        'participant' -- Non-negotiable: All new accounts are participants by default
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name;
    -- Note: Role is intentionally NEVER updated on conflict to prevent escalation
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. SECURE EXPLICIT ADMINISTRATOR ASSIGNMENT FUNCTION
-- Administrators can ONLY be designated through an explicit database operation.
-- Usage via Supabase SQL Editor: SELECT public.assign_admin_role('admin@skillconnect.org');
CREATE OR REPLACE FUNCTION public.assign_admin_role(p_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_user_id UUID;
    v_rows_updated INTEGER;
BEGIN
    -- Locate the authenticated user by email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE LOWER(TRIM(email)) = LOWER(TRIM(p_email));

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', format('User with email "%s" not found in auth.users. Please create the user in Supabase Authentication first.', p_email)
        );
    END IF;

    -- Explicitly update profile to admin role
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = v_user_id;

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

    IF v_rows_updated = 0 THEN
        INSERT INTO public.profiles (id, full_name, role)
        VALUES (v_user_id, split_part(p_email, '@', 1), 'admin');
    END IF;

    RETURN json_build_object(
        'success', true,
        'message', format('User "%s" has been successfully granted administrator privileges.', p_email)
    );
END;
$$;

-- Restrict execution to service_role or authenticated administrators
REVOKE EXECUTE ON FUNCTION public.assign_admin_role(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.assign_admin_role(TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.assign_admin_role(TEXT) TO authenticated, service_role;
