import type { Metadata } from 'next'
import Link from 'next/link'
import { Users2, Award, Globe, BookOpen, Target, Heart, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About DCDS',
  description: 'Learn about the history, mission, values, and journey of Dhaka College Debating Society.',
}

const milestones = [
  { year: '1995', title: 'DCDS Founded', description: 'Dhaka College Debating Society established with a founding batch of passionate debaters.' },
  { year: '2000', title: 'First National Title', description: 'DCDS wins its first national inter-college debate championship.' },
  { year: '2005', title: 'International Debut', description: 'DCDS members participate in international debate forums for the first time.' },
  { year: '2010', title: 'Annual Fest Launched', description: 'Launch of the DCDS Annual Debate Fest, now one of the biggest in Bangladesh.' },
  { year: '2015', title: '20th Anniversary', description: 'Celebrated 20 years with a grand reunion and championship series.' },
  { year: '2020', title: 'Digital Transformation', description: 'DCDS adapts to online formats, hosting virtual tournaments during COVID-19.' },
  { year: '2024', title: 'New Heights', description: 'Record membership and championship wins in the 2024 session.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050D1A] pt-24 pb-16">
      <div className="container-custom">
        {/* Hero */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B8FD8]/10 border border-[#1B8FD8]/20 text-[#1B8FD8] text-sm font-medium mb-4">
            Our Story
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
            About <span className="gradient-text">DCDS</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            For over three decades, Dhaka College Debating Society has been the intellectual heartbeat 
            of Dhaka College — nurturing generations of thinkers, speakers, and leaders.
          </p>
        </div>

        {/* Mission / Vision / Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: 'Our Mission', color: '#1B8FD8', text: 'To develop confident, articulate, and analytically sharp students who can communicate ideas powerfully and lead with integrity in every sphere of life.' },
            { icon: Globe, title: 'Our Vision', color: '#F0C040', text: "To be recognized as Bangladesh's most impactful student debate organization — shaping the voices of tomorrow's leaders through excellence in discourse." },
            { icon: Heart, title: 'Our Values', color: '#C41230', text: 'Intellectual honesty, inclusive discourse, mutual respect, continuous learning, and an unbreakable competitive spirit — these are the pillars of DCDS.' },
          ].map(({ icon: Icon, title, color, text }) => (
            <div key={title} className="p-6 rounded-2xl glass border border-white/5 card-hover">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h2 className="font-bold text-white mb-3" style={{ color }}>{title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* About Text */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="prose-dcds space-y-4 text-gray-400 leading-relaxed">
            <p className="text-lg text-gray-300">
              Dhaka College Debating Society (DCDS) was established in 1995 with a singular vision — 
              to create a platform where the brightest minds of Dhaka College could sharpen their 
              intellectual abilities and develop the art of reasoned discourse.
            </p>
            <p>
              Over the past three decades, DCDS has grown from a small group of passionate debaters 
              into one of Bangladesh's most renowned student organizations. Our members have gone on 
              to become lawyers, politicians, journalists, academics, and business leaders — all 
              crediting DCDS as the crucible that forged their confidence and critical thinking.
            </p>
            <p>
              We participate in and host tournaments in multiple formats including Asian Parliamentary, 
              British Parliamentary, World Schools Debate, and more. Our annual debate fest has 
              become one of the most prestigious inter-college events in the country, attracting 
              participants from institutions across Bangladesh.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-white text-center mb-10" style={{ fontFamily: 'var(--font-outfit)' }}>
            Our <span className="gradient-text">Journey</span>
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1B8FD8] via-[#F0C040] to-[#1B6B32] hidden md:block" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={m.year} className={`flex gap-6 items-start ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="glass border border-white/5 rounded-2xl p-5 card-hover inline-block w-full">
                      <span className="text-[#F0C040] font-bold text-sm">{m.year}</span>
                      <h3 className="font-bold text-white mt-1 mb-2">{m.title}</h3>
                      <p className="text-gray-400 text-sm">{m.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-5 h-5 rounded-full bg-[#1B8FD8] border-4 border-[#050D1A] flex-shrink-0 mt-5 relative z-10" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] hover:shadow-2xl hover:shadow-[#1B8FD8]/30 hover:scale-105 transition-all duration-300">
            Join Our Legacy <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
