import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, type, logo_url, website, description, tier, is_visible, sort_order } = body

    const { data, error } = await supabaseServer
      .from('sponsors')
      .update({
        name,
        type,
        logo_url,
        website,
        description,
        tier,
        is_visible,
        sort_order,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating sponsor:', error)
      return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in sponsor PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseServer
      .from('sponsors')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting sponsor:', error)
      return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in sponsor DELETE API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}