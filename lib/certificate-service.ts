import { supabaseServer } from './supabase-server'
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
  best_time?: string | null
  certificate_type: string
  status: string
  sent_status: boolean
  template_used?: string | null
  template_id?: string | null
  generated_at?: string | null
  imported_at: string
  sent_at?: string | null
  verification_count?: number
  last_verified_at?: string | null
}

export interface CertificateRules {
  excellenceMinScore: number
  appreciationMinScore: number
  maxExcellence?: number
  useRankBased?: boolean
}

export interface BulkCreateResult {
  created: number
  updated: number
  skipped: number
  failed: (number | string)[]
  total: number
}

export interface SendResult {
  sent: number
  failed: (number | string)[]
  skipped: number
}

// Default certificate rules
const DEFAULT_RULES: CertificateRules = {
  excellenceMinScore: 19,
  appreciationMinScore: 15,
  maxExcellence: undefined,
  useRankBased: false
}

// Helper to determine certificate type based on score
export function determineCertificateType(score: number | null, rules: CertificateRules = DEFAULT_RULES): string {
  if (score === null || score === undefined) {
    return 'participation'
  }
  
  if (score >= rules.excellenceMinScore) {
    return 'excellence'
  }
  
  if (score >= rules.appreciationMinScore) {
    return 'appreciation'
  }
  
  return 'participation'
}

// Get certificate title based on type
export function getCertificateTitle(certificateType: string): string {
  switch (certificateType) {
    case 'excellence':
      return 'CERTIFICATE OF EXCELLENCE'
    case 'appreciation':
      return 'CERTIFICATE OF APPRECIATION'
    case 'participation':
      return 'CERTIFICATE OF PARTICIPATION'
    case 'winner':
      return 'CERTIFICATE OF WINNER'
    case 'runner-up':
      return 'CERTIFICATE OF RUNNER-UP'
    case 'second-runner-up':
      return 'CERTIFICATE OF SECOND RUNNER-UP'
    default:
      return 'CERTIFICATE OF PARTICIPATION'
  }
}

// Get template category based on certificate type
export function getTemplateCategory(certificateType: string): string {
  switch (certificateType) {
    case 'excellence':
      return 'excellence'
    case 'appreciation':
      return 'appreciation'
    case 'winner':
    case 'runner-up':
    case 'second-runner-up':
      return 'excellence'
    default:
      return 'participation'
  }
}

// Bulk create certificates with score-based type assignment
export async function createCertificatesWithScores(rules: CertificateRules = DEFAULT_RULES): Promise<BulkCreateResult> {
  try {
    const { data: records, error } = await supabaseServer
      .from('certificate_records')
      .select('*')
      .is('certificate_type', null)
      .or('status.is.null,status.eq.invalid')

    if (error) throw error

    if (!records || records.length === 0) {
      return { created: 0, updated: 0, skipped: 0, failed: [], total: 0 }
    }

    let created = 0
    let updated = 0
    let skipped = 0
    const failed: string[] = []

    // Sort by score (descending) for excellence limit
    let sortedRecords = [...records].sort((a, b) => (b.score || 0) - (a.score || 0))
    
    // If using rank-based, also sort by rank
    if (rules.useRankBased) {
      sortedRecords = sortedRecords.sort((a, b) => {
        const scoreDiff = (b.score || 0) - (a.score || 0)
        if (scoreDiff !== 0) return scoreDiff
        return (a.best_time || '').localeCompare(b.best_time || '')
      })
    }

    const excellenceCount = rules.maxExcellence ? Math.min(rules.maxExcellence, sortedRecords.length) : sortedRecords.length

    for (let i = 0; i < sortedRecords.length; i++) {
      try {
        const record = sortedRecords[i]
        
        // Check if certificate already exists
        const { data: existing } = await supabaseServer
          .from('certificate_records')
          .select('id')
          .eq('email', record.email)
          .not('certificate_type', 'is', null)
          .eq('status', 'valid')
          .maybeSingle()

        if (existing) {
          skipped++
          continue
        }

        // Determine certificate type based on score
        let certificateType: string
        if (i < excellenceCount && record.score && record.score >= rules.excellenceMinScore) {
          certificateType = 'excellence'
        } else if (record.score && record.score >= rules.appreciationMinScore) {
          certificateType = 'appreciation'
        } else {
          certificateType = 'participation'
        }

        const isUpdate = record.certificate_type !== null

        const { error: upsertError } = isUpdate 
          ? await supabaseServer
              .from('certificate_records')
              .update({
                certificate_type: certificateType,
                status: 'valid',
                template_used: certificateType,
                generated_at: new Date().toISOString()
              })
              .eq('id', record.id)
          : await supabaseServer
              .from('certificate_records')
              .insert({
                certificate_id: `THBBS-2026-${String(i + 1).padStart(4, '0')}`,
                name: record.name,
                email: record.email,
                event: record.event || 'TechQuiz 2026',
                score: record.score,
                rank: record.rank,
                best_time: record.best_time,
                certificate_type: certificateType,
                status: 'valid',
                template_used: certificateType,
                imported_at: new Date().toISOString(),
                generated_at: new Date().toISOString()
              })

        if (upsertError) throw upsertError

        if (isUpdate) updated++
        else created++
      } catch (err: any) {
        console.error(`Failed to process cert for record:`, err)
        failed.push(err.message || 'Unknown error')
      }
    }

    return {
      created,
      updated,
      skipped,
      failed,
      total: records.length
    }
  } catch (error) {
    console.error('Bulk certificate creation error:', error)
    throw error
  }
}

// Legacy function for backward compatibility
export async function createBulkParticipation(mode: 'participation' | 'result-based' = 'participation'): Promise<BulkCreateResult> {
  if (mode === 'result-based') {
    return createCertificatesWithScores(DEFAULT_RULES)
  }

  try {
    const { data: records, error } = await supabaseServer
      .from('certificate_records')
      .select('*')
      .or('certificate_type.ne.participation,status.eq.invalid,status.is.null')

    if (error) throw error

    if (!records || records.length === 0) {
      return { created: 0, updated: 0, skipped: 0, failed: [], total: 0 }
    }

    let created = 0
    let skipped = 0
    const failed: string[] = []

    for (const record of records) {
      try {
        const { data: existing } = await supabaseServer
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

        const { error: updateError } = await supabaseServer
          .from('certificate_records')
          .update({
            certificate_type: 'participation',
            status: 'valid',
            template_used: 'participation'
          })
          .eq('id', record.id)

        if (updateError) throw updateError

        created++
      } catch (err: any) {
        console.error(`Failed to create cert for ${record.email}:`, err)
        failed.push(record.email)
      }
    }

    return {
      created,
      updated: 0,
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
  minScore?: number
  maxScore?: number
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: string
}): Promise<{ data: CertificateRecord[], count: number }> {
  let query = supabaseServer
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
  if (filters.minScore !== undefined) query = query.gte('score', filters.minScore)
  if (filters.maxScore !== undefined) query = query.lte('score', filters.maxScore)

  const sortField = filters.sortBy || 'score'
  const sortAsc = filters.sortOrder !== 'desc'

  if (filters.limit) query = query.limit(filters.limit).range(filters.offset || 0, (filters.offset || 0) + filters.limit! - 1)

  const { data, count, error } = await query.order(sortField, { ascending: sortAsc })

  if (error) throw error

  return { data: data as CertificateRecord[], count: count || 0 }
}

// Get certificate statistics
export async function getCertificateStats(): Promise<{
  totalImported: number
  totalCertificates: number
  excellence: number
  appreciation: number
  participation: number
  sent: number
  pending: number
  failed: number
  verified: number
}> {
  try {
    const { data: records, error } = await supabaseServer
      .from('certificate_records')
      .select('*')

    if (error) throw error

    const allRecords = records || []

    return {
      totalImported: allRecords.length,
      totalCertificates: allRecords.filter(r => r.certificate_type && r.status === 'valid').length,
      excellence: allRecords.filter(r => r.certificate_type === 'excellence').length,
      appreciation: allRecords.filter(r => r.certificate_type === 'appreciation').length,
      participation: allRecords.filter(r => r.certificate_type === 'participation').length,
      sent: allRecords.filter(r => r.sent_status).length,
      pending: allRecords.filter(r => !r.sent_status && r.status === 'valid').length,
      failed: allRecords.filter(r => r.status === 'invalid').length,
      verified: allRecords.filter(r => r.verification_count && r.verification_count > 0).length
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalImported: 0,
      totalCertificates: 0,
      excellence: 0,
      appreciation: 0,
      participation: 0,
      sent: 0,
      pending: 0,
      failed: 0,
      verified: 0
    }
  }
}

// Update sent status
export async function updateSentStatus(certificateIds: string[], sent: boolean, sentAt?: string): Promise<{ success: boolean }> {
  const { error } = await supabaseServer
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
  const { data } = await supabaseServer
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
  const { count } = await supabaseServer
    .from('certificate_records')
    .delete()
    .in('certificate_id', certificateIds)

  return { deleted: count || 0 }
}

// Get templates
export async function getTemplates(): Promise<any[]> {
  const { data, error } = await supabaseServer
    .from('certificate_templates')
    .select('*')
    .order('uploaded_at', { ascending: false })

  if (error) throw error
  return data || []
}