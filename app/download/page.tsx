'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Award, Loader2, ArrowRight, Download, Mail, AlertCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { downloadCertificatePNG } from '@/components/certificate-export'
import { generateQRCodeBase64 } from '@/lib/qr-generator'

const ScaledCertificate = dynamic(
  () => import('@/components/certificate-wrapper').then((mod) => mod.ScaledCertificate),
  { ssr: false, loading: () => <div className="bg-gray-800 animate-pulse rounded-lg" style={{ width: '100%', aspectRatio: '16/9' }} /> }
)

const CertificateExportWrapper = dynamic(
  () => import('@/components/certificate-wrapper').then((mod) => mod.CertificateExportWrapper),
  { ssr: false }
)

const CERTIFICATE_WIDTH = 2880
const CERTIFICATE_HEIGHT = 1620

const CERTIFICATE_FONTS = [
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700',
  'https://fonts.googleapis.com/css2?family=Great+Vibes',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600',
  'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600'
]

async function preloadFonts(): Promise<void> {
  if (typeof document === 'undefined') return
  for (const href of CERTIFICATE_FONTS) {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
    }
  }
  try {
    if (document.fonts?.ready) await document.fonts.ready
  } catch {}
  await new Promise<void>((resolve) => setTimeout(resolve, 500))
}

async function waitForImages(container: HTMLElement): Promise<void> {
  if (typeof document === 'undefined') return
  const images = Array.from(container.querySelectorAll('img'))
  const promises = images.map((img) => {
    return new Promise<void>((resolve) => {
      if (img.complete && img.naturalHeight !== 0) resolve()
      else {
        img.onload = () => resolve()
        img.onerror = () => resolve()
        setTimeout(() => resolve(), 3000)
      }
    })
  })
  await Promise.all(promises)
  await new Promise<void>((resolve) => setTimeout(resolve, 300))
}

interface Certificate {
  certificate_id: string
  name: string
  email: string
  event: string
  certificate_type: string
  rank: number | null
  score: number | null
}

interface CertificateWithQR extends Certificate {
  qrCodeUrl: string
  title: string
}

function getTitle(certificateType: string): string {
  switch (certificateType) {
    case 'excellence': return 'CERTIFICATE OF EXCELLENCE'
    case 'appreciation': return 'CERTIFICATE OF APPRECIATION'
    case 'winner': return 'WINNER CERTIFICATE'
    case 'runner-up': return 'RUNNER-UP CERTIFICATE'
    case 'second-runner-up': return 'SECOND RUNNER-UP CERTIFICATE'
    default: return 'CERTIFICATE OF PARTICIPATION'
  }
}

function buildCertificateData(cert: Certificate, qrCodeUrl: string) {
  return {
    name: cert.name,
    event: cert.event || 'TechQuiz 2026',
    certificateType: cert.certificate_type,
    title: getTitle(cert.certificate_type),
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    rank: cert.rank,
    score: cert.score,
    certificateId: cert.certificate_id,
    qrCodeUrl,
  }
}

export default function DownloadCertificatePage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [certificates, setCertificates] = useState<CertificateWithQR[]>([])
  const [downloading, setDownloading] = useState<string | null>(null)
  const exportRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError(null)
    setCertificates([])

    try {
      const response = await fetch(`/api/certificates/find-by-email?email=${encodeURIComponent(email.trim())}`)
      const data = await response.json()

      if (data.success && data.certificates && data.certificates.length > 0) {
        const certsWithQR = await Promise.all(
          data.certificates.map(async (cert: Certificate) => {
            const verifyUrl = `${process.env.NEXT_PUBLIC_VERIFY_BASE_URL || 'https://techhub-bbs.vercel.app'}/verify/${cert.certificate_id}`
            const qrBase64 = await generateQRCodeBase64(verifyUrl, 200)
            return {
              ...cert,
              qrCodeUrl: qrBase64,
              title: getTitle(cert.certificate_type)
            }
          })
        )
        setCertificates(certsWithQR)
      } else {
        setError(data.message || 'No certificates found for this email address')
      }
    } catch (err) {
      setError('Failed to fetch certificates. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPNG = async (certificate: CertificateWithQR) => {
    const certElement = exportRefs.current.get(certificate.certificate_id)
    if (!certElement) {
      console.error('Certificate element not found')
      return
    }

    try {
      setDownloading(certificate.certificate_id)
      await preloadFonts()
      await waitForImages(certElement)
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
      await new Promise<void>((resolve) => setTimeout(resolve, 300))
      await downloadCertificatePNG(certElement, certificate.certificate_id, certificate.name)
    } catch (err) {
      console.error('Error downloading PNG:', err)
      setError('Failed to download certificate. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-2xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center mb-8"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Download Your Certificate</h1>
        <p className="text-gray-400">Enter your registered email to find and download your certificate</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email address"
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-900/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find My Certificates
              </>
            )}
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 text-center mb-6 flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {certificates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-gray-400 text-sm text-center mb-4">
              Found {certificates.length} certificate{certificates.length > 1 ? 's' : ''} for {email}
            </p>
            
            {certificates.map((cert) => (
              <div key={cert.certificate_id} className="glass-dark rounded-2xl p-6 border border-cyan-500/30">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{cert.name}</h3>
                    <p className="text-sm text-gray-400">{cert.event}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Certificate Type</p>
                    <p className="text-white font-medium text-sm">{cert.title}</p>
                  </div>
                  {cert.rank && (
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Rank Achieved</p>
                      <p className="text-white font-medium">#{cert.rank}</p>
                    </div>
                  )}
                  {cert.score !== null && (
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Score</p>
                      <p className="text-white font-medium">{cert.score}/20</p>
                    </div>
                  )}
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Certificate ID</p>
                    <p className="text-white font-mono text-sm">{cert.certificate_id}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadPNG(cert)}
                    disabled={downloading === cert.certificate_id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-medium transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
                  >
                    {downloading === cert.certificate_id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Download Certificate
                  </button>
                </div>

                <div className="hidden">
                  <CertificateExportWrapper
                    ref={(el) => {
                      if (el) exportRefs.current.set(cert.certificate_id, el)
                    }}
                    certificate={buildCertificateData(cert, cert.qrCodeUrl)}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {!certificates.length && !error && !loading && (
          <p className="text-center text-gray-500 text-sm">
            Enter the email address you used to register for the quiz.
            <br />
            Your certificates will appear here if found.
          </p>
        )}
      </motion.div>
    </div>
  )
}
