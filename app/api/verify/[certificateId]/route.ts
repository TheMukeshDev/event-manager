import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params

    const { data: cert, error } = await supabaseServer
      .from('certificate_records')
      .select('*')
      .eq('certificate_id', certificateId)
      .single()

    if (error || !cert) {
      return NextResponse.json({
        valid: false,
        status: 'NOT_FOUND',
        message: 'Certificate not found'
      })
    }

    // Increment verification count
    const currentCount = cert.verification_count || 0
    await supabaseServer
      .from('certificate_records')
      .update({
        verification_count: currentCount + 1,
        last_verified_at: new Date().toISOString()
      })
      .eq('certificate_id', certificateId)

    const status = cert.status === 'valid' ? 'VALID' : 'REVOKED'

    return NextResponse.json({
      valid: cert.status === 'valid',
      status,
      certificate: {
        certificateId: cert.certificate_id,
        recipientName: cert.name,
        eventName: cert.event,
        certificateType: cert.certificate_type,
        score: cert.score,
        rank: cert.rank,
        issueDate: cert.imported_at ? new Date(cert.imported_at).toLocaleDateString() : 'N/A',
        issuedBy: 'Tech Hub BBS',
        verificationCount: currentCount + 1
      }
    })
  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.json({
      valid: false,
      status: 'ERROR',
      message: error.message || 'Verification failed'
    }, { status: 500 })
  }
}