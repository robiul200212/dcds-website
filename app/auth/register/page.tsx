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
  payment_method: z.string().min(2, 'Select a payment method'),
  payment_sender_number: z.string().min(11, 'Enter the number you paid from'),
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
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { agree_terms: false },
  })

  const nextStep = async () => {
    const fieldsPerStep: Record<number, (keyof FormData)[]> = {
      0: ['full_name', 'email', 'password', 'confirm_password'],
      1: ['phone', 'student_id', 'department', 'session'],
      2: ['payment_method', 'payment_sender_number', 'payment_ref'],
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

      // 2. Update profile
      const { error: profileError } = await supabase.from('profiles').update({
        full_name: data.full_name,
        phone: data.phone,
        student_id: data.student_id,
        department: data.department,
        session: data.session,
        payment_method: data.payment_method,
        payment_sender_number: data.payment_sender_number,
        payment_ref: data.payment_ref,
        membership_status: 'pending',
      }).eq('id', userId)
      if (profileError) throw profileError

      // 3. Insert registration request
      await supabase.from('registration_requests').insert({
        profile_id: userId,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        student_id: data.student_id,
        department: data.department,
        session: data.session,
        why_join: data.why_join || null,
        payment_method: data.payment_method,
        payment_sender_number: data.payment_sender_number,
        payment_ref: data.payment_ref,
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-32 pb-12">
      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm mx-auto bg-white flex items-center justify-center">
              <Image src="/logo.png" alt="DCDS" width={56} height={56} className="object-contain" />
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
            Join DCDS
          </h1>
          <p className="text-gray-600">Create your member account</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                  i < step ? 'bg-[#1B6B32] text-white' : i === step ? 'bg-[#1B8FD8] text-white' : 'bg-white text-gray-400 border border-gray-200'
                }`}>
                  {i < step ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-xs mt-2 hidden sm:block font-medium ${i <= step ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-all ${i < step ? 'bg-[#1B8FD8]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Step 0: Account */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-bold text-gray-900 mb-6 text-xl">Account Details</h2>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" {...register('full_name')} placeholder="Your Full Name"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all" />
                  </div>
                  {errors.full_name && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.full_name.message}</p>}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" {...register('email')} placeholder="your@email.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all" />
                  </div>
                  {errors.email && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.email.message}</p>}
                </div>
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="Min 8 characters"
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.password.message}</p>}
                </div>
                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="password" {...register('confirm_password')} placeholder="Repeat password"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all" />
                  </div>
                  {errors.confirm_password && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.confirm_password.message}</p>}
                </div>
              </div>
            )}

            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-bold text-gray-900 mb-6 text-xl">Personal Information</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="tel" {...register('phone')} placeholder="01XXXXXXXXX"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all" />
                  </div>
                  {errors.phone && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student ID *</label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" {...register('student_id')} placeholder="Your college student ID"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all" />
                  </div>
                  {errors.student_id && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.student_id.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department *</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select {...register('department')}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all appearance-none">
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  {errors.department && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.department.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Session *</label>
                  <input type="text" {...register('session')} placeholder="e.g. 2022-23"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all" />
                  {errors.session && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.session.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Why do you want to join? (Optional)</label>
                  <textarea {...register('why_join')} rows={3} placeholder="Tell us why you want to join DCDS..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all resize-none" />
                  {errors.why_join && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.why_join.message}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-bold text-gray-900 mb-6 text-xl">Membership Payment</h2>
                
                {/* Payment Instructions */}
                <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-sm font-bold text-[#1B8FD8] mb-3 flex items-center gap-2">💰 Payment Instructions</p>
                  <div className="space-y-2 text-sm text-gray-700 font-medium">
                    <p>• Membership Fee: <span className="font-bold text-gray-900">BDT 500</span></p>
                    <p>• <span className="font-bold text-pink-600">bKash</span> Send Money: <span className="font-bold text-gray-900 font-mono">01560005203</span></p>
                    <p>• <span className="font-bold text-orange-500">Nagad</span> Send Money: <span className="font-bold text-gray-900 font-mono">01991334397</span></p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Method *</label>
                  <select {...register('payment_method')}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all">
                    <option value="">Select Method</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                  </select>
                  {errors.payment_method && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.payment_method.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Paid Using Which Number? *</label>
                  <input type="text" {...register('payment_sender_number')} placeholder="e.g. 01XXXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all font-mono" />
                  {errors.payment_sender_number && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.payment_sender_number.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Transaction ID / Reference *</label>
                  <input type="text" {...register('payment_ref')} placeholder="e.g. 8N7A2KXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B8FD8]/50 focus:border-[#1B8FD8] transition-all font-mono" />
                  {errors.payment_ref && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.payment_ref.message}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-bold text-gray-900 mb-2 text-xl">Review & Submit</h2>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-200">
                  {[
                    ['Full Name', formValues.full_name],
                    ['Email', formValues.email],
                    ['Phone', formValues.phone],
                    ['Student ID', formValues.student_id],
                    ['Department', formValues.department],
                    ['Session', formValues.session],
                    ['Payment Method', formValues.payment_method],
                    ['Sender Number', formValues.payment_sender_number],
                    ['Transaction ID', formValues.payment_ref],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-500 font-medium">{label}</span>
                      <span className="text-gray-900 font-bold text-right max-w-[200px] truncate">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <input type="checkbox" {...register('agree_terms')} className="mt-1 w-4 h-4 rounded text-[#1B8FD8] focus:ring-[#1B8FD8] border-gray-300" />
                  <span className="text-sm text-gray-600 leading-relaxed font-medium">
                    I agree to DCDS terms and conditions, and confirm that the information provided is accurate.
                    I understand my registration is subject to approval.
                  </span>
                </label>
                {errors.agree_terms && <p className="text-xs text-red-600 mt-2 font-medium px-4">{errors.agree_terms.message}</p>}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={nextStep}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] hover:shadow-lg hover:shadow-[#1B8FD8]/30 transition-all flex items-center justify-center gap-2">
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B6B32] to-[#145228] hover:shadow-lg hover:shadow-[#1B6B32]/30 disabled:opacity-70 transition-all flex items-center justify-center gap-2">
                  {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : '🎉 Submit'}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8 font-medium">
            Already a member?{' '}
            <Link href="/auth/login" className="text-[#1B8FD8] font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
