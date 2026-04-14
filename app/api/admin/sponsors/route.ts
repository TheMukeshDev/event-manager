import { NextResponse } from 'next/server'
import { getSponsors, addSponsor, updateSponsor, deleteSponsor, getSponsorById } from '@/lib/admin-sponsors'

export async function GET() {
  try {
    const sponsors = getSponsors()
    return NextResponse.json(sponsors)
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, type, logo_url, website, description, tier, is_visible, sort_order } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const sponsor = addSponsor({
      name,
      type: type || 'Partner',
      logo_url,
      website,
      description,
      tier: tier || 'silver',
      is_visible: is_visible !== false,
      sort_order: sort_order || 0,
    })

    return NextResponse.json(sponsor)
  } catch (error) {
    console.error('Error creating sponsor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
