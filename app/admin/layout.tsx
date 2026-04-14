import type { Metadata } from 'next'
import { AdminAuthProvider } from '@/components/admin/admin-auth-context'

export const metadata: Metadata = {
  title: 'Admin Panel - Tech Hub BBS',
  description: 'Tech Hub BBS Admin Panel',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  )
}
