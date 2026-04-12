'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Trophy, FileCheck, Users } from 'lucide-react'
import { TimelineItem } from '@/lib/types'
import { useEventData } from '@/components/event-data-provider'

interface TimelineSectionProps {
  timeline: TimelineItem[]
}

export function TimelineSection({ timeline }: TimelineSectionProps) {
  const { apiData } = useEventData()
  
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const getIcon = (phase?: string) => {
    const lowerPhase = (phase || '').toLowerCase()
    if (lowerPhase.includes('registration') && lowerPhase.includes('open')) return Calendar
    if (lowerPhase.includes('registration') && lowerPhase.includes('close')) return Calendar
    if (lowerPhase.includes('quiz') && lowerPhase.includes('start')) return Clock
    if (lowerPhase.includes('quiz') && lowerPhase.includes('end')) return Clock
    if (lowerPhase.includes('result')) return Trophy
    if (lowerPhase.includes('certificate')) return FileCheck
    if (lowerPhase.includes('technical') || lowerPhase.includes('session')) return Users
    return Calendar
  }

  const getColor = (phase?: string) => {
    const lowerPhase = (phase || '').toLowerCase()
    if (lowerPhase.includes('registration') && lowerPhase.includes('open')) return 'cyan'
    if (lowerPhase.includes('registration') && lowerPhase.includes('close')) return 'orange'
    if (lowerPhase.includes('quiz') && lowerPhase.includes('start')) return 'green'
    if (lowerPhase.includes('quiz') && lowerPhase.includes('end')) return 'red'
    if (lowerPhase.includes('result')) return 'yellow'
    if (lowerPhase.includes('certificate')) return 'blue'
    return 'cyan'
  }

  const timelineData = apiData ? [
    { phase: 'Registration Opens', date: apiData.registration.opens, time: apiData.registration.opensTime, description: 'Registration window opens for all eligible students' },
    { phase: 'Registration Closes', date: apiData.registration.closes, time: apiData.registration.closesTime, description: 'Last day to register for the quiz challenge' },
    { phase: 'Quiz Starts', date: apiData.rounds[0]?.date || '', time: apiData.rounds[0]?.time || '', description: 'Live TechQuiz challenge begins on Unstop platform' },
    { phase: 'Quiz Ends', date: apiData.rounds[0]?.date || '', time: apiData.rounds[0]?.endTime || '', description: 'Submission window closes' },
    { phase: 'Results', date: 'Within 3 days', time: '', description: 'Rankings announced based on score. Time as tie-breaker.' },
  ] : timeline.map(t => ({
    phase: t.phase || t.title,
    date: t.date || t.time,
    time: t.time,
    description: t.description,
  }))

  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="heading-lg gradient-cyan-blue mb-4 break-words px-2 sm:px-0">Event Timeline</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Key milestones and schedule for the TechQuiz 2026 challenge.
        </p>
      </motion.div>

      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 transform md:-translate-x-1/2" />

        <div className="space-y-6 md:space-y-8 pl-12 md:pl-0">
          {timelineData.map((item, index) => {
            const Icon = getIcon(item.phase)
            const color = getColor(item.phase)
            const isLeft = index % 2 === 0

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex items-start ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`absolute left-0 md:left-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transform -translate-x-1 md:-translate-x-1/2 z-10 ${
                  color === 'cyan' ? 'bg-cyan-500/20 border border-cyan-500' :
                  color === 'green' ? 'bg-green-500/20 border border-green-500' :
                  color === 'red' ? 'bg-red-500/20 border border-red-500' :
                  color === 'orange' ? 'bg-orange-500/20 border border-orange-500' :
                  color === 'yellow' ? 'bg-yellow-500/20 border border-yellow-500' :
                  'bg-blue-500/20 border border-blue-500'
                }`}>
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${
                    color === 'cyan' ? 'text-cyan-400' :
                    color === 'green' ? 'text-green-400' :
                    color === 'red' ? 'text-red-400' :
                    color === 'orange' ? 'text-orange-400' :
                    color === 'yellow' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`} />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`w-full md:w-[45%] ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}
                >
                  <div className={`glass-dark rounded-lg p-4 sm:p-5 border-l-2 ${
                    color === 'cyan' ? 'border-l-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]' :
                    color === 'green' ? 'border-l-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]' :
                    color === 'red' ? 'border-l-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]' :
                    color === 'orange' ? 'border-l-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]' :
                    color === 'yellow' ? 'border-l-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]' :
                    'border-l-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-xs sm:text-sm font-semibold ${
                        color === 'cyan' ? 'text-cyan-300' :
                        color === 'green' ? 'text-green-300' :
                        color === 'red' ? 'text-red-300' :
                        color === 'orange' ? 'text-orange-300' :
                        color === 'yellow' ? 'text-yellow-300' :
                        'text-blue-300'
                      }`}>{item.date}</span>
                      {item.time && (
                        <span className="text-xs text-gray-400">{item.time}</span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">{item.phase}</h3>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-gray-400">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 md:mt-16 text-center"
      >
        <div className="inline-block glass-dark rounded-xl p-4 sm:p-6 border border-cyan-500/20">
          <p className="text-gray-300 text-sm sm:text-base mb-2">Scoring Method</p>
          <p className="text-white font-semibold">Based on Score | Time as Tie-breaker</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Certificates and prizes within 3 days after event</p>
        </div>
      </motion.div>
    </section>
  )
}
