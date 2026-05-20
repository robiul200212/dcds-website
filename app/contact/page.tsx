'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin, Send, User, MessageSquare, FileText } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})
type FormData = z.infer<typeof schema>

export default function ContactPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.from('contact_messages').insert(data)
      if (error) throw error
      toast.success('Message sent! We\'ll get back to you soon.')
      reset()
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050D1A] pt-24 pb-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B8FD8]/10 border border-[#1B8FD8]/20 text-[#1B8FD8] text-sm font-medium mb-4">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Contact <span className="gradient-text">DCDS</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">Have a question, suggestion, or want to collaborate? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-5">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: 'Address', value: 'Dhaka College, Mirpur Road, Dhaka-1205, Bangladesh', color: '#1B8FD8' },
                  { icon: Mail, label: 'Email', value: 'dcds@dhakacollege.edu.bd', color: '#F0C040', href: 'mailto:dcds@dhakacollege.edu.bd' },
                  { icon: Phone, label: 'Phone', value: '+880-2-XXXXXXXX', color: '#1B6B32' },
                ].map(({ icon: Icon, label, value, color, href }) => (
                  <div key={label} className="flex items-start gap-4 p-4 rounded-xl glass border border-white/5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm text-white hover:text-[#1B8FD8] transition-colors">{value}</a>
                      ) : (
                        <p className="text-sm text-white">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold text-white mb-3">Follow DCDS</h3>
              <div className="flex gap-3">
                <a href="https://facebook.com/dcds" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] text-sm font-medium hover:bg-[#1877F2]/20 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Facebook
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF0000]/10 border border-[#FF0000]/20 text-[#FF0000] text-sm font-medium hover:bg-[#FF0000]/20 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> YouTube
                </a>
              </div>
            </div>

            {/* Map embed placeholder */}
            <div className="rounded-2xl overflow-hidden h-48 bg-[#0A1628] border border-white/5 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-[#1B8FD8]/30 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Dhaka College, Mirpur Road, Dhaka</p>
                <a href="https://maps.google.com/?q=Dhaka+College" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[#1B8FD8] hover:underline mt-1 block">Open in Google Maps →</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-dark rounded-2xl p-8 border border-[#1B8FD8]/10">
            <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Your Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" {...register('name')} placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 text-sm transition-all" />
                </div>
                {errors.name && <p className="text-xs text-[#C41230] mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="email" {...register('email')} placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 text-sm transition-all" />
                </div>
                {errors.email && <p className="text-xs text-[#C41230] mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Subject *</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" {...register('subject')} placeholder="What is this about?"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 text-sm transition-all" />
                </div>
                {errors.subject && <p className="text-xs text-[#C41230] mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Message *</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <textarea {...register('message')} rows={5} placeholder="Your message..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 text-sm transition-all resize-none" />
                </div>
                {errors.message && <p className="text-xs text-[#C41230] mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] hover:shadow-lg hover:shadow-[#1B8FD8]/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
