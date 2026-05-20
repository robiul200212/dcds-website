'use client'

import Link from 'next/link'
import { Users, UserCheck, ClipboardList, Calendar, FileText, Bell, Mail, TrendingUp, Shield, Plus, CheckCircle, Clock, BarChart2, Image, Megaphone, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props {
  stats: Record<string, number> | null
  recentMembers: Array<{ id: string; full_name: string; member_id: string | null; membership_status: string; role: string; department: string | null; created_at: string }>
  pendingRegs: Array<{ id: string; full_name: string; email: string; department: string; created_at: string }>
  recentSessions: Array<{ id: string; title: string; session_type: string; held_at: string }>
  recentMessages: Array<{ id: string; name: string; subject: string; created_at: string }>
}

const adminNavItems = [
  { href: '/admin/members', label: 'Members', icon: Users, color: '#1B8FD8', description: 'Manage all members' },
  { href: '/admin/registrations', label: 'Registrations', icon: UserCheck, color: '#F0C040', description: 'Approve / reject' },
  { href: '/admin/attendance', label: 'Attendance', icon: Calendar, color: '#1B6B32', description: 'Manage sessions' },
  { href: '/admin/notices', label: 'Notices', icon: Bell, color: '#C41230', description: 'Publish notices' },
  { href: '/admin/articles', label: 'Articles', icon: FileText, color: '#8B5CF6', description: 'Manage content' },
  { href: '/admin/ec-body', label: 'EC Committee', icon: Shield, color: '#1B8FD8', description: 'Manage EC' },
  { href: '/admin/events', label: 'Events', icon: Megaphone, color: '#F0C040', description: 'Manage events' },
  { href: '/admin/gallery', label: 'Gallery', icon: Image, color: '#1B6B32', description: 'Manage photos' },
  { href: '/admin/statistics', label: 'Statistics', icon: BarChart2, color: '#C41230', description: '100+ metrics' },
]

export function AdminDashboard({ stats, recentMembers, pendingRegs, recentSessions, recentMessages }: Props) {
  const statCards = [
    { label: 'Total Members', value: stats?.total_members ?? 0, icon: Users, color: '#1B8FD8', change: `+${stats?.members_this_month ?? 0} this month` },
    { label: 'Active Members', value: stats?.active_members ?? 0, icon: UserCheck, color: '#1B6B32', change: `${stats?.total_members ? Math.round((stats.active_members / stats.total_members) * 100) : 0}% active` },
    { label: 'Pending Approval', value: stats?.pending_registrations ?? 0, icon: Clock, color: '#F0C040', change: 'Needs attention', urgent: (stats?.pending_registrations ?? 0) > 0 },
    { label: 'Total Sessions', value: stats?.total_sessions ?? 0, icon: Calendar, color: '#1B6B32', change: `+${stats?.sessions_this_month ?? 0} this month` },
    { label: 'Published Articles', value: stats?.total_articles ?? 0, icon: FileText, color: '#8B5CF6', change: 'Total articles' },
    { label: 'Active Notices', value: stats?.total_notices ?? 0, icon: Bell, color: '#C41230', change: 'Published' },
    { label: 'Achievements', value: stats?.total_achievements ?? 0, icon: TrendingUp, color: '#F0C040', change: 'In database' },
    { label: 'Unread Messages', value: recentMessages.length, icon: Mail, color: '#1B8FD8', change: 'Contact inbox' },
  ]

  return (
    <div className="min-h-screen bg-[#050D1A] pt-20 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Shield className="w-4 h-4 text-[#F0C040]" />
              <span className="text-[#F0C040] font-medium">Admin Panel</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm">Full control of DCDS platform</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/registrations" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-[#F0C040]/10 border border-[#F0C040]/20 text-[#F0C040] hover:bg-[#F0C040]/20 transition-all relative">
              <Clock className="w-4 h-4" /> Pending
              {(stats?.pending_registrations ?? 0) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C41230] text-white text-xs flex items-center justify-center font-bold">
                  {stats?.pending_registrations}
                </span>
              )}
            </Link>
            <Link href="/admin/notices" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] text-white hover:shadow-lg transition-all">
              <Plus className="w-4 h-4" /> New Notice
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className={`glass-dark rounded-2xl p-5 border transition-all ${card.urgent ? 'border-[#F0C040]/30 animate-pulse-slow' : 'border-white/5'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15` }}>
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white mb-0.5" style={{ fontFamily: 'var(--font-outfit)' }}>
                {card.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mb-1">{card.label}</p>
              <p className="text-xs" style={{ color: card.color }}>{card.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Nav */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 mb-8">
          {adminNavItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl glass border border-white/5 hover:border-[#1B8FD8]/20 transition-all card-hover text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${item.color}15` }}>
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors leading-tight">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Members */}
          <div className="glass-dark rounded-2xl p-5 border border-[#1B8FD8]/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1B8FD8]" /> Recent Members
              </h3>
              <Link href="/admin/members" className="text-xs text-[#1B8FD8] hover:underline flex items-center gap-0.5">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm text-white font-medium">{member.full_name}</p>
                    <p className="text-xs text-gray-500">{member.department || '—'} • {member.member_id || 'No ID'}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                    member.membership_status === 'active' ? 'badge-active' :
                    member.membership_status === 'pending' ? 'badge-pending' : 'badge-inactive'
                  }`}>
                    {member.membership_status}
                  </span>
                </div>
              ))}
              {recentMembers.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No members yet</p>}
            </div>
          </div>

          {/* Pending Registrations */}
          <div className="glass-dark rounded-2xl p-5 border border-[#F0C040]/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F0C040]" /> Pending Registrations
                {pendingRegs.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#F0C040] text-[#050D1A] text-xs flex items-center justify-center font-bold">{pendingRegs.length}</span>
                )}
              </h3>
              <Link href="/admin/registrations" className="text-xs text-[#F0C040] hover:underline flex items-center gap-0.5">
                Review All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {pendingRegs.length > 0 ? (
              <div className="space-y-3">
                {pendingRegs.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm text-white font-medium">{reg.full_name}</p>
                      <p className="text-xs text-gray-500">{reg.email} • {reg.department}</p>
                    </div>
                    <Link href="/admin/registrations" className="px-2.5 py-1 rounded-lg text-xs bg-[#F0C040]/10 text-[#F0C040] border border-[#F0C040]/20 hover:bg-[#F0C040]/20 transition-colors whitespace-nowrap">
                      Review →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-10 h-10 text-[#1B6B32] mx-auto mb-2" />
                <p className="text-sm text-gray-400">All registrations reviewed!</p>
              </div>
            )}
          </div>

          {/* Recent Sessions */}
          <div className="glass-dark rounded-2xl p-5 border border-[#1B8FD8]/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1B8FD8]" /> Recent Sessions
              </h3>
              <Link href="/admin/attendance" className="text-xs text-[#1B8FD8] hover:underline flex items-center gap-0.5">
                Manage <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm text-white font-medium">{session.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{session.session_type} • {formatDate(session.held_at, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              ))}
              {recentSessions.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No sessions yet</p>}
            </div>
          </div>

          {/* Unread Messages */}
          <div className="glass-dark rounded-2xl p-5 border border-[#1B8FD8]/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1B8FD8]" /> Unread Messages
              </h3>
            </div>
            {recentMessages.length > 0 ? (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="py-2 border-b border-white/5 last:border-0">
                    <p className="text-sm text-white font-medium">{msg.name}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{msg.subject}</p>
                    <p className="text-xs text-gray-600">{formatDate(msg.created_at, { month: 'short', day: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-10 h-10 text-[#1B6B32] mx-auto mb-2" />
                <p className="text-sm text-gray-400">No unread messages!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
