'use client'

import { useState } from 'react'
import { AdminSidebar, Breadcrumb } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <AdminSidebar />
      <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="pt-16 lg:pl-64 xl:pl-72">
        <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          <Breadcrumb />
          {children}
        </div>
      </main>
    </div>
  )
}
