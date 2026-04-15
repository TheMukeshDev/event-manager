-- TechQuiz Event Management Database Schema
-- This schema is designed for Supabase PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  college VARCHAR(255),
  stream VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'participant',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  time_start TIME,
  time_end TIME,
  mode VARCHAR(50),
  total_seats INTEGER DEFAULT 50,
  registration_deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  registration_date TIMESTAMP DEFAULT now(),
  status VARCHAR(50) DEFAULT 'registered', -- 'registered', 'completed', 'cancelled'
  score INTEGER,
  time_taken INTEGER, -- in seconds
  rank INTEGER,
  whatsapp_joined BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id VARCHAR(50) UNIQUE NOT NULL, -- Format: BBSCET-TQ-2026-[TYPE]-[SERIAL]
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  event_name VARCHAR(255) NOT NULL,
  issue_date TIMESTAMP DEFAULT now(),
  certificate_type VARCHAR(50), -- 'P' for participation, 'W1' for winner 1st, 'W2' for winner 2nd, 'W3' for winner 3rd
  certificate_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'issued', -- 'issued', 'verified', 'revoked'
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Certificate Records table (for Unstop CSV import)
CREATE TABLE IF NOT EXISTS certificate_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id VARCHAR(50) UNIQUE NOT NULL, -- Format: THBBS-2026-0001
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  event VARCHAR(255) NOT NULL DEFAULT 'TechQuiz 2026',
  score INTEGER,
  rank INTEGER,
  certificate_type VARCHAR(50) NOT NULL, -- 'winner', 'runner-up', 'second-runner-up', 'participation'
  status VARCHAR(50) DEFAULT 'valid', -- 'valid', 'invalid'
  sent_status BOOLEAN DEFAULT false,
  imported_at TIMESTAMP DEFAULT now(),
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for certificate_records
CREATE INDEX idx_certificate_records_email ON certificate_records(email);
CREATE INDEX idx_certificate_records_certificate_id ON certificate_records(certificate_id);
CREATE INDEX idx_certificate_records_sent_status ON certificate_records(sent_status);

-- New fields for admin certificates workflow
ALTER TABLE certificate_records 
ADD COLUMN IF NOT EXISTS template_used VARCHAR(50),
ADD COLUMN IF NOT EXISTS generated_at TIMESTAMP;


-- Admin Settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_link VARCHAR(500),
  whatsapp_community_link VARCHAR(500) DEFAULT 'https://chat.whatsapp.com/Hc1zaz52LdOAh6kM5NHREA',
  is_whatsapp_join_mandatory BOOLEAN DEFAULT true,
  certificate_rules_text TEXT DEFAULT 'Certificates are issued only to valid registered participants who attend/attempt the event and follow all event rules.',
  certificate_id_prefix VARCHAR(50) DEFAULT 'BBSCET-TQ-2026',
  sponsor_cta_whatsapp_number VARCHAR(20) DEFAULT '919771894062',
  sponsor_cta_default_message TEXT DEFAULT 'Hello Mukesh Kumar, I am interested in sponsoring your event. Please share the sponsorship details, audience reach, and collaboration opportunities.',
  sponsor_cta_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) DEFAULT 'Partner',
  logo_url VARCHAR(500),
  website VARCHAR(500),
  description TEXT,
  tier VARCHAR(50) DEFAULT 'silver',
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  contact_info TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Admin OTP table
CREATE TABLE IF NOT EXISTS admin_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(email)
);

-- Make email case-insensitive unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_otps_email_unique ON admin_otps (LOWER(email));

-- Insert default admin settings
INSERT INTO admin_settings (registration_link, whatsapp_community_link, is_whatsapp_join_mandatory, certificate_rules_text, certificate_id_prefix, sponsor_cta_whatsapp_number, sponsor_cta_default_message, sponsor_cta_visible)
VALUES ('', 'https://chat.whatsapp.com/Hc1zaz52LdOAh6kM5NHREA', true, 'Certificates are issued only to valid registered participants who attend/attempt the event and follow all event rules.', 'BBSCET-TQ-2026', '919771894062', 'Hello Mukesh Kumar, I am interested in sponsoring your event. Please share the sponsorship details, audience reach, and collaboration opportunities.', true)
ON CONFLICT DO NOTHING;

-- Insert default sponsor (BBS Coding Club)
INSERT INTO sponsors (event_id, name, type, tier, is_visible, sort_order, description)
SELECT id, 'BBS Coding Club', 'Community Partner', 'gold', true, 1, 'Official coding community partner supporting Tech Hub BBS initiatives'
FROM events WHERE name LIKE '%Tech Hub BBS%' LIMIT 1
ON CONFLICT DO NOTHING;
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  event_name VARCHAR(255) NOT NULL,
  issue_date TIMESTAMP DEFAULT now(),
  certificate_type VARCHAR(50), -- 'participation', 'winner', 'runner-up'
  certificate_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'issued', -- 'issued', 'verified', 'revoked'
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Timeline items table
CREATE TABLE IF NOT EXISTS timeline_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  phase VARCHAR(100) NOT NULL,
  date DATE,
  time TIME,
  description TEXT,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Contacts/Organizers table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Quiz Responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  answer_selected VARCHAR(100),
  is_correct BOOLEAN,
  points_earned INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_certificate_id ON certificates(certificate_id);
CREATE INDEX idx_quiz_responses_registration_id ON quiz_responses(registration_id);

-- Seed admin users by default
INSERT INTO users (email, full_name, role)
VALUES
  ('Mukeshkumar916241@gmail.com', 'Mukesh Kumar', 'admin'),
  ('shwetatiwari.8060@gmail.com', 'Shweta Tiwari', 'admin'),
  ('techwitharyan2211@gmail.com', 'Aryaman Patel', 'admin'),
  ('deepatiwari221503@gmail.com', 'Deepa Tiwari', 'admin')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, full_name = EXCLUDED.full_name;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- RLS Policies for registrations
CREATE POLICY "Users can view their own registrations"
  ON registrations FOR SELECT
  USING (user_id = auth.uid());

-- RLS Policies for certificates
CREATE POLICY "Users can view their own certificates"
  ON certificates FOR SELECT
  USING (user_id = auth.uid());
