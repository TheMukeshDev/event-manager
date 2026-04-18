import { supabaseServer } from './supabase-server'

export interface Event {
  id: string
  name: string
  slug: string
  description?: string
  event_type?: string
  mode?: 'online' | 'offline' | 'hybrid'
  registration_type?: 'free' | 'paid'
  registration_fee?: number
  registration_start?: string
  registration_end?: string
  event_start?: string
  event_end?: string
  status?: 'draft' | 'published' | 'completed' | 'archived'
  registration_link?: string
  external_platform_link?: string
  whatsapp_community_link?: string
  is_whatsapp_mandatory?: boolean
  rules_text?: string
  certificate_rules_text?: string
  certificate_id_prefix?: string
  referral_threshold?: number
  venue_or_meeting_link?: string
  max_participants?: number
  contact_email?: string
  is_visible?: boolean
  is_home_event?: boolean
  created_at?: string
  updated_at?: string
}

const defaultEvent: Partial<Event> = {
  name: '',
  slug: '',
  description: '',
  event_type: 'technical',
  mode: 'online',
  registration_type: 'free',
  registration_fee: 0,
  status: 'draft',
  is_whatsapp_mandatory: false,
  referral_threshold: 10,
  is_visible: true,
}

let eventsCache: Event[] = []
let currentEventId: string | null = null
let initialized = false

export function getDefaultEvent() {
  return { ...defaultEvent }
}

export function getCurrentEventId(): string | null {
  return currentEventId
}

export function setCurrentEventId(id: string | null) {
  currentEventId = id
}

export async function fetchEvents(): Promise<Event[]> {
  if (!supabaseServer) {
    return eventsCache.length > 0 ? eventsCache : []
  }

  try {
    const { data, error } = await supabaseServer
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    eventsCache = (data || []) as Event[]
    
    if (eventsCache.length > 0 && !currentEventId) {
      const published = eventsCache.find(e => e.status === 'published')
      if (published) {
        currentEventId = published.id
      } else {
        currentEventId = eventsCache[0].id
      }
    }
    
    return eventsCache
  } catch (error) {
    console.error('Error fetching events:', error)
    return eventsCache
  }
}

export async function fetchEventById(id: string): Promise<Event | null> {
  if (!supabaseServer) {
    return eventsCache.find(e => e.id === id) || null
  }

  try {
    const { data, error } = await supabaseServer
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Event
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}

export async function createEvent(eventData: Partial<Event>): Promise<Event | null> {
  if (!supabaseServer) {
    const newEvent: Event = {
      ...defaultEvent,
      ...eventData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Event
    eventsCache.unshift(newEvent)
    return newEvent
  }

  try {
    const { data, error } = await supabaseServer
      .from('events')
      .insert(eventData)
      .select()
      .single()

    if (error) throw error

    eventsCache.unshift(data as Event)
    return data as Event
  } catch (error) {
    console.error('Error creating event:', error)
    return null
  }
}

export async function updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
  if (!supabaseServer) {
    const index = eventsCache.findIndex(e => e.id === id)
    if (index !== -1) {
      eventsCache[index] = { ...eventsCache[index], ...eventData, updated_at: new Date().toISOString() }
      return eventsCache[index]
    }
    return null
  }

  try {
    const { data, error } = await supabaseServer
      .from('events')
      .update({ ...eventData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    const index = eventsCache.findIndex(e => e.id === id)
    if (index !== -1) {
      eventsCache[index] = data as Event
    }

    return data as Event
  } catch (error) {
    console.error('Error updating event:', error)
    return null
  }
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (!supabaseServer) {
    eventsCache = eventsCache.filter(e => e.id !== id)
    return true
  }

  try {
    const { error } = await supabaseServer
      .from('events')
      .delete()
      .eq('id', id)

    if (error) throw error

    eventsCache = eventsCache.filter(e => e.id !== id)
    return true
  } catch (error) {
    console.error('Error deleting event:', error)
    return false
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (!supabaseServer) {
    return eventsCache.find(e => e.slug === slug) || null
  }

  try {
    const { data, error } = await supabaseServer
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as Event
  } catch (error) {
    console.error('Error fetching event by slug:', error)
    return null
  }
}

export function getActiveEvent(): Event | null {
  if (!currentEventId) return null
  return eventsCache.find(e => e.id === currentEventId) || null
}

export function getHomeEvent(): Event | null {
  return eventsCache.find(e => e.is_home_event === true) || null
}

export async function setHomeEvent(id: string): Promise<boolean> {
  if (!supabaseServer) {
    eventsCache.forEach(e => {
      e.is_home_event = e.id === id
    })
    currentEventId = id
    return true
  }

  try {
    const allEvents = await supabaseServer.from('events').select('id')
    for (const event of allEvents.data || []) {
      await supabaseServer.from('events').update({ is_home_event: false }).eq('id', event.id)
    }
    await supabaseServer.from('events').update({ is_home_event: true }).eq('id', id)
    
    eventsCache.forEach(e => {
      e.is_home_event = e.id === id
    })
    currentEventId = id
    return true
  } catch (error) {
    console.error('Error setting home event:', error)
    return false
  }
}

export function getEventSettings(event: Event | null): Record<string, any> {
  if (!event) return {}
  
  return {
    registration_link: event.registration_link || '',
    whatsapp_community_link: event.whatsapp_community_link || '',
    is_whatsapp_join_mandatory: event.is_whatsapp_mandatory || false,
    certificate_rules_text: event.certificate_rules_text || '',
    certificate_id_prefix: event.certificate_id_prefix || '',
    referral_threshold: event.referral_threshold || 10,
    rules_text: event.rules_text || '',
  }
}