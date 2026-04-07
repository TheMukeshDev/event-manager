import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const body = await request.json()
  const { fullName, email, phone, college, eventId } = body

  if (!fullName || !email || !phone || !college || !eventId) {
    return NextResponse.json({ success: false, error: 'Missing required registration fields.' }, { status: 400 })
  }

  const { data, error } = await supabaseServer
    .from('registrations')
    .insert([
      {
        event_id: eventId,
        full_name: fullName,
        email,
        phone,
        college_name: college,
        status: 'registered',
      },
    ])
    .select()
    .single()

  if (error || !data) {
    console.error('Registration failed:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Unable to register for the event.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
