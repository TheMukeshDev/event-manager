'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage('')
    setIsSuccess(false)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()
    setIsLoading(false)

    if (result.success) {
      setIsSuccess(true)
      setMessage('Login successful! Redirecting...')
      router.push('/admin')
    } else {
      setMessage(result.error || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="glass-dark rounded-3xl border border-cyan-500/20 p-10 max-w-md w-full">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold gradient-cyan-green">Admin Login</h1>
          <p className="text-gray-400 mt-2">Enter your Supabase admin credentials to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-gray-300">
            Email
            <div className="mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-cyan-500/20 bg-black/50 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-gray-300">
            Password
            <div className="mt-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-cyan-500/20 bg-black/50 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </label>

          {message && (
            <div className={`rounded-2xl p-3 text-sm ${isSuccess ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Admin login route: <span className="text-cyan-300">/admin/login</span></p>
          <p className="mt-2">If you do not have an account, please use Supabase credentials configured for admin access.</p>
        </div>
      </div>
    </div>
  )
}
