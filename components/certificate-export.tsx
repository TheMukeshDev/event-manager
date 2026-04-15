'use client'

import { useRef, useCallback, useState } from 'react'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'

async function waitForFonts(): Promise<void> {
  if (document.fonts) {
    try {
      await document.fonts.ready
      await new Promise<void>((resolve) => setTimeout(resolve, 1000))
    } catch {
      await new Promise<void>((resolve) => setTimeout(resolve, 2000))
    }
  }
  
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700',
    'https://fonts.googleapis.com/css2?family=Great+Vibes',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600',
    'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600'
  ]
  
  await Promise.all(fontLinks.map(href => {
    return new Promise<void>((resolve) => {
      if (document.querySelector(`link[href="${href}"]`)) {
        resolve()
        return
      }
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.onload = () => resolve()
      link.onerror = () => resolve()
      document.head.appendChild(link)
    })
  }))
  
  await new Promise<void>((resolve) => setTimeout(resolve, 500))
}

async function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img'))
  const promises = images.map((img) => {
    return new Promise<void>((resolve) => {
      if (img.complete && img.naturalHeight !== 0) {
        resolve()
      } else {
        img.onload = () => resolve()
        img.onerror = () => resolve()
        setTimeout(() => resolve(), 3000)
      }
    })
  })
  await Promise.all(promises)
  await new Promise<void>((resolve) => setTimeout(resolve, 500))
}

async function waitForCertificateAssets(certificateElement: HTMLElement): Promise<void> {
  await waitForFonts()
  await waitForImages(certificateElement)
  await new Promise<void>((resolve) => requestAnimationFrame(() => {
    requestAnimationFrame(() => resolve())
  }))
  await new Promise<void>((resolve) => setTimeout(resolve, 300))
}

export async function getCertificateDataUrl(
  certificateElement: HTMLElement,
  options: { pixelRatio?: number } = {}
): Promise<string> {
  const pixelRatio = options.pixelRatio || 2

  await waitForCertificateAssets(certificateElement)

  const toPngOptions = {
    cacheBust: true,
    pixelRatio,
    skipAutoScale: true,
    allowTaint: true,
    backgroundColor: '#0a0a0a'
  }

  const dataUrl = await toPng(certificateElement, toPngOptions)
  return dataUrl
}

export async function downloadCertificatePNG(
  certificateElement: HTMLElement,
  certificateId: string
): Promise<void> {
  const dataUrl = await getCertificateDataUrl(certificateElement, { pixelRatio: 3 })
  
  const link = document.createElement('a')
  link.download = `certificate-${certificateId}.png`
  link.href = dataUrl
  link.click()
}

export async function downloadCertificatePDF(
  certificateElement: HTMLElement,
  certificateId: string
): Promise<void> {
  const dataUrl = await getCertificateDataUrl(certificateElement, { pixelRatio: 3 })
  
  const img = new window.Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = dataUrl
  })

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [img.width / 3, img.height / 3]
  })

  pdf.addImage(dataUrl, 'PNG', 0, 0, img.width / 3, img.height / 3)
  pdf.save(`certificate-${certificateId}.pdf`)
}

export function useCertificateExport(certificateId: string) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState<'none' | 'png' | 'pdf'>('none')
  const [exportError, setExportError] = useState<string | null>(null)

  const downloadPNG = useCallback(async () => {
    if (!certificateRef.current || isExporting !== 'none') return

    setIsExporting('png')
    setExportError(null)

    try {
      await downloadCertificatePNG(certificateRef.current, certificateId)
    } catch (error: any) {
      console.error('PNG export error:', error)
      setExportError(`Failed to export PNG: ${error.message || 'Unknown error'}`)
    } finally {
      setIsExporting('none')
    }
  }, [certificateId, isExporting])

  const downloadPDF = useCallback(async () => {
    if (!certificateRef.current || isExporting !== 'none') return

    setIsExporting('pdf')
    setExportError(null)

    try {
      await downloadCertificatePDF(certificateRef.current, certificateId)
    } catch (error: any) {
      console.error('PDF export error:', error)
      setExportError(`Failed to export PDF: ${error.message || 'Unknown error'}`)
    } finally {
      setIsExporting('none')
    }
  }, [certificateId, isExporting])

  return {
    certificateRef,
    isExporting,
    exportError,
    downloadPNG,
    downloadPDF,
    clearError: () => setExportError(null)
  }
}
