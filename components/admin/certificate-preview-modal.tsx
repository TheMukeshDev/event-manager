'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Send, Loader2, ExternalLink, RefreshCw, Image as ImageIcon } from 'lucide-react'

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

interface CertificatePreviewModalProps {
  certificate: CertificateRecord
  onClose: () => void
}

export function CertificatePreviewModal({ certificate, onClose }: CertificatePreviewModalProps) {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [viewMode, setViewMode] = useState<'modal' | 'fullpage'>('modal')
  const [downloading, setDownloading] = useState<'none' | 'pdf' | 'png'>('none')

  useEffect(() => {
    async function fetchPreview() {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'preview-html',
            data: { certificateId: certificate.certificate_id }
          })
        })
        const data = await response.json()
        if (data.success) {
          setPreviewHtml(data.html)
        }
      } catch (error) {
        console.error('Error fetching preview:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPreview()
  }, [certificate.certificate_id])

  const handleSend = async () => {
    setSending(true)
    try {
      await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk-send',
          data: { certificateIds: [certificate.certificate_id] }
        })
      })
      onClose()
    } catch (error) {
      console.error('Error sending certificate:', error)
    } finally {
      setSending(false)
    }
  }

  const handleDownload = async (format: 'pdf' | 'png') => {
    try {
      setDownloading(format)
      const response = await fetch(`/api/certificates/download/${certificate.certificate_id}?format=${format}`)
      
      if (!response.ok) {
        throw new Error(`Failed to generate ${format.toUpperCase()}`)
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate-${certificate.certificate_id}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(`Error downloading ${format.toUpperCase()}:`, error)
    } finally {
      setDownloading('none')
    }
  }

  const handleOpenFullPage = () => {
    const previewWindow = window.open('', '_blank')
    if (previewWindow && previewHtml) {
      previewWindow.document.write(previewHtml)
      previewWindow.document.close()
    }
  }

  if (viewMode === 'fullpage') {
    return (
      <div className="fixed inset-0 z-[100] bg-black">
        <button
          onClick={() => setViewMode('modal')}
          className="fixed top-4 right-4 z-[101] p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <iframe
            srcDoc={previewHtml || ''}
            className="w-full h-screen"
            title="Certificate Preview"
          />
        )}
      </div>
    )
  }

  return (
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
        className="glass-dark rounded-xl w-full max-w-5xl border border-cyan-500/30 max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <div>
            <h3 className="text-lg font-semibold text-white">Certificate Preview</h3>
            <p className="text-sm text-gray-400">{certificate.name} - {certificate.certificate_type}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('fullpage')}
              className="p-2 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-colors"
              title="Open Full Page"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDownload('png')}
              disabled={downloading !== 'none'}
              className="p-2 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
              title="Download Image (PNG)"
            >
              {downloading === 'png' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloading !== 'none'}
              className="p-2 rounded-lg text-gray-400 hover:text-green-300 hover:bg-green-500/20 transition-colors disabled:opacity-50"
              title="Download PDF"
            >
              {downloading === 'pdf' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            </button>
            {!certificate.sent_status && (
              <button
                onClick={handleSend}
                disabled={sending}
                className="p-2 rounded-lg text-gray-400 hover:text-purple-300 hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                title="Send Certificate"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-900/50 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading preview...</p>
              </div>
            </div>
          ) : previewHtml ? (
            <div className="flex justify-center">
              <iframe
                srcDoc={previewHtml}
                className="w-full max-w-3xl aspect-[1.414] border border-cyan-500/30 rounded-lg shadow-2xl"
                title="Certificate Preview"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-400">Failed to load preview</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-gray-400">Certificate ID: </span>
              <span className="text-cyan-300 font-mono">{certificate.certificate_id}</span>
            </div>
            <div>
              <span className="text-gray-400">Email: </span>
              <span className="text-gray-300">{certificate.email}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative group">
              <button
                disabled={downloading !== 'none'}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors text-sm disabled:opacity-50"
              >
                {downloading !== 'none' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                PNG
              </button>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                <button
                  onClick={() => handleDownload('png')}
                  disabled={downloading !== 'none'}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded disabled:opacity-50"
                >
                  <ImageIcon className="w-3 h-3" />
                  Download as Image
                </button>
              </div>
            </div>
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloading !== 'none'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500/30 text-green-300 hover:bg-green-500/20 transition-colors text-sm disabled:opacity-50"
            >
              {downloading === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              PDF
            </button>
            {!certificate.sent_status && (
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-400 transition-colors text-sm disabled:opacity-50"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Now
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
