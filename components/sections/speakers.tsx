'use client'

import { motion } from 'framer-motion'
import { Linkedin, Twitter } from 'lucide-react'

export function SpeakersSection() {
  const speakers = [
    {
      name: 'Sarah Chen',
      role: 'CEO, Tech Innovations',
      bio: 'Digital transformation expert with 15+ years experience',
      image: 'SC',
    },
    {
      name: 'Alex Rodriguez',
      role: 'Lead Designer, Creative Labs',
      bio: 'Award-winning designer shaping the future of UX',
      image: 'AR',
    },
    {
      name: 'Maria Patel',
      role: 'Founder, StartUp Hub',
      bio: 'Serial entrepreneur and venture advisor',
      image: 'MP',
    },
    {
      name: 'James Wilson',
      role: 'CTO, Cloud Systems',
      bio: 'Cloud architecture expert and tech thought leader',
      image: 'JW',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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
        <h2 className="heading-lg gradient-cyan-blue mb-4">Featured Speakers & Judges</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Learn from industry leaders and innovators
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {speakers.map((speaker, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.08,
              y: -15,
            }}
            className="group"
          >
            <div className="glass-dark rounded-lg p-6 h-full glow-cyan hover-glow-cyan overflow-hidden relative">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xl font-bold text-white mb-4 group-hover:scale-110 transition-transform">
                {speaker.image}
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{speaker.name}</h3>
              <p className="text-sm text-cyan-300 font-medium mb-3">{speaker.role}</p>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">{speaker.bio}</p>

              {/* Social links */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  className="flex-1 p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-cyan-400 mx-auto" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  className="flex-1 p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
                >
                  <Twitter className="w-4 h-4 text-cyan-400 mx-auto" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
