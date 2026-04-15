import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { getCertificateTemplate, generatePDF, generateImage } from '@/lib/certificate-template'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'pdf'

    if (!supabaseServer) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { data: cert, error } = await supabaseServer
      .from('certificate_records')
      .select('*')
      .eq('certificate_id', certificateId)
      .single()

    if (error || !cert) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    const templateData = {
      name: cert.name,
      event: cert.event || 'TechQuiz 2026',
      score: cert.score,
      rank: cert.rank,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      certificateId: cert.certificate_id,
      certificateType: cert.certificate_type
    }

    const html = getCertificateTemplate(cert.certificate_type, templateData)

    let buffer: Buffer
    let contentType: string
    let filename: string

    if (format === 'png' || format === 'image') {
      buffer = await generateImage(html)
      contentType = 'image/png'
      filename = `certificate-${certificateId}.png`
    } else {
      buffer = await generatePDF(html)
      contentType = 'application/pdf'
      filename = `certificate-${certificateId}.pdf`
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString()
      }
    })
  } catch (error: any) {
    console.error('Error generating certificate:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate certificate' }, { status: 500 })
  }
}
