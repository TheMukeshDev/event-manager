'use client'

import { FloatingParticles } from '@/components/floating-particles'
import { ScrollProgressBar } from '@/components/scroll-progress'
import { HeroSection } from '@/components/sections/hero'
import { AboutSection } from '@/components/sections/about'
import { HighlightsSection } from '@/components/sections/highlights'
import { TracksSection } from '@/components/sections/tracks'
import { TimelineSection } from '@/components/sections/timeline'
import { PrizesSection } from '@/components/sections/prizes'
import { SpeakersSection } from '@/components/sections/speakers'
import { RegistrationSection } from '@/components/sections/registration'
import { CertificateSection } from '@/components/sections/certificate'
import { TeamSection } from '@/components/sections/team'
import { SponsorsSection } from '@/components/sections/sponsors'
import { FAQSection } from '@/components/sections/faq'
import { ContactSection } from '@/components/sections/contact'

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <FloatingParticles />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* About Section */}
        <AboutSection />

        {/* Highlights Section */}
        <HighlightsSection />

        {/* Tracks Section */}
        <TracksSection />

        {/* Timeline Section */}
        <TimelineSection />

        {/* Prizes Section */}
        <PrizesSection />

        {/* Speakers Section */}
        <SpeakersSection />

        {/* Registration Section */}
        <RegistrationSection />

        {/* Certificate Section */}
        <CertificateSection />

        {/* Team Section */}
        <TeamSection />

        {/* Sponsors Section */}
        <SponsorsSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Contact Section */}
        <ContactSection />
      </main>
    </>
  )
}
