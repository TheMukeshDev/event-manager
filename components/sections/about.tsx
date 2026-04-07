'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Target, Users, Award } from 'lucide-react'
import { EVENT_DATA } from '@/lib/event-data'

export function AboutSection() {
  const stats = [
    { icon: Target, label: 'Questions', value: EVENT_DATA.questions },
    { icon: Users, label: 'Seats', value: EVENT_DATA.seats.total },
    { icon: Award, label: 'Duration', value: `${EVENT_DATA.duration}` },
    { icon: CheckCircle2, label: 'Difficulty', value: 'Easy-Moderate' },
  ]

  const features: string[] = EVENT_DATA.features ?? []

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-lg gradient-cyan-green mb-6">About {EVENT_DATA.shortName}</h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            {EVENT_DATA.name} is an exclusive online quiz challenge designed to test your knowledge of Computer Awareness and C Programming. Compete with students from across India and showcase your technical expertise!
          </p>

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
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
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
          {[
            { title: 'Founded', value: '2024', color: 'cyan' },
            { title: 'Global Reach', value: '150+ Countries', color: 'green' },
            { title: 'Event Types', value: '50+', color: 'blue' },
            { title: 'Support', value: '24/7', color: 'cyan' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`glass-dark rounded-lg p-6 border-l-4 ${
                stat.color === 'cyan'
                  ? 'border-l-cyan-400 glow-cyan'
                  : stat.color === 'green'
                    ? 'border-l-green-400 glow-green'
                    : 'border-l-blue-400 glow-blue'
              } hover-glow-cyan`}
            >
              <p className="text-gray-400 text-sm font-medium mb-2">{stat.title}</p>
              <p
                className={`text-2xl font-bold ${
                  stat.color === 'cyan'
                    ? 'text-cyan-300'
                    : stat.color === 'green'
                      ? 'text-green-300'
                      : 'text-blue-300'
                }`}
              >
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
