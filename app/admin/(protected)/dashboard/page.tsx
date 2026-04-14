'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, FileText, Building2, TrendingUp, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface Stats {
  totalUsers: number
  totalAmbassadors: number
  totalSponsors: number
  totalCertificates: number
  validCertificates: number
  revokedCertificates: number
  recentSignups: { date: string; count: number }[]
  ambassadorReferrals: { name: string; referrals: number }[]
}

const defaultStats: Stats = {
  totalUsers: 0,
  totalAmbassadors: 0,
  totalSponsors: 0,
  totalCertificates: 0,
  validCertificates: 0,
  revokedCertificates: 0,
  recentSignups: [],
  ambassadorReferrals: []
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>(defaultStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
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
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'cyan' },
    { title: 'Ambassadors', value: stats.totalAmbassadors, icon: TrendingUp, color: 'green' },
    { title: 'Sponsors', value: stats.totalSponsors, icon: Building2, color: 'blue' },
    { title: 'Certificates', value: stats.totalCertificates, icon: FileText, color: 'purple' },
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-dark rounded-lg p-4 sm:p-6"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 ${
              stat.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-300' :
              stat.color === 'green' ? 'bg-green-500/20 text-green-300' :
              stat.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
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
    </div>
  )
}
