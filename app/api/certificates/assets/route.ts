import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  if (!supabaseServer) {
    return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const name = formData.get('name') as string || ''
    const type = formData.get('type') as string || 'logo'
    const category = formData.get('category') as string || 'general'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Allowed: PNG, JPG, JPEG, WEBP, SVG' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File too large. Max 5MB allowed.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const fileType = ext === 'jpeg' ? 'jpg' : ext === 'svg' ? 'svg' : ext

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileType}`
    const filePath = `${category}/${uniqueName}`

    const buffer = Buffer.from(await file.arrayBuffer())
    
    const { error: uploadError } = await supabaseServer.storage
      .from('certificate-assets')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json({ success: false, error: 'Failed to upload file to storage' }, { status: 500 })
    }

    const { data: urlData } = supabaseServer.storage
      .from('certificate-assets')
      .getPublicUrl(filePath)

    const fileUrl = urlData.publicUrl

    const { data, error } = await supabaseServer
      .from('certificate_assets')
      .insert({
        name: name || file.name.replace(/\.[^/.]+$/, ''),
        type,
        category,
        file_url: fileUrl,
        file_type: fileType,
        file_size: file.size
      })
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({ success: false, error: 'Failed to save asset record' }, { status: 500 })
    }

    return NextResponse.json({ success: true, asset: data })
  } catch (error: any) {
    console.error('Error uploading asset:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed to upload asset' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  if (!supabaseServer) {
    return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const favorite = searchParams.get('favorite')

    let query = supabaseServer
      .from('certificate_assets')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (type) query = query.eq('type', type)
    if (category) query = query.eq('category', category)
    if (favorite === 'true') query = query.eq('is_favorite', true)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching assets:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, assets: data || [] })
  } catch (error: any) {
    console.error('Error fetching assets:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch assets' }, { status: 500 })
  }
}