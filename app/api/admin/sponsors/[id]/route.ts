import { NextResponse } from 'next/server'
import { updateSponsor, deleteSponsor, getSponsorById } from '@/lib/admin-sponsors'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const sponsor = updateSponsor(id, body)

    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    return NextResponse.json(sponsor)
  } catch (error) {
    console.error('Error updating sponsor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const success = deleteSponsor(id)

    if (!success) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sponsor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
