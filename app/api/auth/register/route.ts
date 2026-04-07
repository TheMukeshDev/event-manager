import { NextResponse } from 'next/server'
import { createAuthUserWithPassword, isAdminEmail } from '../../../../lib/auth-service'
import { supabaseServer } from '../../../../lib/supabase-server'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password, fullName, phone, college, stream } = body

  if (!email || !password || !fullName) {
    return NextResponse.json({ success: false, error: 'Email, password, and full name are required.' }, { status: 400 })
  }

  const signUpResult = await createAuthUserWithPassword({
    email,
    password,
    fullName,
    phone,
    college,
    stream,
  })

  if (!signUpResult.success) {
    return NextResponse.json({ success: false, error: signUpResult.error }, { status: 500 })
  }

  const role = isAdminEmail(email) ? 'admin' : 'participant'
  const { data: profile, error: profileError } = await supabaseServer
    .from('users')
    .select('id,email,full_name,role')
    .eq('email', email)
    .single()

  if (profileError) {
    console.error('Profile fetch failed:', profileError.message)
  }

  return NextResponse.json({
    success: true,
    message: role === 'admin' ? 'Admin account created successfully.' : 'Account created successfully.',
    profile,
  })
}
