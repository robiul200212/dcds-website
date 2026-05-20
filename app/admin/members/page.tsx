import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Member Management | Admin' }

export default async function AdminMembersPage() {
  return (
    <div className="min-h-screen bg-[#050D1A] pt-20 pb-12">
      <div className="container-custom">
        <MembersTable />
      </div>
    </div>
  )
}

// Dynamic import to keep server boundary clean
import { MembersTable } from '@/components/admin/MembersTable'
