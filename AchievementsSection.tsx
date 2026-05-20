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
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#F0C040]/5 blur-3xl pointer-events-none" />
      <div className="container-custom relative">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-100 text-[#D49A2A] text-sm font-bold mb-4 uppercase tracking-wider">
            Our Victories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            A Legacy of <span className="bg-gradient-to-r from-[#D49A2A] to-[#F0C040] bg-clip-text text-transparent">Excellence</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-medium leading-relaxed">
            Decades of hard work, passion, and teamwork — our achievements reflect DCDS&apos;s relentless pursuit of excellence on every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.map((ach, i) => {
            const Icon = categoryIcons[ach.category] || Trophy
            const color = categoryColors[ach.category] || '#F0C040'
            return (
              <div key={ach.id} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-6 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${color}20 0%, transparent 100%)` }} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold mb-3 capitalize" style={{ background: `${color}15`, color }}>
                    {ach.category}
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-sm mb-2 leading-tight">{ach.title}</h3>
                  {ach.description && <p className="text-gray-600 font-medium text-xs leading-relaxed">{ach.description}</p>}
                  <p className="text-xs font-bold mt-3" style={{ color }}>{new Date(ach.award_date).getFullYear()}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
