'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleNavClick = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? 'glass-dark backdrop-blur-xl border-b border-cyan-500/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#home"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 font-bold z-[101]"
              onClick={handleNavClick}
            >
              <img 
                src="/icon.svg" 
                alt="Tech Hub BBS Logo" 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shrink-0" 
              />
              <span className="gradient-cyan-green text-xs sm:text-sm">{EVENT_DATA.shortName}</span>
            </motion.a>

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
              className="md:hidden relative z-[101] flex items-center justify-center w-10 h-10 rounded-lg bg-black/40 border border-cyan-500/30 text-white hover:bg-black/60 hover:border-cyan-400 transition-all duration-300 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen ? 'true' : 'false'}
              type="button"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            {/* Mobile Menu Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[95] w-[280px] sm:w-[320px] bg-black/95 backdrop-blur-xl border-l border-cyan-500/30 shadow-2xl overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
                <span className="gradient-cyan-green font-semibold text-sm">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-300 hover:text-white hover:bg-cyan-500/20 transition-colors"
                  aria-label="Close menu"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Items */}
              <div className="p-4 space-y-2">
                {navItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className="block w-full px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-cyan-500/20 transition-all duration-300 text-sm font-medium"
                    onClick={handleNavClick}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              {/* Register Button */}
              <div className="p-4 pt-0">
                <a
                  href="https://unstop.com/o/EhGlUDp?lb=GUZITycG&utm_medium=Share&utm_source=quizzes&utm_campaign=Mukeskum10881"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] transition-all duration-300"
                  onClick={handleNavClick}
                >
                  Register Now
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}