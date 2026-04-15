import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, category, is_favorite } = body

    const { data, error } = await supabaseServer
      .from('certificate_assets')
      .update({
        ...(name && { name }),
        ...(category && { category }),
        ...(is_favorite !== undefined && { is_favorite })
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, asset: data })
  } catch (error: any) {
    console.error('Error updating asset:', error)
    return NextResponse.json({ error: error.message || 'Failed to update asset' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseServer
      .from('certificate_assets')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting asset:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete asset' }, { status: 500 })
  }
}