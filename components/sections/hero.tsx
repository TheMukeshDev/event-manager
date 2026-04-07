'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Calendar, MapPin, Users, MessageCircle } from 'lucide-react'
import { EventData } from '@/lib/event-data'

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20" />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-cyan-500/30">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">{event.mode} Event</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="heading-xl gradient-cyan-green mb-6 leading-tight"
        >
          {event.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          {event.description}
        </motion.p>

        {/* Event Info Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <div className="glass-dark rounded-lg p-4 border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-300 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Date</span>
            </div>
            <p className="text-gray-300">{event.date}</p>
            <p className="text-sm text-gray-400">{event.time}</p>
          </div>

          <div className="glass-dark rounded-lg p-4 border-green-500/20">
            <div className="flex items-center gap-2 text-green-300 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Seats</span>
            </div>
            <p className="text-gray-300">{event.registeredCount}/{event.capacity} Registered</p>
            <p className="text-sm text-gray-400">Limited availability</p>
          </div>

          <div className="glass-dark rounded-lg p-4 border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-300 mb-2">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">Location</span>
            </div>
            <p className="text-gray-300 text-sm">{event.venue}</p>
            <p className="text-xs text-gray-400">{event.mode}</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a href="#registration" className="neon-button group inline-flex items-center justify-center">
            <span className="flex items-center gap-2">
              Register Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          <a
            href="https://chat.whatsapp.com/Hc1zaz52LdOAh6kM5NHREA"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg border border-green-600 text-green-300 font-semibold transition-all duration-300 hover:border-green-400 hover:text-green-200 inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Join WhatsApp Community
          </a>
          <a href="#certificate-verify" className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 font-semibold transition-all duration-300 hover:border-cyan-400 hover:text-cyan-300">
            Verify Certificate
          </a>
        </motion.div>

        {/* Event Stats */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mt-20"
        >
          <div className="inline-block glass-dark rounded-lg p-6 glow-cyan">
            <p className="text-sm text-gray-300 mb-4">Event Challenge Specs</p>
            <div className="flex gap-8 justify-center text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-400">{event.questions}</div>
                <div className="text-xs text-gray-400">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{event.duration}</div>
                <div className="text-xs text-gray-400">Duration</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{event.eventType}</div>
                <div className="text-xs text-gray-400">Category</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
