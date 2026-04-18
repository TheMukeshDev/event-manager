-- Complete Events Table Upgrade Script
-- Run this in Supabase SQL Editor

-- 1. Drop old events table if exists (backup first if you have data)
-- DROP TABLE IF EXISTS events CASCADE;

-- 2. Create new events table with all required columns
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  event_type VARCHAR(50) DEFAULT 'technical',
  mode VARCHAR(20) DEFAULT 'online',
  registration_type VARCHAR(20) DEFAULT 'free',
  registration_fee DECIMAL(10,2) DEFAULT 0,
  registration_start TIMESTAMP,
  registration_end TIMESTAMP,
  event_start TIMESTAMP,
  event_end TIMESTAMP,
  status VARCHAR(20) DEFAULT 'draft',
  registration_link VARCHAR(500),
  external_platform_link VARCHAR(500),
  whatsapp_community_link VARCHAR(500),
  is_whatsapp_mandatory BOOLEAN DEFAULT false,
  rules_text TEXT,
  certificate_rules_text TEXT,
  certificate_id_prefix VARCHAR(50),
  referral_threshold INTEGER DEFAULT 10,
  venue_or_meeting_link VARCHAR(500),
  max_participants INTEGER,
  contact_email VARCHAR(255),
  is_visible BOOLEAN DEFAULT true,
  is_home_event BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 3. Insert default Tech Hub BBS event
INSERT INTO events (
  name, 
  slug, 
  description, 
  event_type, 
  mode, 
  registration_type, 
  status, 
  is_visible, 
  is_home_event,
  certificate_rules_text,
  certificate_id_prefix,
  referral_threshold,
  rules_text
)
VALUES (
  'Tech Hub BBS',
  'tech-hub-bbs',
  'Tech Hub BBS is a student-led tech community focused on building skills, organizing coding events, hackathons, and sharing real opportunities.',
  'technical',
  'online',
  'free',
  'published',
  true,
  true,
  'Certificates are issued only to valid registered participants who attend/attempt the event and follow all event rules.',
  'BBSCET-TQ-2026',
  10,
  '1. All participants must register online. 2. Submit within given time. 3. Follow all event rules.'
)
ON CONFLICT DO NOTHING;

-- 4. Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 5. Create policy for admin read/write
CREATE POLICY "Admin can manage events" ON events
  FOR ALL USING (true);

-- 6. Create indexes
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_home ON events(is_home_event);