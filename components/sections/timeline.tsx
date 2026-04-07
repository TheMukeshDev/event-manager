'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { TimelineItem } from '@/lib/types'

interface TimelineSectionProps {
  timeline: TimelineItem[]
}

export function TimelineSection({ timeline }: TimelineSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
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
        <h2 className="heading-lg gradient-cyan-blue mb-4">Event Timeline</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Animated stage flow with registration, shortlist, event rounds, results, and certificate release.
        </p>
      </motion.div>

      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Vertical line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 transform md:-translate-x-1/2" />

        <div className="space-y-8">
          {timeline.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Timeline dot */}
              <motion.div
                className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-cyan-400 border-2 border-black transform md:-translate-x-1/2 -translate-x-1.5 z-10"
                whileHover={{ scale: 1.5 }}
              />

              {/* Content */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 pl-8 md:pl-0' : 'md:pl-12 pl-8'}`}
              >
                <div className="glass-dark rounded-lg p-6 glow-cyan hover-glow-cyan border-l-2 border-l-green-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-300">{item.time}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
