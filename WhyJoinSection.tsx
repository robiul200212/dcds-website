import { Brain, Mic, Award, Users, Globe, BookOpen, Star, Zap } from 'lucide-react'

const benefits = [
  { icon: Brain, title: 'Critical Thinking', description: 'Develop razor-sharp analytical skills through intensive debate practice and training sessions.', color: '#1B8FD8' },
  { icon: Mic, title: 'Public Speaking', description: 'Overcome stage fright and master the art of confident, persuasive public speaking.', color: '#F0C040' },
  { icon: Award, title: 'Win Championships', description: 'Compete in prestigious national and regional tournaments and bring home trophies.', color: '#C41230' },
  { icon: Users, title: 'Build Network', description: 'Connect with bright minds from Dhaka College and debate clubs across Bangladesh.', color: '#1B6B32' },
  { icon: Globe, title: 'Global Exposure', description: 'Participate in international debate formats like BP, WSDC, and Model UN.', color: '#8B5CF6' },
  { icon: BookOpen, title: 'Research Skills', description: 'Master the art of rapid research and building evidence-based arguments.', color: '#F0C040' },
  { icon: Star, title: 'Leadership Growth', description: 'Take on leadership roles within the club and develop executive management skills.', color: '#1B8FD8' },
  { icon: Zap, title: 'Instant Thinking', description: 'Train your mind to think on its feet with impromptu debates and quickfire sessions.', color: '#C41230' },
]

export function WhyJoinSection() {
  return (
    <section className="section-padding bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(27,143,216,0.03) 0%, transparent 70%)' }} />
      <div className="container-custom relative">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#1B8FD8] text-sm font-bold mb-4 uppercase tracking-wider">
            Why DCDS?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Transform Your <span className="bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] bg-clip-text text-transparent">Potential</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto font-medium">
            Joining DCDS is one of the best decisions you can make as a Dhaka College student. Here's why hundreds of members agree.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <div key={i} className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1B8FD8]/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${benefit.color}15`, border: `1px solid ${benefit.color}30` }}>
                  <Icon className="w-6 h-6" style={{ color: benefit.color }} />
                </div>
                <h3 className="font-extrabold text-gray-900 mb-2 text-sm">{benefit.title}</h3>
                <p className="text-xs font-medium text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
