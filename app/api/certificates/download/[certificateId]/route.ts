import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { getCertificateTemplate, generatePDF, generateImage } from '@/lib/certificate-template'
import { generateQRCodeBase64 } from '@/lib/qr-generator'
import { getLogosAsBase64 } from '@/lib/logo-loader'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  let certificateId: string
  let format: string

  try {
    const { certificateId: paramId } = await params
    certificateId = paramId
    
    const { searchParams } = new URL(request.url)
    format = searchParams.get('format') || 'html'
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 })
  }

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

  try {
    const verifyUrl = `${process.env.NEXT_PUBLIC_VERIFY_BASE_URL || 'https://techhub-bbs.vercel.app'}/verify/${cert.certificate_id}`
    
    const [qrCodeBase64, logos] = await Promise.all([
      generateQRCodeBase64(verifyUrl, 200),
      Promise.resolve(getLogosAsBase64())
    ])

    const templateData = {
      name: cert.name,
      event: cert.event || 'TechQuiz 2026',
      score: cert.score,
      rank: cert.rank,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      certificateId: cert.certificate_id,
      certificateType: cert.certificate_type,
      qrCodeBase64,
      logos
    }

    const html = getCertificateTemplate(cert.certificate_type, templateData)

    if (format === 'html') {
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="certificate-${certificateId}.html"`
        }
      })
    }

    let buffer: Buffer
    let contentType: string
    let filename: string

    try {
      if (format === 'png' || format === 'image') {
        buffer = await generateImage(html)
        contentType = 'image/png'
        filename = `certificate-${certificateId}.png`
      } else if (format === 'pdf') {
        buffer = await generatePDF(html)
        contentType = 'application/pdf'
        filename = `certificate-${certificateId}.pdf`
      } else {
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html',
            'Content-Disposition': `inline; filename="certificate-${certificateId}.html"`
          }
        })
      }
    } catch (genError: any) {
      console.error('Generation failed:', genError.message)
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="certificate-${certificateId}.html"`
        }
      })
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
