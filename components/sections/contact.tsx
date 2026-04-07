'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Github, Linkedin, Twitter } from 'lucide-react'

export function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@eventmanager.com',
      color: 'cyan',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      color: 'green',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Tech Hub, Silicon Valley',
      color: 'blue',
    },
  ]

  const socials = [
    { icon: Github, label: 'GitHub', color: 'hover:text-gray-400' },
    { icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: Twitter, label: 'Twitter', color: 'hover:text-cyan-400' },
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
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="heading-lg gradient-cyan-blue mb-4">Get in Touch</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Have questions? We&apos;d love to hear from you. Contact us for any inquiries.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            const colorMap = {
              cyan: 'text-cyan-400 glow-cyan',
              green: 'text-green-400 glow-green',
              blue: 'text-blue-400 glow-blue',
            }

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                className="flex gap-6 items-start"
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`shrink-0 w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center ${colorMap[info.color as keyof typeof colorMap]}`}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{info.title}</h3>
                  <p className="text-gray-400">{info.value}</p>
                </div>
              </motion.div>
            )
          })}

          {/* Social Links */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <h3 className="text-lg font-bold text-white mb-6">Follow Us</h3>
            <div className="flex gap-4">
              {socials.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2, y: -5 }}
                    className={`w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 transition-all hover:bg-cyan-500/20 hover:border-cyan-400 ${social.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="glass-dark rounded-lg p-8 glow-cyan"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                placeholder="Your message here..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full neon-button justify-center"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="mt-16 pt-8 border-t border-gray-700 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="text-gray-500 text-sm mb-2">
          &copy; 2024 EventManager. All rights reserved.
        </p>
        <p className="text-gray-600 text-xs">
          Built with innovation and passion for amazing events
        </p>
      </motion.div>
    </section>
  )
}
