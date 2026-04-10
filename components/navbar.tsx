'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { EVENT_DATA } from '@/lib/event-data'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Prizes', href: '#prizes' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Team', href: '#team' },
  { label: 'Ambassador', href: '#ambassador' },
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 font-bold"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs">TQ</span>
              </div>
              <span className="gradient-cyan-green text-xs sm:text-sm">{EVENT_DATA.shortName}</span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white text-sm transition-colors duration-300 hover:bg-cyan-500/10 pointer-events-auto cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <motion.a
                href="https://unstop.com/o/EhGlUDp?lb=GUZITycG&utm_medium=Share&utm_source=quizzes&utm_campaign=Mukeskum10881"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-cyan-500 text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] transition-all duration-300 inline-flex items-center justify-center"
              >
                Register
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden pointer-events-auto cursor-pointer"
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
            className="md:hidden overflow-hidden bg-glass-dark/95 backdrop-blur-xl border-t border-cyan-500/30 z-[49] pointer-events-auto shadow-2xl max-h-[70vh] overflow-y-auto -mx-3 sm:-mx-4"
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="block w-full px-6 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-cyan-500/20 transition-all duration-300 text-base font-medium pointer-events-auto cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <motion.a
              href="https://unstop.com/o/EhGlUDp?lb=GUZITycG&utm_medium=Share&utm_source=quizzes&utm_campaign=Mukeskum10881"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-base shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] transition-all duration-300 pointer-events-auto inline-flex items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              Register Now
            </motion.a>
          </motion.div>

          {/* Mobile Backdrop */}
          {isOpen && (
            <motion.div 
              className="md:hidden fixed inset-0 z-[48] bg-black/50 backdrop-blur-sm pointer-events-auto" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
          )}
        </div>
      </motion.nav>
    </>
  )
}
