import { NextResponse } from 'next/server'
import { verifyOTP, isAdminEmail } from '@/lib/otp-service'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, otp } = body

  if (!email || !otp) {
    return NextResponse.json({ success: false, error: 'Email and OTP are required.' }, { status: 400 })
  }

  const adminCheck = await isAdminEmail(email)
  if (!adminCheck) {
    return NextResponse.json({ success: false, error: 'Only admin emails are allowed.' }, { status: 403 })
  }

  const verification = await verifyOTP(email, otp)
  
  if (!verification.valid) {
    return NextResponse.json({ success: false, error: verification.error }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabaseServer
    .from('users')
    .select('id,email,full_name,role')
    .eq('email', email.toLowerCase())
    .single()

  if (profileError) {
    console.error('Profile lookup failed:', profileError.message)
  }

  return NextResponse.json({
    success: true,
    message: 'Login successful!',
    profile,
  })
}