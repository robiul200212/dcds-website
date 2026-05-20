import Image from 'next/image'
import Link from 'next/link'
import type { ClubEvent } from '@/lib/types'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props { events: ClubEvent[] }

const fallback: ClubEvent[] = [
  { id: '1', title: 'DCDS Annual Debate Fest 2024', description: 'The biggest debate festival in Dhaka College history.', event_type: 'fest', start_date: '2024-12-01', end_date: '2024-12-03', location: 'Dhaka College Auditorium', cover_image_url: null, gallery_urls: [], is_published: true, is_featured: true, created_at: '' },
  { id: '2', title: 'Inter-College Debate 2024', description: 'Annual inter-college debate championship.', event_type: 'competition', start_date: '2024-09-15', end_date: null, location: 'Dhaka College', cover_image_url: null, gallery_urls: [], is_published: true, is_featured: true, created_at: '' },
  { id: '3', title: 'Leadership Workshop 2024', description: 'Public speaking and leadership development workshop.', event_type: 'workshop', start_date: '2024-07-20', end_date: null, location: 'Dhaka College', cover_image_url: null, gallery_urls: [], is_published: true, is_featured: true, created_at: '' },
]

const eventTypeColors: Record<string, string> = {
  fest: '#F0C040', competition: '#C41230', workshop: '#1B8FD8', seminar: '#1B6B32', social: '#8B5CF6', other: '#6B7280',
}

export function EventsSection({ events }: Props) {
  const data = events.length > 0 ? events : fallback

  return (
    <section className="section-padding bg-[#0A1628] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#C41230]/5 blur-3xl" />
      <div className="container-custom relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#C41230]/10 border border-[#C41230]/20 text-[#C41230] text-sm font-medium mb-4">
              Events & Fests
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
              Our <span className="gradient-text">Milestones</span>
            </h2>
          </div>
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-[#1B8FD8] font-semibold hover:gap-3 transition-all group whitespace-nowrap">
            View All Events <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((event) => {
            const color = eventTypeColors[event.event_type] || '#6B7280'
            return (
              <div key={event.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/3 to-transparent card-hover">
                {/* Cover Image / Placeholder */}
                <div className="relative h-48 overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}20 0%, #0A1628 100%)` }}>
                  {event.cover_image_url ? (
                    <Image src={event.cover_image_url} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="w-16 h-16 opacity-10" style={{ color }} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-bold capitalize" style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}>
                    {event.event_type}
                  </span>
                </div>
                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#1B8FD8] transition-colors">{event.title}</h3>
                  {event.description && <p className="text-sm text-gray-400 mb-3 line-clamp-2">{event.description}</p>}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-[#1B8FD8]" />
                      {formatDate(event.start_date, { year: 'numeric', month: 'short', day: 'numeric' })}
                      {event.end_date && ` – ${formatDate(event.end_date, { month: 'short', day: 'numeric' })}`}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-[#1B8FD8]" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
