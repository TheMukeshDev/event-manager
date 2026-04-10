import { supabaseServer } from './supabase-server'
import { EVENT_DATA } from './event-data'
import { Ambassador } from './types'
import {
  mockEventTracks,
  mockTimeline,
  mockPrizes,
  mockTeam,
  mockSponsors,
  mockFAQs,
} from './mock-data'

export type PublicOverview = {
  event: typeof EVENT_DATA
  tracks: typeof mockEventTracks
  timeline: typeof mockTimeline
  prizes: typeof mockPrizes
  sponsors: typeof mockSponsors
  faqs: typeof mockFAQs
  team: typeof mockTeam
  ambassadors: Ambassador[]
  contacts: typeof EVENT_DATA.contacts
  highlights: typeof EVENT_DATA.highlights
  adminSettings: {
    registration_link: string
    whatsapp_community_link: string
    is_whatsapp_join_mandatory: boolean
    certificate_rules_text: string
    certificate_id_prefix: string
    sponsor_cta_whatsapp_number: string
    sponsor_cta_default_message: string
    sponsor_cta_visible: boolean
    campus_ambassador_enabled: boolean
    referral_threshold: number
    reward_title: string
    reward_description: string
    use_external_proof_form: boolean
    external_proof_form_link: string
    leaderboard_visible: boolean
    ambassador_share_message: string
  }
}

const fallbackOverview: PublicOverview = {
  event: EVENT_DATA,
  tracks: mockEventTracks,
  timeline: mockTimeline,
  prizes: mockPrizes,
  sponsors: mockSponsors,
  faqs: mockFAQs,
  team: mockTeam,
  contacts: EVENT_DATA.contacts,
  ambassadors: [],
  highlights: EVENT_DATA.highlights,
  adminSettings: {
    registration_link: '',
    whatsapp_community_link: 'https://chat.whatsapp.com/Hc1zaz52LdOAh6kM5NHREA',
    is_whatsapp_join_mandatory: true,
    certificate_rules_text: 'Certificates are issued only to valid registered participants who attend/attempt the event and follow all event rules.',
    certificate_id_prefix: 'BBSCET-TQ-2026',
    sponsor_cta_whatsapp_number: '919771894062',
    sponsor_cta_default_message: 'Hello Mukesh Kumar, I am interested in sponsoring your event. Please share the sponsorship details, audience reach, and collaboration opportunities.',
    sponsor_cta_visible: true,
    campus_ambassador_enabled: true,
    referral_threshold: 10,
    reward_title: 'Certificate of Appreciation + Google swag',
    reward_description: 'Bring 10 valid referrals and unlock rewards, recognition and ambassador status.',
    use_external_proof_form: true,
    external_proof_form_link: 'https://forms.gle/your-campus-ambassador-proof-form',
    leaderboard_visible: true,
    ambassador_share_message: 'Hi! Join the Tech Hub BBS challenge using my referral link: ',
  }
}

export async function getPublicOverview(): Promise<PublicOverview> {
  try {
    const eventResponse = await supabaseServer
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('date', { ascending: true })
      .limit(1)
      .single()

    const event = {
      ...EVENT_DATA,
      ...(eventResponse.data ?? {}),
      title: eventResponse.data?.title ?? eventResponse.data?.name ?? EVENT_DATA.title,
      capacity: eventResponse.data?.capacity ?? EVENT_DATA.capacity,
      registeredCount: eventResponse.data?.registered_count ?? EVENT_DATA.registeredCount,
      venue: eventResponse.data?.venue ?? EVENT_DATA.venue,
      mode: eventResponse.data?.mode ?? EVENT_DATA.mode,
      eventType: eventResponse.data?.eventType ?? EVENT_DATA.eventType,
      questions: eventResponse.data?.questions ?? EVENT_DATA.questions,
      duration: eventResponse.data?.duration ?? EVENT_DATA.duration,
      highlights: EVENT_DATA.highlights,
    }

    const [tracksResponse, timelineResponse, prizesResponse, sponsorsResponse, faqsResponse, organizersResponse, teamResponse, ambassadorsResponse, adminSettingsResponse] = await Promise.all([
      supabaseServer.from('event_tracks').select('*').eq('event_id', event.id).order('display_order', { ascending: true }),
      supabaseServer.from('timeline_items').select('*').eq('event_id', event.id).order('display_order', { ascending: true }),
      supabaseServer.from('prizes').select('*').eq('event_id', event.id).order('display_order', { ascending: true }),
      supabaseServer.from('sponsors').select('*').eq('event_id', event.id).order('sort_order', { ascending: true }),
      supabaseServer.from('faqs').select('*').eq('event_id', event.id).order('sort_order', { ascending: true }),
      supabaseServer.from('organizers').select('*').eq('event_id', event.id).order('display_order', { ascending: true }),
      supabaseServer.from('team_members').select('*').eq('event_id', event.id).order('display_order', { ascending: true }),
      supabaseServer.from('ambassadors').select('*').eq('event_id', event.id).order('total_referrals', { ascending: false }),
      supabaseServer.from('admin_settings').select('sponsor_cta_visible, sponsor_cta_whatsapp_number, sponsor_cta_default_message').single(),
    ])

    return {
      event,
      tracks: tracksResponse.data?.length ? tracksResponse.data : mockEventTracks,
      timeline: timelineResponse.data?.length ? timelineResponse.data : mockTimeline,
      prizes: prizesResponse.data?.length ? prizesResponse.data : mockPrizes,
      sponsors: sponsorsResponse.data?.length ? sponsorsResponse.data : mockSponsors,
      faqs: faqsResponse.data?.length ? faqsResponse.data : mockFAQs,
      team: teamResponse.data?.length ? teamResponse.data : mockTeam,
      ambassadors: ambassadorsResponse.data?.length ? ambassadorsResponse.data : [],
      contacts: organizersResponse.data?.length
        ? organizersResponse.data.map((organizer: any) => ({
            name: organizer.name,
            role: organizer.role,
            email: organizer.email,
            phone: organizer.phone,
          }))
        : EVENT_DATA.contacts,
      highlights: EVENT_DATA.highlights,
      adminSettings: {
    ...fallbackOverview.adminSettings,
    ...adminSettingsResponse.data,
  },
    }
  } catch (error) {
    console.error('Public data fetch failed:', error)
    return fallbackOverview
  }
}
