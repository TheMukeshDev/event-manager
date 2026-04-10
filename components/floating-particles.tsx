'use client'

import { useEffect, useState } from 'react'

export function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 10 + Math.random() * 5,
      }))
      setParticles(newParticles)
    }

    generateParticles()
    const interval = setInterval(() => {
      generateParticles()
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full bg-cyan-400"
          style={{
            left: `${particle.left}%`,
            top: '100%',
            opacity: 0.6,
            animation: `particle-float ${particle.duration}s ease-out forwards`,
            animationDelay: `${particle.delay}s`,
            boxShadow: '0 0 10px rgba(0, 217, 255, 0.8)',
          }}
        />
      ))}
    </div>
  )
}
