'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, CheckCircle2, XCircle, Copy, CheckCheck, Loader2, ExternalLink } from 'lucide-react'

interface Certificate {
  id: string
  certificate_id: string
  user_email: string
  user_name: string
  event_name: string
  issued_at: string
  is_valid: boolean
  verification_url: string
}

const mockCertificates: Certificate[] = []

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const response = await fetch('/api/admin/certificates')
        if (response.ok) {
          const data = await response.json()
          setCertificates(Array.isArray(data) ? data : [])
        } else {
          setCertificates(mockCertificates)
        }
      } catch {
        setCertificates(mockCertificates)
      } finally {
        setLoading(false)
      }
    }
    fetchCertificates()
  }, [])

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setMessage('Copied!')
      setTimeout(() => { setCopiedId(null); setMessage(''); }, 2000)
    } catch {
      setMessage('Failed to copy')
    }
  }

  const filteredCertificates = certificates.filter(cert =>
    cert.certificate_id?.toLowerCase().includes(search.toLowerCase()) ||
    cert.user_email?.toLowerCase().includes(search.toLowerCase()) ||
    cert.user_name?.toLowerCase().includes(search.toLowerCase())
  )

  const validCount = certificates.filter(c => c.is_valid).length
  const revokedCount = certificates.length - validCount

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
        <h1 className="text-2xl sm:text-3xl font-bold gradient-cyan-green mb-2">Certificates</h1>
        <p className="text-gray-400 text-sm sm:text-base">View and manage issued certificates</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-dark rounded-lg p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by ID, email, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm"
            />
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>{validCount} Valid</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-red-400">
              <XCircle className="w-4 h-4" />
              <span>{revokedCount} Revoked</span>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
            {message}
          </div>
        )}

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full min-w-[550px]">
            <thead>
              <tr className="border-b border-cyan-500/20">
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400">Certificate ID</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400">Recipient</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400 hidden sm:table-cell">Event</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No certificates found</td>
                </tr>
              ) : (
                filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs sm:text-sm text-cyan-300 truncate max-w-[100px] sm:max-w-[150px]">{cert.certificate_id}</span>
                        <button onClick={() => copyToClipboard(cert.certificate_id, cert.id)}
                          className="p-1 rounded text-gray-400 hover:text-cyan-300 transition-colors shrink-0">
                          {copiedId === cert.id ? <CheckCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      <p className="text-white text-sm truncate max-w-[80px] sm:max-w-[120px]">{cert.user_name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[80px] sm:max-w-[120px]">{cert.user_email}</p>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-300 text-sm hidden sm:table-cell">{cert.event_name}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      {cert.is_valid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                          <XCircle className="w-3 h-3" /> Revoked
                        </span>
                      )}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      <a href={`/verify-certificate?id=${cert.certificate_id}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors inline-block">
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 sm:mt-6 pt-4 border-t border-cyan-500/20">
          <p className="text-xs sm:text-sm text-gray-400">Total certificates: {certificates.length}</p>
        </div>
      </motion.div>
    </div>
  )
}
