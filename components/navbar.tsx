'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { EVENT_DATA } from '@/lib/event-data'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Prizes', href: '#prizes' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Team', href: '#team' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-dark backdrop-blur-xl border-b border-cyan-500/20'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 font-bold text-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">TQ</span>
              </div>
              <span className="gradient-cyan-green text-sm">{EVENT_DATA.shortName}</span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white text-sm transition-colors duration-300 hover:bg-cyan-500/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-cyan-500 text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] transition-all duration-300"
              >
                Register
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 space-y-2 overflow-hidden"
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-colors duration-300 text-sm"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-4 px-6 py-2 rounded-lg bg-cyan-500 text-white font-semibold text-sm"
              onClick={() => setIsOpen(false)}
            >
              Register
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>
    </>
  )
}
