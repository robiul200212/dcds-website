import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateMemberId(): string {
  const year = new Date().getFullYear().toString().slice(-2)
  const random = Math.floor(1000 + Math.random() * 9000)
  return `DCDS-${year}${random}`
}

export function formatDate(dateStr: string | null, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getAttendanceColor(percentage: number): string {
  if (percentage >= 75) return '#16A34A'
  if (percentage >= 50) return '#F59E0B'
  return '#DC2626'
}

export function getMembershipStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending Approval',
    suspended: 'Suspended',
    rejected: 'Rejected',
  }
  return labels[status] ?? status
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    office_secretary: 'Office Secretary',
    member: 'Member',
    guest: 'Guest',
  }
  return labels[role] ?? role
}
