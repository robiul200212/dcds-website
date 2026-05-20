export type UserRole = 'super_admin' | 'admin' | 'office_secretary' | 'member' | 'guest'
export type MembershipStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'rejected'

export interface Profile {
  id: string
  email: string
  full_name: string
  member_id: string | null
  phone: string | null
  student_id: string | null
  department: string | null
  session: string | null
  batch: string | null
  avatar_url: string | null
  bio: string | null
  role: UserRole
  position: string | null
  membership_status: MembershipStatus
  payment_screenshot_url: string | null
  payment_ref: string | null
  payment_amount: number | null
  payment_date: string | null
  facebook_url: string | null
  linkedin_url: string | null
  joined_at: string | null
  created_at: string
  updated_at: string
}

export interface AttendanceSession {
  id: string
  title: string
  session_type: 'meeting' | 'event' | 'workshop' | 'competition' | 'other'
  description: string | null
  held_at: string
  location: string | null
  created_by: string
  created_at: string
}

export interface AttendanceRecord {
  id: string
  session_id: string
  member_id: string
  is_present: boolean
  marked_by: string
  marked_at: string
  note: string | null
}

export interface ExecutiveMember {
  id: string
  profile_id: string | null
  full_name: string
  position: string
  panel_year: string
  avatar_url: string | null
  bio: string | null
  email: string | null
  facebook_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  profile?: Profile
}

export interface Notice {
  id: string
  title: string
  content: string
  category: 'general' | 'urgent' | 'event' | 'academic' | 'meeting'
  is_published: boolean
  pinned: boolean
  author_id: string
  published_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  category: string
  tags: string[]
  is_published: boolean
  author_id: string
  published_at: string | null
  views: number
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Achievement {
  id: string
  title: string
  description: string | null
  category: 'tournament' | 'award' | 'recognition' | 'national' | 'international' | 'other'
  award_date: string
  image_url: string | null
  is_featured: boolean
  display_order: number
  created_at: string
}

export interface ClubEvent {
  id: string
  title: string
  description: string | null
  event_type: 'fest' | 'workshop' | 'seminar' | 'competition' | 'social' | 'other'
  start_date: string
  end_date: string | null
  location: string | null
  cover_image_url: string | null
  gallery_urls: string[]
  is_published: boolean
  is_featured: boolean
  created_at: string
}

export interface GalleryPhoto {
  id: string
  title: string | null
  image_url: string
  event_id: string | null
  uploaded_by: string
  created_at: string
}

export interface Speech {
  id: string
  speaker_name: string
  speaker_role: 'principal' | 'moderator' | 'advisor' | 'guest'
  designation: string
  speech_text: string
  avatar_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface RegistrationRequest {
  id: string
  profile_id: string
  full_name: string
  email: string
  phone: string
  student_id: string
  department: string
  session: string
  batch: string
  why_join: string | null
  payment_screenshot_url: string | null
  payment_ref: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by: string | null
  review_note: string | null
  reviewed_at: string | null
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export interface DashboardStats {
  total_members: number
  active_members: number
  pending_registrations: number
  total_sessions: number
  avg_attendance_rate: number
  total_articles: number
  total_notices: number
  total_achievements: number
  members_this_month: number
  sessions_this_month: number
}
