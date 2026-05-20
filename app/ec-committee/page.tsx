import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { Mail, Award } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { ExecutiveMember } from '@/lib/types'

export const metadata: Metadata = {
  title: 'EC Committee',
  description: 'Meet the Executive Committee of Dhaka College Debating Society.',
}

const fallback: ExecutiveMember[] = [
  { id: '1', profile_id: null, full_name: 'President Name', position: 'President', panel_year: '2024-25', avatar_url: null, bio: 'Club President leading DCDS with vision and dedication.', email: null, facebook_url: null, display_order: 1, is_active: true, created_at: '' },
  { id: '2', profile_id: null, full_name: 'Vice President Name', position: 'Vice President', panel_year: '2024-25', avatar_url: null, bio: null, email: null, facebook_url: null, display_order: 2, is_active: true, created_at: '' },
  { id: '3', profile_id: null, full_name: 'General Secretary', position: 'General Secretary', panel_year: '2024-25', avatar_url: null, bio: null, email: null, facebook_url: null, display_order: 3, is_active: true, created_at: '' },
  { id: '4', profile_id: null, full_name: 'Organizing Secretary', position: 'Organizing Secretary', panel_year: '2024-25', avatar_url: null, bio: null, email: null, facebook_url: null, display_order: 4, is_active: true, created_at: '' },
  { id: '5', profile_id: null, full_name: 'Finance Secretary', position: 'Finance Secretary', panel_year: '2024-25', avatar_url: null, bio: null, email: null, facebook_url: null, display_order: 5, is_active: true, created_at: '' },
  { id: '6', profile_id: null, full_name: 'Research Secretary', position: 'Research Secretary', panel_year: '2024-25', avatar_url: null, bio: null, email: null, facebook_url: null, display_order: 6, is_active: true, created_at: '' },
]

export default async function ECCommitteePage() {
  const supabase = await createClient()
  const { data: members } = await supabase
    .from('executive_body')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const data = (members && members.length > 0) ? members : fallback

  return (
    <div className="min-h-screen bg-[#050D1A] pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B8FD8]/10 border border-[#1B8FD8]/20 text-[#1B8FD8] text-sm font-medium mb-4">
            Leadership Panel
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Executive <span className="gradient-text">Committee</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            The dedicated leaders who manage, organize, and inspire DCDS to new heights every year.
          </p>
        </div>

        {/* Panel Year Badge */}
        {data.length > 0 && (
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F0C040]/10 border border-[#F0C040]/20 text-[#F0C040] font-semibold">
              <Award className="w-5 h-5" /> Executive Committee {data[0].panel_year}
            </span>
          </div>
        )}

        {/* EC Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {data.map((member) => (
            <div key={member.id} className="group text-center glass border border-white/5 rounded-2xl p-6 card-hover">
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1B8FD8] to-[#0A1628] p-0.5 group-hover:from-[#F0C040] group-hover:to-[#1B8FD8] transition-all duration-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0A1628] flex items-center justify-center">
                    {member.avatar_url ? (
                      <Image src={member.avatar_url} alt={member.full_name} width={96} height={96} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-2xl font-bold text-[#1B8FD8] group-hover:text-[#F0C040] transition-colors">{getInitials(member.full_name)}</span>
                    )}
                  </div>
                </div>
              </div>
              <h2 className="font-bold text-white mb-1">{member.full_name}</h2>
              <p className="text-sm text-[#1B8FD8] font-medium mb-1">{member.position}</p>
              <p className="text-xs text-gray-500 mb-3">{member.panel_year}</p>
              {member.bio && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{member.bio}</p>}
              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {member.facebook_url && (
                  <a href={member.facebook_url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`}
                    className="w-8 h-8 rounded-full bg-[#1B8FD8]/10 flex items-center justify-center text-[#1B8FD8] hover:bg-[#1B8FD8]/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
