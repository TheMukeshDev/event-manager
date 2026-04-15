import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { 
  getCertificates, 
  createBulkParticipation,
  createCertificatesWithScores,
  determineCertificateType,
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
    const sortBy = searchParams.get('sortBy') || 'imported_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = getStatsOnly ? 10000 : (Number(searchParams.get('limit'))) || 50
    const offset = Number(searchParams.get('offset')) || 0

    if (search) filters.search = search
    if (type) filters.type = type
    if (status) filters.status = status
    if (sent !== null) filters.sent_status = sent === 'true'
    if (rank) filters.rank = Number(rank)
    if (event) filters.event = event
    filters.sortBy = sortBy
    filters.sortOrder = sortOrder
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
      const { records, mode } = data
      const updateExisting = mode === 'upsert' // Default: update existing records

      if (!records || !Array.isArray(records) || records.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No records to import' },
          { status: 400 }
        )
      }

      const emails = records.map((r: any) => r.email)
      const { data: existingRecords } = await supabaseServer
        .from('certificate_records')
        .select('id, email, name, score, rank, certificate_type')
        .in('email', emails)

      const existingMap = new Map(existingRecords?.map(r => [r.email, r]) || [])
      const newRecords: any[] = []
      const updateRecords: any[] = []
      let serialNumber = 1

      const { count: existingCount } = await supabaseServer
        .from('certificate_records')
        .select('*', { count: 'exact', head: true })

      serialNumber = (existingCount || 0) + 1

      for (const record of records) {
        const existing = existingMap.get(record.email)
        
        // Use normalized score and event from CSV preview
        const normalizedScore = record.normalizedScore ?? record.score ?? null
        const eventName = record.event || 'TechQuiz 2026'
        const certificateType = determineCertificateType(normalizedScore)

        if (existing && updateExisting) {
          updateRecords.push({
            id: existing.id,
            name: record.name,
            score: normalizedScore,
            rank: record.rank || null,
            certificate_type: certificateType,
            status: 'valid',
            template_used: certificateType
          })
        } else if (!existing) {
          const certificateId = `THBBS-2026-${String(serialNumber).padStart(4, '0')}`
          newRecords.push({
            certificate_id: certificateId,
            name: record.name,
            email: record.email,
            event: eventName,
            score: normalizedScore,
            rank: record.rank || null,
            certificate_type: certificateType,
            status: 'valid',
            sent_status: false,
            template_used: certificateType
          })
          serialNumber++
        }
      }

      let inserted: any[] = []
      let updated: any[] = []

      if (newRecords.length > 0) {
        const { data: insertedData, error: insertError } = await supabaseServer
          .from('certificate_records')
          .insert(newRecords)
          .select()
        if (insertError) throw insertError
        inserted = insertedData || []
      }

      if (updateRecords.length > 0) {
        for (const record of updateRecords) {
          const { error: updateError } = await supabaseServer
            .from('certificate_records')
            .update({
              name: record.name,
              score: record.score,
              rank: record.rank,
              certificate_type: record.certificate_type,
              status: record.status,
              template_used: record.template_used,
              imported_at: new Date().toISOString()
            })
            .eq('id', record.id)
          if (updateError) console.error('Update error:', updateError)
        }
        updated = updateRecords
      }

      return NextResponse.json({
        success: true,
        imported: inserted.length || 0,
        updated: updated.length || 0,
        skipped: records.length - newRecords.length - updateRecords.length,
        certificates: inserted
      })
    } else if (action === 'create-all-participation') {
      const mode = data?.mode || 'participation'
      const result = await createBulkParticipation(mode)
      return NextResponse.json({ success: true, ...result })
    } else if (action === 'create-all-with-scores') {
      const rules = data?.rules || { excellenceMinScore: 19, appreciationMinScore: 15 }
      const result = await createCertificatesWithScores(rules)
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
    } else if (action === 'update-record') {
      const { id, name, score, rank } = data
      
      if (!id) {
        return NextResponse.json({ success: false, error: 'Record ID required' }, { status: 400 })
      }

      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (score !== undefined) updateData.score = score
      if (rank !== undefined) updateData.rank = rank

      const { error } = await supabaseServer
        .from('certificate_records')
        .update(updateData)
        .eq('id', id)

      if (error) throw error

      return NextResponse.json({ success: true })
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
