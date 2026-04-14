import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-service'

interface CertificateRecord {
  id: string
  certificate_id: string
  name: string
  email: string
  event: string
  score: number | null
  rank: number | null
  certificate_type: string
  status: string
  sent_status: boolean
  imported_at: string
  sent_at: string | null
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('certificate_records')
      .select('*')
      .order('imported_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (action === 'import') {
      const { records } = data

      if (!records || !Array.isArray(records) || records.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No records to import' },
          { status: 400 }
        )
      }

      const certificates: Omit<CertificateRecord, 'id' | 'imported_at' | 'sent_at' | 'created_at' | 'updated_at'>[] = []

      let serialNumber = 1

      const { data: existingCount } = await supabase
        .from('certificate_records')
        .select('certificate_id', { count: 'exact', head: true })

      const count = existingCount?.length || 0
      serialNumber = count + 1

      for (const record of records) {
        const certificateId = `THBBS-2026-${String(serialNumber).padStart(4, '0')}`
        
        let certificateType = 'participation'
        if (record.rank === 1) certificateType = 'winner'
        else if (record.rank === 2) certificateType = 'runner-up'
        else if (record.rank === 3) certificateType = 'second-runner-up'

        certificates.push({
          certificate_id: certificateId,
          name: record.name,
          email: record.email,
          event: record.event || 'TechQuiz 2026',
          score: record.score,
          rank: record.rank,
          certificate_type: certificateType,
          status: 'valid',
          sent_status: false
        })

        serialNumber++
      }

      const { data: inserted, error: insertError } = await supabase
        .from('certificate_records')
        .insert(certificates)
        .select()

      if (insertError) throw insertError

      return NextResponse.json({
        success: true,
        count: inserted?.length || 0,
        certificates: inserted
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error processing certificate request:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
