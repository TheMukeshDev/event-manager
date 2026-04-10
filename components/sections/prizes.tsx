'use client'

import { motion } from 'framer-motion'
import { Prize } from '@/lib/types'

interface PrizesSectionProps {
  prizes: Prize[]
}

export function PrizesSection({ prizes }: PrizesSectionProps) {
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
        <h2 className="heading-lg gradient-cyan-green mb-4 wrap-break-word px-2 sm:px-0">Rewards and Prizes</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Win exclusive swags, premium dairy hamper, pens, stickers, and achievement certificates for top 3. All quiz completers get instant Participation Certificate on Unstop!
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
        {prizes.map((prize, index) => (
          <motion.div
            key={prize.id}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              y: -10,
            }}
            className={index === 0 ? 'relative md:scale-105' : ''}
          >
            <div
              className={`glass-dark rounded-lg p-8 text-center h-full border-t-2 ${
                index === 0 ? 'border-t-yellow-400 glow-cyan-lg' : 'border-t-gray-500 glow-cyan'
              } hover-glow-cyan`}
            >
              <div className="text-4xl mb-4">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎖️'}</div>
              <h3 className="text-xl font-bold text-white mb-2">{prize.title}</h3>
              <div className="text-sm text-cyan-300 mb-2">
                {prize.label ? prize.label : prize.currency && prize.amount ? `${prize.currency} ${prize.amount}` : prize.rank ? `Rank ${prize.rank}` : 'Premium reward'}
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{prize.description || 'Certificates released within 3 days.'}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
