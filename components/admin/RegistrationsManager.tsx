'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Eye, Clock, User, Mail, Phone, BookOpen, CreditCard, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { RegistrationRequest } from '@/lib/types'

export function RegistrationsManager() {
  const supabase = createClient()
  const [registrations, setRegistrations] = useState<RegistrationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [reviewNote, setReviewNote] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('pending')

  const fetchRegistrations = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('registration_requests').select('*').order('created_at', { ascending: false })
    if (filterStatus) query = query.eq('status', filterStatus)
    const { data } = await query
    setRegistrations(data ?? [])
    setLoading(false)
  }, [filterStatus])

  useEffect(() => { fetchRegistrations() }, [fetchRegistrations])

  const handleReview = async (regId: string, profileId: string, action: 'approved' | 'rejected') => {
    setProcessing(regId)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      await supabase.from('registration_requests').update({
        status: action,
        reviewed_by: user.id,
        review_note: reviewNote || null,
        reviewed_at: new Date().toISOString(),
      }).eq('id', regId)

      if (action === 'approved') {
        await supabase.from('profiles').update({
          membership_status: 'active',
          joined_at: new Date().toISOString().split('T')[0],
        }).eq('id', profileId)
      } else {
        await supabase.from('profiles').update({ membership_status: 'rejected' }).eq('id', profileId)
      }

      toast.success(`Registration ${action}!`)
      setExpandedId(null)
      setReviewNote('')
      fetchRegistrations()
    } catch (err) {
      toast.error('Failed to process registration')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>Registration Approvals</h1>
          <p className="text-gray-500 font-medium text-sm">Review and approve new member applications</p>
        </div>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterStatus === s
                ? s === 'pending' ? 'bg-[#F0C040]/15 text-[#F0C040] border border-[#F0C040]/30'
                  : s === 'approved' ? 'bg-[#1B6B32]/15 text-[#1B6B32] border border-[#1B6B32]/30'
                  : 'bg-[#C41230]/10 text-[#C41230] border border-[#C41230]/20'
                : 'glass border border-white/10 text-gray-400'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="h-20 rounded-2xl glass border border-white/5 shimmer-bg" />)}</div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-16 glass-dark rounded-2xl border border-white/5">
          <CheckCircle className="w-12 h-12 text-[#1B6B32] mx-auto mb-3" />
          <p className="text-white font-semibold mb-1">All caught up!</p>
          <p className="text-gray-400 text-sm">No {filterStatus} registrations at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {registrations.map(reg => (
            <div key={reg.id} className={`bg-white shadow-sm rounded-2xl border overflow-hidden transition-all ${
              reg.status === 'pending' ? 'border-[#F0C040]/30' : reg.status === 'approved' ? 'border-[#1B6B32]/30' : 'border-[#C41230]/30'
            }`}>
              {/* Header Row */}
              <button onClick={() => setExpandedId(expandedId === reg.id ? null : reg.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    reg.status === 'pending' ? 'bg-[#F0C040]/10' : reg.status === 'approved' ? 'bg-[#1B6B32]/10' : 'bg-[#C41230]/10'
                  }`}>
                    <User className={`w-5 h-5 ${reg.status === 'pending' ? 'text-[#F0C040]' : reg.status === 'approved' ? 'text-[#1B6B32]' : 'text-[#C41230]'}`} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{reg.full_name}</p>
                    <p className="text-xs font-medium text-gray-500">{reg.email} • {reg.department} • {reg.session}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    reg.status === 'pending' ? 'badge-pending' : reg.status === 'approved' ? 'badge-active' : 'badge-suspended'
                  }`}>{reg.status}</span>
                  {expandedId === reg.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              </button>

              {/* Detail Panel */}
              {expandedId === reg.id && (
                <div className="border-t border-white/5 p-5">
                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    {[
                      { icon: User, label: 'Full Name', value: reg.full_name },
                      { icon: Mail, label: 'Email', value: reg.email },
                      { icon: Phone, label: 'Phone', value: reg.phone },
                      { icon: BookOpen, label: 'Student ID', value: reg.student_id },
                      { icon: BookOpen, label: 'Department', value: reg.department },
                      { icon: Clock, label: 'Session', value: reg.session },
                      { icon: CreditCard, label: 'Payment Method', value: reg.payment_method || '—' },
                      { icon: Phone, label: 'Sender Number', value: reg.payment_sender_number || '—' },
                      { icon: CreditCard, label: 'Payment Ref', value: reg.payment_ref || '—' },
                      { icon: Clock, label: 'Applied', value: formatDate(reg.created_at) },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#1B8FD8]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5 text-[#1B8FD8]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">{label}</p>
                          <p className="text-sm text-gray-900 font-bold">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {reg.why_join && (
                    <div className="mb-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1 font-medium">Why they want to join:</p>
                      <p className="text-sm text-gray-700">{reg.why_join}</p>
                    </div>
                  )}

                  {reg.status === 'pending' && (
                    <>
                      <div className="mb-4">
                        <label className="block text-xs text-gray-400 mb-1.5">Review Note (optional)</label>
                        <textarea value={reviewNote} onChange={e => setReviewNote(e.target.value)} rows={2}
                          placeholder="Add a note for the applicant (e.g. reason for rejection)..."
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1B8FD8]/50 resize-none" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleReview(reg.id, reg.profile_id, 'approved')}
                          disabled={processing === reg.id}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B6B32] text-white text-sm font-bold hover:bg-[#1B6B32]/80 disabled:opacity-50 transition-all">
                          {processing === reg.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Approve & Activate
                        </button>
                        <button onClick={() => handleReview(reg.id, reg.profile_id, 'rejected')}
                          disabled={processing === reg.id}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C41230]/15 text-[#C41230] border border-[#C41230]/30 text-sm font-bold hover:bg-[#C41230]/25 disabled:opacity-50 transition-all">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </>
                  )}

                  {reg.status !== 'pending' && reg.review_note && (
                    <div className="p-3 rounded-xl bg-white/2 border border-white/5">
                      <p className="text-xs text-gray-500">Review Note: <span className="text-gray-300">{reg.review_note}</span></p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
