import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface LogoData {
  techHub: string
  bbsGroup: string
  csi: string
  unstop: string
}

const LOGO_PATHS = {
  techHub: '/certificates/logos/techhubbs.png',
  bbsGroup: '/certificates/logos/bbslogo.png',
  csi: '/certificates/logos/csi.png',
  unstop: '/certificates/logos/unstop.png'
}

export function getLogosAsBase64(): LogoData {
  const baseDir = process.cwd()
  
  const loadLogo = (logoPath: string): string => {
    const fullPath = join(baseDir, 'public', logoPath)
    if (existsSync(fullPath)) {
      const buffer = readFileSync(fullPath)
      const ext = logoPath.split('.').pop()?.toLowerCase() || 'png'
      const mimeType = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : 'image/jpeg'
      return `data:${mimeType};base64,${buffer.toString('base64')}`
    }
    console.warn(`Logo not found: ${logoPath}`)
    return ''
  }

  return {
    techHub: loadLogo(LOGO_PATHS.techHub),
    bbsGroup: loadLogo(LOGO_PATHS.bbsGroup),
    csi: loadLogo(LOGO_PATHS.csi),
    unstop: loadLogo(LOGO_PATHS.unstop)
  }
}

export function getLocalLogoPath(logoName: string): string {
  return `/certificates/logos/${logoName}`
}
