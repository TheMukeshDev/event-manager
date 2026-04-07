'use client'

import { motion } from 'framer-motion'
import { User, Mail, CheckCircle2 } from 'lucide-react'

export function RegistrationSection() {
  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up with your email and create a secure account',
      icon: User,
    },
    {
      number: '02',
      title: 'Choose Your Tracks',
      description: 'Select the event tracks and workshops you want to attend',
      icon: Mail,
    },
    {
      number: '03',
      title: 'Confirm Registration',
      description: 'Review your selections and complete the registration',
      icon: CheckCircle2,
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left - Steps */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-lg gradient-cyan-green mb-12">Easy Registration Process</h2>

          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex gap-6 items-start"
                >
                  {/* Step circle */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center"
                  >
                    <span className="text-xl font-bold text-white">{step.number}</span>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Right - Registration form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="glass-dark rounded-lg p-8 glow-cyan"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Register Now</h3>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">College Name</label>
              <input
                type="text"
                placeholder="Your college/organization"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Tracks</label>
              <div className="space-y-2">
                {['Development', 'Design', 'Marketing', 'Entrepreneurship'].map((track) => (
                  <label key={track} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                    <span className="text-gray-300">{track}</span>
                  </label>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 neon-button justify-center"
            >
              Complete Registration
            </motion.button>

            <p className="text-xs text-gray-500 text-center">
              By registering, you agree to our terms and conditions
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
