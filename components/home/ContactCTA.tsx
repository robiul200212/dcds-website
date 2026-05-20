import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'

export function ContactCTA() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#1B8FD8]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#F0C040]/10 blur-3xl" />
      </div>
      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-100 text-[#D49A2A] text-sm font-bold mb-6 uppercase tracking-wider">
            Ready to Begin?
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
            Your Debate Journey<br />
            <span className="bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] bg-clip-text text-transparent">Starts Here</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto font-medium">
            Join hundreds of passionate students who have transformed their lives through debate. Registration is open — take the first step today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] shadow-lg hover:shadow-xl hover:shadow-[#1B8FD8]/30 hover:-translate-y-1 transition-all duration-300">
              Register as Member
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm">
              <Mail className="w-5 h-5" />
              Get in Touch
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-6 justify-center mt-10 text-sm font-semibold text-gray-500">
            <span className="flex items-center gap-1.5">✅ Registration is live</span>
            <span className="flex items-center gap-1.5">✅ Open to all Dhaka College students</span>
            <span className="flex items-center gap-1.5">✅ Expert mentorship</span>
          </div>
        </div>
      </div>
    </section>
  )
}
