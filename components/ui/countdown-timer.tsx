'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, X } from 'lucide-react'

interface CountdownTimerProps {
  targetDate: string // e.g., "12 April 2026, 6:00 PM IST"
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Parse the target date
      // Format: "12 April 2026, 6:00 PM IST"
      const [datePart, timePart] = targetDate.split(', ')
      const timeStr = timePart.replace(' IST', '')
      // Create date in IST timezone
      const target = new Date(`${datePart} ${timeStr} +0530`)

      const now = new Date()
      const difference = target.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
        setIsExpired(false)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
          <X className="w-5 h-5 text-red-400" />
          <span className="text-lg font-semibold text-red-300">Event Has Started</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-8"
    >
      <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl glass border-cyan-500/30">
        <Clock className="w-5 h-5 text-cyan-400" />
        <span className="text-sm font-semibold text-cyan-300 mr-4">Event Starts In:</span>
        <div className="flex gap-3 text-center">
          <div className="bg-slate-800/80 px-3 py-2 rounded-lg min-w-15">
            <div className="text-xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-xs text-gray-400">Days</div>
          </div>
          <div className="bg-slate-800/80 px-3 py-2 rounded-lg min-w-15">
            <div className="text-xl font-bold text-white">{timeLeft.hours}</div>
            <div className="text-xs text-gray-400">Hours</div>
          </div>
          <div className="bg-slate-800/80 px-3 py-2 rounded-lg min-w-15">
            <div className="text-xl font-bold text-white">{timeLeft.minutes}</div>
            <div className="text-xs text-gray-400">Min</div>
          </div>
          <div className="bg-slate-800/80 px-3 py-2 rounded-lg min-w-15">
            <div className="text-xl font-bold text-white">{timeLeft.seconds}</div>
            <div className="text-xs text-gray-400">Sec</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}