'use client'

import { useState } from 'react'
import { 
  Eye, Send, Trash2, RefreshCw, Download, Mail, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Award, AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'

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

interface CertificateTableProps {
  certificates: CertificateRecord[]
  loading: boolean
  selectedIds: string[]
  onSelect: (ids: string[]) => void
  onPreview: (cert: CertificateRecord) => void
  onSend: (ids: string[]) => void
  onDelete: (ids: string[]) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CertificateTable({
  certificates,
  loading,
  selectedIds,
  onSelect,
  onPreview,
  onSend,
  onDelete,
  currentPage,
  totalPages,
  onPageChange
}: CertificateTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleSelectAll = () => {
    if (selectedIds.length === certificates.length) {
      onSelect([])
    } else {
      onSelect(certificates.map(c => c.certificate_id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter(i => i !== id))
    } else {
      onSelect([...selectedIds, id])
    }
  }

  const handleAction = async (action: string, cert: CertificateRecord) => {
    setActionLoading(cert.certificate_id)
    setTimeout(() => setActionLoading(null), 1000)
    
    if (action === 'preview') {
      onPreview(cert)
    } else if (action === 'send') {
      onSend([cert.certificate_id])
    } else if (action === 'delete') {
      onDelete([cert.certificate_id])
    }
  }

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      'winner': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'runner-up': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'second-runner-up': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'participation': 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    }
    return styles[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }

  const getStatusBadge = (status: string) => {
    if (status === 'valid') {
      return { bg: 'bg-green-500/20', text: 'text-green-300', icon: CheckCircle }
    }
    return { bg: 'bg-red-500/20', text: 'text-red-300', icon: XCircle }
  }

  const getSentBadge = (sent: boolean) => {
    if (sent) {
      return { bg: 'bg-green-500/20', text: 'text-green-300', icon: CheckCircle, label: 'Sent' }
    }
    return { bg: 'bg-orange-500/20', text: 'text-orange-300', icon: Loader2, label: 'Pending' }
  }

  if (loading) {
    return (
      <div className="glass-dark rounded-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-800 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800/50 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (certificates.length === 0) {
    return null
  }

  return (
    <div className="glass-dark rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-cyan-500/20 bg-gray-900/50">
              <th className="p-3 sm:p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === certificates.length && certificates.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-600 bg-black/50 text-cyan-500 focus:ring-cyan-500/20"
                />
              </th>
              <th className="p-3 sm:p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Certificate ID</th>
              <th className="p-3 sm:p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Recipient</th>
              <th className="p-3 sm:p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Event</th>
              <th className="p-3 sm:p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Rank</th>
              <th className="p-3 sm:p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Score</th>
              <th className="p-3 sm:p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
              <th className="p-3 sm:p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Status</th>
              <th className="p-3 sm:p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Sent</th>
              <th className="p-3 sm:p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Imported</th>
              <th className="p-3 sm:p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => {
              const statusInfo = getStatusBadge(cert.status)
              const sentInfo = getSentBadge(cert.sent_status)
              const StatusIcon = statusInfo.icon
              const SentIcon = sentInfo.icon

              return (
                <motion.tr
                  key={cert.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors ${
                    selectedIds.includes(cert.certificate_id) ? 'bg-cyan-500/10' : ''
                  }`}
                >
                  <td className="p-3 sm:p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(cert.certificate_id)}
                      onChange={() => handleSelectOne(cert.certificate_id)}
                      className="w-4 h-4 rounded border-gray-600 bg-black/50 text-cyan-500 focus:ring-cyan-500/20"
                    />
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className="font-mono text-xs sm:text-sm text-cyan-300">{cert.certificate_id}</span>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="min-w-0">
                      <p className="text-white text-sm truncate max-w-[120px] sm:max-w-[180px]">{cert.name}</p>
                      <p className="text-gray-400 text-xs truncate max-w-[120px] sm:max-w-[180px]">{cert.email}</p>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 text-gray-300 text-sm hidden md:table-cell">{cert.event}</td>
                  <td className="p-3 sm:p-4 hidden lg:table-cell">
                    {cert.rank ? (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cert.rank === 1 ? 'bg-yellow-500/20 text-yellow-300' :
                        cert.rank === 2 ? 'bg-purple-500/20 text-purple-300' :
                        cert.rank === 3 ? 'bg-orange-500/20 text-orange-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        #{cert.rank}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="p-3 sm:p-4 text-gray-300 text-sm hidden lg:table-cell">
                    {cert.score !== null ? `${cert.score}/20` : '-'}
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeBadge(cert.certificate_type)}`}>
                      {cert.certificate_type}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                      <StatusIcon className="w-3 h-3" />
                      {cert.status}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${sentInfo.bg} ${sentInfo.text}`}>
                      <SentIcon className={`w-3 h-3 ${!cert.sent_status ? 'animate-spin' : ''}`} />
                      {sentInfo.label}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-gray-400 text-xs hidden md:table-cell">
                    {new Date(cert.imported_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAction('preview', cert)}
                        title="Preview"
                        className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                      >
                        {actionLoading === cert.certificate_id ? (
                          <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </button>
                      {!cert.sent_status && (
                        <button
                          onClick={() => handleAction('send', cert)}
                          title="Send"
                          className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-green-300 hover:bg-green-500/20 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleAction('delete', cert)}
                        title="Delete"
                        className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-cyan-500/20">
          <p className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}