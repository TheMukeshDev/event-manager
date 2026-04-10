import { NextResponse } from 'next/server'
import { generateOTP, sendOTPEmail, storeOTP, isAdminEmail } from '@/lib/otp-service'

export async function POST(request: Request) {
  const body = await request.json()
  const { email } = body

  if (!email) {
    return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 })
  }

  const adminCheck = await isAdminEmail(email)
  if (!adminCheck) {
    return NextResponse.json({ success: false, error: 'Only admin emails are allowed.' }, { status: 403 })
  }

  const otp = generateOTP()
  const emailResult = await sendOTPEmail(email, otp)

  if (!emailResult.success) {
    return NextResponse.json({ success: false, error: emailResult.error || 'Failed to send OTP.' }, { status: 500 })
  }

  await storeOTP(email, otp)

  return NextResponse.json({
    success: true,
    message: 'OTP sent to your email. Valid for 5 minutes.',
  })
}