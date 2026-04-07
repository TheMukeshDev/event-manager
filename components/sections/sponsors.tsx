'use client'

import { motion } from 'framer-motion'
import { Sponsor } from '@/lib/types'

interface SponsorsSectionProps {
  sponsors: Sponsor[]
}

export function SponsorsSection({ sponsors }: SponsorsSectionProps) {
  const grouped = sponsors.reduce(
    (acc, sponsor) => {
      const tier = (sponsor.tier ?? 'silver') as 'platinum' | 'gold' | 'silver'
      acc[tier] = [...acc[tier], sponsor]
      return acc
    },
    { platinum: [] as Sponsor[], gold: [] as Sponsor[], silver: [] as Sponsor[] }
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  const vendorCard = (sponsor: Sponsor, tier: 'platinum' | 'gold' | 'silver') => {
    const colorClass = tier === 'platinum' ? 'text-yellow-400 border-t-yellow-400' : tier === 'gold' ? 'text-green-400 border-t-green-400' : 'text-gray-400 border-t-gray-500'
    return (
      <motion.div
        key={sponsor.id}
        variants={itemVariants}
        whileHover={{ scale: 1.08 }}
        className={`glass-dark rounded-lg p-8 flex items-center justify-center text-center hover-glow-cyan border-t-2 ${colorClass}`}
      >
        <div>
          <div className="text-4xl font-bold mb-2 text-white">{sponsor.name.slice(0, 2).toUpperCase()}</div>
          <p className="text-gray-300 font-semibold text-sm">{sponsor.name}</p>
          <p className="text-xs text-gray-500 mt-2">{sponsor.website ?? tier}</p>
        </div>
      </motion.div>
    )
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
        <h2 className="heading-lg gradient-cyan-blue mb-4">Our Sponsors</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Trusted partners making this event experience feel premium and purposeful.
        </p>
      </motion.div>

      {(['platinum', 'gold', 'silver'] as const).map((tier) => (
        <div key={tier} className="mb-16">
          <h3 className={`text-2xl font-bold ${tier === 'platinum' ? 'text-yellow-400' : tier === 'gold' ? 'text-green-400' : 'text-gray-400'} text-center mb-8`}>
            {tier === 'platinum' ? 'Platinum Sponsors' : tier === 'gold' ? 'Gold Sponsors' : 'Silver Sponsors'}
          </h3>
          <motion.div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {grouped[tier].map((sponsor) => vendorCard(sponsor, tier))}
          </motion.div>
        </div>
      ))}
    </section>
  )
}
