import { supabaseServer } from './supabase-server'

function normalizeName(name: string) {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 15)
}

async function getFirstEventId() {
  const { data, error } = await supabaseServer
    .from('events')
    .select('id')
    .order('date', { ascending: true })
    .limit(1)
    .single()

  if (error || !data) {
    throw new Error('No event found')
  }

  return data.id
}

export async function generateUniqueReferralCode(fullName: string) {
  const base = normalizeName(fullName.split(' ')[0] || 'AMBASSADOR')
  let uniqueCode = ''

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    const suffix = attempt.toString().padStart(3, '0')
    uniqueCode = `CA-${base}-${suffix}`

    const { data, error } = await supabaseServer
      .from('ambassadors')
      .select('id')
      .eq('referral_code', uniqueCode)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message)
    }

    if (!data) {
      return uniqueCode
    }
  }

  return `CA-${base}-${Math.floor(Math.random() * 900 + 100)}`
}

export async function createAmbassadorApplication(payload: {
  full_name: string
  phone: string
  email: string
  college_name: string
  branch: string
  section: string
  year_or_semester: string
  city?: string
  state?: string
  why_fit_for_role: string
  prior_experience?: string
  social_profile_link?: string
  whatsapp_number?: string
  consent: boolean
}) {
  const eventId = await getFirstEventId()

  const { data, error } = await supabaseServer
    .from('ambassador_applications')
    .insert([
      {
        event_id: eventId,
        ...payload,
        status: 'pending',
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getAmbassadorApplicationList(status?: string) {
  const query = supabaseServer.from('ambassador_applications').select('*').order('created_at', { ascending: false })
  if (status) {
    query.eq('status', status)
  }
  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getApprovedAmbassadors(limit = 20) {
  const eventId = await getFirstEventId()
  const { data, error } = await supabaseServer
    .from('ambassadors')
    .select('*')
    .eq('event_id', eventId)
    .eq('status', 'approved')
    .order('valid_referral_count', { ascending: false })
    .order('updated_at', { ascending: true })
    .limit(limit)

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function findAmbassadorByCode(referralCode: string) {
  const { data, error } = await supabaseServer
    .from('ambassadors')
    .select('*')
    .eq('referral_code', referralCode)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message)
  }

  return data || null
}

export async function getAmbassadorDashboard(referralCode: string) {
  const ambassador = await findAmbassadorByCode(referralCode)
  if (!ambassador) {
    return null
  }

  const [{ data: referrals }, proofMeta] = await Promise.all([
    supabaseServer
      .from('ambassador_referrals')
      .select('*')
      .eq('ambassador_id', ambassador.id)
      .order('created_at', { ascending: false }),
    supabaseServer
      .from('ambassador_proofs')
      .select('*', { count: 'exact', head: true })
      .eq('ambassador_id', ambassador.id),
  ])

  return {
    ambassador,
    referrals: referrals || [],
    proofSubmissions: proofMeta.count || 0,
  }
}

export async function submitAmbassadorProof(data: {
  ambassador_id: string
  proof_description: string
  number_of_students_claimed: number
  referred_student_emails?: string[]
  file?: File
}) {
  let proofFileUrl: string | undefined

  if (data.file) {
    const storageKey = `ambassador-proofs/${crypto.randomUUID()}-${data.file.name}`
    const { error: uploadError } = await supabaseServer.storage
      .from('ambassador-proofs')
      .upload(storageKey, data.file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    proofFileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ambassador-proofs/${storageKey}`
  }

  const { data: proofData, error } = await supabaseServer
    .from('ambassador_proofs')
    .insert([
      {
        ambassador_id: data.ambassador_id,
        proof_file_url: proofFileUrl,
        proof_description: data.proof_description,
        number_of_students_claimed: data.number_of_students_claimed,
        referred_student_emails: data.referred_student_emails,
        status: 'pending',
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return proofData
}

export async function getLeaderboard(limit = 20) {
  const eventId = await getFirstEventId()
  const { data, error } = await supabaseServer
    .from('ambassadors')
    .select('*')
    .eq('event_id', eventId)
    .eq('status', 'approved')
    .order('valid_referral_count', { ascending: false })
    .order('updated_at', { ascending: true })
    .limit(limit)

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}
