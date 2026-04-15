'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users as UsersIcon, Search, Mail, Shield, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface User {
  id: string
  email: string
  full_name?: string
  name?: string
  role: 'user' | 'admin' | 'ambassador' | 'participant'
  created_at: string
  referral_count: number
  referral_code?: string
  is_verified: boolean
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'admin' | 'ambassador' | 'user'>('all')
  const [totalCount, setTotalCount] = useState(0)
  const usersPerPage = 10

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.set('page', currentPage.toString())
        params.set('limit', usersPerPage.toString())
        params.set('filter', filter)
        if (search) params.set('search', search)
        
        const response = await fetch(`/api/admin/users?${params}`)
        const data = await response.json()
        
        if (data.success && data.users) {
          setUsers(data.users)
          setTotalCount(data.total || 0)
        } else if (data.users) {
          setUsers(data.users)
          setTotalCount(data.total || 0)
        } else {
          setUsers([])
          setTotalCount(0)
        }
      } catch (err) {
        console.error('Error fetching users:', err)
        setError('Failed to load users')
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [currentPage, filter])

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.full_name || user.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(totalCount / usersPerPage))

  const getRoleBadge = (role: string) => {
    const normalizedRole = (role || 'user').toLowerCase()
    const roleClasses: Record<string, { bg: string; text: string; label: string }> = {
      admin: { bg: 'bg-purple-500/20', text: 'text-purple-300', label: 'Admin' },
      ambassador: { bg: 'bg-green-500/20', text: 'text-green-300', label: 'Ambassador' },
      user: { bg: 'bg-gray-500/20', text: 'text-gray-300', label: 'User' },
      participant: { bg: 'bg-gray-500/20', text: 'text-gray-300', label: 'Participant' }
    }
    const roleStyle = roleClasses[normalizedRole] || roleClasses.user
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
        {normalizedRole === 'admin' && <Shield className="w-3 h-3" />}
        {roleStyle.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-cyan-green mb-2">Users</h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage registered users and administrators</p>
          </div>
          <div className="text-sm text-gray-400">
            Total: {totalCount} users
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-dark rounded-lg p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value as typeof filter); setCurrentPage(1); }}
            className="px-4 py-2.5 sm:py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm min-w-[120px]"
          >
            <option value="all">All</option>
            <option value="admin">Admins</option>
            <option value="ambassador">Ambassadors</option>
            <option value="user">Users</option>
          </select>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-cyan-500/20">
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400">User</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400">Role</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400 hidden sm:table-cell">Referrals</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                          <UsersIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm truncate max-w-[120px] sm:max-w-[150px]">{user.full_name || user.name || 'N/A'}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[120px] sm:max-w-[150px]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-white text-sm hidden sm:table-cell">{user.referral_count}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      {user.is_verified ? (
                        <span className="inline-block px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">Verified</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">Pending</span>
                      )}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      <button className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 pt-4 border-t border-cyan-500/20 gap-3">
          <p className="text-xs sm:text-sm text-gray-400">Showing {filteredUsers.length} users</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 sm:p-2 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs sm:text-sm text-gray-300 px-2">{currentPage}/{totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 sm:p-2 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
