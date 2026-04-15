import { supabaseBrowser } from './supabase-browser'
import { supabaseServer } from './supabase-server'

export const ADMIN_EMAILS = [
  'mukeshkumar916241@gmail.com',
  'shwetatiwari.8060@gmail.com',
  'techwitharyan2211@gmail.com',
  'deepatiwari221503@gmail.com',
]

const ADMIN_PROFILE_MAP: Record<string, { full_name: string; role: 'admin' }> = {
  'mukeshkumar916241@gmail.com': { full_name: 'Mukesh Kumar', role: 'admin' },
  'shwetatiwari.8060@gmail.com': { full_name: 'Shweta Tiwari', role: 'admin' },
  'techwitharyan2211@gmail.com': { full_name: 'Aryaman Patel', role: 'admin' },
  'deepatiwari221503@gmail.com': { full_name: 'Deepa Tiwari', role: 'admin' },
}

export function isAdminEmail(email: string) {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export async function seedAdminProfiles() {
  if (!supabaseServer) {
    return { success: false, error: 'Database not configured' }
  }

  const profiles = Object.entries(ADMIN_PROFILE_MAP).map(([email, profile]) => ({
    email,
    full_name: profile.full_name,
    role: profile.role,
  }))

  const { data, error } = await supabaseServer
    .from('users')
    .upsert(profiles, { onConflict: 'email' })
    .select()

  if (error) {
    console.error('Admin seed failed:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true, adminProfiles: data }
}

export async function createAuthUserWithPassword(payload: {
  email: string
  password: string
  fullName: string
  phone?: string
  college?: string
  stream?: string
}) {
  if (!supabaseServer) {
    return { success: false, error: 'Database not configured' }
  }

  const { email, password, fullName, phone, college, stream } = payload
  const role = isAdminEmail(email) ? 'admin' : 'participant'

  // Create the Supabase auth user and then ensure the custom users table has a matching profile.
  const { data: authData, error: authError } = await supabaseServer.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      full_name: fullName,
      phone,
      college,
      stream,
    },
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  const { data: profile, error: profileError } = await supabaseServer
    .from('users')
    .upsert([
      {
        email,
        full_name: fullName,
        phone,
        college,
        stream,
        role,
      },
    ], { onConflict: 'email' })
    .select()
    .single()

  if (profileError) {
    return { success: false, error: profileError.message }
  }

  return {
    success: true,
    authUser: authData.user ?? null,
    profile,
  }
}

export async function signInWithEmailPassword(email: string, password: string) {
  if (!supabaseBrowser) {
    return { success: false, error: 'Authentication not configured' }
  }

  const { data, error } = await supabaseBrowser.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, session: data.session, user: data.user }
}

export function signInWithGoogle() {
  if (!supabaseBrowser) {
    throw new Error('Authentication not configured')
  }

  return supabaseBrowser.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'email profile',
    },
  })
}
