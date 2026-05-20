'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon, ChevronDown, LogIn, UserPlus, LayoutDashboard, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'
import { getInitials } from '@/lib/utils'
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
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
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
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
          : 'bg-white border-b border-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 bg-white flex items-center justify-center">
            <Image src="/logo.png" alt="DCDS Logo" width={40} height={40} className="object-contain" />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-lg text-gray-900 leading-tight block" style={{ fontFamily: 'var(--font-outfit)' }}>
              DCDS
            </span>
            <span className="text-[11px] font-bold text-[#1B8FD8] leading-tight block uppercase tracking-wider">Dhaka College</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-[#1B8FD8] hover:bg-blue-50/50 transition-all"
                >
                  {link.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#1B8FD8] hover:bg-blue-50 transition-colors"
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
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  pathname === link.href
                    ? 'text-[#1B8FD8] bg-blue-50'
                    : 'text-gray-600 hover:text-[#1B8FD8] hover:bg-blue-50/50'
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-all"
              >
                {user.avatar_url ? (
                  <Image src={user.avatar_url} alt={user.full_name} width={28} height={28} className="rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1B8FD8] to-[#1470B0] flex items-center justify-center text-xs font-bold text-white">
                    {getInitials(user.full_name)}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-semibold text-gray-700 max-w-24 truncate pl-1">
                  {user.full_name.split(' ')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-900">{user.full_name}</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{user.member_id || 'Pending'}</p>
                  </div>
                  <div className="p-2">
                    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1B8FD8] hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" /> My Dashboard
                    </Link>
                    {isAdminUser && (
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-[#1B6B32] hover:bg-green-50 rounded-lg transition-colors mt-1" onClick={() => setUserMenuOpen(false)}>
                        <Shield className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-100">
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/auth/login" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all">
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link href="/auth/register" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold bg-[#1B8FD8] text-white hover:bg-[#1470B0] shadow-sm hover:shadow-md hover:shadow-[#1B8FD8]/20 transition-all">
                <UserPlus className="w-4 h-4" /> Join DCDS
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 mt-2 shadow-lg absolute left-0 right-0">
          <div className="container-custom py-4 flex flex-col gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{link.label}</p>
                  {link.children.map((child) => (
                    <Link key={child.href} href={child.href} onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-[#1B8FD8] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.href} href={link.href!} onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-bold rounded-lg transition-colors ${
                    pathname === link.href ? 'text-[#1B8FD8] bg-blue-50' : 'text-gray-600 hover:text-[#1B8FD8] hover:bg-blue-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            {!user && (
              <div className="flex flex-col gap-2 pt-4 pb-2 border-t border-gray-100 mt-2">
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="text-center px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Login</Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)} className="text-center px-4 py-2.5 rounded-lg text-sm font-bold bg-[#1B8FD8] text-white hover:bg-[#1470B0] transition-colors shadow-sm">Join DCDS</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
