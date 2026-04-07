import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const { userId, eventId, certificateType } = await request.json()

    if (!userId || !eventId || !certificateType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get admin settings for certificate ID prefix
    const { data: settings } = await supabaseServer
      .from('admin_settings')
      .select('certificate_id_prefix')
      .single()

    const prefix = settings?.certificate_id_prefix || 'BBSCET-TQ-2026'

    // Get user and event details
    const { data: user } = await supabaseServer
      .from('users')
      .select('full_name, email')
      .eq('id', userId)
      .single()

    const { data: event } = await supabaseServer
      .from('events')
      .select('name')
      .eq('id', eventId)
      .single()

    if (!user || !event) {
      return NextResponse.json({ error: 'User or event not found' }, { status: 404 })
    }

    // Generate certificate ID based on type
    const typeCode = certificateType === 'participation' ? 'P' :
                    certificateType === 'winner' ? 'W1' :
                    certificateType === 'runner-up' ? 'W2' :
                    certificateType === 'third-place' ? 'W3' : 'P'

    // Get the next serial number for this type
    const { data: existingCerts } = await supabaseServer
      .from('certificates')
      .select('certificate_id')
      .ilike(`certificate_id`, `${prefix}-${typeCode}-%`)
      .order('certificate_id', { ascending: false })
      .limit(1)

    let serialNumber = 1
    if (existingCerts && existingCerts.length > 0) {
      const lastCert = existingCerts[0]
      const parts = lastCert.certificate_id.split('-')
      if (parts.length >= 3) {
        const lastSerial = parseInt(parts[parts.length - 1])
        serialNumber = lastSerial + 1
      }
    }

    const certificateId = `${prefix}-${typeCode}-${serialNumber.toString().padStart(3, '0')}`

    // Create certificate record
    const { data, error } = await supabaseServer
      .from('certificates')
      .insert({
        certificate_id: certificateId,
        user_id: userId,
        event_id: eventId,
        event_name: event.name,
        certificate_type: certificateType,
        issue_date: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating certificate:', error)
      return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      certificate: data,
      certificateId: certificateId
    })
  } catch (error) {
    console.error('Error in certificate generation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}