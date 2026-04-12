'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Clock, Radio } from 'lucide-react'

interface CountdownTimerProps {
  targetDate: string
}

function parseISTDate(dateString: string): Date | null {
  const [datePart, timePart] = dateString.split(', ')
  if (!datePart) return null
  
  const months: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  }
  
  const parts = datePart.trim().split(' ')
  if (parts.length < 3) return null
  
  const monthStr = parts[1].toLowerCase()
  const month = months[monthStr]
  if (month === undefined) return null
  
  const day = parseInt(parts[0], 10)
  const year = parseInt(parts[2], 10)
  
  if (isNaN(day) || isNaN(year)) return null
  
  let hours = 0, minutes = 0
  
  if (timePart) {
    const cleanTime = timePart.replace(' IST', '').replace('IST', '').trim()
    const timeMatch = cleanTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10)
      minutes = parseInt(timeMatch[2], 10)
      if (timeMatch[3]) {
        const isPM = timeMatch[3].toUpperCase() === 'PM'
        if (isPM && hours !== 12) hours += 12
        if (!isPM && hours === 12) hours = 0
      }
    }
  }
  
  return new Date(year, month, day, hours, minutes, 0)
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)
  const [hasError, setHasError] = useState(false)

  const calculateTimeLeft = useCallback(() => {
    const target = parseISTDate(targetDate)
    
    if (!target) {
      setHasError(true)
      return
    }

    const now = new Date()
    const difference = target.getTime() - now.getTime()

    if (difference > 0) {
      setTimeLeft({
        days: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((difference / 1000 / 60) % 60)),
        seconds: Math.max(0, Math.floor((difference / 1000) % 60)),
      })
      setIsExpired(false)
      setHasError(false)
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setIsExpired(true)
    }
  }, [targetDate])

  useEffect(() => {
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  if (hasError) {
    return null
  }

  if (isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6 sm:mb-8 w-full px-2"
      >
        <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-green-500/10 border border-green-500/30 text-center">
          <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 animate-pulse" />
          <span className="text-sm sm:text-base sm:text-lg font-semibold text-green-300">Event is Live!</span>
        </div>
      </motion.div>
    )
  }

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-slate-800/80 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg min-w-[44px] sm:min-w-14 flex items-center justify-center">
        <div className="text-base sm:text-xl font-bold text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{label}</div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6 sm:mb-8 w-full px-2"
    >
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl glass border-cyan-500/30 w-full max-w-md mx-auto">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-cyan-300 whitespace-nowrap">Event Starts In:</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 text-center">
          <TimeBox value={timeLeft.days} label="Days" />
          <span className="text-lg font-bold text-cyan-400 mt-1 hidden sm:block">:</span>
          <TimeBox value={timeLeft.hours} label="Hours" />
          <span className="text-lg font-bold text-cyan-400 mt-1 hidden sm:block">:</span>
          <TimeBox value={timeLeft.minutes} label="Min" />
          <span className="text-lg font-bold text-cyan-400 mt-1 hidden sm:block">:</span>
          <TimeBox value={timeLeft.seconds} label="Sec" />
        </div>
      </div>
    </motion.div>
  )
}