import Link from 'next/link'
import { BookOpen, Users2, Award, Globe, ChevronRight } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="section-padding bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#1B8FD8]/5 blur-3xl" />
      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-[#1B8FD8] text-sm font-bold mb-5 uppercase tracking-wider">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
              The Premier Debate Society of
              <span className="bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] bg-clip-text text-transparent"> Dhaka College</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5 font-medium">
              Dhaka College Debating Society (DCDS) was established with a singular mission — 
              to cultivate the art of reasoned discourse and empower students with the tools 
              of critical thinking, eloquent speech, and ethical leadership.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 font-medium">
              Over three decades, we have nurtured hundreds of debate champions, national 
              leaders, and accomplished professionals. Our legacy is built on intellectual 
              rigor, passionate debate, and an unwavering commitment to excellence.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: BookOpen, text: 'Academic Excellence' },
                { icon: Users2, text: 'Inclusive Community' },
                { icon: Award, text: 'National Champions' },
                { icon: Globe, text: 'International Exposure' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#1B8FD8]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{text}</span>
                </div>
              ))}
            </div>

            <Link href="/about" className="inline-flex items-center gap-2 text-[#1B8FD8] font-bold hover:gap-3 transition-all group">
              Learn More About DCDS
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Vision/Mission Cards */}
          <div className="space-y-5">
            {[
              {
                title: 'Our Mission',
                text: 'To develop confident, articulate, and analytically sharp students who can communicate ideas powerfully and lead with integrity.',
                color: '#1B8FD8',
              },
              {
                title: 'Our Vision',
                text: 'To be recognized as Bangladesh\'s most impactful student debate organization — shaping the voices of tomorrow\'s leaders.',
                color: '#F0C040',
              },
              {
                title: 'Our Values',
                text: 'Intellectual honesty, inclusive discourse, mutual respect, continuous learning, and an unbreakable spirit of competition.',
                color: '#1B6B32',
              },
            ].map((item) => (
              <div key={item.title} className={`relative p-6 rounded-2xl bg-white shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 overflow-hidden group`}>
                <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl transition-all duration-300 group-hover:w-2" style={{ background: item.color }} />
                <h3 className="font-extrabold mb-2 pl-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed pl-4 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
