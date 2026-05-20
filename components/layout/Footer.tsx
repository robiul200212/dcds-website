import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

const footerLinks = {
  'Quick Links': [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About DCDS' },
    { href: '/ec-committee', label: 'EC Committee' },
    { href: '/events', label: 'Events & Fests' },
    { href: '/articles', label: 'Articles' },
    { href: '/gallery', label: 'Gallery' },
  ],
  'Member': [
    { href: '/auth/register', label: 'Join DCDS' },
    { href: '/auth/login', label: 'Member Login' },
    { href: '/dashboard', label: 'My Dashboard' },
    { href: '/notices', label: 'Notice Board' },
    { href: '/contact', label: 'Contact Us' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#050D1A] border-t border-[#1B8FD8]/10">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#1B8FD8]/40">
                <Image src="/logo.png" alt="DCDS Logo" width={48} height={48} className="object-contain" />
              </div>
              <div>
                <p className="font-bold text-xl text-white" style={{ fontFamily: 'var(--font-outfit)' }}>DCDS</p>
                <p className="text-sm text-[#1B8FD8]">Dhaka College Debating Society</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              Fostering critical thinking, public speaking, and leadership among students 
              of Dhaka College since 1995. Where logic meets eloquence.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="https://facebook.com/dcds" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#1877F2]/10 border border-[#1877F2]/20 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2]/20 transition-all"
                aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#FF0000]/10 border border-[#FF0000]/20 flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000]/20 transition-all"
                aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="mailto:dcds@dhakacollege.edu.bd"
                className="w-9 h-9 rounded-lg bg-[#1B8FD8]/10 border border-[#1B8FD8]/20 flex items-center justify-center text-[#1B8FD8] hover:bg-[#1B8FD8]/20 transition-all"
                aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Footer Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm text-gray-400 hover:text-[#1B8FD8] transition-colors flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1B8FD8]/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-[#1B8FD8]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="text-sm text-gray-300">Dhaka College, Mirpur Road, Dhaka-1205</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1B8FD8]/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-[#1B8FD8]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <a href="mailto:dcds@dhakacollege.edu.bd" className="text-sm text-gray-300 hover:text-[#1B8FD8] transition-colors">
                dcds@dhakacollege.edu.bd
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1B8FD8]/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-[#1B8FD8]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone</p>
              <p className="text-sm text-gray-300">+880-2-XXXXXXXX</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Dhaka College Debating Society. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Built with ❤️ for DCDS
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-[#1B8FD8] hover:underline flex items-center gap-0.5">
              Next.js <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
