import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabase-server'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 })
  }

  const { data, error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.session) {
    return NextResponse.json({ success: false, error: error?.message || 'Invalid credentials.' }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabaseServer
    .from('users')
    .select('id,email,full_name,role')
    .eq('email', email)
    .single()

  if (profileError) {
    console.error('Profile lookup failed:', profileError.message)
  }

  return NextResponse.json({
    success: true,
    session: data.session,
    user: data.user,
    profile,
  })
}
