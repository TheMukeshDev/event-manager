import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, category, is_default } = body

    if (is_default) {
      await supabaseServer
        .from('certificate_templates')
        .update({ is_default: false })
        .eq('category', category)
    }

    const { data, error } = await supabaseServer
      .from('certificate_templates')
      .update({
        ...(name && { name }),
        ...(category && { category }),
        ...(is_default !== undefined && { is_default })
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, template: data })
  } catch (error: any) {
    console.error('Error updating template:', error)
    return NextResponse.json({ error: error.message || 'Failed to update template' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseServer
      .from('certificate_templates')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting template:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete template' }, { status: 500 })
  }
}