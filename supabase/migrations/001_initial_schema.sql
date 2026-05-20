-- ================================================================
-- DCDS Website — Complete Database Schema
-- Dhaka College Debating Society
-- Run this entire file in Supabase SQL Editor
-- ================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ================================================================
-- 1. PROFILES (extends auth.users)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                    UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email                 TEXT NOT NULL,
  full_name             TEXT NOT NULL,
  member_id             TEXT UNIQUE,
  phone                 TEXT,
  student_id            TEXT,
  department            TEXT,
  session               TEXT,   -- e.g. "2022-23"
  avatar_url            TEXT,
  bio                   TEXT,
  role                  TEXT NOT NULL DEFAULT 'member' 
                          CHECK (role IN ('super_admin','admin','office_secretary','member','guest')),
  position              TEXT,   -- Club position e.g. "General Secretary"
  membership_status     TEXT NOT NULL DEFAULT 'pending'
                          CHECK (membership_status IN ('active','inactive','pending','suspended','rejected')),
  payment_method        TEXT,
  payment_sender_number TEXT,
  payment_ref           TEXT,
  payment_amount        NUMERIC(10,2),
  payment_date          DATE,
  facebook_url          TEXT,
  linkedin_url          TEXT,
  joined_at             DATE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-generate member_id trigger
CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TRIGGER AS $$
DECLARE
  new_id TEXT;
  yr TEXT := TO_CHAR(NOW(), 'YY');
  seq INT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(member_id FROM 8) AS INT)), 0) + 1
    INTO seq FROM profiles WHERE member_id LIKE 'DCDS-' || yr || '%';
  new_id := 'DCDS-' || yr || LPAD(seq::TEXT, 4, '0');
  NEW.member_id := new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_member_id
  BEFORE INSERT ON profiles
  FOR EACH ROW
  WHEN (NEW.member_id IS NULL)
  EXECUTE FUNCTION generate_member_id();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- 2. REGISTRATION REQUESTS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.registration_requests (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id            UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  full_name             TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT NOT NULL,
  student_id            TEXT NOT NULL,
  department            TEXT NOT NULL,
  session               TEXT NOT NULL,
  why_join              TEXT,
  payment_method        TEXT NOT NULL,
  payment_sender_number TEXT NOT NULL,
  payment_ref           TEXT,
  payment_amount        NUMERIC(10,2),
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','approved','rejected')),
  reviewed_by           UUID REFERENCES profiles(id),
  review_note           TEXT,
  reviewed_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 3. ATTENDANCE SESSIONS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'meeting'
                CHECK (session_type IN ('meeting','event','workshop','competition','other')),
  description TEXT,
  held_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location    TEXT,
  created_by  UUID REFERENCES profiles(id) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 4. ATTENDANCE RECORDS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id  UUID REFERENCES attendance_sessions(id) ON DELETE CASCADE NOT NULL,
  member_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_present  BOOLEAN NOT NULL DEFAULT FALSE,
  marked_by   UUID REFERENCES profiles(id) NOT NULL,
  marked_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note        TEXT,
  UNIQUE(session_id, member_id)
);

-- ================================================================
-- 5. EXECUTIVE BODY
-- ================================================================
CREATE TABLE IF NOT EXISTS public.executive_body (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name     TEXT NOT NULL,
  position      TEXT NOT NULL,
  panel_year    TEXT NOT NULL,  -- e.g. "2024-25"
  avatar_url    TEXT,
  bio           TEXT,
  email         TEXT,
  facebook_url  TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 6. NOTICES
-- ================================================================
CREATE TABLE IF NOT EXISTS public.notices (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT 'general'
                 CHECK (category IN ('general','urgent','event','academic','meeting')),
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  pinned       BOOLEAN NOT NULL DEFAULT FALSE,
  author_id    UUID REFERENCES profiles(id) NOT NULL,
  published_at TIMESTAMPTZ,
  expires_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER notices_updated_at
  BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- 7. ARTICLES
-- ================================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT NOT NULL,
  cover_image_url TEXT,
  category        TEXT NOT NULL DEFAULT 'general',
  tags            TEXT[] DEFAULT '{}',
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  author_id       UUID REFERENCES profiles(id) NOT NULL,
  published_at    TIMESTAMPTZ,
  views           INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(is_published, published_at DESC);

-- ================================================================
-- 8. ACHIEVEMENTS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL DEFAULT 'tournament'
                  CHECK (category IN ('tournament','award','recognition','national','international','other')),
  award_date    DATE NOT NULL,
  image_url     TEXT,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 9. EVENTS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  event_type      TEXT NOT NULL DEFAULT 'fest'
                    CHECK (event_type IN ('fest','workshop','seminar','competition','social','other')),
  start_date      DATE NOT NULL,
  end_date        DATE,
  location        TEXT,
  cover_image_url TEXT,
  gallery_urls    TEXT[] DEFAULT '{}',
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 10. GALLERY
-- ================================================================
CREATE TABLE IF NOT EXISTS public.gallery (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT,
  image_url   TEXT NOT NULL,
  event_id    UUID REFERENCES events(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES profiles(id) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 11. SPEECHES (Principal / Moderator)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.speeches (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  speaker_name  TEXT NOT NULL,
  speaker_role  TEXT NOT NULL DEFAULT 'moderator'
                  CHECK (speaker_role IN ('principal','moderator','advisor','guest')),
  designation   TEXT NOT NULL,
  speech_text   TEXT NOT NULL,
  avatar_url    TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 12. CONTACT MESSAGES
-- ================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- 13. SITE SETTINGS (key-value store for admin-editable content)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  label      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default settings
INSERT INTO site_settings (key, value, label) VALUES
  ('hero_tagline', 'Where Logic Meets Eloquence', 'Hero Section Tagline'),
  ('hero_sub', 'Dhaka College Debating Society — Fostering critical thinking, public speaking, and leadership since 1995.', 'Hero Sub-text'),
  ('club_founded_year', '1995', 'Club Founded Year'),
  ('total_championships', '50+', 'Total Championships Won'),
  ('total_members_ever', '500+', 'Total Members (All Time)'),
  ('moderator_name', 'TBD', 'Chief Moderator Name'),
  ('about_text', 'DCDS is the premier debating society of Dhaka College...', 'About Us Text'),
  ('contact_address', 'Dhaka College, Mirpur Road, Dhaka-1205', 'Contact Address'),
  ('contact_email', 'dcds@dhakacollege.edu.bd', 'Contact Email'),
  ('contact_phone', '+880-2-XXXXXXXX', 'Contact Phone'),
  ('facebook_url', 'https://facebook.com/dcds', 'Facebook URL'),
  ('youtube_url', '', 'YouTube URL'),
  ('membership_fee', '500', 'Membership Fee (BDT)')
ON CONFLICT (key) DO NOTHING;

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_body ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE speeches ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: is admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT role IN ('super_admin','admin','office_secretary') 
  FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── PROFILES ──
CREATE POLICY "Public profiles viewable by all" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (is_admin());
CREATE POLICY "Profile inserted via trigger" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ── REGISTRATION REQUESTS ──
CREATE POLICY "Own reg request" ON registration_requests FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Admins see all reg" ON registration_requests FOR SELECT USING (is_admin());
CREATE POLICY "Own insert reg" ON registration_requests FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Admins update reg" ON registration_requests FOR UPDATE USING (is_admin());

-- ── ATTENDANCE SESSIONS ──
CREATE POLICY "Members see sessions" ON attendance_sessions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage sessions" ON attendance_sessions FOR ALL USING (is_admin());

-- ── ATTENDANCE RECORDS ──
CREATE POLICY "Own attendance" ON attendance_records FOR SELECT USING (auth.uid() = member_id);
CREATE POLICY "Admins see all attendance" ON attendance_records FOR SELECT USING (is_admin());
CREATE POLICY "Admins manage attendance" ON attendance_records FOR ALL USING (is_admin());

-- ── EXECUTIVE BODY ──
CREATE POLICY "EC public view" ON executive_body FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage EC" ON executive_body FOR ALL USING (is_admin());

-- ── NOTICES ──
CREATE POLICY "Published notices public" ON notices FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Members see all notices" ON notices FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage notices" ON notices FOR ALL USING (is_admin());

-- ── ARTICLES ──
CREATE POLICY "Published articles public" ON articles FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Authors see own" ON articles FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Admins manage articles" ON articles FOR ALL USING (is_admin());
CREATE POLICY "Members submit articles" ON articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ── ACHIEVEMENTS, EVENTS, GALLERY, SPEECHES ──
CREATE POLICY "Achievements public" ON achievements FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage achievements" ON achievements FOR ALL USING (is_admin());

CREATE POLICY "Events public" ON events FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins manage events" ON events FOR ALL USING (is_admin());

CREATE POLICY "Gallery public" ON gallery FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage gallery" ON gallery FOR ALL USING (is_admin());

CREATE POLICY "Speeches public" ON speeches FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins manage speeches" ON speeches FOR ALL USING (is_admin());

-- ── CONTACT MESSAGES ──
CREATE POLICY "Anyone can submit contact" ON contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins read contact" ON contact_messages FOR SELECT USING (is_admin());
CREATE POLICY "Admins update contact" ON contact_messages FOR UPDATE USING (is_admin());

-- ── SITE SETTINGS ──
CREATE POLICY "Settings public read" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage settings" ON site_settings FOR ALL USING (is_admin());

-- ================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, membership_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'),
    'member',
    'pending'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================================
-- VIEWS (for dashboard statistics)
-- ================================================================

CREATE OR REPLACE VIEW member_attendance_stats AS
SELECT 
  p.id as member_id,
  p.full_name,
  p.member_id as member_code,
  COUNT(ar.id) FILTER (WHERE ar.is_present) as sessions_attended,
  COUNT(ar.id) as sessions_total,
  CASE WHEN COUNT(ar.id) > 0 
    THEN ROUND(COUNT(ar.id) FILTER (WHERE ar.is_present)::NUMERIC / COUNT(ar.id) * 100, 1)
    ELSE 0 
  END as attendance_percentage
FROM profiles p
LEFT JOIN attendance_records ar ON p.id = ar.member_id
WHERE p.role = 'member'
GROUP BY p.id, p.full_name, p.member_id;

CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM profiles WHERE role = 'member') as total_members,
  (SELECT COUNT(*) FROM profiles WHERE role = 'member' AND membership_status = 'active') as active_members,
  (SELECT COUNT(*) FROM profiles WHERE role = 'member' AND membership_status = 'pending') as pending_members,
  (SELECT COUNT(*) FROM registration_requests WHERE status = 'pending') as pending_registrations,
  (SELECT COUNT(*) FROM attendance_sessions) as total_sessions,
  (SELECT COUNT(*) FROM articles WHERE is_published = TRUE) as total_articles,
  (SELECT COUNT(*) FROM notices WHERE is_published = TRUE) as total_notices,
  (SELECT COUNT(*) FROM achievements) as total_achievements,
  (SELECT COUNT(*) FROM profiles WHERE role = 'member' 
     AND created_at >= DATE_TRUNC('month', NOW())) as members_this_month,
  (SELECT COUNT(*) FROM attendance_sessions 
     WHERE held_at >= DATE_TRUNC('month', NOW())) as sessions_this_month;
