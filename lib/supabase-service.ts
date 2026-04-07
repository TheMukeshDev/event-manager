import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Service functions for TechQuiz

// 1. User Registration
export async function registerUser(data: {
  email: string
  full_name: string
  phone: string
  college: string
  stream: string
}) {
  try {
    const adminEmails = [
      'mukeshkumar916241@gmail.com',
      'shwetatiwari.8060@gmail.com',
      'techwitharyan2211@gmail.com',
      'deepatiwari221503@gmail.com',
    ]

    const role = adminEmails.includes(data.email.toLowerCase()) ? 'admin' : 'participant'

    const { data: user, error } = await supabase
      .from('users')
      .insert([{ ...data, role }])
      .select()

    if (error) throw error
    return { success: true, user }
  } catch (error: any) {
    console.error('Registration error:', error.message)
    return { success: false, error: error.message }
  }
}

// 2. Create Event Registration
export async function registerForEvent(data: {
  user_id: string
  event_id: string
}) {
  try {
    const { data: registration, error } = await supabase
      .from('registrations')
      .insert([data])
      .select()

    if (error) throw error
    return { success: true, registration }
  } catch (error: any) {
    console.error('Event registration error:', error.message)
    return { success: false, error: error.message }
  }
}

// 3. Get Registration Count
export async function getRegistrationCount(eventId: string) {
  try {
    const { count, error } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'registered')

    if (error) throw error
    return { success: true, count: count || 0 }
  } catch (error: any) {
    console.error('Count error:', error.message)
    return { success: false, count: 0 }
  }
}

// 4. Update Quiz Score
export async function updateQuizScore(
  registrationId: string,
  score: number,
  timeTaken: number
) {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .update({
        score,
        time_taken: timeTaken,
        status: 'completed',
      })
      .eq('id', registrationId)
      .select()

    if (error) throw error
    return { success: true, registration: data }
  } catch (error: any) {
    console.error('Score update error:', error.message)
    return { success: false, error: error.message }
  }
}

// 5. Issue Certificate
export async function issueCertificate(data: {
  certificate_id: string
  user_id: string
  event_id: string
  event_name: string
  certificate_type: string
  certificate_url?: string
}) {
  try {
    const { data: certificate, error } = await supabase
      .from('certificates')
      .insert([data])
      .select()

    if (error) throw error
    return { success: true, certificate }
  } catch (error: any) {
    console.error('Certificate issue error:', error.message)
    return { success: false, error: error.message }
  }
}

// 6. Verify Certificate
export async function verifyCertificate(certificateId: string) {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*, users(full_name, email)')
      .eq('certificate_id', certificateId)
      .single()

    if (error) throw error
    return { success: true, certificate: data }
  } catch (error: any) {
    console.error('Certificate verification error:', error.message)
    return { success: false, error: error.message }
  }
}

// 7. Get User Registrations
export async function getUserRegistrations(userId: string) {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*, events(*)')
      .eq('user_id', userId)

    if (error) throw error
    return { success: true, registrations: data }
  } catch (error: any) {
    console.error('Get registrations error:', error.message)
    return { success: false, registrations: [] }
  }
}

// 8. Get Leaderboard
export async function getLeaderboard(eventId: string, limit: number = 100) {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*, users(full_name, college)')
      .eq('event_id', eventId)
      .eq('status', 'completed')
      .order('score', { ascending: false })
      .order('time_taken', { ascending: true })
      .limit(limit)

    if (error) throw error
    return { success: true, leaderboard: data }
  } catch (error: any) {
    console.error('Leaderboard error:', error.message)
    return { success: false, leaderboard: [] }
  }
}

// 9. Submit Quiz Answer
export async function submitAnswer(data: {
  registration_id: string
  question_number: number
  answer_selected: string
  is_correct: boolean
  points_earned: number
}) {
  try {
    const { data: response, error } = await supabase
      .from('quiz_responses')
      .insert([data])
      .select()

    if (error) throw error
    return { success: true, response }
  } catch (error: any) {
    console.error('Submit answer error:', error.message)
    return { success: false, error: error.message }
  }
}

// 10. Get Event FAQs
export async function getEventFAQs(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('event_id', eventId)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return { success: true, faqs: data }
  } catch (error: any) {
    console.error('FAQs error:', error.message)
    return { success: false, faqs: [] }
  }
}

// 11. Get Event Timeline
export async function getEventTimeline(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('timeline_items')
      .select('*')
      .eq('event_id', eventId)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return { success: true, timeline: data }
  } catch (error: any) {
    console.error('Timeline error:', error.message)
    return { success: false, timeline: [] }
  }
}

// 12. Get Event Contacts
export async function getEventContacts(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('event_id', eventId)

    if (error) throw error
    return { success: true, contacts: data }
  } catch (error: any) {
    console.error('Contacts error:', error.message)
    return { success: false, contacts: [] }
  }
}
