import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const name = formData.get('name') as string || ''
    const type = formData.get('type') as string || 'logo'
    const category = formData.get('category') as string || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: PNG, JPG, JPEG, WEBP, SVG, GIF' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const fileType = ext === 'jpeg' ? 'jpg' : ext

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'assets')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileType}`
    const filePath = join(uploadDir, uniqueName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const fileUrl = `/uploads/assets/${uniqueName}`

    const { data, error } = await supabaseServer
      .from('certificate_assets')
      .insert({
        name: name || file.name,
        type,
        category,
        file_url: fileUrl,
        file_type: fileType,
        file_size: file.size
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, asset: data })
  } catch (error: any) {
    console.error('Error uploading asset:', error)
    return NextResponse.json({ error: error.message || 'Failed to upload asset' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

    if (error) throw error

    return NextResponse.json({ assets: data || [] })
  } catch (error: any) {
    console.error('Error fetching assets:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch assets' }, { status: 500 })
  }
}