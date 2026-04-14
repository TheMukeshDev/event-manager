'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: 'admin'
}

interface AdminAuthContextType {
  user: AdminUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, profile: AdminUser) => void
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

const SESSION_KEY = 'admin_session'

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AdminUser
        setUser(parsed)
      } catch {
        localStorage.removeItem(SESSION_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((email: string, profile: AdminUser) => {
    setUser(profile)
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile))
    document.cookie = `${SESSION_KEY}=${encodeURIComponent(JSON.stringify(profile))}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
    document.cookie = `${SESSION_KEY}=; path=/; max-age=0`
    router.push('/admin/login')
  }, [router])

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
