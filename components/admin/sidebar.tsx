'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Users,
  FileText,
  BarChart3,
  Building2,
  Menu,
  X,
  Home,
  LogOut,
  ChevronRight,
  Calendar
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAdminAuth } from './admin-auth-context'

interface SidebarLink {
  href: string
  label: string
  icon: React.ElementType
}

const sidebarLinks: SidebarLink[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/sponsors', label: 'Sponsors', icon: Building2 },
  { href: '/admin/certificates', label: 'Certificates', icon: FileText },
]

export function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length <= 1) return null

  return (
    <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 mb-4 overflow-x-auto whitespace-nowrap">
      <Link href="/admin/dashboard" className="hover:text-cyan-300 transition-colors shrink-0">
        Admin
      </Link>
      {segments.slice(1).map((segment, index) => (
        <span key={index} className="flex items-center gap-1.5 shrink-0">
          <ChevronRight className="w-3 h-3" />
          <span className="capitalize text-gray-300">
            {segment}
          </span>
        </span>
      ))}
    </nav>
  )
}

interface NavLinkProps extends SidebarLink {
  isActive: boolean
  onClick?: () => void
}

function NavLink({ href, label, icon: Icon, isActive, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive
          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,217,255,0.1)]'
          : 'text-gray-400 hover:text-white hover:bg-cyan-500/10 border border-transparent'
        }
      `}
    >
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
      <span className="truncate">{label}</span>
    </Link>
  )
}

interface SidebarContentProps {
  onLinkClick?: () => void
}

function SidebarContent({ onLinkClick }: SidebarContentProps) {
  const pathname = usePathname()
  const { user, logout } = useAdminAuth()

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin' || pathname === '/admin/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 border-b border-cyan-500/20">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-cyan-500/10 transition-colors"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm truncate">Tech Hub BBS</p>
            <p className="text-xs text-gray-400 truncate">{user?.full_name || 'Admin'}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-2 sm:p-3 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.href}
            {...link}
            isActive={isActive(link.href)}
            onClick={onLinkClick}
          />
        ))}
      </nav>

      <div className="p-2 sm:p-3 border-t border-cyan-500/20 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Site</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Logout</span>
        </button>
        <div className="px-3 sm:px-4 py-2 text-xs text-gray-500 hidden sm:block">
          <p>Admin Console v1.0</p>
        </div>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-lg bg-black/80 border border-cyan-500/30 text-white hover:bg-black hover:border-cyan-400 transition-all duration-300"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 bg-black/95 backdrop-blur-xl border-r border-cyan-500/30 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent onLinkClick={() => setIsOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 xl:w-72 z-30">
        <div className="h-full glass-dark border-r border-cyan-500/20 overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>
    </>
  )
}
