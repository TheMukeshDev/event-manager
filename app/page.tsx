import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FloatingParticles } from '@/components/floating-particles'
import { ScrollProgressBar } from '@/components/scroll-progress'
import { HeroSection } from '@/components/sections/hero'
import { AboutSection } from '@/components/sections/about'
import { HighlightsSection } from '@/components/sections/highlights'
import { TimelineSection } from '@/components/sections/timeline'
import { PrizesSection } from '@/components/sections/prizes'
import { CertificateSection } from '@/components/sections/certificate'
import { TeamSection } from '@/components/sections/team'
import { AmbassadorSection } from '@/components/sections/ambassador'
import { SponsorsSection } from '@/components/sections/sponsors'
import { FAQSection } from '@/components/sections/faq'
import { getPublicOverview } from '@/lib/public-data'

export const metadata: Metadata = {
  title: 'Tech Hub BBS Events - Innovate. Connect. Elevate.',
  description: 'Discover and participate in exciting tech events organized by Tech Hub BBS, a premier group of institutions in Prayagraj, U.P. India. Join us for competitions, learning opportunities, and awards.',
  keywords: ['tech events', 'Prayagraj', 'competitions', 'learning', 'innovation', 'Tech Hub BBS'],
  alternates: {
    canonical: 'https://techhub-bbs.vercel.app',
  },
}

export default async function Home() {
  const { event, timeline, prizes, sponsors, faqs, team, ambassadors, adminSettings } = await getPublicOverview()

  return (
    <>
      <ScrollProgressBar />
      <FloatingParticles />
      <Navbar />
      
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section id="hero">
          <HeroSection event={event} />
        </section>

        {/* About Section */}
        <section id="about">
          <AboutSection event={event} />
        </section>

        {/* Highlights Section */}
        <section id="highlights">
          <HighlightsSection highlights={event.highlights} />
        </section>

        {/* Timeline Section */}
        <section id="timeline">
          <TimelineSection timeline={timeline} />
        </section>

        {/* Prizes Section */}
        <section id="prizes">
          <PrizesSection prizes={prizes} />
        </section>

        {/* Certificates Section */}
        <section id="certificates">
          <CertificateSection />
        </section>

        {/* Team Section */}
        <section id="team">
          <TeamSection team={team} />
        </section>

        {/* Campus Ambassador Section */}
        <section id="ambassador">
          <AmbassadorSection ambassadors={ambassadors} />
        </section>

        {/* Sponsors Section */}
        <section id="sponsors">
          <SponsorsSection
            sponsors={sponsors}
            sponsorCtaVisible={adminSettings.sponsor_cta_visible}
            sponsorCtaMessage={adminSettings.sponsor_cta_default_message}
            sponsorCtaWhatsappNumber={adminSettings.sponsor_cta_whatsapp_number}
          />
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <FAQSection faqs={faqs} />
        </section>
      </main>

      <Footer />
    </>
  )
}
