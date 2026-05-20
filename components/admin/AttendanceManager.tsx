'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Plus, Calendar, Users, Check, X, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Profile, AttendanceSession } from '@/lib/types'

interface SessionWithRecords extends AttendanceSession {
  records?: Array<{ member_id: string; is_present: boolean }>
  memberCount?: number
  presentCount?: number
}

type PartialMember = Pick<Profile, 'id' | 'full_name' | 'member_id' | 'department'>

export function AttendanceManager() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<SessionWithRecords[]>([])
  const [members, setMembers] = useState<PartialMember[]>([])
  const [expandedSession, setExpandedSession] = useState<string | null>(null)
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSession, setNewSession] = useState({
    title: '', session_type: 'meeting', held_at: new Date().toISOString().slice(0, 16), location: '', description: '',
  })

  const fetchSessions = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('attendance_sessions').select('*').order('held_at', { ascending: false }).limit(20)
    setSessions(data ?? [])
    setLoading(false)
  }, [])

  const fetchMembers = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('id,full_name,member_id,department').eq('membership_status', 'active').order('full_name')
    setMembers(data ?? [])
  }, [])

  useEffect(() => { fetchSessions(); fetchMembers() }, [fetchSessions, fetchMembers])

  const expandSession = async (sessionId: string) => {
    if (expandedSession === sessionId) { setExpandedSession(null); return }
    setExpandedSession(sessionId)
    const { data: records } = await supabase.from('attendance_records').select('member_id,is_present').eq('session_id', sessionId)
    const attendanceMap: Record<string, boolean> = {}
    members.forEach(m => { attendanceMap[m.id] = false })
    records?.forEach(r => { attendanceMap[r.member_id] = r.is_present })
    setAttendance(attendanceMap)
  }

  const createSession = async () => {
    if (!newSession.title.trim()) { toast.error('Session title is required'); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('attendance_sessions').insert({ ...newSession, created_by: user.id })
    if (error) { toast.error('Failed to create session'); return }
    toast.success('Session created!')
    setShowCreateForm(false)
    setNewSession({ title: '', session_type: 'meeting', held_at: new Date().toISOString().slice(0, 16), location: '', description: '' })
    fetchSessions()
  }

  const toggleAttendance = (memberId: string) => {
    setAttendance(prev => ({ ...prev, [memberId]: !prev[memberId] }))
  }

  const markAll = (present: boolean) => {
    const newAtt: Record<string, boolean> = {}
    members.forEach(m => { newAtt[m.id] = present })
    setAttendance(newAtt)
  }

  const saveAttendance = async (sessionId: string) => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const records = members.map(m => ({
        session_id: sessionId,
        member_id: m.id,
        is_present: attendance[m.id] ?? false,
        marked_by: user.id,
        marked_at: new Date().toISOString(),
      }))

      const { error } = await supabase.from('attendance_records').upsert(records, { onConflict: 'session_id,member_id' })
      if (error) throw error
      toast.success('Attendance saved!')
    } catch {
      toast.error('Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const presentCount = Object.values(attendance).filter(Boolean).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>Attendance Management</h1>
          <p className="text-gray-400 text-sm">Create sessions and mark attendance</p>
        </div>
        <button onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] text-white text-sm font-bold hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Session
        </button>
      </div>

      {/* Create Session Form */}
      {showCreateForm && (
        <div className="glass-dark rounded-2xl p-6 border border-[#1B8FD8]/20 mb-6">
          <h3 className="font-semibold text-white mb-4">Create New Session</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Session Title *</label>
              <input type="text" value={newSession.title} onChange={e => setNewSession(s => ({ ...s, title: e.target.value }))}
                placeholder="e.g. Weekly Practice Session" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1B8FD8]/50" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Session Type</label>
              <select value={newSession.session_type} onChange={e => setNewSession(s => ({ ...s, session_type: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A1628] border border-white/10 text-white text-sm focus:outline-none appearance-none">
                {['meeting', 'event', 'workshop', 'competition', 'other'].map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Date & Time</label>
              <input type="datetime-local" value={newSession.held_at} onChange={e => setNewSession(s => ({ ...s, held_at: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1B8FD8]/50" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Location (optional)</label>
              <input type="text" value={newSession.location} onChange={e => setNewSession(s => ({ ...s, location: e.target.value }))}
                placeholder="e.g. Auditorium, Room 201" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1B8FD8]/50" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={createSession} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] text-white text-sm font-bold hover:shadow-lg transition-all">
              Create Session
            </button>
            <button onClick={() => setShowCreateForm(false)} className="px-5 py-2.5 rounded-xl glass border border-white/10 text-gray-300 text-sm hover:border-white/20 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-16 rounded-2xl glass border border-white/5 shimmer-bg" />)
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 glass-dark rounded-2xl border border-white/5">
            <Calendar className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">No sessions yet. Create your first session!</p>
          </div>
        ) : sessions.map((session) => (
          <div key={session.id} className="glass-dark rounded-2xl border border-[#1B8FD8]/10 overflow-hidden">
            {/* Session Header */}
            <button onClick={() => expandSession(session.id)} className="w-full flex items-center justify-between p-5 hover:bg-white/2 transition-colors text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B8FD8]/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#1B8FD8]" />
                </div>
                <div>
                  <p className="font-semibold text-white">{session.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="capitalize">{session.session_type}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(session.held_at, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {session.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{session.location}</span>}
                  </div>
                </div>
              </div>
              {expandedSession === session.id ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>

            {/* Attendance Sheet */}
            {expandedSession === session.id && (
              <div className="border-t border-white/5 p-5">
                {/* Summary */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white font-medium">{presentCount} / {members.length} Present</span>
                    <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#1B6B32] transition-all" style={{ width: members.length > 0 ? `${(presentCount / members.length) * 100}%` : '0%' }} />
                    </div>
                    <span className="text-xs text-gray-500">{members.length > 0 ? Math.round((presentCount / members.length) * 100) : 0}%</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => markAll(true)} className="px-3 py-1.5 rounded-lg text-xs bg-[#1B6B32]/15 text-[#1B6B32] border border-[#1B6B32]/20 hover:bg-[#1B6B32]/25 transition-colors">
                      ✅ Mark All Present
                    </button>
                    <button onClick={() => markAll(false)} className="px-3 py-1.5 rounded-lg text-xs bg-[#C41230]/10 text-[#C41230] border border-[#C41230]/20 hover:bg-[#C41230]/20 transition-colors">
                      ❌ Clear All
                    </button>
                  </div>
                </div>

                {/* Member List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-5 max-h-80 overflow-y-auto pr-1">
                  {members.map(member => (
                    <button
                      key={member.id}
                      onClick={() => toggleAttendance(member.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        attendance[member.id]
                          ? 'bg-[#1B6B32]/15 border-[#1B6B32]/30 text-white'
                          : 'bg-white/2 border-white/5 text-gray-400 hover:border-white/15'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                        attendance[member.id] ? 'bg-[#1B6B32] border-[#1B6B32]' : 'border-gray-600'
                      }`}>
                        {attendance[member.id] && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{member.full_name}</p>
                        <p className="text-xs text-gray-600 truncate">{member.member_id || member.department || ''}</p>
                      </div>
                    </button>
                  ))}
                  {members.length === 0 && <p className="col-span-3 text-center text-gray-500 py-6">No active members found</p>}
                </div>

                <button
                  onClick={() => saveAttendance(session.id)}
                  disabled={saving || members.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1B8FD8] to-[#1470B0] text-white text-sm font-bold disabled:opacity-50 hover:shadow-lg transition-all"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Attendance
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
