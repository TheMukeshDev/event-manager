import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const { name, email, message } = await request.json()

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: 'All contact fields are required.' }, { status: 400 })
  }

  const { data, error } = await supabaseServer
    .from('contact_messages')
    .insert([
      {
        name,
        email,
        message,
        status: 'new',
      },
    ])
    .select()
    .single()

  if (error || !data) {
    console.error('Contact submission failed:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Unable to submit contact request.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
