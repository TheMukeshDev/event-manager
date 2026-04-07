import { ReactNode } from 'react'
import Link from 'next/link'
import { Settings, Users, FileText, BarChart3, LogOut, Building2 } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="glass-dark border-b border-cyan-500/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-cyan-green">Tech Hub BBS - Admin Panel</h1>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Back to Site
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 glass-dark border-r border-cyan-500/20 p-6">
          <div className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
            >
              <Users className="w-5 h-5" />
              Users
            </Link>
            <Link
              href="/admin/sponsors"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
            >
              <Building2 className="w-5 h-5" />
              Sponsors
            </Link>
            <Link
              href="/admin/certificates"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Certificates
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}