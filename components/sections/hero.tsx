'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Calendar, MapPin, Users, MessageCircle } from 'lucide-react'
import { EventData } from '@/lib/event-data'
import { CountdownTimer } from '@/components/ui/countdown-timer'

interface HeroSectionProps {
  event: EventData
}

export function HeroSection({ event }: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-3 sm:px-4 w-full">
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="px-3 sm:px-0">
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-5 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass border-cyan-500/30">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-cyan-300">{event.mode} Event</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-cyan-green mb-4 sm:mb-6 leading-tight break-words"
          >
            {event.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-xl text-gray-300 mb-6 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2"
          >
            {event.description}
          </motion.p>

          {/* Event Info Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-12"
          >
            <div className="glass-dark rounded-lg p-3 sm:p-4 border-cyan-500/20 w-full">
              <div className="flex items-center gap-2 text-cyan-300 mb-1 sm:mb-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="font-semibold text-sm sm:text-base">Date</span>
              </div>
              <p className="text-gray-300 text-sm truncate">{event.date}</p>
              <p className="text-xs sm:text-sm text-gray-400">{event.time}</p>
            </div>

            <div className="glass-dark rounded-lg p-3 sm:p-4 border-green-500/20 w-full">
              <div className="flex items-center gap-2 text-green-300 mb-1 sm:mb-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="font-semibold text-sm sm:text-base">Seats</span>
              </div>
              <p className="text-gray-300 text-sm">{event.registeredCount}/{event.capacity}</p>
              <p className="text-xs sm:text-sm text-gray-400">Registered</p>
            </div>

            <div className="glass-dark rounded-lg p-3 sm:p-4 border-blue-500/20 w-full">
              <div className="flex items-center gap-2 text-blue-300 mb-1 sm:mb-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="font-semibold text-sm sm:text-base">Location</span>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm truncate">{event.venue}</p>
              <p className="text-xs text-gray-400">{event.mode}</p>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <CountdownTimer targetDate={`${event.date}, ${event.time.split(' – ')[0]} IST`} />

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center"
          >
            <a
              href="https://unstop.com/o/EhGlUDp?lb=GUZITycG&utm_medium=Share&utm_source=quizzes&utm_campaign=Mukeskum10881"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button group inline-flex items-center justify-center text-sm sm:text-base w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 min-w-0"
            >
              <span className="flex items-center gap-2">
                Register Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </span>
            </a>
            <a
              href="https://chat.whatsapp.com/Hc1zaz52LdOAh6kM5NHREA"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-green-600 text-green-300 font-semibold transition-all duration-300 hover:border-green-400 hover:text-green-200 inline-flex items-center gap-2 text-sm w-full sm:w-auto justify-center min-w-0"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">Join WhatsApp</span>
            </a>
            <a href="#certificate-verify" className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-gray-600 text-gray-300 font-semibold transition-all duration-300 hover:border-cyan-400 hover:text-cyan-300 text-sm w-full sm:w-auto justify-center min-w-0">
              Verify Certificate
            </a>
          </motion.div>

          {/* Event Stats */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mt-10 sm:mt-20"
          >
            <div className="inline-block glass-dark rounded-lg p-4 sm:p-6 glow-cyan">
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">Event Challenge Specs</p>
              <div className="flex gap-4 sm:gap-8 justify-center text-center">
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-cyan-400">{event.questions}</div>
                  <div className="text-xs text-gray-400">Questions</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-green-400">{event.duration}</div>
                  <div className="text-xs text-gray-400">Duration</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-blue-400">{event.eventType}</div>
                  <div className="text-xs text-gray-400">Category</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
