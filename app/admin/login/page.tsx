'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Mail, AlertCircle, CheckCircle2, Shield, ArrowLeft } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/admin-auth-context'

type Step = 'email' | 'otp'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAdminAuth()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()
      setIsLoading(false)

      if (result.success) {
        setIsSuccess(true)
        setMessage(result.message)
        setTimeout(() => {
          setStep('otp')
          setIsSuccess(false)
          setMessage('')
        }, 1500)
      } else {
        setMessage(result.error || 'Failed to send OTP.')
      }
    } catch {
      setIsLoading(false)
      setMessage('Network error. Please try again.')
    }
  }

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const result = await response.json()
      setIsLoading(false)

      if (result.success && result.profile) {
        login(email, result.profile)
        router.push('/admin/dashboard')
      } else {
        setMessage(result.error || 'Invalid OTP.')
      }
    } catch {
      setIsLoading(false)
      setMessage('Network error. Please try again.')
    }
  }

  const handleBack = () => {
    setStep('email')
    setOtp('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-300 transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>

        <div className="glass-dark rounded-2xl sm:rounded-3xl border border-cyan-500/20 p-6 sm:p-8 sm:p-10">
          <div className="mb-6 sm:mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 sm:mb-5"
            >
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-cyan-green mb-2">
              Admin Login
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {step === 'email'
                ? 'Enter your admin email to receive OTP.'
                : 'Enter the 6-digit OTP sent to your email.'}
            </p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <label className="block text-sm font-medium text-gray-300">
                Admin Email
                <div className="mt-2 relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@techhub-bbs.com"
                    className="w-full rounded-xl sm:rounded-2xl border border-cyan-500/20 bg-black/50 pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-white text-sm sm:text-base placeholder-gray-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </label>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 text-sm flex items-center gap-2 ${
                    isSuccess ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'
                  }`}
                >
                  {isSuccess ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  )}
                  {message}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl sm:rounded-full bg-cyan-500 px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="rounded-xl sm:rounded-2xl bg-cyan-500/10 p-3 sm:p-4 border border-cyan-500/20">
                <p className="text-xs sm:text-sm text-gray-400">
                  OTP sent to: <span className="text-cyan-300 font-medium break-all">{email}</span>
                </p>
              </div>

              <label className="block text-sm font-medium text-gray-300">
                6-Digit OTP
                <div className="mt-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    placeholder="000000"
                    maxLength={6}
                    className="w-full rounded-xl sm:rounded-2xl border border-cyan-500/20 bg-black/50 px-4 py-3 sm:py-3.5 text-white text-center text-xl sm:text-2xl tracking-[8px] font-mono outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>
              </label>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 text-sm flex items-center gap-2 ${
                    isSuccess ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'
                  }`}
                >
                  {isSuccess ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  )}
                  {message}
                </motion.div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 rounded-xl sm:rounded-full bg-gray-800 px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-gray-300 transition hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="flex-1 rounded-xl sm:rounded-full bg-cyan-500 px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-400 space-y-1">
            <p>Only authorized admins can access this panel</p>
            <p>OTP valid for 5 minutes</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
