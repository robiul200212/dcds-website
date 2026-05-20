'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface CounterProps { end: number; suffix?: string; duration?: number }

function Counter({ end, suffix = '', duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress === 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const stats = [
  { value: 30, suffix: '+', label: 'Years of Excellence', description: 'Founded in 1995', color: '#1B8FD8', bg: 'from-[#1B8FD8]/20 to-[#1B8FD8]/5' },
  { value: 500, suffix: '+', label: 'Total Members', description: 'Alumni and active', color: '#F0C040', bg: 'from-[#F0C040]/20 to-[#F0C040]/5' },
  { value: 50, suffix: '+', label: 'Championships Won', description: 'National & regional', color: '#C41230', bg: 'from-[#C41230]/20 to-[#C41230]/5' },
  { value: 100, suffix: '+', label: 'Events Hosted', description: 'Fests, workshops & more', color: '#1B6B32', bg: 'from-[#1B6B32]/20 to-[#1B6B32]/5' },
  { value: 20, suffix: '+', label: 'National Titles', description: 'Top debate honors', color: '#F0C040', bg: 'from-[#F0C040]/20 to-[#F0C040]/5' },
  { value: 95, suffix: '%', label: 'Member Satisfaction', description: 'Annual survey result', color: '#1B8FD8', bg: 'from-[#1B8FD8]/20 to-[#1B8FD8]/5' },
]

export function StatsSection() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      <div className="container-custom relative">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#1B8FD8] text-sm font-bold mb-4 uppercase tracking-wider">
            Our Legacy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
            Numbers That Define <span className="bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] bg-clip-text text-transparent">DCDS</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {stats.map((stat, i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md border border-gray-100 p-5 text-center transition-all duration-300 group hover:-translate-y-1`}>
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: stat.color }} />
              <p className="text-3xl font-extrabold mb-1.5" style={{ color: stat.color, fontFamily: 'var(--font-outfit)' }}>
                <Counter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm font-bold text-gray-800 mb-1 leading-tight">{stat.label}</p>
              <p className="text-xs font-medium text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
