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
import { EventDataProvider } from '@/components/event-data-provider'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function getEventDataFromAPI() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || API_URL
    const res = await fetch(`${baseUrl}/api/event`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.success ? json.data : null
  } catch (error) {
    console.error('Failed to fetch event data from API:', error)
    return null
  }
}

export const metadata: Metadata = {
  title: 'TechQuiz 2026 | C Programming & Computer Awareness Quiz',
  description: 'Test your C programming and computer awareness skills in this exciting online quiz challenge. Beginner friendly and open to all streams.',
  keywords: ['tech quiz', 'c programming', 'computer awareness', 'BBSCET', 'online quiz'],
  alternates: {
    canonical: 'https://techhub-bbs.vercel.app',
  },
}

export default async function Home() {
  const { event, timeline, prizes, sponsors, faqs, team, ambassadors, adminSettings } = await getPublicOverview()
  const apiEventData = await getEventDataFromAPI()

  return (
    <>
      <ScrollProgressBar />
      <FloatingParticles />
      <Navbar />
      
      <EventDataProvider apiData={apiEventData} fallbackData={event}>
        <main className="relative z-40 pointer-events-auto min-h-screen pt-24 md:pt-20 px-3 sm:px-4 md:px-6 pb-20 w-full overflow-x-hidden">
          {/* Hero Section */}
          <section id="hero" className="snap-start w-full">
            <HeroSection event={event} />
          </section>

          {/* About Section */}
          <section id="about" className="snap-start w-full">
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
      </EventDataProvider>

      <Footer />
    </>
  )
}
