'use client'

import { motion } from 'framer-motion'
import { FileText, Users, ShieldCheck, Link, Clock, Award, Zap } from 'lucide-react'

interface EventDetailsProps {
  event: {
    title: string
    description: string
    eventType?: string
    teamSize?: string
    eligibility?: string[]
    rules?: string[]
    brochureUrl?: string
    venue?: string
    mode?: string
    date?: string
    time?: string
    questions?: number
    duration?: string
    registeredCount?: number
    rounds?: { name: string; difficulty?: string; questions?: number; duration?: string }[]
  }
}

export function EventDetailsSection({ event }: EventDetailsProps) {
  const firstRound = event.rounds?.[0]

  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="details">
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-start">
        <motion.div
          className="glass-dark rounded-2xl sm:rounded-3xl border border-cyan-500/20 p-6 sm:p-8 glow-cyan"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 sm:mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 font-semibold">Event Details</p>
            <h2 className="heading-lg gradient-cyan-green mt-4">TechQuiz 2026 Challenge</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-10">
            <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <Zap className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <p className="text-white font-semibold text-sm sm:text-base">{event.questions ?? 20}</p>
              <p className="text-gray-400 text-xs">Questions</p>
            </div>
            <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <Clock className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-white font-semibold text-sm sm:text-base">{event.duration ?? '20 min'}</p>
              <p className="text-gray-400 text-xs">Duration</p>
            </div>
            <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <Users className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-semibold text-sm sm:text-base">{event.teamSize ?? 'Individual'}</p>
              <p className="text-gray-400 text-xs">Team Size</p>
            </div>
            <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <Award className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
              <p className="text-white font-semibold text-sm sm:text-base">{event.registeredCount ?? 0}</p>
              <p className="text-gray-400 text-xs">Registered</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 sm:mb-8">
            {[
              { label: 'Event Type', value: 'Online Quiz', icon: Zap },
              { label: 'Mode', value: event.mode ?? 'Online', icon: FileText },
              { label: 'Venue', value: event.venue ?? 'Online', icon: Link },
              { label: 'Difficulty', value: firstRound?.difficulty ?? 'Easy to Moderate', icon: ShieldCheck },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10">
                <p className="text-gray-400 text-xs uppercase tracking-[0.25em] mb-1 sm:mb-2">{item.label}</p>
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <p className="text-white font-semibold text-sm sm:text-base">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-6 sm:mb-8">
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{event.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-cyan-500/10">
                <h3 className="text-sm text-cyan-300 uppercase tracking-[0.2em] mb-3">Eligibility</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
                  {event.eligibility?.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-green-500/10">
                <h3 className="text-sm text-green-300 uppercase tracking-[0.2em] mb-3">Rules</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
                  {(event.rules ?? ['Keep answers sharp.', 'Respect the timeline.', 'Maintain academic integrity.']).map((rule, index) => (
                    <li key={index}>• {rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {event.brochureUrl ? (
            <a
              href={event.brochureUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 transition-colors text-sm"
            >
              <Link className="w-4 h-4" />
              Download Brochure
            </a>
          ) : null}
        </motion.div>

        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="glass-dark rounded-2xl sm:rounded-3xl border border-cyan-500/20 p-6 sm:p-8 glow-blue">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              <div>
                <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-[0.25em]">Why Attend</p>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Premium Event Experience</h3>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Engage with curated competitions and verified certificates—designed to elevate your skills with a futuristic neon edge.
            </p>
          </div>

          <div className="glass-dark rounded-2xl sm:rounded-3xl border border-green-500/20 p-6 sm:p-8 glow-green">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              <div>
                <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-[0.25em]">Participation</p>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Open to all streams</h3>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Join individually and gain instant access to exclusive event resources, community networking, and skill-building rewards.
            </p>
          </div>

          <div className="glass-dark rounded-2xl sm:rounded-3xl border border-cyan-500/20 p-6 sm:p-8 glow-cyan">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              <div>
                <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-[0.25em]">Security</p>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Verified participation</h3>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Every certificate and registration record is stored securely, ensuring real-time verification and audit-ready reporting.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
