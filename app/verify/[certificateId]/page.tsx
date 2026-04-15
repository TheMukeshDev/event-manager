'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Loader2, Award, User, Calendar, Hash, FileText } from 'lucide-react'

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

export default function VerifyCertificatePage() {
  const params = useParams()
  const certificateId = params.certificateId as string
  
  const [loading, setLoading] = useState(true)
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('UNKNOWN')

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
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-dark rounded-2xl p-8 max-w-lg w-full border"
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
        </div>
      </motion.div>
    </div>
  )
}