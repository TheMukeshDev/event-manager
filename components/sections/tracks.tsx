'use client'

import { motion } from 'framer-motion'
import { Code, Palette, Megaphone, TrendingUp } from 'lucide-react'
import { EventTrack } from '@/lib/types'

interface TracksSectionProps {
  tracks: EventTrack[]
}

const defaultIcons = [Code, Palette, Megaphone, TrendingUp]

export function TracksSection({ tracks }: TracksSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="heading-lg gradient-cyan-green mb-4">Event Tracks</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore multiple tracks across different domains and skill levels
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {tracks.map((track, index) => {
          const Icon = (track.icon && (track.icon as any)) || defaultIcons[index % defaultIcons.length]
          const gradients = ['gradient-cyan-green', 'gradient-cyan-blue', 'gradient-cyan-green', 'gradient-cyan-blue']

          return (
            <motion.div
              key={track.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.08,
                y: -15,
              }}
              className="group cursor-pointer"
            >
              <div className="glass-dark rounded-lg p-6 h-full border-l-2 border-l-cyan-500 group-hover:border-l-green-400 group-hover:glow-cyan-lg transition-all duration-300">
                <Icon className="w-10 h-10 text-cyan-400 mb-4 group-hover:text-green-400 transition-colors" />
                <h3 className={`text-xl font-bold mb-3 ${gradients[index % gradients.length]}`}>{track.name}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{track.description}</p>
                <div className="flex flex-wrap gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((label, i) => (
                    <span
                      key={`${track.id}-${i}`}
                      className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
