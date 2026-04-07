import { supabaseServer } from './supabase-server'
import { EVENT_DATA } from './event-data'
import {
  mockEvent,
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
  contacts: typeof EVENT_DATA.contacts
  highlights: typeof EVENT_DATA.highlights
  adminSettings: {
    sponsor_cta_visible: boolean
    sponsor_cta_whatsapp_number: string
    sponsor_cta_default_message: string
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
  highlights: EVENT_DATA.highlights,
  adminSettings: {
    sponsor_cta_visible: true,
    sponsor_cta_whatsapp_number: '919771894062',
    sponsor_cta_default_message: 'Hello Mukesh Kumar, I am interested in sponsoring your event. Please share the sponsorship details, audience reach, and collaboration opportunities.'
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
      registeredCount: eventResponse.data?.registeredCount ?? EVENT_DATA.registeredCount,
      venue: eventResponse.data?.venue ?? EVENT_DATA.venue,
      mode: eventResponse.data?.mode ?? EVENT_DATA.mode,
      eventType: eventResponse.data?.eventType ?? EVENT_DATA.eventType,
      questions: eventResponse.data?.questions ?? EVENT_DATA.questions,
      duration: eventResponse.data?.duration ?? EVENT_DATA.duration,
      highlights: EVENT_DATA.highlights,
    }

    const [tracksResponse, timelineResponse, prizesResponse, sponsorsResponse, faqsResponse, organizersResponse, teamResponse, adminSettingsResponse] = await Promise.all([
      supabaseServer.from('event_tracks').select('*').eq('event_id', event.id).order('display_order', { ascending: true }),
      supabaseServer.from('timeline_items').select('*').eq('event_id', event.id).order('display_order', { ascending: true }),
      supabaseServer.from('prizes').select('*').eq('event_id', event.id).order('display_order', { ascending: true }),
      supabaseServer.from('sponsors').select('*').eq('event_id', event.id).order('sort_order', { ascending: true }),
      supabaseServer.from('faqs').select('*').eq('event_id', event.id).order('sort_order', { ascending: true }),
      supabaseServer.from('organizers').select('*').eq('event_id', event.id).order('display_order', { ascending: true }),
      supabaseServer.from('team_members').select('*').eq('event_id', event.id).order('display_order', { ascending: true }),
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
      contacts: organizersResponse.data?.length
        ? organizersResponse.data.map((organizer: any) => ({
            name: organizer.name,
            role: organizer.role,
            email: organizer.email,
            phone: organizer.phone,
          }))
        : EVENT_DATA.contacts,
      highlights: EVENT_DATA.highlights,
      adminSettings: adminSettingsResponse.data ?? fallbackOverview.adminSettings,
    }
  } catch (error) {
    console.error('Public data fetch failed:', error)
    return fallbackOverview
  }
}
