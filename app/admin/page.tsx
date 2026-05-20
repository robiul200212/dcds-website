import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const metadata: Metadata = { title: 'Admin Dashboard | DCDS' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['super_admin', 'admin', 'office_secretary'].includes(profile.role)) redirect('/dashboard')

  const { data: stats } = await supabase.from('dashboard_stats').select('*').single()

  const [
    { data: recentMembers },
    { data: pendingRegs },
    { data: recentSessions },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from('profiles').select('id,full_name,member_id,membership_status,role,department,created_at').eq('role', 'member').order('created_at', { ascending: false }).limit(5),
    supabase.from('registration_requests').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
    supabase.from('attendance_sessions').select('*').order('held_at', { ascending: false }).limit(5),
    supabase.from('contact_messages').select('*').eq('is_read', false).order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <AdminDashboard
      stats={stats}
      recentMembers={recentMembers ?? []}
      pendingRegs={pendingRegs ?? []}
      recentSessions={recentSessions ?? []}
      recentMessages={recentMessages ?? []}
    />
  )
}
