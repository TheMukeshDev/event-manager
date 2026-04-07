'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Award } from 'lucide-react'

export function PrizesSection() {
  const prizes = [
    {
      rank: '🥇 1st Prize',
      amount: '$5,000',
      description: 'Plus mentorship and investment opportunity',
      icon: Trophy,
      color: 'from-yellow-400 to-orange-500',
      highlight: true,
    },
    {
      rank: '🥈 2nd Prize',
      amount: '$3,000',
      description: 'Plus 6 months free premium access',
      icon: Medal,
      color: 'from-gray-300 to-gray-400',
      highlight: false,
    },
    {
      rank: '🥉 3rd Prize',
      amount: '$1,500',
      description: 'Plus featured project showcase',
      icon: Award,
      color: 'from-amber-600 to-amber-700',
      highlight: false,
    },
  ]

  const specialAwards = [
    { title: 'Innovation Award', reward: '₹2,000 + Trophy' },
    { title: 'Best Presentation', reward: '₹1,500 + Badge' },
    { title: 'Community Choice', reward: '₹1,500 + Certificate' },
    { title: 'Best Collaboration', reward: '₹1,000 + Feature' },
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
    hidden: { opacity: 0, y: 40 },
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
        <h2 className="heading-lg gradient-cyan-green mb-4">Prizes & Awards</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Exciting rewards waiting for winners across all categories
        </p>
      </motion.div>

      {/* Main prizes */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {prizes.map((prize, index) => {
          const Icon = prize.icon
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: prize.highlight ? 1.08 : 1.05,
                y: prize.highlight ? -20 : -10,
              }}
              className={`relative ${prize.highlight ? 'md:scale-105' : ''}`}
            >
              {prize.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-xs font-bold text-black">
                    GRAND PRIZE
                  </div>
                </div>
              )}

              <div
                className={`glass-dark rounded-lg p-8 text-center h-full border-t-2 ${
                  prize.highlight ? 'border-t-yellow-400 glow-cyan-lg' : 'border-t-gray-500 glow-cyan'
                } hover-glow-cyan`}
              >
                <Icon
                  className={`w-16 h-16 mx-auto mb-4 ${
                    prize.highlight ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                />
                <h3 className="text-xl font-bold text-white mb-2">{prize.rank}</h3>
                <div
                  className={`text-3xl font-bold mb-4 bg-gradient-to-r ${prize.color} bg-clip-text text-transparent`}
                >
                  {prize.amount}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{prize.description}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Special awards */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold text-center mb-8 text-cyan-300">Special Awards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {specialAwards.map((award, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="glass-dark rounded-lg p-4 border-l-2 border-l-green-400 glow-cyan hover-glow-cyan text-center"
            >
              <p className="font-semibold text-white mb-2">{award.title}</p>
              <p className="text-sm text-cyan-300">{award.reward}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
