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
    { icon: Linkedin, href: 'https://linkedin.com/company/tech-hub-bbs', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/tech.hub.bbs', label: 'Instagram' },
  ]

  return (
    <footer className="relative bg-black border-t border-cyan-500/20 overflow-hidden">
      <div className="absolute -top-40 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative z-10 max-w-7xl mx-auto w-full">
        {/* Top section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/icon.png"
                alt="Tech Hub BBS Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shrink-0"
              />
              <span className="gradient-cyan-green font-bold text-sm sm:text-base md:text-lg">Tech Hub BBS</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-2">
              Computer Society of India
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
              BBS College of Engineering and Technology
            </p>
            <div className="flex gap-3 sm:gap-4">
              {socials.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -4 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-white hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {footerLinks.map((section, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">{section.title}</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-cyan-300 transition-colors duration-300 text-xs sm:text-sm"
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
        <div className="border-t border-gray-700 my-6 sm:my-8" />

        {/* Contact section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12"
        >
          <motion.div variants={itemVariants} className="flex gap-3">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 mt-0.5 sm:mt-1" />
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Email</p>
              <a href="mailto:TechHubBBS@gmail.com" className="text-white hover:text-cyan-300 transition-colors text-xs sm:text-sm break-all">
                TechHubBBS@gmail.com
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-3">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 mt-0.5 sm:mt-1" />
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Phone</p>
              <a href="tel:+9118001200407" className="text-white hover:text-cyan-300 transition-colors text-xs sm:text-sm">
                1800-1200-407
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-3 sm:col-span-2 md:col-span-1">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 mt-0.5 sm:mt-1" />
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Location</p>
              <p className="text-white text-xs sm:text-sm">BBS Campus Santipuram, Prayagraj</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-4 sm:pt-6 md:pt-8 border-t border-gray-700"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 text-center sm:text-left">
            <p>&copy; 2026 Tech Hub BBS. All rights reserved.</p>
            <p className="sm:text-right">
              Designed & built by{' '}
              <a
                href="https://www.linkedin.com/in/themukeshdev"
                target="_blank"
                rel="noopener noreferrer"
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
