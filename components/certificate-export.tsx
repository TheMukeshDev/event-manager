'use client'

import { useRef, useCallback, useState } from 'react'

const CERTIFICATE_FONTS = [
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700',
  'https://fonts.googleapis.com/css2?family=Great+Vibes',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600',
  'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600'
]

function preloadFonts(): Promise<void> {
  const fontPromises = CERTIFICATE_FONTS.map(href => {
    return new Promise<void>((resolve) => {
      if (typeof document === 'undefined') {
        resolve()
        return
      }
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
  })
  return Promise.all(fontPromises).then(() => {})
}

async function waitForFonts(): Promise<void> {
  if (typeof document === 'undefined') return
  
  try {
    if (document.fonts?.ready) {
      await document.fonts.ready
    }
  } catch {
    // Fonts API not available
  }
  
  await preloadFonts()
  await new Promise<void>((resolve) => setTimeout(resolve, 500))
}

async function waitForImages(container: HTMLElement): Promise<void> {
  if (typeof document === 'undefined') return
  
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
  await new Promise<void>((resolve) => setTimeout(resolve, 300))
}

async function waitForCertificateAssets(certificateElement: HTMLElement): Promise<void> {
  await waitForFonts()
  await waitForImages(certificateElement)
  await new Promise<void>((resolve) => requestAnimationFrame(() => {
    requestAnimationFrame(() => resolve())
  }))
  await new Promise<void>((resolve) => setTimeout(resolve, 200))
}

export async function getCertificateDataUrl(
  certificateElement: HTMLElement,
  options: { pixelRatio?: number } = {}
): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Export only works in browser')
  }
  
  const pixelRatio = options.pixelRatio || 2

  await waitForCertificateAssets(certificateElement)

  const { toPng } = await import('html-to-image')
  
  const dataUrl = await toPng(certificateElement, {
    cacheBust: true,
    pixelRatio,
    skipAutoScale: true,
    backgroundColor: '#0a0a0a'
  })

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
  // Use server-side API for PDF generation (more reliable)
  const response = await fetch(`/api/certificates/download/${certificateId}?format=pdf`)
  
  if (!response.ok) {
    throw new Error('Failed to generate PDF')
  }
  
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `certificate-${certificateId}.pdf`
  link.click()
  URL.revokeObjectURL(url)
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
      setExportError(error.message || 'Failed to export PNG')
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
      setExportError(error.message || 'Failed to export PDF')
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
