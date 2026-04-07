import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const { certificateId } = await request.json()

  if (!certificateId) {
    return NextResponse.json({ success: false, error: 'Certificate ID is required.' }, { status: 400 })
  }

  const { data, error } = await supabaseServer
    .from('certificates')
    .select('certificate_id, recipient_name, certificate_type, position_or_role, issue_date, issuer_name, verification_status, event_id')
    .eq('certificate_id', certificateId)
    .single()

  if (error || !data) {
    return NextResponse.json({ success: false, error: 'Certificate not found.' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data })
}
