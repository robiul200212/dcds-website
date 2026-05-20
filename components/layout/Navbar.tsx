'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon, ChevronDown, LogIn, UserPlus, LayoutDashboard, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'
import { getInitials } from '@/lib/utils'
import { useTheme } from 'next-themes'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/ec-committee', label: 'EC Committee' },
  {
    label: 'More',
    children: [
      { href: '/events', label: 'Events & Fests' },
      { href: '/articles', label: 'Articles' },
      { href: '/notices', label: 'Notice Board' },
      { href: '/gallery', label: 'Gallery' },
    ],
  },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<Profile | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
        setUser(data)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserMenuOpen(false)
    window.location.href = '/'
  }

  const isAdminUser = user && ['super_admin', 'admin', 'office_secretary'].includes(user.role)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-dark shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#1B8FD8]/40 group-hover:ring-[#F0C040] transition-all duration-300">
            <Image src="/logo.png" alt="DCDS Logo" width={40} height={40} className="object-contain" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg text-white leading-tight block" style={{ fontFamily: 'var(--font-outfit)' }}>
              DCDS
            </span>
            <span className="text-xs text-[#1B8FD8] leading-tight block">Dhaka College</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 w-48 glass-dark rounded-xl overflow-hidden shadow-xl border border-[#1B8FD8]/20">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-[#1B8FD8]/10 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'text-[#F0C040] bg-[#F0C040]/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-400 hover:text-[#F0C040] hover:bg-white/5 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[#1B8FD8]/20 hover:border-[#1B8FD8]/50 transition-all"
              >
                {user.avatar_url ? (
                  <Image src={user.avatar_url} alt={user.full_name} width={32} height={32} className="rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B8FD8] to-[#0A1628] flex items-center justify-center text-xs font-bold text-white">
                    {getInitials(user.full_name)}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-white max-w-24 truncate">
                  {user.full_name.split(' ')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-dark rounded-xl shadow-xl border border-[#1B8FD8]/20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-semibold text-white">{user.full_name}</p>
                    <p className="text-xs text-gray-400">{user.member_id || 'Pending'}</p>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>
                    <LayoutDashboard className="w-4 h-4" /> My Dashboard
                  </Link>
                  {isAdminUser && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-[#F0C040] hover:bg-[#F0C040]/10 transition-colors" onClick={() => setUserMenuOpen(false)}>
                      <Shield className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-sm text-[#C41230] hover:bg-[#C41230]/10 transition-colors border-t border-white/5">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/auth/login" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link href="/auth/register" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] text-white hover:shadow-lg hover:shadow-[#1B8FD8]/30 transition-all">
                <UserPlus className="w-4 h-4" /> Join DCDS
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden glass-dark border-t border-white/5 mt-2">
          <div className="container-custom py-4 flex flex-col gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{link.label}</p>
                  {link.children.map((child) => (
                    <Link key={child.href} href={child.href} onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.href} href={link.href!} onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href ? 'text-[#F0C040] bg-[#F0C040]/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            {!user && (
              <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="text-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 border border-white/10 hover:bg-white/5">Login</Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)} className="text-center px-4 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] text-white">Join DCDS</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
