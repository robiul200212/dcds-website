'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) throw error

      const { data: profile } = await supabase.from('profiles').select('role, membership_status').eq('email', data.email).single()

      toast.success('Welcome back!')
      if (profile?.role && ['super_admin', 'admin', 'office_secretary'].includes(profile.role)) {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    const email = (document.getElementById('email-input') as HTMLInputElement)?.value
    if (!email) { toast.error('Please enter your email first'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/dashboard` } })
      if (error) throw error
      toast.success('Magic link sent! Check your email.')
    } catch (err: unknown) {
      toast.error('Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050D1A] flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#1B8FD8]/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#F0C040]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#1B8FD8]/30">
              <Image src="/logo.png" alt="DCDS" width={56} height={56} className="object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">Sign in to your DCDS account</p>
        </div>

        {/* Card */}
        <div className="glass-dark rounded-2xl p-8 border border-[#1B8FD8]/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="email-input"
                  type="email"
                  {...register('email')}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 focus:bg-white/8 transition-all text-sm"
                />
              </div>
              {errors.email && <p className="text-xs text-[#C41230] mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-[#1B8FD8] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#C41230] mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] hover:shadow-lg hover:shadow-[#1B8FD8]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Magic Link */}
          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-medium text-gray-300 glass border border-white/10 hover:border-[#1B8FD8]/30 hover:text-white transition-all"
          >
            ✨ Send Magic Link
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Not a member yet?{' '}
            <Link href="/auth/register" className="text-[#1B8FD8] font-semibold hover:underline">
              Join DCDS
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
