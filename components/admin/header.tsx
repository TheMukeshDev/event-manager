'use client'

import Link from 'next/link'
import { LogOut, Menu, BarChart3 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAdminAuth } from './admin-auth-context'

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { user, logout } = useAdminAuth()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-cyan-500/20">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
            </div>
            <h1 className="text-lg font-bold gradient-cyan-green">Admin Panel</h1>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-cyan-500/20">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3 lg:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-black/40 border border-cyan-500/30 text-white hover:bg-black/60 hover:border-cyan-400 transition-all duration-300"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg font-bold gradient-cyan-green">
                Admin Panel
              </h1>
              {user && (
                <p className="text-xs text-gray-400 -mt-0.5">{user.full_name}</p>
              )}
            </div>
            <h1 className="sm:hidden text-base font-bold gradient-cyan-green">
              Admin
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition-colors text-xs sm:text-sm"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Site</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-300 transition-colors text-xs sm:text-sm"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
