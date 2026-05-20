'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'
import { getMembershipStatusLabel, getRoleLabel, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Search, Filter, Download, RefreshCw, Edit2, Check, X, ChevronLeft, ChevronRight, Users, Shield } from 'lucide-react'

const STATUSES = ['active', 'inactive', 'pending', 'suspended', 'rejected']
const ROLES = ['member', 'office_secretary', 'admin', 'super_admin']
const PER_PAGE = 20

export function MembersTable() {
  const supabase = createClient()
  const [members, setMembers] = useState<Profile[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ membership_status?: string; role?: string; position?: string }>({})

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * PER_PAGE, (page + 1) * PER_PAGE - 1)

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,member_id.ilike.%${search}%`)
      }
      if (statusFilter) {
        query = query.eq('membership_status', statusFilter)
      }

      const { data, count } = await query
      setMembers(data ?? [])
      setTotal(count ?? 0)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const startEdit = (member: Profile) => {
    setEditingId(member.id)
    setEditValues({ membership_status: member.membership_status, role: member.role, position: member.position || '' })
  }

  const saveEdit = async (memberId: string) => {
    try {
      const { error } = await supabase.from('profiles').update(editValues).eq('id', memberId)
      if (error) throw error
      toast.success('Member updated successfully!')
      setEditingId(null)
      fetchMembers()
    } catch {
      toast.error('Failed to update member')
    }
  }

  const exportCSV = () => {
    const headers = ['Member ID', 'Full Name', 'Email', 'Phone', 'Department', 'Session', 'Status', 'Role', 'Position', 'Joined At']
    const rows = members.map(m => [
      m.member_id || '', m.full_name, m.email, m.phone || '', m.department || '',
      m.session || '', m.membership_status, m.role, m.position || '',
      m.joined_at ? formatDate(m.joined_at) : '',
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'dcds-members.csv'; a.click()
    toast.success('CSV exported!')
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Shield className="w-4 h-4 text-[#F0C040]" />
            <span className="text-[#F0C040]">Admin</span>
            <span>/</span> Members
          </div>
          <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
            Member Management <span className="text-[#1B8FD8] text-lg">({total})</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchMembers} className="p-2.5 rounded-xl glass border border-white/10 text-gray-400 hover:text-white transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass border border-white/10 text-sm font-medium text-gray-300 hover:text-white transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or member ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1B8FD8]/50 text-sm transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(0) }}
            className="pl-10 pr-8 py-2.5 rounded-xl bg-[#0A1628] border border-white/10 text-white focus:outline-none focus:border-[#1B8FD8]/50 text-sm appearance-none"
          >
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{getMembershipStatusLabel(s)}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-dark rounded-2xl border border-[#1B8FD8]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Member</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Position</th>
                <th className="text-right px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 rounded bg-white/5 shimmer-bg" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  No members found
                </td></tr>
              ) : members.map((member) => (
                <tr key={member.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{member.full_name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-[#F0C040] text-xs">{member.member_id || '—'}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-400 text-xs">{member.department || '—'}</td>
                  <td className="px-4 py-4">
                    {editingId === member.id ? (
                      <select value={editValues.membership_status} onChange={e => setEditValues(v => ({ ...v, membership_status: e.target.value }))}
                        className="px-2 py-1 rounded-lg bg-[#0A1628] border border-[#1B8FD8]/30 text-white text-xs focus:outline-none">
                        {STATUSES.map(s => <option key={s} value={s}>{getMembershipStatusLabel(s)}</option>)}
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        member.membership_status === 'active' ? 'badge-active' :
                        member.membership_status === 'pending' ? 'badge-pending' : 'badge-inactive'
                      }`}>
                        {getMembershipStatusLabel(member.membership_status)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {editingId === member.id ? (
                      <select value={editValues.role} onChange={e => setEditValues(v => ({ ...v, role: e.target.value }))}
                        className="px-2 py-1 rounded-lg bg-[#0A1628] border border-[#1B8FD8]/30 text-white text-xs focus:outline-none">
                        {ROLES.map(r => <option key={r} value={r}>{getRoleLabel(r)}</option>)}
                      </select>
                    ) : (
                      <span className="text-gray-400 text-xs">{getRoleLabel(member.role)}</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {editingId === member.id ? (
                      <input value={editValues.position ?? ''} onChange={e => setEditValues(v => ({ ...v, position: e.target.value }))}
                        placeholder="e.g. Treasurer" className="px-2 py-1 w-32 rounded-lg bg-[#0A1628] border border-[#1B8FD8]/30 text-white text-xs focus:outline-none" />
                    ) : (
                      <span className="text-gray-400 text-xs">{member.position || '—'}</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === member.id ? (
                        <>
                          <button onClick={() => saveEdit(member.id)} className="p-1.5 rounded-lg bg-[#1B6B32]/20 text-[#1B6B32] hover:bg-[#1B6B32]/30 transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-[#C41230]/20 text-[#C41230] hover:bg-[#C41230]/30 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(member)} className="p-1.5 rounded-lg bg-[#1B8FD8]/10 text-[#1B8FD8] hover:bg-[#1B8FD8]/20 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
            <p className="text-xs text-gray-500">Showing {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, total)} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="p-2 rounded-lg glass border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="p-2 rounded-lg glass border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
