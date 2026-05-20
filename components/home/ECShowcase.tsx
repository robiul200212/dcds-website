import Image from 'next/image'
import Link from 'next/link'
import type { ExecutiveMember } from '@/lib/types'
import { getInitials } from '@/lib/utils'
import { Mail, ChevronRight } from 'lucide-react'

interface Props { members: ExecutiveMember[] }

const fallback: ExecutiveMember[] = [
  { id: '1', profile_id: null, full_name: 'President Name', position: 'President', panel_year: '2024-25', avatar_url: null, bio: null, email: null, facebook_url: null, display_order: 1, is_active: true, created_at: '' },
  { id: '2', profile_id: null, full_name: 'General Secretary', position: 'General Secretary', panel_year: '2024-25', avatar_url: null, bio: null, email: null, facebook_url: null, display_order: 2, is_active: true, created_at: '' },
  { id: '3', profile_id: null, full_name: 'Organizing Secretary', position: 'Organizing Secretary', panel_year: '2024-25', avatar_url: null, bio: null, email: null, facebook_url: null, display_order: 3, is_active: true, created_at: '' },
  { id: '4', profile_id: null, full_name: 'Treasurer', position: 'Treasurer', panel_year: '2024-25', avatar_url: null, bio: null, email: null, facebook_url: null, display_order: 4, is_active: true, created_at: '' },
]

export function ECShowcase({ members }: Props) {
  const data = members.length > 0 ? members : fallback

  return (
    <section className="section-padding bg-[#0A1628] relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#1B8FD8]/5 blur-3xl" />
      <div className="container-custom relative">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B8FD8]/10 border border-[#1B8FD8]/20 text-[#1B8FD8] text-sm font-medium mb-4">
            Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Executive <span className="gradient-text">Committee</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Meet the dedicated leaders who drive DCDS forward, organizing events, mentoring members, and upholding our legacy of excellence.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {data.slice(0, 8).map((member) => (
            <div key={member.id} className="group text-center glass border border-white/5 rounded-2xl p-6 card-hover">
              {/* Avatar */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1B8FD8] to-[#0A1628] p-0.5 group-hover:from-[#F0C040] group-hover:to-[#1B8FD8] transition-all duration-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0A1628] flex items-center justify-center">
                    {member.avatar_url ? (
                      <Image src={member.avatar_url} alt={member.full_name} width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-xl font-bold text-[#1B8FD8] group-hover:text-[#F0C040] transition-colors">{getInitials(member.full_name)}</span>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">{member.full_name}</h3>
              <p className="text-xs text-[#1B8FD8] font-medium mb-2">{member.position}</p>
              <p className="text-xs text-gray-500 mb-3">{member.panel_year}</p>

              {/* Social Links */}
              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {member.facebook_url && (
                  <a href={member.facebook_url} target="_blank" rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`}
                    className="w-7 h-7 rounded-full bg-[#1B8FD8]/10 flex items-center justify-center text-[#1B8FD8] hover:bg-[#1B8FD8]/20 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/ec-committee" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-[#1B8FD8]/20 text-[#1B8FD8] font-semibold hover:border-[#1B8FD8]/50 transition-all group">
            View Full Executive Committee <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
