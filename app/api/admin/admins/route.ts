import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  if (!supabaseServer) {
    return NextResponse.json(
      { success: false, error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { email, name } = body

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Email and name are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const { data: existing } = await supabaseServer
      .from('users')
      .select('id, email, role')
      .eq('email', email.toLowerCase())
      .maybe()

    if (existing && existing.length > 0) {
      const user = existing[0]
      if (user.role === 'admin') {
        return NextResponse.json(
          { success: false, error: 'User is already an admin' },
          { status: 400 }
        )
      }

      const { error: updateError } = await supabaseServer
        .from('users')
        .update({ role: 'admin', full_name: name })
        .eq('id', user.id)

      if (updateError) throw updateError

      return NextResponse.json({
        success: true,
        message: 'User upgraded to admin successfully',
        updated: true
      })
    }

    const { error: insertError } = await supabaseServer
      .from('users')
      .insert({
        email: email.toLowerCase(),
        full_name: name,
        role: 'admin'
      })

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'User with this email already exists' },
          { status: 400 }
        )
      }
      throw insertError
    }

    return NextResponse.json({
      success: true,
      message: 'Admin added successfully. They can login with OTP.',
      updated: false
    })
  } catch (error: any) {
    console.error('Error adding admin:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add admin' },
      { status: 500 }
    )
  }
}

export async function GET() {
  if (!supabaseServer) {
    return NextResponse.json({ admins: [] })
  }

  try {
    const { data: admins } = await supabaseServer
      .from('users')
      .select('id, email, full_name, role, created_at')
      .eq('role', 'admin')
      .order('created_at', { ascending: false })

    return NextResponse.json({ admins: admins || [] })
  } catch (error) {
    console.error('Error fetching admins:', error)
    return NextResponse.json({ admins: [] })
  }
}