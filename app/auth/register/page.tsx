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
import { Upload, X, Eye, EyeOff, User, Mail, Lock, Phone, BookOpen, Hash, ChevronRight, ChevronLeft, Check } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  phone: z.string().min(11, 'Enter a valid phone number').max(14),
  student_id: z.string().min(4, 'Enter your student ID'),
  department: z.string().min(2, 'Select your department'),
  session: z.string().min(4, 'Enter your session e.g. 2022-23'),
  why_join: z.string().min(30, 'Please write at least 30 characters').max(500).optional().or(z.literal('')),
  payment_ref: z.string().min(5, 'Enter your payment reference/transaction ID'),
  agree_terms: z.boolean().refine(v => v === true, 'You must agree to terms'),
}).refine(d => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})

type FormData = z.infer<typeof schema>

const departments = [
  'HSC Science', 'HSC Commerce', 'HSC Arts', 'Department of Physics', 'Department of Chemistry',
  'Department of Mathematics', 'Department of Botany', 'Department of Zoology',
  'Department of Geography and Environment', 'Department of Soil Science',
  'Department of Psychology', 'Department of Statistics', 'Department of Bengali',
  'Department of English', 'Department of History', 'Department of Islamic History and Culture',
  'Department of Philosophy', 'Department of Economics', 'Department of Political Science',
  'Department of Sociology', 'Department of Islamic Studies', 'Department of Accounting',
  'Department of Management'
]

const STEPS = ['Account', 'Personal', 'Payment', 'Review']

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [paymentFile, setPaymentFile] = useState<File | null>(null)
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { agree_terms: false },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setPaymentPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const nextStep = async () => {
    const fieldsPerStep: Record<number, (keyof FormData)[]> = {
      0: ['full_name', 'email', 'password', 'confirm_password'],
      1: ['phone', 'student_id', 'department', 'session'],
      2: ['payment_ref'],
    }
    const valid = await trigger(fieldsPerStep[step])
    if (valid) setStep(s => s + 1)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      // 1. Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { full_name: data.full_name } },
      })
      if (signUpError) throw signUpError

      const userId = authData.user?.id
      if (!userId) throw new Error('User creation failed')

      // 2. Upload payment screenshot
      let paymentUrl: string | null = null
      if (paymentFile) {
        const ext = paymentFile.name.split('.').pop()
        const path = `payment-proofs/${userId}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('dcds-media')
          .upload(path, paymentFile, { upsert: true })
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('dcds-media').getPublicUrl(path)
          paymentUrl = urlData.publicUrl
        }
      }

      // 3. Update profile
      const { error: profileError } = await supabase.from('profiles').update({
        full_name: data.full_name,
        phone: data.phone,
        student_id: data.student_id,
        department: data.department,
        session: data.session,
        payment_ref: data.payment_ref,
        payment_screenshot_url: paymentUrl,
        membership_status: 'pending',
      }).eq('id', userId)
      if (profileError) throw profileError

      // 4. Insert registration request
      await supabase.from('registration_requests').insert({
        profile_id: userId,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        student_id: data.student_id,
        department: data.department,
        session: data.session,
        why_join: data.why_join || null,
        payment_ref: data.payment_ref,
        payment_screenshot_url: paymentUrl,
        status: 'pending',
      })

      toast.success('Registration submitted! You will be notified once approved.')
      router.push('/auth/login')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const formValues = watch()

  return (
    <div className="min-h-screen bg-[#050D1A] flex items-center justify-center px-4 pt-24 pb-12">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-[#1B8FD8]/8 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-[#F0C040]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#1B8FD8]/30 mx-auto">
              <Image src="/logo.png" alt="DCDS" width={56} height={56} className="object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>
            Join DCDS
          </h1>
          <p className="text-gray-400 text-sm">Create your member account</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? 'bg-[#1B6B32] text-white' : i === step ? 'bg-[#1B8FD8] text-white' : 'bg-white/5 text-gray-500'
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs mt-1 text-gray-500 hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all ${i < step ? 'bg-[#1B8FD8]' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-dark rounded-2xl p-8 border border-[#1B8FD8]/10">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Step 0: Account */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-bold text-white mb-5 text-lg">Account Details</h2>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" {...register('full_name')} placeholder="Your Full Name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 transition-all text-sm" />
                  </div>
                  {errors.full_name && <p className="text-xs text-[#C41230] mt-1">{errors.full_name.message}</p>}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="email" {...register('email')} placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 transition-all text-sm" />
                  </div>
                  {errors.email && <p className="text-xs text-[#C41230] mt-1">{errors.email.message}</p>}
                </div>
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="Min 8 characters"
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 transition-all text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-[#C41230] mt-1">{errors.password.message}</p>}
                </div>
                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="password" {...register('confirm_password')} placeholder="Repeat password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 transition-all text-sm" />
                  </div>
                  {errors.confirm_password && <p className="text-xs text-[#C41230] mt-1">{errors.confirm_password.message}</p>}
                </div>
              </div>
            )}

            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-bold text-white mb-5 text-lg">Personal Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="tel" {...register('phone')} placeholder="+880XXXXXXXXXX"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 transition-all text-sm" />
                  </div>
                  {errors.phone && <p className="text-xs text-[#C41230] mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Student ID *</label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" {...register('student_id')} placeholder="Your college student ID"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 transition-all text-sm" />
                  </div>
                  {errors.student_id && <p className="text-xs text-[#C41230] mt-1">{errors.student_id.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Department *</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select {...register('department')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0A1628] border border-white/10 text-white focus:outline-none focus:border-[#1B8FD8]/50 transition-all text-sm appearance-none">
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  {errors.department && <p className="text-xs text-[#C41230] mt-1">{errors.department.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Session *</label>
                  <input type="text" {...register('session')} placeholder="e.g. 2022-23"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 transition-all text-sm" />
                  {errors.session && <p className="text-xs text-[#C41230] mt-1">{errors.session.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Why do you want to join? (Optional)</label>
                  <textarea {...register('why_join')} rows={3} placeholder="Tell us why you want to join DCDS..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 transition-all text-sm resize-none" />
                  {errors.why_join && <p className="text-xs text-[#C41230] mt-1">{errors.why_join.message}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-bold text-white mb-2 text-lg">Membership Payment</h2>
                {/* Payment Instructions */}
                <div className="p-4 rounded-xl bg-[#F0C040]/5 border border-[#F0C040]/20">
                  <p className="text-sm font-semibold text-[#F0C040] mb-2">💰 Payment Instructions</p>
                  <div className="space-y-1 text-xs text-gray-400">
                    <p>• Membership Fee: <span className="text-white font-semibold">BDT 500</span></p>
                    <p>• Send via <span className="text-white">bKash / Nagad</span> to: <span className="text-[#F0C040] font-mono">01XXXXXXXXX</span></p>
                    <p>• Keep your transaction ID / screenshot</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Transaction ID / Reference *</label>
                  <input type="text" {...register('payment_ref')} placeholder="e.g. 8N7A2KXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 transition-all text-sm font-mono" />
                  {errors.payment_ref && <p className="text-xs text-[#C41230] mt-1">{errors.payment_ref.message}</p>}
                </div>
                {/* Payment Screenshot Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Payment Screenshot (Optional but recommended)</label>
                  {paymentPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-[#1B8FD8]/20">
                      <img src={paymentPreview} alt="Payment proof" className="w-full max-h-48 object-cover" />
                      <button type="button" onClick={() => { setPaymentFile(null); setPaymentPreview(null); }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#C41230] flex items-center justify-center hover:bg-[#C41230]/80 transition-colors">
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-white/10 cursor-pointer hover:border-[#1B8FD8]/30 hover:bg-white/2 transition-all">
                      <Upload className="w-8 h-8 text-gray-500" />
                      <span className="text-sm text-gray-400">Click to upload screenshot</span>
                      <span className="text-xs text-gray-600">PNG, JPG up to 5MB</span>
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div>
                <h2 className="font-bold text-white mb-5 text-lg">Review & Submit</h2>
                <div className="space-y-3 mb-5">
                  {[
                    ['Full Name', formValues.full_name],
                    ['Email', formValues.email],
                    ['Phone', formValues.phone],
                    ['Student ID', formValues.student_id],
                    ['Department', formValues.department],
                    ['Session', formValues.session],
                    ['Payment Ref', formValues.payment_ref],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-400">{label}</span>
                      <span className="text-white font-medium text-right max-w-[200px] truncate">{value}</span>
                    </div>
                  ))}
                  {paymentPreview && (
                    <div className="text-sm flex justify-between">
                      <span className="text-gray-400">Payment Screenshot</span>
                      <span className="text-[#1B6B32] font-medium">✓ Uploaded</span>
                    </div>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...register('agree_terms')} className="mt-0.5 w-4 h-4 rounded accent-[#1B8FD8]" />
                  <span className="text-xs text-gray-400 leading-relaxed">
                    I agree to DCDS terms and conditions, and confirm that the information provided is accurate.
                    I understand my registration is subject to approval.
                  </span>
                </label>
                {errors.agree_terms && <p className="text-xs text-[#C41230] mt-2">{errors.agree_terms.message}</p>}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-7">
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3 rounded-xl font-medium text-gray-300 glass border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={nextStep}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] hover:shadow-lg hover:shadow-[#1B8FD8]/30 transition-all flex items-center justify-center gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B6B32] to-[#145228] hover:shadow-lg hover:shadow-[#1B6B32]/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🎉 Submit Registration'}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already a member?{' '}
            <Link href="/auth/login" className="text-[#1B8FD8] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
