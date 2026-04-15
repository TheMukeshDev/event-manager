'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileCheck, Download, Loader2, CheckCircle, XCircle, AlertTriangle, Image as ImageIcon, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CertificateSection() {
  const router = useRouter()
  const [certificateId, setCertificateId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [downloading, setDownloading] = useState(false)

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError('Please enter a certificate ID')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/verify/${certificateId.trim()}`)
      const data = await response.json()
      
      if (data.certificate) {
        setResult(data)
      } else {
        setError(data.message || 'Certificate not found')
      }
    } catch (err) {
      setError('Failed to verify certificate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (format: 'pdf' | 'png' | 'html') => {
    try {
      setDownloading(true)
      const response = await fetch(`/api/certificates/download/${certificateId}?format=${format}`)
      
      if (!response.ok) {
        throw new Error(`Failed to generate ${format.toUpperCase()}`)
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate-${certificateId}.${format === 'html' ? 'html' : format}`
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(`Error downloading ${format.toUpperCase()}:`, error)
    } finally {
      setDownloading(false)
    }
  }

  const handleViewFull = () => {
    router.push(`/verify?id=${certificateId}`)
  }

  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Certificate graphic */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center"
        >
          <motion.div
            whileHover={{ rotateY: 5 }}
            className="glass-dark rounded-lg p-8 glow-cyan-lg border-2 border-cyan-500/30 max-w-sm"
            style={{ perspective: '1000px' }}
          >
            <div className="bg-linear-to-br from-yellow-100 to-amber-50 rounded-lg p-8 text-center shadow-2xl">
              <FileCheck className="w-12 h-12 text-amber-700 mx-auto mb-4" />
              <p className="text-sm text-gray-600 font-serif mb-2">This is to certify that</p>
              <p className="text-xl font-bold text-gray-800 mb-2">Your Name</p>
              <p className="text-sm text-gray-600 mb-4">has successfully completed and participated in</p>
              <p className="text-lg font-bold text-gray-800 mb-4">Tech Hub BBS 2026</p>
              <div className="flex justify-between px-4 pt-4 border-t border-gray-300 text-xs text-gray-600">
                <span>Date: April 2026</span>
                <span>Signature</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side - Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-lg gradient-cyan-blue mb-6">Earn Your Certificate</h2>

          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Every participant who completes the event will receive a digitally verified certificate
            recognizing their participation and achievements in the selected tracks.
          </p>

          <div className="space-y-4 mb-8">
            {[
              'Digital Certificate of Participation',
              'Verified on blockchain',
              'Shareable on LinkedIn and social media',
              'Track-specific skill badges',
              'Official credentials for your resume',
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 text-gray-300"
              >
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="glass-dark rounded-lg p-6 glow-green">
            <p className="text-sm text-gray-300 mb-4">
              Verify your certificate with our online portal using your unique certificate ID.
            </p>
            
            <input
              type="text"
              placeholder="Enter your certificate ID (e.g., THBBS-2026-0001)"
              value={certificateId}
              onChange={(e) => {
                setCertificateId(e.target.value)
                setError(null)
                setResult(null)
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-green-500/30 text-white placeholder-gray-500 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors mb-4"
            />
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-300 text-sm">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            {result && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  {result.valid ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`font-medium ${result.valid ? 'text-green-300' : 'text-red-300'}`}>
                    {result.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">
                    <span className="text-gray-500">Recipient:</span> {result.certificate?.recipientName}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Type:</span> {result.certificate?.certificateType}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Event:</span> {result.certificate?.eventName}
                  </p>
                  {result.certificate?.score && (
                    <p className="text-gray-300">
                      <span className="text-gray-500">Score:</span> {result.certificate?.score}/20
                    </p>
                  )}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerify}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-green-500 text-green-300 font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Verify Certificate
                </>
              )}
            </motion.button>

            {result?.valid && (
              <div className="flex gap-2 mt-3">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownload('png')}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
                >
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  PNG
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownload('html')}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-500/20 border border-gray-500/50 text-gray-300 font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(128,128,128,0.3)] disabled:opacity-50"
                >
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  HTML
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownload('pdf')}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] disabled:opacity-50"
                >
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  PDF
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
