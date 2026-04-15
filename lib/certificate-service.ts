import { supabase } from './supabase-service'
import { getCertificateTemplate } from './certificate-template'

// Types
export interface CertificateRecord {
  id: string
  certificate_id: string
  name: string
  email: string
  event: string
  rank: number | null
  score: number | null
  certificate_type: string
  status: string
  sent_status: boolean
  template_used?: string | null
  generated_at?: string | null
  imported_at: string
  sent_at: string | null
}

export interface BulkCreateResult {
  created: number
  skipped: number
  failed: number[]
  total: number
}

export interface SendResult {
  sent: number
  failed: number[]
  skipped: number
}

// Bulk create participation certificates for all eligible records
export async function createBulkParticipation(mode: 'participation' | 'result-based' = 'participation'): Promise<BulkCreateResult> {
  try {
    let query = supabase
      .from('certificate_records')
      .select('*')

    if (mode === 'participation') {
      query = query.or('certificate_type.ne.participation,status.eq.invalid,status.is.null')
    } else {
      query = query.eq('status', 'valid')
    }

    const { data: records, error } = await query

    if (error) throw error

    if (!records || records.length === 0) {
      return { created: 0, skipped: 0, failed: [], total: 0 }
    }

    let created = 0
    let skipped = 0
    const failed: number[] = []

    for (const record of records) {
      try {
        if (mode === 'participation') {
          const { data: existing } = await supabase
            .from('certificate_records')
            .select('id')
            .eq('email', record.email)
            .eq('certificate_type', 'participation')
            .eq('status', 'valid')
            .maybeSingle()

          if (existing) {
            skipped++
            continue
          }

          const { error: updateError } = await supabase
            .from('certificate_records')
            .update({
              certificate_type: 'participation',
              status: 'valid',
              template_used: 'participation'
            })
            .eq('id', record.id)

          if (updateError) throw updateError
        } else {
          let certificateType = 'participation'
          if (record.rank === 1) certificateType = 'winner'
          else if (record.rank === 2) certificateType = 'runner-up'
          else if (record.rank === 3) certificateType = 'second-runner-up'

          const { error: updateError } = await supabase
            .from('certificate_records')
            .update({
              certificate_type: certificateType,
              status: 'valid',
              template_used: certificateType
            })
            .eq('id', record.id)

          if (updateError) throw updateError
        }

        created++
      } catch (err) {
        console.error(`Failed to create cert for ${record.email}:`, err)
        failed.push(record.id)
      }
    }

    return {
      created,
      skipped,
      failed,
      total: records.length
    }
  } catch (error) {
    console.error('Bulk participation error:', error)
    throw error
  }
}

// Get filtered certificates
export async function getCertificates(filters: {
  search?: string
  type?: string
  status?: string
  sent_status?: boolean
  rank?: number
  event?: string
  limit?: number
  offset?: number
}): Promise<{ data: CertificateRecord[], count: number }> {
  let query = supabase
    .from('certificate_records')
    .select('*', { count: 'exact' })

  if (filters.search) {
    query = query.or(`certificate_id.ilike.%${filters.search}%,name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }
  if (filters.type) query = query.eq('certificate_type', filters.type)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.sent_status !== undefined) query = query.eq('sent_status', filters.sent_status)
  if (filters.rank) query = query.eq('rank', filters.rank)
  if (filters.event) query = query.eq('event', filters.event)

  if (filters.limit) query = query.limit(filters.limit).range(filters.offset || 0, (filters.offset || 0) + filters.limit! - 1)

  const { data, count, error } = await query.order('imported_at', { ascending: false })

  if (error) throw error

  return { data: data as CertificateRecord[], count: count || 0 }
}

// Update sent status
export async function updateSentStatus(certificateIds: string[], sent: boolean, sentAt?: string): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('certificate_records')
    .update({ 
      sent_status: sent,
      ...(sentAt && { sent_at: sentAt })
    })
    .in('certificate_id', certificateIds)

  return { success: !error }
}

// Generate preview HTML
export async function generatePreviewHtml(certificateId: string): Promise<string> {
  const { data } = await supabase
    .from('certificate_records')
    .select('*')
    .eq('certificate_id', certificateId)
    .single() as { data: CertificateRecord | null }

  if (!data) throw new Error('Certificate not found')

  const templateData = {
    name: data.name,
    event: data.event,
    rank: data.rank,
    score: data.score,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    certificateId: data.certificate_id,
    certificateType: data.certificate_type
  }

  return getCertificateTemplate(data.certificate_type, templateData)
}

// Delete bulk
export async function deleteCertificates(certificateIds: string[]): Promise<{ deleted: number }> {
  const { count } = await supabase
    .from('certificate_records')
    .delete()
    .in('certificate_id', certificateIds)

  return { deleted: count || 0 }
}
