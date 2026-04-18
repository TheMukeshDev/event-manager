'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Users, FileText, Building2, TrendingUp, Clock, CheckCircle2, XCircle, Loader2, Shield, Plus, X, Mail, UserPlus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface Stats {
  totalUsers: number
  totalAdmins: number
  totalAmbassadors: number
  totalSponsors: number
  totalCertificates: number
  validCertificates: number
  sentCertificates: number
  pendingCertificates: number
  revokedCertificates: number
  recentSignups: { date: string; count: number }[]
  ambassadorReferrals: { name: string; referrals: number }[]
}

const defaultStats: Stats = {
  totalUsers: 0,
  totalAdmins: 0,
  totalAmbassadors: 0,
  totalSponsors: 0,
  totalCertificates: 0,
  validCertificates: 0,
  sentCertificates: 0,
  pendingCertificates: 0,
  revokedCertificates: 0,
  recentSignups: [],
  ambassadorReferrals: []
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>(defaultStats)
  const [loading, setLoading] = useState(true)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminName, setNewAdminName] = useState('')
  const [addingAdmin, setAddingAdmin] = useState(false)
  const [adminMessage, setAdminMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats({ ...defaultStats, ...data })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminName) {
      setAdminMessage({ type: 'error', message: 'Please fill all fields' })
      return
    }
    setAddingAdmin(true)
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAdminEmail, name: newAdminName })
      })
      const data = await response.json()
      if (data.success) {
        setAdminMessage({ type: 'success', message: `Admin added successfully! OTP sent to ${newAdminEmail}` })
        setNewAdminEmail('')
        setNewAdminName('')
        setTimeout(() => {
          setShowAddAdmin(false)
          window.location.reload()
        }, 1500)
      } else {
        setAdminMessage({ type: 'error', message: data.error || 'Failed to add admin' })
      }
    } catch (error) {
      setAdminMessage({ type: 'error', message: 'Failed to add admin' })
    } finally {
      setAddingAdmin(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  const statCards: { title: string; value: number; icon: React.ElementType; color: string; showAddButton?: boolean; onAddClick?: () => void }[] = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'cyan', showAddButton: false },
    { title: 'Admins', value: stats.totalAdmins, icon: Shield, color: 'yellow', showAddButton: true, onAddClick: () => setShowAddAdmin(true) },
    { title: 'Ambassadors', value: stats.totalAmbassadors, icon: TrendingUp, color: 'green', showAddButton: false },
    { title: 'Sponsors', value: stats.totalSponsors, icon: Building2, color: 'blue', showAddButton: false },
    { title: 'Certificates', value: stats.totalCertificates, icon: FileText, color: 'purple', showAddButton: false },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold gradient-cyan-green mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of Tech Hub BBS metrics</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-dark rounded-lg p-4 sm:p-6 relative group"
          >
            {stat.showAddButton && (
              <button
                onClick={stat.onAddClick}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-500/40"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 ${
              stat.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-300' :
              stat.color === 'green' ? 'bg-green-500/20 text-green-300' :
              stat.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
              stat.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-purple-500/20 text-purple-300'
            }`}>
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-400">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-lg p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <BarChart3 className="w-5 h-5 text-cyan-300" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Certificate Status</h2>
          </div>
          <div className="flex items-center justify-center gap-6 sm:gap-8 py-6 sm:py-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">{stats.validCertificates}</p>
              <p className="text-xs sm:text-sm text-gray-400">Valid</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">{stats.revokedCertificates}</p>
              <p className="text-xs sm:text-sm text-gray-400">Revoked</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-dark rounded-lg p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Clock className="w-5 h-5 text-cyan-300" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Recent Signups</h2>
          </div>
          {stats.recentSignups.length > 0 ? (
            <div className="h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.recentSignups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00d9ff20" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #00d9ff30', borderRadius: '8px', color: '#fff' }} />
                  <Line type="monotone" dataKey="count" stroke="#00d9ff" strokeWidth={2} dot={{ fill: '#00d9ff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 sm:h-48 flex items-center justify-center text-gray-400 text-sm">
              No signup data available
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-dark rounded-lg p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <TrendingUp className="w-5 h-5 text-cyan-300" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Top Ambassadors by Referrals</h2>
        </div>
        {stats.ambassadorReferrals.length > 0 ? (
          <div className="h-40 sm:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ambassadorReferrals.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#00d9ff20" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #00d9ff30', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="referrals" fill="#00ff88" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 sm:h-48 flex items-center justify-center text-gray-400 text-sm">
            No ambassador data available
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showAddAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-dark rounded-xl p-6 w-full max-w-md border border-yellow-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-white">Add New Admin</h3>
                </div>
                <button
                  onClick={() => { setShowAddAdmin(false); setAdminMessage(null); setNewAdminEmail(''); setNewAdminName('') }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="Enter admin name"
                    className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {adminMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    adminMessage.type === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'
                  }`}>
                    {adminMessage.message}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setShowAddAdmin(false); setAdminMessage(null); setNewAdminEmail(''); setNewAdminName('') }}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAdmin}
                    disabled={addingAdmin || !newAdminEmail || !newAdminName}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingAdmin ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Admin
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
