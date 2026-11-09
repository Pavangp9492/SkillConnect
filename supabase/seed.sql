-- ==============================================================================
-- SkillConnect Sample Seed Data
-- Demonstration Data for Community Skill-Building Workshops
-- ==============================================================================

-- Clear existing sample data
TRUNCATE TABLE public.registrations CASCADE;
TRUNCATE TABLE public.workshops CASCADE;

-- Insert 6 Core Skill-Building Workshops
INSERT INTO public.workshops (id, title, category, description, date, time, venue, total_seats, image_url)
VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'Basic Computer Skills for Beginners',
    'Technology',
    'A hands-on introductory workshop designed for community members who want to learn how to operate a computer, browse the web safely, send emails, and use office applications for everyday personal and professional tasks.',
    CURRENT_DATE + INTERVAL '5 days',
    '10:00 AM - 1:00 PM',
    'Panchayat Community Center, Hall A',
    25,
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
),
(
    'a2222222-2222-2222-2222-222222222222',
    'Digital Literacy for Senior Citizens',
    'Digital Literacy',
    'Specially tailored for elders to learn how to navigate smartphones, make digital payments via UPI, book healthcare appointments online, and communicate with family members securely on messaging apps.',
    CURRENT_DATE + INTERVAL '8 days',
    '02:00 PM - 4:30 PM',
    'Village Library & Learning Hub',
    20,
    'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=800&q=80'
),
(
    'a3333333-3333-3333-3333-333333333333',
    'Tailoring, Stitching & Garment Craft',
    'Vocational Skills',
    'Practical training covering sewing machine operation, garment cutting, stitching patterns, and garment repair. Ideal for homemakers and youth seeking self-employment and micro-business opportunities.',
    CURRENT_DATE + INTERVAL '12 days',
    '09:30 AM - 1:30 PM',
    'Women Self-Help Group Center, Block 2',
    18,
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80'
),
(
    'a4444444-4444-4444-4444-444444444444',
    'First Aid & Emergency Response Awareness',
    'Healthcare',
    'Learn essential life-saving skills including CPR, managing cuts and burns, treating fractures, heatstroke prevention, and handling common medical emergencies before ambulance or hospital arrival.',
    CURRENT_DATE + INTERVAL '15 days',
    '10:00 AM - 12:30 PM',
    'Primary Health Sub-Center Auditorium',
    30,
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
),
(
    'a5555555-5555-5555-5555-555555555555',
    'Organic Farming & Composting Techniques',
    'Agriculture',
    'Master natural fertilizer preparation (Jeevamrutha, vermicompost), non-chemical pest management, soil conservation, and organic crop certification for sustainable yield and cost reduction.',
    CURRENT_DATE + INTERVAL '19 days',
    '08:30 AM - 12:00 PM',
    'Krishi Vikas Kendra, Agricultural Demonstration Field',
    35,
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
),
(
    'a6666666-6666-6666-6666-666666666666',
    'Entrepreneurship & Small Business Skills',
    'Business',
    'Practical guidance for aspiring local entrepreneurs on business idea validation, basic financial accounting, accessing government loan schemes (Mudra/NABARD), and marketing local village products.',
    CURRENT_DATE + INTERVAL '24 days',
    '11:00 AM - 2:00 PM',
    'Community Skill Development Center, Seminar Room',
    25,
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'
);

-- Insert Sample Registrations for Demonstration & Testing
INSERT INTO public.registrations (workshop_id, participant_name, email, phone, age, village, attendance_status, created_at)
VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'Ramesh Kumar',
    'ramesh.kumar@example.com',
    '9876543210',
    24,
    'Kothur Village',
    'Present',
    NOW() - INTERVAL '3 days'
),
(
    'a1111111-1111-1111-1111-111111111111',
    'Sunita Devi',
    'sunita.devi@example.com',
    '9876543211',
    29,
    'Rampur Sector 4',
    'Registered',
    NOW() - INTERVAL '2 days'
),
(
    'a1111111-1111-1111-1111-111111111111',
    'Amit Sharma',
    'amit.sharma@example.com',
    '9876543212',
    21,
    'Shivaji Nagar',
    'Registered',
    NOW() - INTERVAL '1 day'
),
(
    'a3333333-3333-3333-3333-333333333333',
    'Pooja Verma',
    'pooja.verma@example.com',
    '9876543213',
    32,
    'Greenfield Basti',
    'Present',
    NOW() - INTERVAL '4 days'
),
(
    'a3333333-3333-3333-3333-333333333333',
    'Lakshmi Bai',
    'lakshmi.bai@example.com',
    '9876543214',
    40,
    'Kothur Village',
    'Registered',
    NOW() - INTERVAL '2 days'
),
(
    'a5555555-5555-5555-5555-555555555555',
    'Balwinder Singh',
    'balwinder.singh@example.com',
    '9876543215',
    45,
    'Kisan Palli',
    'Present',
    NOW() - INTERVAL '5 days'
),
(
    'a5555555-5555-5555-5555-555555555555',
    'Suresh Patil',
    'suresh.patil@example.com',
    '9876543216',
    38,
    'Adarsh Gram',
    'Absent',
    NOW() - INTERVAL '3 days'
);
