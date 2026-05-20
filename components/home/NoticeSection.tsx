import Link from 'next/link'
import type { Notice } from '@/lib/types'
import { Bell, Pin, ChevronRight, AlertCircle, Calendar, BookOpen, Users } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface Props { notices: Notice[] }

const categoryIcons: Record<string, React.ElementType> = {
  general: Bell, urgent: AlertCircle, event: Calendar, academic: BookOpen, meeting: Users,
}

const categoryColors: Record<string, string> = {
  general: '#1B8FD8', urgent: '#C41230', event: '#F0C040', academic: '#1B6B32', meeting: '#8B5CF6',
}

export function NoticeSection({ notices }: Props) {
  if (notices.length === 0) return null

  return (
    <section className="section-padding bg-[#050D1A] relative">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B8FD8]/10 border border-[#1B8FD8]/20 text-[#1B8FD8] text-sm font-medium mb-4">
              Notice Board
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
              Latest <span className="gradient-text">Notices</span>
            </h2>
          </div>
          <Link href="/notices" className="inline-flex items-center gap-1.5 text-sm text-[#1B8FD8] font-semibold hover:gap-3 transition-all group whitespace-nowrap">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-3">
          {notices.map((notice) => {
            const Icon = categoryIcons[notice.category] || Bell
            const color = categoryColors[notice.category] || '#1B8FD8'
            return (
              <Link key={notice.id} href="/notices" className="group flex items-start gap-4 p-4 rounded-xl glass border border-white/5 hover:border-[#1B8FD8]/20 transition-all">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {notice.pinned && <Pin className="w-3.5 h-3.5 text-[#F0C040]" />}
                    <h3 className="font-semibold text-white text-sm group-hover:text-[#1B8FD8] transition-colors truncate">{notice.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs capitalize" style={{ background: `${color}15`, color }}>
                      {notice.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{notice.content}</p>
                </div>
                <span className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
                  {notice.published_at ? formatRelativeTime(notice.published_at) : ''}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
