import { NextResponse } from 'next/server'

interface User {
  id: string
  email: string
  full_name?: string
  role: 'user' | 'admin' | 'ambassador'
  created_at: string
  referral_count: number
  referral_code?: string
  is_verified: boolean
}

const mockUsers: User[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const filter = searchParams.get('filter') || 'all'

  try {
    let filteredUsers = [...mockUsers]
    
    if (filter !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.role === filter)
    }

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedUsers = filteredUsers.slice(start, end)
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / limit))

    return NextResponse.json({
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({
      users: [],
      total: 0,
      page: 1,
      totalPages: 1,
    })
  }
}
