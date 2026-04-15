import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ 
      success: false, 
      message: 'Email is required' 
    }, { status: 400 })
  }

  if (!supabaseServer) {
    return NextResponse.json({ 
      success: false, 
      message: 'Database not configured' 
    }, { status: 500 })
  }

  try {
    const { data: certificates, error } = await supabaseServer
      .from('certificate_records')
      .select('certificate_id, name, email, event, certificate_type, rank, score')
      .ilike('email', email.trim())

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to fetch certificates' 
      }, { status: 500 })
    }

    if (!certificates || certificates.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No certificates found for this email address' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      certificates 
    })
  } catch (error) {
    console.error('Error finding certificates:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to search certificates' 
    }, { status: 500 })
  }
}
