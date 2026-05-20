import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHome } from '@/components/dashboard/DashboardHome'

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'Your DCDS member dashboard',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  // Get attendance stats
  const { data: attendanceRecords } = await supabase
    .from('attendance_records')
    .select('is_present, session_id, attendance_sessions(title, held_at)')
    .eq('member_id', user.id)
    .order('marked_at', { ascending: false })
    .limit(10)

  const totalSessions = attendanceRecords?.length ?? 0
  const attendedSessions = attendanceRecords?.filter(r => r.is_present).length ?? 0
  const attendanceRate = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0

  // Get recent notices
  const { data: notices } = await supabase
    .from('notices')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(5)

  // Get my articles
  const { data: myArticles } = await supabase
    .from('articles')
    .select('id, title, slug, is_published, created_at')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <DashboardHome
      profile={profile}
      attendanceRecords={attendanceRecords ?? []}
      attendanceRate={attendanceRate}
      totalSessions={totalSessions}
      attendedSessions={attendedSessions}
      notices={notices ?? []}
      myArticles={myArticles ?? []}
    />
  )
}
