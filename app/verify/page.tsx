'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Loader2, Award, User, Calendar, Hash } from 'lucide-react'

function VerifyContent() {
  const searchParams = useSearchParams()
  const certificateId = searchParams.get('id')
  
  const [loading, setLoading] = useState(true)
  const [certificate, setCertificate] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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
          setCertificate(data)
        } else {
          setError(data.message || 'Certificate not found')
        }
      } catch (err) {
        setError('Verification failed')
      } finally {
        setLoading(false)
      }
    }

    verifyCertificate()
  }, [certificateId])

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

  if (error) {
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
          <p className="text-gray-400">{error}</p>
          {certificateId && (
            <p className="text-gray-500 text-sm mt-4 font-mono">{certificateId}</p>
          )}
        </motion.div>
      </div>
    )
  }

  const isValid = certificate?.valid
  const isRevoked = certificate?.status === 'REVOKED'

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-dark rounded-2xl p-8 max-w-lg w-full border"
      >
        {/* Status Badge */}
        <div className={`text-center mb-8 ${isValid ? 'border-green-500/30' : 'border-red-500/30'}`}>
          <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isValid ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {isValid ? (
              <CheckCircle className="w-12 h-12 text-green-400" />
            ) : isRevoked ? (
              <XCircle className="w-12 h-12 text-red-400" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-yellow-400" />
            )}
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            isValid ? 'text-green-400' : isRevoked ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {certificate?.status || 'UNKNOWN'}
          </h1>
          <p className="text-gray-400">
            {isValid ? 'This certificate is valid and verified' : isRevoked ? 'This certificate has been revoked' : 'Certificate status unknown'}
          </p>
        </div>

        {/* Certificate Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <User className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs text-gray-400">Recipient</p>
              <p className="text-white font-medium">{certificate?.certificate?.recipientName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <Award className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs text-gray-400">Certificate Type</p>
              <p className="text-white font-medium capitalize">{certificate?.certificate?.certificateType}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs text-gray-400">Event</p>
              <p className="text-white font-medium">{certificate?.certificate?.eventName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-400">Score</p>
              <p className="text-white font-medium">{certificate?.certificate?.score || 'N/A'}/20</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-400">Rank</p>
              <p className="text-white font-medium">{certificate?.certificate?.rank ? `#${certificate.certificate.rank}` : 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <Hash className="w-5 h-5 text-cyan-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">Certificate ID</p>
              <p className="text-white font-mono text-sm">{certificate?.certificate?.certificateId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs text-gray-400">Issue Date</p>
              <p className="text-white font-medium">{certificate?.certificate?.issueDate}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-center text-gray-500 text-sm">
              Issued by: <span className="text-cyan-400">{certificate?.certificate?.issuedBy}</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}