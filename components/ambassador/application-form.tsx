'use client'

import { useState } from 'react'

interface AmbassadorApplicationFormProps {
  proofFormLink: string
}

export function AmbassadorApplicationForm({ proofFormLink }: AmbassadorApplicationFormProps) {
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    college_name: '',
    branch: '',
    section: '',
    year_or_semester: '',
    city: '',
    state: '',
    why_fit_for_role: '',
    prior_experience: '',
    social_profile_link: '',
    whatsapp_number: '',
    consent: true,
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch('/api/ambassador/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const result = await response.json()
      if (!response.ok) {
        setStatus('error')
        setMessage(result?.message || 'Unable to submit application. Please try again.')
        return
      }

      setStatus('success')
      setMessage('Application submitted successfully. We will contact you once approved.')
      setForm({
        full_name: '',
        phone: '',
        email: '',
        college_name: '',
        branch: '',
        section: '',
        year_or_semester: '',
        city: '',
        state: '',
        why_fit_for_role: '',
        prior_experience: '',
        social_profile_link: '',
        whatsapp_number: '',
        consent: true,
      })
    } catch (error) {
      setStatus('error')
      setMessage('Unable to submit application. Please try again later.')
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-200">Full name</span>
          <input
            value={form.full_name}
            onChange={(event) => handleChange('full_name', event.target.value)}
            required
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-200">Email address</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => handleChange('email', event.target.value)}
            required
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-200">Phone number</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            required
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-200">College / University</span>
          <input
            value={form.college_name}
            onChange={(event) => handleChange('college_name', event.target.value)}
            required
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-200">Branch</span>
          <input
            value={form.branch}
            onChange={(event) => handleChange('branch', event.target.value)}
            required
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-200">Section / Year</span>
          <input
            value={form.section}
            onChange={(event) => handleChange('section', event.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-slate-200">Why are you a good fit?</span>
        <textarea
          value={form.why_fit_for_role}
          onChange={(event) => handleChange('why_fit_for_role', event.target.value)}
          required
          rows={4}
          className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-200">WhatsApp number</span>
          <input
            type="tel"
            value={form.whatsapp_number}
            onChange={(event) => handleChange('whatsapp_number', event.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-200">Social profile (optional)</span>
          <input
            value={form.social_profile_link}
            onChange={(event) => handleChange('social_profile_link', event.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </label>
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          checked={form.consent}
          onChange={(event) => handleChange('consent', event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400"
        />
        <label htmlFor="consent" className="text-sm leading-6 text-slate-300">
          I agree to be contacted about the ambassador program and to share my referral link with my network.
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full justify-center rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
      </button>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
        <p className="font-semibold text-slate-100">Proof Submission</p>
        <p className="mt-2 text-slate-400">
          After approval, share your referral submissions via proof so we can validate your referrals and update your leaderboard rank.
        </p>
        <a
          href={proofFormLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex rounded-3xl bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-white/10"
        >
          Open proof form
        </a>
      </div>

      {status !== 'idle' && (
        <p className={`rounded-3xl px-4 py-3 text-sm ${status === 'success' ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200'}`}>
          {message}
        </p>
      )}
    </form>
  )
}
