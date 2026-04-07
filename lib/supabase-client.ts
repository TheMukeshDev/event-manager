/**
 * Supabase Client Configuration
 * Currently using mock data - uncomment and configure when ready for Supabase integration
 */

// Uncomment these imports when integrating with Supabase
// import { createBrowserClient } from '@supabase/ssr'
// import type { Database } from '@/lib/database.types'

// export function createClient() {
//   return createBrowserClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )
// }

// For server-side operations:
// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import type { Database } from '@/lib/database.types'

// export async function createServerSupabaseClient() {
//   const cookieStore = await cookies()

//   return createServerClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll()
//         },
//         setAll(cookiesToSet) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options)
//             )
//           } catch {
//             // Catch errors during cookie setting - this can happen
//             // when setting cookies in a Server Component
//           }
//         },
//       },
//     }
//   )
// }

/**
 * Database Types
 * Generate these using: supabase gen types typescript --project-id your_project_id
 * Place in lib/database.types.ts
 */

// Example structure for reference:
// export interface Database {
//   public: {
//     Tables: {
//       events: {
//         Row: Event
//         Insert: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
//         Update: Partial<Event>
//       }
//       event_tracks: {
//         Row: EventTrack
//         Insert: Omit<EventTrack, 'id'>
//         Update: Partial<EventTrack>
//       }
//       // ... other tables
//     }
//   }
// }

/**
 * API Endpoints
 * These will be used to fetch data from Supabase
 */

// Example API route structure:
// GET /api/events - Get all events
// GET /api/events/[id] - Get specific event
// GET /api/events/[id]/tracks - Get event tracks
// GET /api/events/[id]/timeline - Get event timeline
// GET /api/events/[id]/prizes - Get event prizes
// GET /api/events/[id]/team - Get event team
// GET /api/events/[id]/sponsors - Get event sponsors
// GET /api/events/[id]/faqs - Get event FAQs
// POST /api/events/[id]/register - Register for event
// POST /api/auth/register - User registration
// POST /api/auth/login - User login
// GET /api/auth/session - Get current session

/**
 * Environment Variables Needed
 * 
 * .env.local should contain:
 * NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
 * SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (for server-side only)
 */

/**
 * Database Schema Migration SQL
 * 
 * These tables should be created in Supabase:
 */

export const DATABASE_SCHEMA_SQL = `
-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255),
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Tracks table
CREATE TABLE IF NOT EXISTS event_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  max_participants INTEGER,
  registered_count INTEGER DEFAULT 0,
  difficulty VARCHAR(50),
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline Items table
CREATE TABLE IF NOT EXISTS timeline_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  time TIME NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  duration VARCHAR(100),
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prizes table
CREATE TABLE IF NOT EXISTS prizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2),
  currency VARCHAR(10),
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  bio TEXT,
  email VARCHAR(255),
  twitter_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  description TEXT,
  tier VARCHAR(50),
  contact_email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Highlights table
CREATE TABLE IF NOT EXISTS highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(50),
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url VARCHAR(500),
  bio TEXT,
  role VARCHAR(50) DEFAULT 'participant',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ambassador applications table
CREATE TABLE IF NOT EXISTS ambassador_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  college_name VARCHAR(500) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  section VARCHAR(100) NOT NULL,
  year_or_semester VARCHAR(100) NOT NULL,
  city VARCHAR(255),
  state VARCHAR(255),
  why_fit_for_role TEXT NOT NULL,
  prior_experience TEXT,
  social_profile_link VARCHAR(500),
  whatsapp_number VARCHAR(50),
  consent BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ambassadors table
CREATE TABLE IF NOT EXISTS ambassadors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  application_id UUID REFERENCES ambassador_applications(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  college_name VARCHAR(500) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  section VARCHAR(100) NOT NULL,
  year_or_semester VARCHAR(100) NOT NULL,
  city VARCHAR(255),
  state VARCHAR(255),
  referral_code VARCHAR(255) UNIQUE,
  referral_link VARCHAR(500),
  total_referrals INTEGER DEFAULT 0,
  valid_referral_count INTEGER DEFAULT 0,
  reward_eligible BOOLEAN DEFAULT FALSE,
  certificate_eligible BOOLEAN DEFAULT FALSE,
  goodies_eligible BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'approved',
  reward_status VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_ids TEXT[] DEFAULT '{}',
  referral_code VARCHAR(255),
  ambassador_id UUID REFERENCES ambassadors(id) ON DELETE SET NULL,
  valid_referral BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'registered',
  attendance_verified BOOLEAN DEFAULT FALSE,
  checkin_time TIMESTAMP WITH TIME ZONE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  track_id UUID REFERENCES event_tracks(id) ON DELETE SET NULL,
  certificate_url VARCHAR(500),
  verification_id VARCHAR(255) UNIQUE,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ambassadors table
CREATE TABLE IF NOT EXISTS ambassadors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  application_id UUID REFERENCES ambassador_applications(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  college_name VARCHAR(500) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  section VARCHAR(100) NOT NULL,
  year_or_semester VARCHAR(100) NOT NULL,
  city VARCHAR(255),
  state VARCHAR(255),
  referral_code VARCHAR(255) UNIQUE,
  referral_link VARCHAR(500),
  total_referrals INTEGER DEFAULT 0,
  valid_referral_count INTEGER DEFAULT 0,
  reward_eligible BOOLEAN DEFAULT FALSE,
  certificate_eligible BOOLEAN DEFAULT FALSE,
  goodies_eligible BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'approved',
  reward_status VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ambassador referrals table
CREATE TABLE IF NOT EXISTS ambassador_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ambassador_id UUID REFERENCES ambassadors(id) ON DELETE CASCADE,
  referred_email VARCHAR(255),
  referred_name VARCHAR(255),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  proof_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ambassador proof submissions table
CREATE TABLE IF NOT EXISTS ambassador_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ambassador_id UUID REFERENCES ambassadors(id) ON DELETE CASCADE,
  proof_file_url VARCHAR(500),
  proof_description TEXT,
  number_of_students_claimed INTEGER DEFAULT 0,
  referred_student_emails TEXT[],
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY,
  registration_link VARCHAR(500),
  whatsapp_community_link VARCHAR(500),
  is_whatsapp_join_mandatory BOOLEAN DEFAULT TRUE,
  certificate_rules_text TEXT,
  certificate_id_prefix VARCHAR(255),
  sponsor_cta_whatsapp_number VARCHAR(50),
  sponsor_cta_default_message TEXT,
  sponsor_cta_visible BOOLEAN DEFAULT TRUE,
  campus_ambassador_enabled BOOLEAN DEFAULT TRUE,
  referral_threshold INTEGER DEFAULT 10,
  reward_title VARCHAR(255),
  reward_description TEXT,
  use_external_proof_form BOOLEAN DEFAULT TRUE,
  external_proof_form_link VARCHAR(500),
  leaderboard_visible BOOLEAN DEFAULT TRUE,
  ambassador_share_message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_event_tracks_event_id ON event_tracks(event_id);
CREATE INDEX idx_timeline_items_event_id ON timeline_items(event_id);
CREATE INDEX idx_prizes_event_id ON prizes(event_id);
CREATE INDEX idx_team_members_event_id ON team_members(event_id);
CREATE INDEX idx_sponsors_event_id ON sponsors(event_id);
CREATE INDEX idx_faqs_event_id ON faqs(event_id);
CREATE INDEX idx_highlights_event_id ON highlights(event_id);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_event_id ON certificates(event_id);
CREATE INDEX idx_ambassadors_event_id ON ambassadors(event_id);
CREATE INDEX idx_ambassador_referrals_ambassador_id ON ambassador_referrals(ambassador_id);
CREATE INDEX idx_ambassador_proofs_ambassador_id ON ambassador_proofs(ambassador_id);
`
