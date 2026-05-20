'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Profile, Notice } from '@/lib/types'
import { getInitials, formatDate, getMembershipStatusLabel, getAttendanceColor } from '@/lib/utils'
import { User, Shield, Calendar, Bell, BookOpen, TrendingUp, Edit, LayoutDashboard } from 'lucide-react'

interface Props {
  profile: Profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attendanceRecords: Array<{ is_present: boolean; session_id: string; attendance_sessions?: any }>
  attendanceRate: number
  totalSessions: number
  attendedSessions: number
  notices: Notice[]
  myArticles: Array<{ id: string; title: string; slug: string; is_published: boolean; created_at: string }>
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active Member', className: 'badge-active' },
  pending: { label: 'Pending Approval', className: 'badge-pending' },
  inactive: { label: 'Inactive', className: 'badge-inactive' },
  suspended: { label: 'Suspended', className: 'badge-suspended' },
  rejected: { label: 'Rejected', className: 'badge-suspended' },
}

export function DashboardHome({ profile, attendanceRecords, attendanceRate, totalSessions, attendedSessions, notices, myArticles }: Props) {
  const status = statusConfig[profile.membership_status] || statusConfig.inactive
  const attendanceColor = getAttendanceColor(attendanceRate)
  const circumference = 2 * Math.PI * 45

  return (
    <div className="min-h-screen bg-[#050D1A] pt-20 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <LayoutDashboard className="w-4 h-4" />
            <span>My Dashboard</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
            Welcome back, {profile.full_name.split(' ')[0]}! 👋
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass-dark rounded-2xl p-6 border border-[#1B8FD8]/10">
              {/* Avatar */}
              <div className="text-center mb-5">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-[#1B8FD8]/20 bg-gradient-to-br from-[#1B8FD8] to-[#0A1628] flex items-center justify-center">
                    {profile.avatar_url ? (
                      <Image src={profile.avatar_url} alt={profile.full_name} width={96} height={96} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-3xl font-bold text-white">{getInitials(profile.full_name)}</span>
                    )}
                  </div>
                </div>
                <h2 className="font-bold text-white text-lg">{profile.full_name}</h2>
                <p className="text-sm text-[#1B8FD8]">{profile.position || 'Club Member'}</p>
              </div>

              {/* Member Info */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Member ID</span>
                  <span className="font-mono font-bold text-[#F0C040]">{profile.member_id || '—'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}>{status.label}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Department</span>
                  <span className="text-white text-xs text-right max-w-28 truncate">{profile.department || '—'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Session</span>
                  <span className="text-white">{profile.session || '—'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Batch</span>
                  <span className="text-white">{profile.batch || '—'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Joined</span>
                  <span className="text-white">{profile.joined_at ? formatDate(profile.joined_at, { year: 'numeric', month: 'short' }) : '—'}</span>
                </div>
              </div>

              <Link href="/dashboard/profile" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl glass border border-white/10 text-sm text-gray-300 hover:text-white hover:border-[#1B8FD8]/30 transition-all">
                <Edit className="w-4 h-4" /> Edit Profile
              </Link>
            </div>

            {/* Attendance Circle */}
            <div className="glass-dark rounded-2xl p-6 border border-[#1B8FD8]/10 mt-5 text-center">
              <h3 className="font-semibold text-white mb-4 flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1B8FD8]" />
                Attendance Rate
              </h3>
              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1E3050" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" strokeWidth="10" strokeLinecap="round"
                    stroke={attendanceColor}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (attendanceRate / 100) * circumference}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-extrabold text-white">{attendanceRate}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">{attendedSessions} of {totalSessions} sessions</p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Membership Status Warning */}
            {profile.membership_status === 'pending' && (
              <div className="p-4 rounded-xl bg-[#F0C040]/8 border border-[#F0C040]/20">
                <p className="text-sm text-[#F0C040] font-semibold mb-1">⏳ Registration Pending</p>
                <p className="text-xs text-gray-400">Your membership application is under review. You will be notified via email once approved by an admin.</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: Calendar, label: 'Sessions Attended', value: attendedSessions, color: '#1B8FD8' },
                { icon: TrendingUp, label: 'Attendance Rate', value: `${attendanceRate}%`, color: attendanceColor },
                { icon: BookOpen, label: 'My Articles', value: myArticles.length, color: '#F0C040' },
              ].map((stat, i) => (
                <div key={i} className="glass border border-white/5 rounded-xl p-4 text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
                  <p className="text-xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Attendance */}
            <div className="glass-dark rounded-2xl p-5 border border-[#1B8FD8]/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1B8FD8]" /> Recent Attendance
                </h3>
                <Link href="/dashboard/attendance" className="text-xs text-[#1B8FD8] hover:underline">View All</Link>
              </div>
              {attendanceRecords.length > 0 ? (
                <div className="space-y-2">
                  {attendanceRecords.slice(0, 5).map((record, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-sm text-white font-medium">{(record.attendance_sessions as { title: string; held_at: string } | null)?.title || 'Session'}</p>
                        <p className="text-xs text-gray-500">
                          {(record.attendance_sessions as { title: string; held_at: string } | null)?.held_at
                            ? formatDate((record.attendance_sessions as { title: string; held_at: string }).held_at, { month: 'short', day: 'numeric' })
                            : ''}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${record.is_present ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                        {record.is_present ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No attendance records yet</p>
              )}
            </div>

            {/* Recent Notices */}
            <div className="glass-dark rounded-2xl p-5 border border-[#1B8FD8]/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#1B8FD8]" /> Latest Notices
                </h3>
                <Link href="/notices" className="text-xs text-[#1B8FD8] hover:underline">View All</Link>
              </div>
              {notices.length > 0 ? (
                <div className="space-y-2">
                  {notices.map((notice) => (
                    <div key={notice.id} className="py-2 border-b border-white/5 last:border-0">
                      <p className="text-sm text-white font-medium">{notice.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notice.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No notices available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
