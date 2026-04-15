'use client'

import { useRef, useCallback, useState } from 'react'

export const CERTIFICATE_WIDTH = 1600
export const CERTIFICATE_HEIGHT = 900

const CERTIFICATE_FONTS = [
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700',
  'https://fonts.googleapis.com/css2?family=Great+Vibes',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600',
  'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600'
]

function preloadFonts(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (typeof document === 'undefined') {
      resolve()
      return
    }
    const fontPromises = CERTIFICATE_FONTS.map(href => {
      return new Promise<void>((res) => {
        if (document.querySelector(`link[href="${href}"]`)) {
          res()
          return
        }
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.onload = () => res()
        link.onerror = () => res()
        document.head.appendChild(link)
      })
    })
    Promise.all(fontPromises).then(() => resolve())
  })
}

async function waitForFonts(): Promise<void> {
  if (typeof document === 'undefined') return
  
  try {
    if (document.fonts?.ready) {
      await document.fonts.ready
    }
  } catch {}

  await preloadFonts()
  await new Promise<void>((resolve) => setTimeout(resolve, 300))
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
  await new Promise<void>((resolve) => setTimeout(resolve, 200))
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
  
  const pixelRatio = options.pixelRatio || 1

  await waitForCertificateAssets(certificateElement)

  const { toPng } = await import('html-to-image')
  
  const dataUrl = await toPng(certificateElement, {
    cacheBust: true,
    pixelRatio,
    skipAutoScale: true,
    backgroundColor: '#0a0a0a',
    width: CERTIFICATE_WIDTH,
    height: CERTIFICATE_HEIGHT
  })

  return dataUrl
}

export async function downloadCertificatePNG(
  certificateElement: HTMLElement,
  certificateId: string,
  recipientName: string
): Promise<void> {
  const dataUrl = await getCertificateDataUrl(certificateElement, { pixelRatio: 1 })
  
  const firstName = recipientName.trim().split(' ')[0]
  const sanitizedName = firstName.replace(/[^a-zA-Z0-9]/g, '-')
  const filename = `${sanitizedName}-Tech-Hub-BBS.png`
  
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

export function useCertificateExport(certificateId: string, recipientName: string) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const downloadPNG = useCallback(async () => {
    if (!certificateRef.current || isExporting) return

    setIsExporting(true)
    setExportError(null)

    try {
      await downloadCertificatePNG(certificateRef.current, certificateId, recipientName)
    } catch (error: any) {
      console.error('PNG export error:', error)
      setExportError(error.message || 'Failed to export PNG')
    } finally {
      setIsExporting(false)
    }
  }, [certificateId, recipientName, isExporting])

  return {
    certificateRef,
    isExporting,
    exportError,
    downloadPNG,
    clearError: () => setExportError(null)
  }
}

export async function generateAndDownloadCertificate(
  container: HTMLElement,
  certificateId: string,
  recipientName: string
): Promise<void> {
  await downloadCertificatePNG(container, certificateId, recipientName)
}
