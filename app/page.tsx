'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FloatingParticles } from '@/components/floating-particles'
import { ScrollProgressBar } from '@/components/scroll-progress'
import { HeroSection } from '@/components/sections/hero'
import { AboutSection } from '@/components/sections/about'
import { HighlightsSection } from '@/components/sections/highlights'
import { TracksSection } from '@/components/sections/tracks'
import { TimelineSection } from '@/components/sections/timeline'
import { PrizesSection } from '@/components/sections/prizes'
import { CertificateSection } from '@/components/sections/certificate'
import { TeamSection } from '@/components/sections/team'
import { SponsorsSection } from '@/components/sections/sponsors'
import { FAQSection } from '@/components/sections/faq'

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <FloatingParticles />
      <Navbar />
      
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* About Section */}
        <section id="about">
          <AboutSection />
        </section>

        {/* Highlights Section */}
        <section id="highlights">
          <HighlightsSection />
        </section>

        {/* Tracks Section */}
        <section id="tracks">
          <TracksSection />
        </section>

        {/* Timeline Section */}
        <section id="timeline">
          <TimelineSection />
        </section>

        {/* Prizes Section */}
        <section id="prizes">
          <PrizesSection />
        </section>

        {/* Certificates Section */}
        <section id="certificates">
          <CertificateSection />
        </section>

        {/* Team Section */}
        <section id="team">
          <TeamSection />
        </section>

        {/* Sponsors Section */}
        <section id="sponsors">
          <SponsorsSection />
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <FAQSection />
        </section>
      </main>

      <Footer />
    </>
  )
}
