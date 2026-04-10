import nodemailer from 'nodemailer'
import { supabaseServer } from './supabase-server'

const OTP_EXPIRY_MINUTES = 5
const otpStore = new Map<string, { otp: string; expiresAt: number }>()

async function ensureOtpTable() {
  try {
    const { error } = await supabaseServer
      .from('admin_otps')
      .select('id')
      .limit(1)
    
    if (error && error.code === '42P01') {
      console.log('Creating admin_otps table...')
      await supabaseServer.rpc('create_admin_otps_table', {})
    }
  } catch (e) {
    console.log('OTP table check failed, using in-memory only')
  }
}

ensureOtpTable().catch(() => {})

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOTPEmail(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Your Tech Hub BBS Admin Login OTP',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000;">
        <div style="max-width: 400px; margin: 0 auto; background-color: #0a0a0a; border-radius: 16px; padding: 32px; border: 1px solid #00d9ff20;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #00d9ff; font-size: 24px; margin: 0 0 8px 0;">Tech Hub BBS</h1>
            <p style="color: #666; font-size: 14px; margin: 0;">Admin Login Verification</p>
          </div>
          
          <p style="color: #ccc; font-size: 16px; margin: 0 0 24px 0;">Your One-Time Password (OTP) is:</p>
          
          <div style="background: linear-gradient(135deg, #00d9ff10, #00ff8810); border: 2px solid #00d9ff; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="color: #00d9ff; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">${otp}</span>
          </div>
          
          <p style="color: #666; font-size: 14px; margin: 0 0 16px 0;">This OTP is valid for <strong style="color: #ff4444;">${OTP_EXPIRY_MINUTES} minutes</strong>.</p>
          
          <p style="color: #444; font-size: 12px; margin: 0;">If you didn't request this, please ignore this email.</p>
          
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #00d9ff10; text-align: center;">
            <p style="color: #444; font-size: 11px; margin: 0;">Tech Hub BBS - Premium Event Platform</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Failed to send OTP email:', error)
    return { success: false, error: 'Failed to send OTP email' }
  }
}

export async function storeOTP(email: string, otp: string): Promise<void> {
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  const emailLower = email.toLowerCase()
  otpStore.set(emailLower, { otp, expiresAt })
  
  try {
    const { error } = await supabaseServer
      .from('admin_otps')
      .upsert([{
        email: emailLower,
        otp,
        expires_at: new Date(expiresAt).toISOString(),
        created_at: new Date().toISOString(),
      }], { onConflict: 'email' })
    
    if (error) {
      console.error('Failed to store OTP in DB:', error.message)
    }
  } catch (e) {
    console.error('OTP DB storage error:', e)
  }
}

export async function verifyOTP(email: string, inputOTP: string): Promise<{ valid: boolean; error?: string }> {
  const emailLower = email.toLowerCase()
  const stored = otpStore.get(emailLower)
  
  if (stored) {
    if (stored.expiresAt < Date.now()) {
      otpStore.delete(emailLower)
      return { valid: false, error: 'OTP expired. Please request a new OTP.' }
    }
    
    if (stored.otp !== inputOTP) {
      return { valid: false, error: 'Invalid OTP. Please try again.' }
    }
    
    otpStore.delete(emailLower)
    return { valid: true }
  }
  
  try {
    const { data, error } = await supabaseServer
      .from('admin_otps')
      .select('*')
      .eq('email', emailLower)
      .single()
    
    if (error || !data) {
      return { valid: false, error: 'No OTP found. Please request a new OTP.' }
    }
    
    if (new Date(data.expires_at).getTime() < Date.now()) {
      return { valid: false, error: 'OTP expired. Please request a new OTP.' }
    }
    
    if (data.otp !== inputOTP) {
      return { valid: false, error: 'Invalid OTP. Please try again.' }
    }
    
    await supabaseServer.from('admin_otps').delete().eq('email', emailLower)
    
    return { valid: true }
  } catch (e) {
    console.error('OTP verification error:', e)
    return { valid: false, error: 'No OTP found. Please request a new OTP.' }
  }
}

export async function isAdminEmail(email: string): Promise<boolean> {
  const ADMIN_EMAILS = [
    'mukeshkumar916241@gmail.com',
    'shwetatiwari.8060@gmail.com',
    'techwitharyan2211@gmail.com',
    'deepatiwari221503@gmail.com',
  ]
  return ADMIN_EMAILS.includes(email.toLowerCase())
}