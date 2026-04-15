import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

interface User {
  id: string
  email: string
  full_name?: string
  role: 'user' | 'admin' | 'ambassador' | 'participant'
  created_at: string
  referral_count: number
  referral_code?: string
  is_verified: boolean
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const filter = searchParams.get('filter') || 'all'
  const search = searchParams.get('search') || ''

  if (!supabaseServer) {
    return NextResponse.json({
      success: false,
      users: [],
      total: 0,
      page,
      totalPages: 1,
      error: 'Database not configured'
    }, { status: 503 })
  }

  try {
    let query = supabaseServer
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('role', filter)
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
    }

    const start = (page - 1) * limit
    const end = start + limit - 1

    const { data: users, count, error } = await query.range(start, end)

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({
        success: false,
        users: [],
        total: 0,
        page,
        totalPages: 1,
        error: error.message
      }, { status: 500 })
    }

    const allUsers = users || []
    const normalizedUsers: User[] = allUsers.map((user: any) => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      name: user.full_name,
      role: (user.role || 'user') as User['role'],
      created_at: user.created_at,
      referral_count: user.referral_count || 0,
      referral_code: user.referral_code,
      is_verified: user.is_verified || user.email_confirmed_at !== null
    }))

    const totalUsers = count || 0
    const totalPages = Math.max(1, Math.ceil(totalUsers / limit))

    return NextResponse.json({
      success: true,
      users: normalizedUsers,
      total: totalUsers,
      page,
      totalPages
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({
      success: false,
      users: [],
      total: 0,
      page: 1,
      totalPages: 1,
      error: 'Failed to fetch users'
    }, { status: 500 })
  }
}
