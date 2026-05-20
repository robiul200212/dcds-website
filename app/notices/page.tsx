import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Bell, Pin, AlertCircle, Calendar, BookOpen, Users, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Notice Board',
  description: 'Latest notices and announcements from Dhaka College Debating Society.',
}

const categoryConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  general: { icon: Bell, color: '#1B8FD8', bg: 'from-[#1B8FD8]/10 to-transparent', label: 'General' },
  urgent: { icon: AlertCircle, color: '#C41230', bg: 'from-[#C41230]/10 to-transparent', label: 'Urgent' },
  event: { icon: Calendar, color: '#F0C040', bg: 'from-[#F0C040]/10 to-transparent', label: 'Event' },
  academic: { icon: BookOpen, color: '#1B6B32', bg: 'from-[#1B6B32]/10 to-transparent', label: 'Academic' },
  meeting: { icon: Users, color: '#8B5CF6', bg: 'from-[#8B5CF6]/10 to-transparent', label: 'Meeting' },
}

export default async function NoticesPage() {
  const supabase = await createClient()
  const { data: notices } = await supabase
    .from('notices')
    .select('*')
    .eq('is_published', true)
    .order('pinned', { ascending: false })
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#050D1A] pt-24 pb-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B8FD8]/10 border border-[#1B8FD8]/20 text-[#1B8FD8] text-sm font-medium mb-4">
            Announcements
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Notice <span className="gradient-text">Board</span>
          </h1>
          <p className="text-gray-400">Stay updated with the latest announcements from DCDS.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {notices && notices.length > 0 ? notices.map(notice => {
            const conf = categoryConfig[notice.category] || categoryConfig.general
            const Icon = conf.icon
            return (
              <div key={notice.id} className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${conf.bg} border ${notice.pinned ? 'border-[#F0C040]/20' : 'border-white/5'} p-6`}>
                {notice.pinned && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-[#F0C040]">
                    <Pin className="w-3.5 h-3.5" /> Pinned
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${conf.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: conf.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${conf.color}15`, color: conf.color }}>
                        {conf.label}
                      </span>
                      <h2 className="font-bold text-white">{notice.title}</h2>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">{notice.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {notice.published_at && <span>{formatDate(notice.published_at)}</span>}
                      {notice.expires_at && <span>Expires: {formatDate(notice.expires_at)}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="text-center py-16 glass-dark rounded-2xl border border-white/5">
              <Bell className="w-12 h-12 mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400">No notices published yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
