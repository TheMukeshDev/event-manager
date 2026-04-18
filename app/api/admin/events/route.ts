import { NextRequest, NextResponse } from 'next/server'
import { 
  fetchEvents, 
  fetchEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  getCurrentEventId,
  setCurrentEventId,
  setHomeEvent,
  getEventBySlug 
} from '@/lib/events'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('id')
    const slug = searchParams.get('slug')
    const currentId = searchParams.get('current')

    if (currentId === 'true') {
      const current = getCurrentEventId()
      return NextResponse.json({ currentEventId: current })
    }

    if (eventId) {
      const event = await fetchEventById(eventId)
      return NextResponse.json(event)
    }

    if (slug) {
      const event = await getEventBySlug(slug)
      return NextResponse.json(event)
    }

    const events = await fetchEvents()
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error in events GET API:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'create') {
      const event = await createEvent(data)
      if (event) {
        return NextResponse.json({ success: true, event })
      }
      return NextResponse.json({ success: false, error: 'Failed to create event' }, { status: 400 })
    }

    if (action === 'update') {
      if (!data.id) {
        return NextResponse.json({ success: false, error: 'Event ID required' }, { status: 400 })
      }
      const event = await updateEvent(data.id, data)
      if (event) {
        return NextResponse.json({ success: true, event })
      }
      return NextResponse.json({ success: false, error: 'Failed to update event' }, { status: 400 })
    }

    if (action === 'delete') {
      if (!data.id) {
        return NextResponse.json({ success: false, error: 'Event ID required' }, { status: 400 })
      }
      const success = await deleteEvent(data.id)
      return NextResponse.json({ success })
    }

    if (action === 'setCurrent') {
      if (!data.id) {
        return NextResponse.json({ success: false, error: 'Event ID required' }, { status: 400 })
      }
      setCurrentEventId(data.id)
      return NextResponse.json({ success: true, currentEventId: data.id })
    }

    if (action === 'setHome') {
      if (!data.id) {
        return NextResponse.json({ success: false, error: 'Event ID required' }, { status: 400 })
      }
      const success = await setHomeEvent(data.id)
      return NextResponse.json({ success, homeEventId: data.id })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in events POST API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}