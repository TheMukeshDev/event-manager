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
    const category = formData.get('category') as string || 'participation'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf', 'text/html']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: PNG, JPG, JPEG, WEBP, PDF, HTML' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const fileType = ext === 'jpeg' ? 'jpg' : ext

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'templates')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileType}`
    const filePath = join(uploadDir, uniqueName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const fileUrl = `/uploads/templates/${uniqueName}`

    const { data, error } = await supabaseServer
      .from('certificate_templates')
      .insert({
        name: name || file.name,
        category,
        file_url: fileUrl,
        file_type: fileType,
        is_default: false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, template: data })
  } catch (error: any) {
    console.error('Error importing template:', error)
    return NextResponse.json({ error: error.message || 'Failed to import template' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('certificate_templates')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ templates: data || [] })
  } catch (error: any) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch templates' }, { status: 500 })
  }
}