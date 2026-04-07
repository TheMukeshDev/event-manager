'use client'

import { FormEvent, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Clipboard, Link2, Sparkles, Trophy } from 'lucide-react'
import { Ambassador } from '@/lib/types'

const UNSTOP_REFERRAL_BASE =
  'https://unstop.com/o/EhGlUDp?lb=GUZITycG&utm_medium=Share&utm_source=quizzes&utm_campaign=Mukeskum10881'
const AMBASSADOR_PROOF_FORM = 'https://forms.gle/your-campus-ambassador-proof-form'

function createReferralCode(value: string) {
  const normalized = value.trim().toLowerCase()
  if (!normalized) {
    return 'campus-ambassador'
  }

  let hash = 0
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) & 0xffffffff
  }

  return `campus-${Math.abs(hash).toString(36).slice(0, 8)}`
}

function getRewardLabel(referrals: number) {
  if (referrals >= 10) return 'Certificate of appreciation + Google swag'
  if (referrals >= 5) return 'Early access recognition + special badge'
  return 'Campus Ambassador lead reward'
}

interface AmbassadorSectionProps {
  ambassadors: Ambassador[]
}

export function AmbassadorSection({ ambassadors }: AmbassadorSectionProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState('')
  const [branch, setBranch] = useState('')
  const [section, setSection] = useState('')
  const [whyFit, setWhyFit] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const referralCode = useMemo(
    () => createReferralCode(email || name || `${college}-${branch}`),
    [email, name, college, branch]
  )
  const referralLink = `${UNSTOP_REFERRAL_BASE}&ref=${encodeURIComponent(referralCode)}`

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
    setCopySuccess(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopySuccess(true)
      window.setTimeout(() => setCopySuccess(false), 2500)
    } catch {
      setCopySuccess(false)
    }
  }

  return (
    <section id="ambassador" className="section-spacing bg-slate-950/80 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid gap-14 xl:grid-cols-[1.4fr_1fr] items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 mb-6 text-sm text-cyan-100">
            <Sparkles className="w-4 h-4" />
            Become a Campus Ambassador
          </div>

          <h2 className="heading-lg gradient-cyan-green mb-6">Referral Leaderboard & Ambassador Program</h2>
          <p className="text-gray-300 max-w-2xl leading-relaxed mb-6">
            Join our Campus Ambassador program and earn a certificate of appreciation plus Google swag when you refer 10+ registrations through your unique link.
            Submit your proof once you start getting signups and track your leaderboard ranking in real time.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-dark rounded-3xl p-6 border border-cyan-500/20">
              <div className="flex items-center gap-3 mb-4 text-cyan-200">
                <Award className="w-5 h-5" />
                <span className="text-sm font-semibold">Ambassador Reward</span>
              </div>
              <p className="text-gray-300 leading-relaxed">Refer 10 students with your unique link and receive a certificate of appreciation, Google swag, and ambassador recognition.</p>
            </div>
            <div className="glass-dark rounded-3xl p-6 border border-green-500/20">
              <div className="flex items-center gap-3 mb-4 text-green-200">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-semibold">Proof Submission</span>
              </div>
              <p className="text-gray-300 leading-relaxed">After you collect referrals, submit your proof using our ambassador proof form so we can validate your registrations and update the leaderboard.</p>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Top campus ambassadors</p>
                <h3 className="text-2xl font-bold text-white">Leaderboard snapshot</h3>
              </div>
              <div className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300">Updated weekly</div>
            </div>

            <div className="mt-6">
              {ambassadors.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {ambassadors.slice(0, 4).map((ambassador) => {
                    const referrals = ambassador.totalReferrals ?? ambassador.validReferralCount ?? 0
                    const name = ambassador.name ?? ambassador.fullName
                    const college = ambassador.college ?? ambassador.collegeName

                    return (
                      <div key={ambassador.id} className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold text-white">{name}</p>
                            <p className="text-sm text-slate-400">{college}</p>
                          </div>
                          <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-200">{referrals} refs</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-400">{getRewardLabel(referrals)}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6 text-sm text-slate-300">
                  <p className="font-semibold text-white">Ambassador leaderboard is coming soon.</p>
                  <p className="mt-2 text-slate-400">Approved ambassadors and referral standings will appear here once the program is active.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="glass-dark rounded-3xl border border-cyan-500/20 p-8 shadow-xl"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 text-cyan-200 mb-3">
              <Link2 className="w-5 h-5" />
              <h3 className="text-xl font-semibold text-white">Claim your referral link</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">Fill out the ambassador sign-up form and use the generated link to invite students to register. Your first 10 referrals qualify for special recognition.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@college.edu"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(event) => setCollege(event.target.value)}
                  placeholder="Your college name"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Branch / Section</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  placeholder="Computer Science, ECE, etc."
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">College section / year</label>
              <input
                type="text"
                value={section}
                onChange={(event) => setSection(event.target.value)}
                placeholder="Section A, Year 3"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Why are you a good fit?</label>
              <textarea
                value={whyFit}
                onChange={(event) => setWhyFit(event.target.value)}
                rows={4}
                placeholder="Share why you want to be a campus ambassador and how you'll bring registrations."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Generate my referral link
            </button>
          </form>

          {isSubmitted && (
            <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-slate-900/90 p-6">
              <div className="flex items-center gap-2 text-cyan-300 mb-3">
                <Clipboard className="w-4 h-4" />
                <span className="text-sm font-semibold">Your Ambassador Referral Link</span>
              </div>

              <div className="rounded-3xl bg-slate-950/90 p-4 border border-slate-700 text-sm text-slate-100 wrap-break-word">
                {referralLink}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Copy link
                </button>
                <a
                  href={AMBASSADOR_PROOF_FORM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-400"
                >
                  Submit ambassador proof
                </a>
              </div>

              {copySuccess && (
                <p className="mt-3 text-sm text-emerald-300">Referral link copied to clipboard.</p>
              )}

              <p className="mt-4 text-sm text-slate-400">
                Share this link with your peers using social groups, college communities, and personal messages. When 10 of your referred students register, you qualify for certification and swag.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
