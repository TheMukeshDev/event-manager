import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('sponsors')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching sponsors:', error)
      return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error in sponsors GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, type, logo_url, website, description, tier, is_visible, sort_order } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Get the first event ID (assuming single event for now)
    const { data: event } = await supabaseServer
      .from('events')
      .select('id')
      .limit(1)
      .single()

    if (!event) {
      return NextResponse.json({ error: 'No event found' }, { status: 404 })
    }

    const { data, error } = await supabaseServer
      .from('sponsors')
      .insert({
        event_id: event.id,
        name,
        type: type || 'Partner',
        logo_url,
        website,
        description,
        tier: tier || 'silver',
        is_visible: is_visible !== false,
        sort_order: sort_order || 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating sponsor:', error)
      return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in sponsors POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}