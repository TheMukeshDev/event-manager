'use client'

import { motion } from 'framer-motion'
import { TeamMember } from '@/lib/types'

interface TeamSectionProps {
  team: TeamMember[]
}

export function TeamSection({ team }: TeamSectionProps) {
  const preparedTeam = team.map((member, i) => ({
    ...member,
    initials: member.name.split(' ').map((n) => n[0]).join(''),
    color: ['from-cyan-400', 'from-green-400', 'from-blue-400'][i % 3],
  }))

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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
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
        <h2 className="heading-lg gradient-cyan-green mb-4">Meet Our Team</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A dedicated team working to make EventManager feel polished, modern, and immediately impactful.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {preparedTeam.map((member) => (
          <motion.div
            key={member.id}
            variants={itemVariants}
            whileHover={{
              scale: 1.08,
              y: -10,
            }}
            className="group"
          >
            <div className="glass-dark rounded-lg p-6 text-center glow-cyan hover-glow-cyan">
              <motion.div
                whileHover={{ scale: 1.15 }}
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} to-blue-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4`}
              >
                {member.initials}
              </motion.div>

              <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
              <p className="text-sm text-cyan-300 font-medium">{member.role}</p>
              <p className="text-sm text-gray-400 mt-3 leading-relaxed">{member.bio}</p>

              <div className="mt-4 h-1 w-12 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto rounded-full" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
