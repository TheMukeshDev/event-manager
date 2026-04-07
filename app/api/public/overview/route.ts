import { NextResponse } from 'next/server'
import { getPublicOverview } from '@/lib/public-data'

export async function GET() {
  const overview = await getPublicOverview()
  return NextResponse.json({ success: true, data: overview })
}
