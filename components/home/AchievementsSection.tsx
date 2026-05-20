import Image from 'next/image'
import type { Achievement } from '@/lib/types'
import { Trophy, Award, Globe, Star } from 'lucide-react'

const categoryIcons: Record<string, React.ElementType> = {
  tournament: Trophy, award: Award, national: Star, international: Globe, recognition: Award, other: Trophy,
}

const categoryColors: Record<string, string> = {
  tournament: '#F0C040', award: '#1B8FD8', national: '#C41230', international: '#1B6B32', recognition: '#1B8FD8', other: '#F0C040',
}

interface Props { achievements: Achievement[] }

const fallbackAchievements = [
  { id: '1', title: 'National Debate Championship', category: 'national', award_date: '2024-03-15', description: 'Champions at the National Debate Championship 2024', is_featured: true },
  { id: '2', title: 'Best Debate Society Award', category: 'award', award_date: '2023-12-10', description: 'Recognized as the best debate society in Dhaka', is_featured: true },
  { id: '3', title: 'Inter-College Tournament Victory', category: 'tournament', award_date: '2023-09-20', description: '1st place in inter-college debate tournament', is_featured: true },
  { id: '4', title: 'International Debate Qualifier', category: 'international', award_date: '2022-11-05', description: 'Qualified for international debate competition', is_featured: true },
]

export function AchievementsSection({ achievements }: Props) {
  const data = achievements.length > 0 ? achievements : fallbackAchievements

  return (
    <section className="section-padding bg-[#050D1A] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#F0C040]/3 blur-3xl pointer-events-none" />
      <div className="container-custom relative">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F0C040]/10 border border-[#F0C040]/20 text-[#F0C040] text-sm font-medium mb-4">
            Our Victories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            A Legacy of <span className="gradient-text-gold">Excellence</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Decades of hard work, passion, and teamwork — our achievements reflect DCDS&apos;s relentless pursuit of excellence on every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.map((ach, i) => {
            const Icon = categoryIcons[ach.category] || Trophy
            const color = categoryColors[ach.category] || '#F0C040'
            return (
              <div key={ach.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/3 to-transparent p-6 card-hover">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 100%)` }} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-3 capitalize" style={{ background: `${color}15`, color }}>
                    {ach.category}
                  </span>
                  <h3 className="font-bold text-white text-sm mb-2 leading-tight">{ach.title}</h3>
                  {ach.description && <p className="text-gray-500 text-xs leading-relaxed">{ach.description}</p>}
                  <p className="text-xs mt-3" style={{ color }}>{new Date(ach.award_date).getFullYear()}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
