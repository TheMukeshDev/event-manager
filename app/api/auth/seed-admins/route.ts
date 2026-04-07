import { NextResponse } from 'next/server'
import { seedAdminProfiles } from '../../../../lib/auth-service'

export async function POST(request: Request) {
  const seedToken = request.headers.get('x-admin-seed-key')
  const secret = process.env.ADMIN_SEED_SECRET

  if (!secret || seedToken !== secret) {
    return NextResponse.json({ success: false, error: 'Unauthorized seed request.' }, { status: 403 })
  }

  const result = await seedAdminProfiles()

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }

  return NextResponse.json({ success: true, adminProfiles: result.adminProfiles })
}
