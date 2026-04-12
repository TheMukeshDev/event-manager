'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Target, Users, Award, Zap, Clock } from 'lucide-react'
import { EventData } from '@/lib/event-data'
import { useEventData } from '@/components/event-data-provider'

interface AboutSectionProps {
  event: EventData
}

export function AboutSection({ event }: AboutSectionProps) {
  const { apiData } = useEventData()

  const stats = [
    { icon: Target, label: 'Questions', value: `${event.questions} MCQs` },
    { icon: Clock, label: 'Duration', value: event.duration ?? '20 minutes' },
    { icon: Users, label: 'Registered', value: `${event.registeredCount} Participants` },
    { icon: Award, label: 'Mode', value: 'Online' },
  ]

  const quizFormat = event.quizFormat ?? []
  const features: string[] = event.features ?? []

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-lg gradient-cyan-green mb-4 sm:mb-6 break-words px-2 sm:px-0">About {event.shortName}</h2>
          <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
            {event.description}
          </p>

          <div className="mb-6 sm:mb-8">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quiz Structure</h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {event.rounds?.map((round, index) => (
                <motion.div
                  key={round.id}
                  variants={itemVariants}
                  className="glass-dark rounded-xl p-4 sm:p-5 border border-cyan-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                    <h4 className="text-white font-semibold text-sm sm:text-base">{round.name}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-400">
                    <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-300">{round.questions} Questions</span>
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-300">{round.duration}</span>
                    <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-300">{round.difficulty}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {features.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center gap-2 sm:gap-3"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 shrink-0" />
                <span className="text-gray-300 font-medium text-xs sm:text-sm">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-3 sm:space-y-4"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`glass-dark rounded-lg sm:rounded-xl p-4 sm:p-6 border-l-4 ${
                index % 4 === 0
                  ? 'border-l-cyan-400 glow-cyan'
                  : index % 4 === 1
                    ? 'border-l-green-400 glow-green'
                    : index % 4 === 2
                      ? 'border-l-blue-400 glow-blue'
                      : 'border-l-yellow-400 glow-yellow'
              } hover-glow-cyan`}
            >
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 shrink-0 ${
                  index % 4 === 0 ? 'text-cyan-400' :
                  index % 4 === 1 ? 'text-green-400' :
                  index % 4 === 2 ? 'text-blue-400' : 'text-yellow-400'
                }`} />
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">{stat.label}</p>
                  <p className={`text-xl sm:text-2xl font-bold ${
                    index % 4 === 0 ? 'text-cyan-300' :
                    index % 4 === 1 ? 'text-green-300' :
                    index % 4 === 2 ? 'text-blue-300' : 'text-yellow-300'
                  }`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-dark rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-500/20 mt-4"
          >
            <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Registration Deadline</h4>
            <p className="text-green-400 font-bold text-lg sm:text-xl">{event.registrationDeadline}</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Don&apos;t miss the chance to participate!</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
