import { NextResponse } from 'next/server'
import { getStats } from '@/lib/admin-stats'

export async function GET() {
  try {
    const stats = getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({
      totalUsers: 0,
      totalAmbassadors: 0,
      totalSponsors: 0,
      totalCertificates: 0,
      validCertificates: 0,
      revokedCertificates: 0,
      recentSignups: [],
      ambassadorReferrals: [],
    })
  }
}
