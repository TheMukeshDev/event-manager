'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'

type Step = 'email' | 'otp'

export default function AdminLoginPage() {
  const router = useRouter()
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
  }

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    const response = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    })

    const result = await response.json()
    setIsLoading(false)

    if (result.success) {
      localStorage.setItem('admin_session', JSON.stringify(result.profile))
      router.push('/admin')
    } else {
      setMessage(result.error || 'Invalid OTP.')
    }
  }

  const handleBack = () => {
    setStep('email')
    setOtp('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="glass-dark rounded-3xl border border-cyan-500/20 p-10 max-w-md w-full">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold gradient-cyan-green">
            {step === 'email' ? 'Admin Login' : 'Verify OTP'}
          </h1>
          <p className="text-gray-400 mt-2">
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
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full rounded-2xl border border-cyan-500/20 bg-black/50 pl-12 pr-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </label>

            {message && (
              <div className={`rounded-2xl p-3 text-sm flex items-center gap-2 ${
                isSuccess ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'
              }`}>
                {isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="rounded-2xl bg-cyan-500/10 p-4 border border-cyan-500/20">
              <p className="text-sm text-gray-400">
                OTP sent to: <span className="text-cyan-300 font-medium">{email}</span>
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
                  className="w-full rounded-2xl border border-cyan-500/20 bg-black/50 px-4 py-3 text-white text-center text-2xl tracking-[12px] font-mono outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </label>

            {message && (
              <div className={`rounded-2xl p-3 text-sm flex items-center gap-2 ${
                isSuccess ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'
              }`}>
                {isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded-full bg-gray-800 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-700"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="flex-1 rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Admin login route: <span className="text-cyan-300">/admin/login</span></p>
          <p className="mt-2">OTP valid for 5 minutes</p>
        </div>
      </div>
    </div>
  )
}