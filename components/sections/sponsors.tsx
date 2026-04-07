'use client'

import { motion } from 'framer-motion'

export function SponsorsSection() {
  const sponsors = {
    platinum: [
      { name: 'TechCorp Industries', logo: 'TCI' },
      { name: 'Digital Innovations Inc', logo: 'DII' },
    ],
    gold: [
      { name: 'Cloud Solutions Ltd', logo: 'CSL' },
      { name: 'Data Systems Pro', logo: 'DSP' },
      { name: 'Innovation Labs', logo: 'IL' },
      { name: 'Future Tech Group', logo: 'FTG' },
    ],
    silver: [
      { name: 'Smart Dev Co', logo: 'SDC' },
      { name: 'Web Innovations', logo: 'WI' },
      { name: 'Code Creators', logo: 'CC' },
      { name: 'Digital Dreams', logo: 'DD' },
    ],
  }

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

  const renderSponsors = (sponsorList: typeof sponsors.platinum, color: string) => (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {sponsorList.map((sponsor, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.08 }}
          className={`glass-dark rounded-lg p-8 flex items-center justify-center text-center glow-${color === 'platinum' ? 'cyan' : color === 'gold' ? 'green' : 'cyan'} hover-glow-cyan border-t-2 ${
            color === 'platinum'
              ? 'border-t-yellow-400'
              : color === 'gold'
                ? 'border-t-green-400'
                : 'border-t-gray-500'
          }`}
        >
          <div>
            <div
              className={`text-4xl font-bold mb-2 ${
                color === 'platinum'
                  ? 'text-yellow-400'
                  : color === 'gold'
                    ? 'text-green-400'
                    : 'text-gray-400'
              }`}
            >
              {sponsor.logo}
            </div>
            <p className="text-gray-300 font-semibold">{sponsor.name}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )

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
          Proud partners making this event possible
        </p>
      </motion.div>

      {/* Platinum Sponsors */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-yellow-400 text-center mb-8">Platinum Sponsors</h3>
        {renderSponsors(sponsors.platinum, 'platinum')}
      </div>

      {/* Gold Sponsors */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-green-400 text-center mb-8">Gold Sponsors</h3>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {sponsors.gold.map((sponsor, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              className="glass-dark rounded-lg p-8 flex items-center justify-center text-center glow-green hover-glow-cyan border-t-2 border-t-green-400"
            >
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">{sponsor.logo}</div>
                <p className="text-gray-300 font-semibold text-sm">{sponsor.name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Silver Sponsors */}
      <div>
        <h3 className="text-2xl font-bold text-gray-400 text-center mb-8">Silver Sponsors</h3>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {sponsors.silver.map((sponsor, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              className="glass-dark rounded-lg p-6 flex items-center justify-center text-center glow-cyan hover-glow-cyan border-t border-t-gray-500"
            >
              <div>
                <div className="text-2xl font-bold text-gray-400 mb-1">{sponsor.logo}</div>
                <p className="text-gray-400 font-semibold text-xs">{sponsor.name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
