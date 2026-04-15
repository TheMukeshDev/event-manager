import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-service'
import { 
  getCertificates, 
  createBulkParticipation, 
  generatePreviewHtml, 
  updateSentStatus, 
  deleteCertificates,
  type CertificateRecord,
  type BulkCreateResult 
} from '@/lib/certificate-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters: any = {}
    const getStatsOnly = searchParams.get('stats') === 'true'

    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const sent = searchParams.get('sent_status')
    const rank = searchParams.get('rank')
    const event = searchParams.get('event')
    const limit = getStatsOnly ? 10000 : (Number(searchParams.get('limit')) || 50)
    const offset = Number(searchParams.get('offset')) || 0

    if (search) filters.search = search
    if (type) filters.type = type
    if (status) filters.status = status
    if (sent !== null) filters.sent_status = sent === 'true'
    if (rank) filters.rank = Number(rank)
    if (event) filters.event = event
    filters.limit = limit
    filters.offset = offset

    const { data, count } = await getCertificates(filters)

    if (getStatsOnly && data) {
      return NextResponse.json({
        totalImported: count || 0,
        totalCertificates: count || 0,
        participation: data.filter((c: CertificateRecord) => c.certificate_type === 'participation').length,
        winner: data.filter((c: CertificateRecord) => ['winner', 'runner-up', 'second-runner-up'].includes(c.certificate_type)).length,
        sent: data.filter((c: CertificateRecord) => c.sent_status).length,
        pending: data.filter((c: CertificateRecord) => !c.sent_status && c.status === 'valid').length,
        failed: 0
      })
    }

    return NextResponse.json({
      data,
      count,
      filters
    })
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json({ data: [], count: 0 }, { status: 500 })
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

      // Check for duplicate emails
      const emails = records.map((r: any) => r.email)
      const { data: existingEmails } = await supabase
        .from('certificate_records')
        .select('email')
        .in('email', emails)

      const dupEmails = existingEmails?.map((e: any) => e.email) || []
      const validRecords = records.filter((r: any) => !dupEmails.includes(r.email))

      if (validRecords.length === 0) {
        return NextResponse.json({ success: false, error: 'All records are duplicates' }, { status: 400 })
      }

      const certificates: any[] = []
      let serialNumber = 1

      const { count: existingCount } = await supabase
        .from('certificate_records')
        .select('*', { count: 'exact', head: true })

      serialNumber = (existingCount || 0) + 1

      for (const record of validRecords) {
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
          score: record.score || null,
          rank: record.rank || null,
          certificate_type: certificateType,
          status: 'valid',
          sent_status: false,
          template_used: certificateType
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
        imported: inserted?.length || 0,
        duplicates: records.length - validRecords.length,
        certificates: inserted
      })
    } else if (action === 'create-all-participation') {
      const mode = data?.mode || 'participation'
      const result = await createBulkParticipation(mode)
      return NextResponse.json({ success: true, ...result })
    } else if (action === 'preview-html') {
      const { certificateId } = data
      const html = await generatePreviewHtml(certificateId)
      return NextResponse.json({ success: true, html })
    } else if (action === 'bulk-send') {
      const { certificateIds } = data
      const now = new Date().toISOString()
      const result = await updateSentStatus(certificateIds, true, now)
      return NextResponse.json({ success: result.success, updated: certificateIds.length })
    } else if (action === 'bulk-delete') {
      const { certificateIds } = data
      const result = await deleteCertificates(certificateIds)
      return NextResponse.json({ success: true, ...result })
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
