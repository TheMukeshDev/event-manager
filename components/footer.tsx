'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const footerLinks = [
    {
      title: 'Quick Links',
      links: ['Home', 'About', 'Events', 'Registration', 'FAQ'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Blog', 'Guides', 'Community', 'Support'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms & Conditions', 'Code of Conduct', 'Disclaimer'],
    },
  ]

  const socials = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/themukeshdev', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/themukeshdev', label: 'Instagram' },
  ]

  return (
    <footer className="relative bg-black border-t border-cyan-500/20">
      <div className="absolute -top-40 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 py-20 relative z-10">
        {/* Top section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">EM</span>
              </div>
              <span className="gradient-cyan-green font-bold text-lg">EventManager</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Premium event platform for college events, competitions, and conferences.
            </p>
            <div className="flex gap-4">
              {socials.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -4 }}
                  className="w-10 h-10 rounded-lg border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-white hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {footerLinks.map((section, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-300 transition-colors duration-300 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8" />

        {/* Contact section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <motion.div variants={itemVariants} className="flex gap-3">
            <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <a href="mailto:mukeshkumar916241@gmail.com" className="text-white hover:text-cyan-300 transition-colors">
                mukeshkumar916241@gmail.com
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-3">
            <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <a href="tel:+919876543210" className="text-white hover:text-cyan-300 transition-colors">
                +91 9876 543 210
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-3">
            <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-400">Location</p>
              <p className="text-white">BBS Campus Santipuram, Prayagraj 210013</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2026 Tech Hub BBS. All rights reserved.</p>
            <p>
              Designed & built with passion for event design by{' '}
              <a
                href="https://www.linkedin.com/in/themukeshdev"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-white transition-colors"
              >
                themukeshdev
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
