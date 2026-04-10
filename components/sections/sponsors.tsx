'use client'

import { motion } from 'framer-motion'
import { Sponsor } from '@/lib/types'
import { MessageCircle, ExternalLink } from 'lucide-react'

interface SponsorsSectionProps {
  sponsors: Sponsor[]
  sponsorCtaVisible?: boolean
  sponsorCtaMessage?: string
  sponsorCtaWhatsappNumber?: string
}

export function SponsorsSection({
  sponsors,
  sponsorCtaVisible = true,
  sponsorCtaMessage = 'Hello Mukesh Kumar, I am interested in sponsoring your event. Please share the sponsorship details, audience reach, and collaboration opportunities.',
  sponsorCtaWhatsappNumber = '919771894062'
}: SponsorsSectionProps) {
  const visibleSponsors = sponsors.filter(sponsor => sponsor.isVisible !== false)

  const grouped = visibleSponsors.reduce(
    (acc, sponsor) => {
      const tier = (sponsor.tier ?? 'silver') as 'platinum' | 'gold' | 'silver'
      acc[tier] = [...acc[tier], sponsor]
      return acc
    },
    { platinum: [] as Sponsor[], gold: [] as Sponsor[], silver: [] as Sponsor[] }
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/)
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const sponsorCard = (sponsor: Sponsor, tier: 'platinum' | 'gold' | 'silver') => {
    const colorClass = tier === 'platinum' ? 'text-yellow-400 border-t-yellow-400' : tier === 'gold' ? 'text-green-400 border-t-green-400' : 'text-gray-400 border-t-gray-500'
    const glowClass = tier === 'platinum' ? 'hover-glow-cyan' : tier === 'gold' ? 'hover-glow-green' : ''
    const gradientClass = tier === 'platinum' ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30' : tier === 'gold' ? 'from-green-500/20 to-emerald-500/20 border-green-500/30' : 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30'
    const textColorClass = tier === 'platinum' ? 'text-yellow-300' : tier === 'gold' ? 'text-green-300' : 'text-cyan-300'

    return (
      <motion.div
        key={sponsor.id}
        variants={itemVariants}
        whileHover={{ scale: 1.08 }}
        className={`glass-dark rounded-lg p-6 flex flex-col items-center justify-center text-center ${glowClass} border-t-2 ${colorClass} group`}
      >
        {sponsor.logo ? (
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="w-16 h-16 object-contain mb-4 rounded-lg"
          />
        ) : (
          <div className={`w-16 h-16 rounded-lg bg-linear-to-br ${gradientClass} flex items-center justify-center mb-4 border`}>
            <span className={`text-2xl font-bold ${textColorClass}`}>
              {getInitials(sponsor.name)}
            </span>
          </div>
        )}

        <h3 className="text-lg font-bold text-white mb-1">{sponsor.name}</h3>
        <p className="text-sm text-cyan-300 mb-2">{sponsor.type || tier}</p>

        {sponsor.description && (
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">{sponsor.description}</p>
        )}

        {sponsor.website && (
          <a
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Visit Website
          </a>
        )}
      </motion.div>
    )
  }

  const handleSponsorCta = () => {
    const encodedMessage = encodeURIComponent(sponsorCtaMessage)
    const whatsappUrl = `https://wa.me/${sponsorCtaWhatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="heading-lg gradient-cyan-blue mb-4">Our Sponsors & Partners</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Trusted partners making Tech Hub BBS feel premium and purposeful. Join our community for exclusive opportunities.
        </p>
      </motion.div>

      {/* Sponsor Cards */}
      {visibleSponsors.length > 0 && (
        <>
          {(['platinum', 'gold', 'silver'] as const).map((tier) => (
            grouped[tier].length > 0 && (
              <div key={tier} className="mb-16">
                <h3 className={`text-2xl font-bold ${tier === 'platinum' ? 'text-yellow-400' : tier === 'gold' ? 'text-green-400' : 'text-gray-400'} text-center mb-8`}>
                  {tier === 'platinum' ? 'Platinum Sponsors' : tier === 'gold' ? 'Gold Sponsors' : 'Silver Sponsors'}
                </h3>
                <motion.div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                >
                  {grouped[tier].map((sponsor) => sponsorCard(sponsor, tier))}
                </motion.div>
              </div>
            )
          ))}
        </>
      )}

      {/* Sponsor CTA Button */}
      {sponsorCtaVisible && (
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button
            onClick={handleSponsorCta}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-lg border border-green-500 text-green-300 font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:text-white hover:border-green-400 bg-black/30 backdrop-blur-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Become a Sponsor
          </motion.button>
          <p className="text-sm text-gray-500 mt-3">
            Interested in sponsoring Tech Hub BBS? Let's discuss partnership opportunities!
          </p>
        </motion.div>
      )}
    </section>
  )
}
