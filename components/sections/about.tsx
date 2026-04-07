'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Target, Users, Award } from 'lucide-react'
import { EventData } from '@/lib/event-data'

interface AboutSectionProps {
  event: EventData
}

export function AboutSection({ event }: AboutSectionProps) {
  const stats = [
    { icon: Target, label: 'Questions', value: event.questions },
    { icon: Users, label: 'Seats', value: event.capacity },
    { icon: Award, label: 'Duration', value: `${event.duration}` },
    { icon: CheckCircle2, label: 'Event Type', value: event.eventType ?? 'Quiz Championship' },
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
    <section className="section-spacing px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-lg gradient-cyan-green mb-6">About {event.shortName}</h2>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            {event.title} is a premium college event experience built for ambitious participants looking to level up with quiz challenges, certificates, and neon-glow rewards.
          </p>
          <p className="text-gray-400 mb-8 leading-relaxed">
            The quiz is designed with a clear learning path: basic Computer Awareness, beginner C fundamentals, followed by moderate and hard C programming questions based on functions, pointers, and file management.
          </p>

          {/* Quiz format cards */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {event.quizFormat?.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-dark rounded-xl p-5 border border-cyan-500/20"
              >
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Features grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {features.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-gray-300 font-medium">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Stats cards */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`glass-dark rounded-lg p-6 border-l-4 ${
                index % 3 === 0
                  ? 'border-l-cyan-400 glow-cyan'
                  : index % 3 === 1
                    ? 'border-l-green-400 glow-green'
                    : 'border-l-blue-400 glow-blue'
              } hover-glow-cyan`}
            >
              <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
              <p className={`text-2xl font-bold ${index % 3 === 0 ? 'text-cyan-300' : index % 3 === 1 ? 'text-green-300' : 'text-blue-300'}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
