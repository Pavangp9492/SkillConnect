import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verify if live Supabase credentials are valid and not placeholders
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-public-api-key')
);

// Initialize Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Initial sample data matching supabase/seed.sql
export const INITIAL_WORKSHOPS = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    title: 'Basic Computer Skills for Beginners',
    category: 'Technology',
    description: 'A hands-on introductory workshop designed for community members who want to learn how to operate a computer, browse the web safely, send emails, and use office applications for everyday personal and professional tasks.',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00 AM - 1:00 PM',
    venue: 'Panchayat Community Center, Hall A',
    total_seats: 25,
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    title: 'Digital Literacy for Senior Citizens',
    category: 'Digital Literacy',
    description: 'Specially tailored for elders to learn how to navigate smartphones, make digital payments via UPI, book healthcare appointments online, and communicate with family members securely on messaging apps.',
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '02:00 PM - 4:30 PM',
    venue: 'Village Library & Learning Hub',
    total_seats: 20,
    image_url: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    title: 'Tailoring, Stitching & Garment Craft',
    category: 'Vocational Skills',
    description: 'Practical training covering sewing machine operation, garment cutting, stitching patterns, and garment repair. Ideal for homemakers and youth seeking self-employment and micro-business opportunities.',
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '09:30 AM - 1:30 PM',
    venue: 'Women Self-Help Group Center, Block 2',
    total_seats: 18,
    image_url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    title: 'First Aid & Emergency Response Awareness',
    category: 'Healthcare',
    description: 'Learn essential life-saving skills including CPR, managing cuts and burns, treating fractures, heatstroke prevention, and handling common medical emergencies before ambulance or hospital arrival.',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00 AM - 12:30 PM',
    venue: 'Primary Health Sub-Center Auditorium',
    total_seats: 30,
    image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    title: 'Organic Farming & Composting Techniques',
    category: 'Agriculture',
    description: 'Master natural fertilizer preparation (Jeevamrutha, vermicompost), non-chemical pest management, soil conservation, and organic crop certification for sustainable yield and cost reduction.',
    date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '08:30 AM - 12:00 PM',
    venue: 'Krishi Vikas Kendra, Agricultural Demonstration Field',
    total_seats: 35,
    image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    title: 'Entrepreneurship & Small Business Skills',
    category: 'Business',
    description: 'Practical guidance for aspiring local entrepreneurs on business idea validation, basic financial accounting, accessing government loan schemes (Mudra/NABARD), and marketing local village products.',
    date: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '11:00 AM - 2:00 PM',
    venue: 'Community Skill Development Center, Seminar Room',
    total_seats: 25,
    image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_REGISTRATIONS = [
  {
    id: 'r1111111-1111-1111-1111-111111111111',
    workshop_id: 'a1111111-1111-1111-1111-111111111111',
    participant_name: 'Ramesh Kumar',
    email: 'ramesh.kumar@example.com',
    phone: '9876543210',
    age: 24,
    village: 'Kothur Village',
    attendance_status: 'Present',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r2222222-2222-2222-2222-222222222222',
    workshop_id: 'a1111111-1111-1111-1111-111111111111',
    participant_name: 'Sunita Devi',
    email: 'sunita.devi@example.com',
    phone: '9876543211',
    age: 29,
    village: 'Rampur Sector 4',
    attendance_status: 'Registered',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r3333333-3333-3333-3333-333333333333',
    workshop_id: 'a1111111-1111-1111-1111-111111111111',
    participant_name: 'Amit Sharma',
    email: 'amit.sharma@example.com',
    phone: '9876543212',
    age: 21,
    village: 'Shivaji Nagar',
    attendance_status: 'Registered',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r4444444-4444-4444-4444-444444444444',
    workshop_id: 'a3333333-3333-3333-3333-333333333333',
    participant_name: 'Pooja Verma',
    email: 'pooja.verma@example.com',
    phone: '9876543213',
    age: 32,
    village: 'Greenfield Basti',
    attendance_status: 'Present',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r5555555-5555-5555-5555-555555555555',
    workshop_id: 'a3333333-3333-3333-3333-333333333333',
    participant_name: 'Lakshmi Bai',
    email: 'lakshmi.bai@example.com',
    phone: '9876543214',
    age: 40,
    village: 'Kothur Village',
    attendance_status: 'Registered',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r6666666-6666-6666-6666-666666666666',
    workshop_id: 'a5555555-5555-5555-5555-555555555555',
    participant_name: 'Balwinder Singh',
    email: 'balwinder.singh@example.com',
    phone: '9876543215',
    age: 45,
    village: 'Kisan Palli',
    attendance_status: 'Present',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r7777777-7777-7777-7777-777777777777',
    workshop_id: 'a5555555-5555-5555-5555-555555555555',
    participant_name: 'Suresh Patil',
    email: 'suresh.patil@example.com',
    phone: '9876543216',
    age: 38,
    village: 'Adarsh Gram',
    attendance_status: 'Absent',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
