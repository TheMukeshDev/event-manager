import { NextResponse } from 'next/server'

interface Certificate {
  id: string
  certificate_id: string
  user_email: string
  user_name: string
  event_name: string
  issued_at: string
  is_valid: boolean
  verification_url: string
}

const mockCertificates: Certificate[] = []

export async function GET() {
  try {
    return NextResponse.json(mockCertificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json([])
  }
}
