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

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
  principal: { label: 'Principal', color: '#F0C040', bg: 'from-[#F0C040]/15 to-[#F0C040]/3' },
  moderator: { label: 'Moderator', color: '#1B8FD8', bg: 'from-[#1B8FD8]/15 to-[#1B8FD8]/3' },
  advisor: { label: 'Advisor', color: '#1B6B32', bg: 'from-[#1B6B32]/15 to-[#1B6B32]/3' },
  guest: { label: 'Guest', color: '#C41230', bg: 'from-[#C41230]/15 to-[#C41230]/3' },
}

export function SpeechesSection({ speeches }: Props) {
  const data = speeches.length > 0 ? speeches : fallback
  const principal = data.find(s => s.speaker_role === 'principal')
  const others = data.filter(s => s.speaker_role !== 'principal').slice(0, 3)

  return (
    <section className="section-padding bg-[#050D1A] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#F0C040]/4 blur-3xl" />
      <div className="container-custom relative">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F0C040]/10 border border-[#F0C040]/20 text-[#F0C040] text-sm font-medium mb-4">
            Words of Wisdom
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
            Leadership <span className="gradient-text-gold">Speaks</span>
          </h2>
        </div>

        {/* Principal Card — Full Width */}
        {principal && (
          <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${roleConfig[principal.speaker_role].bg} border border-[#F0C040]/15 p-8 md:p-10 mb-6`}>
            <Quote className="absolute top-6 right-6 w-16 h-16 text-[#F0C040]/10" />
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-[#F0C040]/30 bg-[#0A1628] flex items-center justify-center">
                  {principal.avatar_url ? (
                    <Image src={principal.avatar_url} alt={principal.speaker_name} width={80} height={80} className="object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[#F0C040]">{getInitials(principal.speaker_name)}</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <GraduationCap className="w-6 h-6 text-[#F0C040] mb-3" />
                <blockquote className="text-lg text-gray-200 italic leading-relaxed mb-5">
                  &ldquo;{principal.speech_text}&rdquo;
                </blockquote>
                <div>
                  <p className="font-bold text-white">{principal.speaker_name}</p>
                  <p className="text-sm text-[#F0C040]">{principal.designation}</p>
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
              <div key={speech.id} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${conf.bg} border border-white/5 p-6`}>
                <Quote className="absolute top-4 right-4 w-10 h-10 opacity-10" style={{ color: conf.color }} />
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#0A1628]" style={{ border: `1px solid ${conf.color}30` }}>
                    {speech.avatar_url ? (
                      <Image src={speech.avatar_url} alt={speech.speaker_name} width={48} height={48} className="object-cover" />
                    ) : (
                      <span className="text-sm font-bold" style={{ color: conf.color }}>{getInitials(speech.speaker_name)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{speech.speaker_name}</p>
                    <p className="text-xs" style={{ color: conf.color }}>{speech.designation}</p>
                  </div>
                </div>
                <blockquote className="text-sm text-gray-400 italic leading-relaxed">
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
