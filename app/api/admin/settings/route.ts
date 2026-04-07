import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { registration_link, whatsapp_community_link, is_whatsapp_join_mandatory, certificate_rules_text, certificate_id_prefix, sponsor_cta_whatsapp_number, sponsor_cta_default_message, sponsor_cta_visible } = body

    // Update admin settings
    const { error } = await supabaseServer
      .from('admin_settings')
      .upsert({
        id: 1, // Single row for settings
        registration_link,
        whatsapp_community_link,
        is_whatsapp_join_mandatory,
        certificate_rules_text,
        certificate_id_prefix,
        sponsor_cta_whatsapp_number,
        sponsor_cta_default_message,
        sponsor_cta_visible,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error updating admin settings:', error)
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in admin settings API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('admin_settings')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching admin settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    return NextResponse.json(data || {
      registration_link: '',
      whatsapp_community_link: 'https://chat.whatsapp.com/Hc1zaz52LdOAh6kM5NHREA',
      is_whatsapp_join_mandatory: true,
      certificate_rules_text: 'Certificates are issued only to valid registered participants who attend/attempt the event and follow all event rules.',
      certificate_id_prefix: 'BBSCET-TQ-2026',
      sponsor_cta_whatsapp_number: '919771894062',
      sponsor_cta_default_message: 'Hello Mukesh Kumar, I am interested in sponsoring your event. Please share the sponsorship details, audience reach, and collaboration opportunities.',
      sponsor_cta_visible: true
    })
  } catch (error) {
    console.error('Error in admin settings GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}