'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, Loader2, ArrowRight, Instagram, Linkedin, AlertCircle, Award } from 'lucide-react'

const INSTAGRAM_URL = 'https://www.instagram.com/techhub_bbs'
const LINKEDIN_URL = 'https://www.linkedin.com/company/tech-hub-bbs'

interface Certificate {
  certificate_id: string
  name: string
  email: string
  event: string
  certificate_type: string
  rank: number | null
  score: number | null
}

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [certificate, setCertificate] = useState<Certificate | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certificateId.trim()) return

    setLoading(true)
    setError(null)
    setCertificate(null)
    
    try {
      const response = await fetch(`/api/verify/${certificateId.trim()}`)
      const data = await response.json()

      if (data.certificate) {
        setCertificate(data.certificate)
      } else {
        setError(data.message || 'Certificate not found')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getCertificateTitle = (type: string) => {
    switch (type) {
      case 'excellence': return 'Certificate of Excellence'
      case 'appreciation': return 'Certificate of Appreciation'
      case 'winner': return 'Winner Certificate'
      case 'runner-up': return 'Runner-up Certificate'
      case 'second-runner-up': return 'Second Runner-up Certificate'
      default: return 'Certificate of Participation'
    }
  }

  const shareOnInstagram = () => {
    const text = `I just verified my certificate from TechQuiz 2026 by Tech Hub BBS! 🎉\n\nRecipient: ${certificate?.name}\nEvent: ${certificate?.event}\nCertificate ID: ${certificate?.certificate_id}\n\nVerify your certificate at: techhub-bbs.vercel.app/verify`
    const url = `https://www.instagram.com/create/post/?caption=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const shareOnLinkedIn = () => {
    const text = `I'm proud to share my certificate from TechQuiz 2026 by Tech Hub BBS! 🎉\n\nRecipient: ${certificate?.name}\nEvent: ${certificate?.event}\nCertificate ID: ${certificate?.certificate_id}`
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://techhub-bbs.vercel.app/verify')}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      {/* Header */}
      <div className="max-w-lg mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Home
        </Link>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto text-center mb-8"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Verify Certificate</h1>
        <p className="text-gray-400">Enter certificate ID to verify authenticity</p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-lg mx-auto"
      >
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="Enter Certificate ID (e.g., THQ26-0001)"
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-900/50 border border-green-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !certificateId.trim()}
            className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Verify Certificate
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
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

        {/* Certificate Found */}
        {certificate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-2xl p-6 border border-green-500/30"
          >
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{certificate.name}</h3>
                <p className="text-sm text-gray-400">{certificate.event}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Certificate Type</p>
                <p className="text-white font-medium text-sm">{getCertificateTitle(certificate.certificate_type)}</p>
              </div>
              {certificate.rank && (
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Rank</p>
                  <p className="text-white font-medium">#{certificate.rank}</p>
                </div>
              )}
              {certificate.score !== null && (
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Score</p>
                  <p className="text-white font-medium">{certificate.score}/20</p>
                </div>
              )}
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Certificate ID</p>
                <p className="text-white font-mono text-sm">{certificate.certificate_id}</p>
              </div>
            </div>

            {/* Download Section */}
            <div className="pt-4 border-t border-gray-700 mb-4">
              <p className="text-sm text-gray-400 mb-3">Download your certificate:</p>
              <div className="flex gap-2">
                <Link
                  href={`/download`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-medium transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  <Award className="w-4 h-4" />
                  Download
                </Link>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="pt-4 border-t border-gray-700">
              <p className="text-center text-gray-400 text-sm mb-4">Follow us and share your achievement!</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={shareOnInstagram}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-medium hover:shadow-[0_0_20px_rgba(225,48,108,0.4)] transition-all"
                >
                  <Instagram className="w-5 h-5" />
                  Follow
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:shadow-[0_0_20px_rgba(10,102,194,0.4)] transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                  Connect
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
          </motion.div>
        )}

        {/* Help Text */}
        {!certificate && !error && !loading && (
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-500 text-sm mb-4">
              Your certificate ID is printed on your certificate.
              <br />
              Example: <span className="font-mono text-green-400">THQ26-0001</span>
            </p>
            
            {/* Social Links */}
            <div className="border-t border-gray-800 pt-6">
              <p className="text-center text-gray-400 text-sm mb-4">Follow us for more updates</p>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-medium hover:shadow-[0_0_20px_rgba(225,48,108,0.4)] transition-all"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:shadow-[0_0_20px_rgba(10,102,194,0.4)] transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
