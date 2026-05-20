import Image from 'next/image'
import type { Speech } from '@/lib/types'
import { Quote, GraduationCap } from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface Props { speeches: Speech[] }

const fallback: Speech[] = [
  { id: '1', speaker_name: 'Principal Name', speaker_role: 'principal', designation: 'Principal, Dhaka College', speech_text: 'Dhaka College Debating Society has been a cornerstone of intellectual development at our institution. I am immensely proud of every member who has channeled their passion into meaningful debate and discourse. This society represents the finest tradition of academic excellence.', avatar_url: null, display_order: 0, is_active: true, created_at: '' },
  { id: '2', speaker_name: 'Chief Moderator', speaker_role: 'moderator', designation: 'Chief Moderator, DCDS', speech_text: 'Debate is the sharpest tool for shaping a young mind. DCDS has always nurtured students who question, reason, and lead. I encourage every student to embrace the culture of thoughtful discourse that this society champions.', avatar_url: null, display_order: 1, is_active: true, created_at: '' },
  { id: '3', speaker_name: 'Faculty Advisor', speaker_role: 'moderator', designation: 'Faculty Advisor, DCDS', speech_text: 'The students of DCDS demonstrate remarkable dedication. Watching them grow from hesitant freshers to confident debaters is one of the greatest joys of my role as advisor. Their journey inspires us all.', avatar_url: null, display_order: 2, is_active: true, created_at: '' },
  { id: '4', speaker_name: 'Senior Moderator', speaker_role: 'moderator', designation: 'Senior Moderator, DCDS', speech_text: 'DCDS is more than a club — it is a life school. The friendships forged here, the arguments won and lost, the lessons learned from every tournament, stay with our members for a lifetime.', avatar_url: null, display_order: 3, is_active: true, created_at: '' },
]

const roleConfig: Record<string, { label: string; color: string; bgClass: string }> = {
  principal: { label: 'Principal', color: '#D49A2A', bgClass: 'bg-yellow-50/30 border-yellow-200' },
  moderator: { label: 'Moderator', color: '#1B8FD8', bgClass: 'bg-blue-50/30 border-blue-100' },
  advisor: { label: 'Advisor', color: '#1B6B32', bgClass: 'bg-green-50/30 border-green-100' },
  guest: { label: 'Guest', color: '#C41230', bgClass: 'bg-red-50/30 border-red-100' },
}

export function SpeechesSection({ speeches }: Props) {
  const data = speeches.length > 0 ? speeches : fallback
  const principal = data.find(s => s.speaker_role === 'principal')
  const others = data.filter(s => s.speaker_role !== 'principal').slice(0, 3)

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#F0C040]/5 blur-3xl" />
      <div className="container-custom relative">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-100 text-[#D49A2A] text-sm font-bold mb-4 uppercase tracking-wider">
            Words of Wisdom
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
            Leadership <span className="bg-gradient-to-r from-[#D49A2A] to-[#F0C040] bg-clip-text text-transparent">Speaks</span>
          </h2>
        </div>

        {/* Principal Card — Full Width */}
        {principal && (
          <div className={`relative overflow-hidden rounded-2xl ${roleConfig[principal.speaker_role].bgClass} border shadow-sm p-8 md:p-10 mb-6`}>
            <Quote className="absolute top-6 right-6 w-16 h-16 opacity-10" style={{ color: roleConfig[principal.speaker_role].color }} />
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-white flex items-center justify-center">
                  {principal.avatar_url ? (
                    <Image src={principal.avatar_url} alt={principal.speaker_name} width={80} height={80} className="object-cover" />
                  ) : (
                    <span className="text-2xl font-extrabold" style={{ color: roleConfig[principal.speaker_role].color }}>{getInitials(principal.speaker_name)}</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <GraduationCap className="w-6 h-6 mb-3" style={{ color: roleConfig[principal.speaker_role].color }} />
                <blockquote className="text-lg font-medium text-gray-700 italic leading-relaxed mb-5">
                  &ldquo;{principal.speech_text}&rdquo;
                </blockquote>
                <div>
                  <p className="font-extrabold text-gray-900">{principal.speaker_name}</p>
                  <p className="text-sm font-bold" style={{ color: roleConfig[principal.speaker_role].color }}>{principal.designation}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Moderators Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {others.map((speech) => {
            const conf = roleConfig[speech.speaker_role] || roleConfig.moderator
            return (
              <div key={speech.id} className={`relative overflow-hidden rounded-2xl ${conf.bgClass} border shadow-sm p-6 hover:shadow-md transition-shadow duration-300`}>
                <Quote className="absolute top-4 right-4 w-10 h-10 opacity-5" style={{ color: conf.color }} />
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-white shadow-sm ring-2 ring-white">
                    {speech.avatar_url ? (
                      <Image src={speech.avatar_url} alt={speech.speaker_name} width={48} height={48} className="object-cover" />
                    ) : (
                      <span className="text-sm font-extrabold" style={{ color: conf.color }}>{getInitials(speech.speaker_name)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm leading-tight mb-1">{speech.speaker_name}</p>
                    <p className="text-xs font-bold" style={{ color: conf.color }}>{speech.designation}</p>
                  </div>
                </div>
                <blockquote className="text-sm font-medium text-gray-600 italic leading-relaxed">
                  &ldquo;{speech.speech_text.slice(0, 180)}{speech.speech_text.length > 180 ? '...' : ''}&rdquo;
                </blockquote>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
