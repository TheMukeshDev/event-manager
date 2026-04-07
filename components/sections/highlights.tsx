'use client'

import { motion } from 'framer-motion'
import { Zap, Users, Rocket, Shield } from 'lucide-react'

export function HighlightsSection() {
  const highlights = [
    {
      icon: Rocket,
      title: 'Lightning Fast',
      description: 'Experience blazing fast performance with our optimized infrastructure',
      color: 'cyan',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with thousands of event enthusiasts and organizers worldwide',
      color: 'green',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Stay informed with instant notifications and live event updates',
      color: 'blue',
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Your data is protected with enterprise-grade security measures',
      color: 'cyan',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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
        <h2 className="heading-lg gradient-cyan-blue mb-4">Why Choose EventManager</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Powerful features designed to make event management simple, efficient, and enjoyable
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon
          const glowClass =
            highlight.color === 'cyan'
              ? 'glow-cyan'
              : highlight.color === 'green'
                ? 'glow-green'
                : 'glow-blue'
          const textColorClass =
            highlight.color === 'cyan'
              ? 'text-cyan-400'
              : highlight.color === 'green'
                ? 'text-green-400'
                : 'text-blue-400'

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
              }}
              className={`glass-dark rounded-lg p-6 ${glowClass} hover-glow-cyan border-t border-t-transparent hover:border-t-cyan-500/50 transition-colors`}
            >
              <Icon className={`w-8 h-8 ${textColorClass} mb-4`} />
              <h3 className="heading-md text-white mb-2">{highlight.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{highlight.description}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
