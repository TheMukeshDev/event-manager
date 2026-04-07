'use client'

import { motion } from 'framer-motion'
import { FileText, Users, ShieldCheck, Link } from 'lucide-react'

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
  }
}

export function EventDetailsSection({ event }: EventDetailsProps) {
  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="details">
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
        <motion.div
          className="glass-dark rounded-3xl border border-cyan-500/20 p-8 glow-cyan"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 font-semibold">Event Details</p>
            <h2 className="heading-lg gradient-cyan-green mt-4">Full Access + Practical Rewards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              { label: 'Event Type', value: event.eventType ?? 'Hybrid Challenge' },
              { label: 'Team Size', value: event.teamSize ?? 'Individual / Teams' },
              { label: 'Mode', value: event.mode ?? 'Online + Onsite' },
              { label: 'Venue', value: event.venue ?? 'Primary Campus Arena' },
            ].map((item) => (
              <div key={item.label} className="glass rounded-3xl p-5 border border-white/10">
                <p className="text-gray-400 text-xs uppercase tracking-[0.25em] mb-2">{item.label}</p>
                <p className="text-white font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-gray-300 leading-relaxed">{event.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-3xl p-5 border border-cyan-500/10">
                <h3 className="text-sm text-cyan-300 uppercase tracking-[0.2em] mb-3">Eligibility</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {event.eligibility?.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-3xl p-5 border border-green-500/10">
                <h3 className="text-sm text-green-300 uppercase tracking-[0.2em] mb-3">Rules</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 transition-colors"
            >
              <Link className="w-4 h-4" />
              Download Brochure
            </a>
          ) : null}
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="glass-dark rounded-3xl border border-cyan-500/20 p-8 glow-blue">
            <div className="flex items-center gap-4 mb-6">
              <FileText className="w-6 h-6 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-[0.25em]">Why Attend</p>
                <h3 className="text-xl font-semibold text-white">Premium Event Experience</h3>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Engage with live workshops, curated competitions, and verified certificates—designed to elevate your college event experience with a futuristic neon edge.
            </p>
          </div>

          <div className="glass-dark rounded-3xl border border-green-500/20 p-8 glow-green">
            <div className="flex items-center gap-4 mb-6">
              <Users className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-[0.25em]">Participation</p>
                <h3 className="text-xl font-semibold text-white">Open to all streams</h3>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Join as an individual or team and gain instant access to exclusive event resources, community networking, and skill-building rewards.
            </p>
          </div>

          <div className="glass-dark rounded-3xl border border-cyan-500/20 p-8 glow-cyan">
            <div className="flex items-center gap-4 mb-6">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-[0.25em]">Security</p>
                <h3 className="text-xl font-semibold text-white">Verified participation</h3>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Every certificate and registration record is stored in a secure Supabase database, ensuring real-time verification and audit-ready reporting.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
