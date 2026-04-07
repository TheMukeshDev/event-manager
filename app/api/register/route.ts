import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const body = await request.json()
  const { fullName, email, phone, college, stream, eventId, whatsappJoined } = body

  if (!fullName || !email || !phone || !college || !eventId) {
    return NextResponse.json({ success: false, error: 'Missing required registration fields.' }, { status: 400 })
  }

  try {
    // Check if admin settings require WhatsApp join
    const { data: settings } = await supabaseServer
      .from('admin_settings')
      .select('is_whatsapp_join_mandatory')
      .single()

    if (settings?.is_whatsapp_join_mandatory && !whatsappJoined) {
      return NextResponse.json({
        success: false,
        error: 'You must join the WhatsApp community to register for this event.'
      }, { status: 400 })
    }

    // Create or update user
    const { data: user, error: userError } = await supabaseServer
      .from('users')
      .upsert({
        email,
        full_name: fullName,
        phone,
        college,
        stream: stream || 'Not specified'
      }, {
        onConflict: 'email'
      })
      .select()
      .single()

    if (userError || !user) {
      console.error('User creation/update failed:', userError)
      return NextResponse.json({ success: false, error: 'Unable to create user account.' }, { status: 500 })
    }

    // Check if already registered
    const { data: existingReg } = await supabaseServer
      .from('registrations')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single()

    if (existingReg) {
      return NextResponse.json({ success: false, error: 'You are already registered for this event.' }, { status: 400 })
    }

    // Create registration
    const { data, error } = await supabaseServer
      .from('registrations')
      .insert([
        {
          user_id: user.id,
          event_id: eventId,
          whatsapp_joined: whatsappJoined || false,
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
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 })
  }
}
