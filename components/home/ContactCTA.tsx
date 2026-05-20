import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'

export function ContactCTA() {
  return (
    <section className="section-padding bg-[#050D1A] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#1B8FD8]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#F0C040]/8 blur-3xl" />
      </div>
      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F0C040]/10 border border-[#F0C040]/20 text-[#F0C040] text-sm font-medium mb-6">
            Ready to Begin?
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
            Your Debate Journey<br />
            <span className="gradient-text">Starts Here</span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            Join hundreds of passionate students who have transformed their lives through debate. Registration is open — take the first step today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] hover:shadow-2xl hover:shadow-[#1B8FD8]/30 hover:scale-105 transition-all duration-300">
              Register as Member
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white glass border border-white/10 hover:border-[#F0C040]/30 hover:bg-white/5 transition-all duration-300">
              <Mail className="w-5 h-5" />
              Get in Touch
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-6 justify-center mt-10 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">✅ Free to join (with membership fee)</span>
            <span className="flex items-center gap-1.5">✅ Open to all Dhaka College students</span>
            <span className="flex items-center gap-1.5">✅ Expert mentorship</span>
          </div>
        </div>
      </div>
    </section>
  )
}
