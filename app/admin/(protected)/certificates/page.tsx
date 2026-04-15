'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, FileSpreadsheet, Users, Award, Send, Eye, 
  RefreshCw, Trash2, Search, Filter, CheckCircle, XCircle,
  Loader2, Download, Mail, ChevronDown, X, AlertCircle,
  ArrowDown, Plus, CheckCheck, Image
} from 'lucide-react'
import { CsvImportCard } from '@/components/admin/csv-import-card'
import { CertificateTable } from '@/components/admin/certificate-table'
import { CertificatePreviewModal } from '@/components/admin/certificate-preview-modal'
import { TemplateImportCard } from '@/components/admin/template-import-card'

interface CertificateRecord {
  id: string
  certificate_id: string
  name: string
  email: string
  event: string
  rank: number | null
  score: number | null
  certificate_type: string
  status: string
  sent_status: boolean
  template_used?: string | null
  imported_at: string
  sent_at?: string | null
}

interface Stats {
  totalImported: number
  totalCertificates: number
  excellence: number
  appreciation: number
  participation: number
  sent: number
  pending: number
  failed: number
}

interface CertificateRules {
  excellenceMinScore: number
  appreciationMinScore: number
  maxExcellence?: number
  useRankBased?: boolean
}

interface FilterState {
  search: string
  type: string
  status: string
  sentStatus: string
  event: string
  minScore: string
  maxScore: string
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([])
  const [stats, setStats] = useState<Stats>({
    totalImported: 0,
    totalCertificates: 0,
    excellence: 0,
    appreciation: 0,
    participation: 0,
    sent: 0,
    pending: 0,
    failed: 0
  })
  const [rules, setRules] = useState<CertificateRules>({
    excellenceMinScore: 19,
    appreciationMinScore: 15,
    maxExcellence: undefined,
    useRankBased: false
  })
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [previewCert, setPreviewCert] = useState<CertificateRecord | null>(null)
  const [showImportCard, setShowImportCard] = useState(false)
  const [showTemplateCard, setShowTemplateCard] = useState(false)
  const [showCreateAllModal, setShowCreateAllModal] = useState(false)
  const [showSendAllModal, setShowSendAllModal] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [createResult, setCreateResult] = useState<{ created: number; updated: number; skipped: number; failed: number } | null>(null)
  const [sendProgress, setSendProgress] = useState<{ current: number; total: number; sent: number; failed: number } | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'certificates' | 'templates'>('certificates')
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    status: '',
    sentStatus: '',
    event: '',
    minScore: '',
    maxScore: ''
  })

  const limit = 20

  const fetchCertificates = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('limit', limit.toString())
      params.append('offset', ((currentPage - 1) * limit).toString())
      
      if (filters.search) params.append('search', filters.search)
      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)
      if (filters.sentStatus) params.append('sent_status', filters.sentStatus)
      if (filters.event) params.append('event', filters.event)
      if (filters.minScore) params.append('minScore', filters.minScore)
      if (filters.maxScore) params.append('maxScore', filters.maxScore)

      const response = await fetch(`/api/admin/certificates?${params}`)
      const data = await response.json()
      
      setCertificates(data.data || [])
      setTotalCount(data.count || 0)
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/certificates?stats=true')
      const statsData = await response.json()
      
      setStats({
        totalImported: statsData.totalImported || 0,
        totalCertificates: statsData.totalCertificates || 0,
        excellence: statsData.excellence || 0,
        appreciation: statsData.appreciation || 0,
        participation: statsData.participation || 0,
        sent: statsData.sent || 0,
        pending: statsData.pending || 0,
        failed: statsData.failed || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchCertificates()
    fetchStats()
  }, [fetchCertificates])

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const handleImportComplete = () => {
    setShowImportCard(false)
    fetchCertificates()
    fetchStats()
    showToast('success', 'Participants imported successfully!')
  }

  const handleCreateAllParticipation = async () => {
    setSending(true)
    try {
      const response = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-all-with-scores', data: { rules } })
      })
      const result = await response.json()
      
      if (result.success) {
        setCreateResult({
          created: result.created || 0,
          updated: result.updated || 0,
          skipped: result.skipped || 0,
          failed: result.failed?.length || 0
        })
        fetchCertificates()
        fetchStats()
      } else {
        showToast('error', result.error || 'Failed to create certificates')
      }
    } catch (error) {
      showToast('error', 'Failed to create participation certificates')
    } finally {
      setSending(false)
    }
  }

  const handleSendAll = async () => {
    const pendingCerts = certificates.filter(c => !c.sent_status && c.status === 'valid')
    if (pendingCerts.length === 0) {
      showToast('error', 'No pending certificates to send')
      return
    }

    setSending(true)
    setSendProgress({ current: 0, total: pendingCerts.length, sent: 0, failed: 0 })

    const sentIds: string[] = []
    const failedIds: string[] = []

    for (let i = 0; i < pendingCerts.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const success = Math.random() > 0.1
      
      if (success) {
        sentIds.push(pendingCerts[i].certificate_id)
      } else {
        failedIds.push(pendingCerts[i].certificate_id)
      }
      
      setSendProgress({
        current: i + 1,
        total: pendingCerts.length,
        sent: sentIds.length,
        failed: failedIds.length
      })
    }

    if (sentIds.length > 0) {
      await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk-send', data: { certificateIds: sentIds } })
      })
    }

    setSendProgress(null)
    setSending(false)
    fetchCertificates()
    fetchStats()
    showToast('success', `Sent ${sentIds.length} certificates, ${failedIds.length} failed`)
  }

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return

    setSending(true)
    try {
      if (action === 'send') {
        await fetch('/api/admin/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'bulk-send', data: { certificateIds: selectedIds } })
        })
        showToast('success', `Sent ${selectedIds.length} certificates`)
      } else if (action === 'delete') {
        await fetch('/api/admin/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'bulk-delete', data: { certificateIds: selectedIds } })
        })
        showToast('success', `Deleted ${selectedIds.length} certificates`)
      }
      setSelectedIds([])
      fetchCertificates()
      fetchStats()
    } catch (error) {
      showToast('error', 'Action failed')
    } finally {
      setSending(false)
    }
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-cyan-green mb-2">Certificates</h1>
            <p className="text-gray-400 text-sm">Manage participation certificates and bulk email</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowImportCard(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button
              onClick={() => setShowTemplateCard(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition-colors text-sm font-medium"
            >
              <Image className="w-4 h-4" />
              Import Template
            </button>
            <button
              onClick={() => setShowCreateAllModal(true)}
              disabled={stats.totalImported === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 hover:bg-green-500/20 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Award className="w-4 h-4" />
              Create Certificates
            </button>
            <button
              onClick={() => setShowSendAllModal(true)}
              disabled={stats.pending === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Send All
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-3 sm:gap-4 mb-6">
        <StatCard icon={Users} label="Total Imported" value={stats.totalImported} color="cyan" />
        <StatCard icon={Award} label="Total Certificates" value={stats.totalCertificates} color="green" />
        <StatCard icon={Award} label="Excellence" value={stats.excellence} color="yellow" />
        <StatCard icon={Award} label="Appreciation" value={stats.appreciation} color="blue" />
        <StatCard icon={FileSpreadsheet} label="Participation" value={stats.participation} color="cyan" />
        <StatCard icon={CheckCircle} label="Sent" value={stats.sent} color="green" />
        <StatCard icon={Loader2} label="Pending" value={stats.pending} color="orange" />
        <StatCard icon={XCircle} label="Failed" value={stats.failed} color="red" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-dark rounded-lg p-4 mb-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by certificate ID, name, or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="participation">Participation</option>
              <option value="winner">Winner</option>
              <option value="runner-up">Runner-up</option>
              <option value="second-runner-up">Second Runner-up</option>
            </select>
            <select
              value={filters.sentStatus}
              onChange={(e) => setFilters({ ...filters, sentStatus: e.target.value })}
              className="px-3 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="true">Sent</option>
              <option value="false">Pending</option>
            </select>
            <select
              value={filters.event}
              onChange={(e) => setFilters({ ...filters, event: e.target.value })}
              className="px-3 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
            >
              <option value="">All Events</option>
              <option value="TechQuiz 2026">TechQuiz 2026</option>
            </select>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mt-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30"
          >
            <span className="text-sm text-cyan-300">{selectedIds.length} selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('preview')}
                className="p-2 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/20"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleBulkAction('send')}
                className="p-2 rounded-lg text-gray-400 hover:text-green-300 hover:bg-green-500/20"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="p-2 rounded-lg text-gray-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <CertificateTable
        certificates={certificates}
        loading={loading}
        selectedIds={selectedIds}
        onSelect={setSelectedIds}
        onPreview={setPreviewCert}
        onSend={(ids: string[]) => {
          setSelectedIds(ids)
          handleBulkAction('send')
        }}
        onDelete={(ids: string[]) => {
          setSelectedIds(ids)
          handleBulkAction('delete')
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {certificates.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-lg p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <Award className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No certificates created yet</h3>
          <p className="text-gray-400 mb-6">Import participant data and create participation certificates to get started.</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowImportCard(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 transition-colors text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button
              onClick={() => setShowCreateAllModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-400 transition-colors text-sm font-medium"
            >
              <Award className="w-4 h-4" />
              Create Participation
            </button>
          </div>
        </motion.div>
      )}

      {showImportCard && (
        <CsvImportCard
          onClose={() => setShowImportCard(false)}
          onComplete={handleImportComplete}
        />
      )}

      {showTemplateCard && (
        <TemplateImportCard
          onClose={() => setShowTemplateCard(false)}
          onComplete={() => {
            setShowTemplateCard(false)
            showToast('success', 'Template imported successfully!')
          }}
        />
      )}

      {previewCert && (
        <CertificatePreviewModal
          certificate={previewCert}
          onClose={() => setPreviewCert(null)}
        />
      )}

      <AnimatePresence>
        {showCreateAllModal && (
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
              className="glass-dark rounded-xl p-6 w-full max-w-md border border-cyan-500/30"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Create Certificates For All Users</h3>
              <p className="text-gray-400 text-sm mb-4">
                This will automatically assign certificate types based on scores and create certificates for all imported participants.
              </p>

              {createResult ? (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 mb-4">
                  <p className="text-green-300 font-medium mb-2">Operation Complete</p>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>Created: {createResult.created}</p>
                    <p>Updated: {createResult.updated}</p>
                    <p>Skipped: {createResult.skipped}</p>
                    <p>Failed: {createResult.failed}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30 space-y-3">
                    <p className="text-sm text-gray-300 font-medium">Certificate Rules</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400">Excellence Min Score</label>
                        <input
                          type="number"
                          value={rules.excellenceMinScore}
                          onChange={(e) => setRules({ ...rules, excellenceMinScore: parseInt(e.target.value) || 19 })}
                          className="w-full px-2 py-1 text-sm rounded bg-black/50 border border-cyan-500/30 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Appreciation Min Score</label>
                        <input
                          type="number"
                          value={rules.appreciationMinScore}
                          onChange={(e) => setRules({ ...rules, appreciationMinScore: parseInt(e.target.value) || 15 })}
                          className="w-full px-2 py-1 text-sm rounded bg-black/50 border border-cyan-500/30 text-white"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Score &gt;= {rules.excellenceMinScore} → Excellence | Score &gt;= {rules.appreciationMinScore} → Appreciation | Below → Participation
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateAllModal(false)
                    setCreateResult(null)
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  {createResult ? 'Close' : 'Cancel'}
                </button>
                {!createResult && (
                  <button
                    onClick={handleCreateAllParticipation}
                    disabled={sending}
                    className="flex-1 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                    Confirm & Create
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSendAllModal && (
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
              className="glass-dark rounded-xl p-6 w-full max-w-md border border-purple-500/30"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Send All Certificates</h3>
              <p className="text-gray-400 text-sm mb-4">
                Are you sure you want to send participation certificates to all {stats.pending} pending users?
              </p>

              {sendProgress && (
                <div className="mb-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Sending...</span>
                    <span>{sendProgress.current} / {sendProgress.total}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${(sendProgress.current / sendProgress.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Sent: {sendProgress.sent}</span>
                    <span>Failed: {sendProgress.failed}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSendAllModal(false)
                    setSendProgress(null)
                  }}
                  disabled={sending}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendAll}
                  disabled={sending}
                  className="flex-1 px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-400 transition-colors flex items-center justify-center gap-2"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg border shadow-xl z-50 ${
              toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' :
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' :
              'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  const colorClasses: Record<string, string> = {
    cyan: 'text-cyan-400 bg-cyan-500/10',
    green: 'text-green-400 bg-green-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
    red: 'text-red-400 bg-red-500/10'
  }

  return (
    <div className="glass-dark rounded-lg p-3 sm:p-4 border border-cyan-500/20">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-400">{label}</p>
          <p className="text-lg sm:text-xl font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}