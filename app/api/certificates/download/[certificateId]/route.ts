import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { getCertificateTemplate } from '@/lib/certificate-template'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params

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

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1123, height: 794 },
      executablePath: await chromium.executablePath(),
      headless: true
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      landscape: false
    })

    await browser.close()

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${certificateId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })
  } catch (error: any) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate PDF' }, { status: 500 })
  }
}