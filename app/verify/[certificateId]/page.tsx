'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Loader2, Award, User, Calendar, Hash, Download, Instagram, Linkedin, ArrowRight, Search } from 'lucide-react'
import dynamic from 'next/dynamic'
import { downloadCertificatePNG } from '@/components/certificate-export'
import { generateQRCodeBase64 } from '@/lib/qr-generator'

const ScaledCertificate = dynamic(
  () => import('@/components/certificate-wrapper').then((mod) => mod.ScaledCertificate),
  { ssr: false, loading: () => <div className="bg-gray-800 animate-pulse rounded-lg" style={{ width: '100%', aspectRatio: '16/9' }} /> }
)

const CERTIFICATE_WIDTH = 2880
const CERTIFICATE_HEIGHT = 1620

interface CertificateData {
  certificateId: string
  recipientName: string
  eventName: string
  certificateType: string
  score: number | null
  rank: number | null
  issueDate: string
  issuedBy: string
}

const INSTAGRAM_URL = 'https://www.instagram.com/tech.hub.bbs'
const LINKEDIN_URL = 'https://www.linkedin.com/company/tech-hub-bbs'

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

function buildCertificateData(cert: CertificateData, qrCodeUrl: string) {
  return {
    name: cert.recipientName,
    event: cert.eventName,
    certificateType: cert.certificateType,
    title: getTitle(cert.certificateType),
    date: cert.issueDate,
    rank: cert.rank,
    score: cert.score,
    certificateId: cert.certificateId,
    qrCodeUrl,
  }
}

export default function VerifyCertificatePage() {
  const params = useParams()
  const certificateId = params.certificateId as string
  
  const [loading, setLoading] = useState(true)
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('UNKNOWN')
  const [downloading, setDownloading] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!certificateId) {
      setLoading(false)
      setError('No certificate ID provided')
      return
    }

    async function verifyCertificate() {
      try {
        const response = await fetch(`/api/verify/${certificateId}`)
        const data = await response.json()
        
        if (data.certificate) {
          setCertificate(data.certificate)
          setStatus(data.status)
          
          const verifyUrl = `${process.env.NEXT_PUBLIC_VERIFY_BASE_URL || 'https://techhub-bbs.vercel.app'}/verify/${certificateId}`
          const qrBase64 = await generateQRCodeBase64(verifyUrl, 200)
          setQrCodeUrl(qrBase64)
        } else {
          setError(data.message || 'Certificate not found')
          setStatus(data.status || 'NOT_FOUND')
        }
      } catch (err) {
        setError('Verification failed')
        setStatus('ERROR')
      } finally {
        setLoading(false)
      }
    }

    verifyCertificate()
  }, [certificateId])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }
    
    updateSize()
    const ro = new ResizeObserver(updateSize)
    if (containerRef.current) {
      ro.observe(containerRef.current)
    }
    return () => ro.disconnect()
  }, [certificate, qrCodeUrl])

  const handleDownload = async () => {
    if (!exportRef.current || !certificate) return
    
    try {
      setDownloading(true)
      await downloadCertificatePNG(exportRef.current, certificate.certificateId, certificate.recipientName)
    } catch (err) {
      console.error('Error downloading certificate:', err)
    } finally {
      setDownloading(false)
    }
  }

  const shareOnInstagram = () => {
    const text = `I just verified my certificate from TechQuiz 2026 by Tech Hub BBS! 🎉\n\nRecipient: ${certificate?.recipientName}\nEvent: ${certificate?.eventName}\nCertificate ID: ${certificate?.certificateId}\n\nVerify your certificate at: techhub-bbs.vercel.app/verify/${certificateId}`
    const url = `https://www.instagram.com/create/post/?caption=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const shareOnLinkedIn = () => {
    const text = `I'm proud to share my certificate from TechQuiz 2026 by Tech Hub BBS! 🎉\n\nRecipient: ${certificate?.recipientName}\nEvent: ${certificate?.eventName}\nCertificate ID: ${certificate?.certificateId}`
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://techhub-bbs.vercel.app/verify/${certificateId}`)}`
    window.open(url, '_blank')
  }

  const isValid = status === 'VALID'
  const isRevoked = status === 'REVOKED'
  const isNotFound = status === 'NOT_FOUND' || status === 'ERROR'

  const getStatusColor = () => {
    if (isValid) return 'green'
    if (isRevoked) return 'red'
    return 'gray'
  }

  const getStatusIcon = () => {
    if (isValid) return CheckCircle
    if (isRevoked) return XCircle
    return AlertTriangle
  }

  const StatusIcon = getStatusIcon()
  const color = getStatusColor()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying certificate...</p>
        </div>
      </div>
    )
  }

  if (isNotFound || error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-dark rounded-2xl p-8 max-w-md w-full text-center border border-red-500/30"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-red-400 mb-2">Certificate Not Found</h1>
          <p className="text-gray-400">{error || 'This certificate does not exist in our records.'}</p>
          {certificateId && (
            <p className="text-gray-500 text-sm mt-4 font-mono">{certificateId}</p>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-colors"
          >
            Go to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  const certData = certificate && qrCodeUrl ? buildCertificateData(certificate, qrCodeUrl) : null

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-lg mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Home
        </Link>
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm"
        >
          <Search className="w-4 h-4" />
          Verify Another
        </Link>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-dark rounded-2xl p-8 max-w-lg mx-auto border"
      >
        <div className={`text-center mb-8 ${isValid ? 'border-green-500/30' : 'border-red-500/30'}`}>
          <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isValid ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <StatusIcon className={`w-12 h-12 ${
              isValid ? 'text-green-400' : 'text-red-400'
            }`} />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            isValid ? 'text-green-400' : 'text-red-400'
          }`}>
            {status}
          </h1>
          <p className="text-gray-400">
            {isValid ? 'This certificate is valid and verified' : isRevoked ? 'This certificate has been revoked' : 'Certificate status unknown'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <User className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs text-gray-400">Recipient</p>
              <p className="text-white font-medium">{certificate?.recipientName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <Award className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs text-gray-400">Certificate Type</p>
              <p className="text-white font-medium capitalize">{certificate?.certificateType}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs text-gray-400">Event</p>
              <p className="text-white font-medium">{certificate?.eventName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-400">Score</p>
              <p className="text-white font-medium">{certificate && certificate.score !== null ? `${certificate.score}/20` : 'N/A'}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-400">Rank</p>
              <p className="text-white font-medium">{certificate?.rank ? `#${certificate.rank}` : 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <Hash className="w-5 h-5 text-cyan-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">Certificate ID</p>
              <p className="text-white font-mono text-sm">{certificate?.certificateId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs text-gray-400">Issue Date</p>
              <p className="text-white font-medium">{certificate?.issueDate}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-center text-gray-500 text-sm">
              Issued by: <span className="text-cyan-400">{certificate?.issuedBy}</span>
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading || !qrCodeUrl}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-medium transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Certificate
          </button>

          {isValid && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-400 text-sm mb-4">
                Share your achievement and follow us!
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={shareOnInstagram}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-medium transition-all hover:shadow-[0_0_20px_rgba(225,48,108,0.4)]"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium transition-all hover:shadow-[0_0_20px_rgba(10,102,194,0.4)]"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @techhub_bbs
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  Tech Hub BBS
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div 
        className="hidden" 
        ref={containerRef}
      >
        {certData && (
          <div
            ref={(el) => { if (el) exportRef.current = el }}
          >
            <ScaledCertificate
              certificate={certData}
              containerWidth={CERTIFICATE_WIDTH}
              containerHeight={CERTIFICATE_HEIGHT}
            />
          </div>
        )}
      </div>
    </div>
  )
}
