'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { X, Download, Send, Loader2, ExternalLink, RefreshCw, Image as ImageIcon, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Certificate } from '@/components/certificate'
import { useCertificateExport } from '@/components/certificate-export'
import { generateQRCodeBase64 } from '@/lib/qr-generator'

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

function getTitle(certificateType: string): string {
  switch (certificateType) {
    case 'excellence':
      return 'CERTIFICATE OF EXCELLENCE'
    case 'appreciation':
      return 'CERTIFICATE OF APPRECIATION'
    case 'participation':
      return 'CERTIFICATE OF PARTICIPATION'
    case 'winner':
      return 'WINNER CERTIFICATE'
    case 'runner-up':
      return 'RUNNER-UP CERTIFICATE'
    case 'second-runner-up':
      return 'SECOND RUNNER-UP CERTIFICATE'
    default:
      return 'CERTIFICATE OF PARTICIPATION'
  }
}

export function CertificatePreviewModal({ certificate, onClose }: CertificatePreviewModalProps) {
  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Loading preview...')
  const [sending, setSending] = useState(false)
  const [viewMode, setViewMode] = useState<'modal' | 'fullpage'>('modal')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  
  const {
    certificateRef,
    isExporting,
    exportError,
    downloadPNG,
    downloadPDF,
    clearError
  } = useCertificateExport(certificate.certificate_id, certificate.name)

  useEffect(() => {
    async function fetchPreview() {
      setLoading(true)
      setLoadingMessage('Fetching certificate data...')
      try {
        const verifyUrl = `${process.env.NEXT_PUBLIC_VERIFY_BASE_URL || 'https://techhub-bbs.vercel.app'}/verify/${certificate.certificate_id}`
        const qrBase64 = await generateQRCodeBase64(verifyUrl, 200)
        setQrCodeUrl(qrBase64)

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
        } else {
          throw new Error(data.error || 'Failed to load preview')
        }
      } catch (error: any) {
        console.error('Error fetching preview:', error)
        setLoadingMessage(error.message || 'Failed to load preview')
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

  const handleOpenFullPage = () => {
    const previewWindow = window.open('', '_blank')
    if (previewWindow && previewHtml) {
      previewWindow.document.write(previewHtml)
      previewWindow.document.close()
    }
  }

  const isAnyExporting = isExporting !== 'none'

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
          <div className="flex flex-col items-center justify-center h-screen">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <p className="text-gray-400">{loadingMessage}</p>
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
              onClick={downloadPNG}
              disabled={isAnyExporting || !qrCodeUrl}
              className="p-2 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
              title="Download Image (PNG)"
            >
              {isExporting === 'png' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={downloadPDF}
              disabled={isAnyExporting || !qrCodeUrl}
              className="p-2 rounded-lg text-gray-400 hover:text-green-300 hover:bg-green-500/20 transition-colors disabled:opacity-50"
              title="Download PDF"
            >
              {isExporting === 'pdf' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
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
          {!qrCodeUrl || loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
              <p className="text-gray-400">{loadingMessage}</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <Certificate
                ref={certificateRef}
                name={certificate.name}
                event={certificate.event || 'TechQuiz 2026'}
                certificateType={certificate.certificate_type}
                title={getTitle(certificate.certificate_type)}
                date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                rank={certificate.rank}
                score={certificate.score}
                certificateId={certificate.certificate_id}
                qrCodeUrl={qrCodeUrl}
              />
            </div>
          )}
          
          {exportError && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3 z-50">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300">{exportError}</span>
              <button onClick={clearError} className="ml-2 text-red-400 hover:text-red-300">
                <X className="w-4 h-4" />
              </button>
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
            <button
              onClick={downloadPNG}
              disabled={isAnyExporting || !qrCodeUrl}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors text-sm disabled:opacity-50"
            >
              {isExporting === 'png' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              PNG
            </button>
            <button
              onClick={downloadPDF}
              disabled={isAnyExporting || !qrCodeUrl}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500/30 text-green-300 hover:bg-green-500/20 transition-colors text-sm disabled:opacity-50"
            >
              {isExporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              PDF
            </button>
            <button
              onClick={() => {
                const previewWindow = window.open('', '_blank')
                if (previewWindow && previewHtml) {
                  previewWindow.document.write(previewHtml)
                  previewWindow.document.close()
                }
              }}
              disabled={!previewHtml}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-500/30 text-gray-300 hover:bg-gray-500/20 transition-colors text-sm disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              HTML
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
