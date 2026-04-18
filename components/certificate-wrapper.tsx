'use client'

import { useRef, useCallback, forwardRef } from 'react'
import dynamic from 'next/dynamic'

export const CERTIFICATE_WIDTH = 2880
export const CERTIFICATE_HEIGHT = 1620
export const CERTIFICATE_ASPECT_RATIO = CERTIFICATE_WIDTH / CERTIFICATE_HEIGHT

interface CertificateData {
  name: string
  event: string
  certificateType: string
  title: string
  date: string
  rank: number | null
  score: number | null
  certificateId: string
  qrCodeUrl: string
}

const CertificateInner = dynamic(
  () => import('./certificate').then((mod) => mod.Certificate),
  { ssr: false, loading: () => <div style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, background: '#0d0d0d' }} /> }
)

export interface CertificateExportHandle {
  getExportElement: () => HTMLDivElement | null
}

interface CertificateExportWrapperProps {
  certificate: CertificateData
  exportRef?: React.RefObject<HTMLDivElement | null>
  className?: string
}

export const CertificateExportWrapper = forwardRef<HTMLDivElement, CertificateExportWrapperProps>(
  function CertificateExportWrapper({ certificate, exportRef, className = '' }, ref) {
    const internalRef = useRef<HTMLDivElement>(null)
    const resolvedRef = exportRef || ref || internalRef

    return (
      <div
        ref={resolvedRef}
        className={`certificate-export-root ${className}`}
        style={{
          width: CERTIFICATE_WIDTH,
          height: CERTIFICATE_HEIGHT,
          maxWidth: CERTIFICATE_WIDTH,
          maxHeight: CERTIFICATE_HEIGHT,
          transform: 'none',
          aspectRatio: `${CERTIFICATE_WIDTH} / ${CERTIFICATE_HEIGHT}`,
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
        data-certificate-export="true"
      >
        <CertificateInner
          name={certificate.name}
          event={certificate.event}
          certificateType={certificate.certificateType}
          title={certificate.title}
          date={certificate.date}
          rank={certificate.rank}
          score={certificate.score}
          certificateId={certificate.certificateId}
          qrCodeUrl={certificate.qrCodeUrl}
        />
      </div>
    )
  }
)

interface ScaledCertificateProps {
  certificate: CertificateData
  containerWidth: number
  containerHeight: number
  onRef?: (el: HTMLDivElement | null) => void
  className?: string
  style?: React.CSSProperties
}

export function ScaledCertificate({
  certificate,
  containerWidth,
  containerHeight,
  onRef,
  className = '',
  style = {}
}: ScaledCertificateProps) {
  const scaleX = containerWidth / CERTIFICATE_WIDTH
  const scaleY = containerHeight / CERTIFICATE_HEIGHT
  const scale = Math.min(scaleX, scaleY, 1)

  const scaledWidth = CERTIFICATE_WIDTH * scale
  const scaledHeight = CERTIFICATE_HEIGHT * scale

  return (
    <div
      className={`certificate-scaler ${className}`}
      style={{
        width: scaledWidth,
        height: scaledHeight,
        position: 'relative',
        flexShrink: 0,
        ...style
      }}
    >
      <div
        data-certificate-export="true"
        style={{
          width: CERTIFICATE_WIDTH,
          height: CERTIFICATE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        <CertificateInner
          name={certificate.name}
          event={certificate.event}
          certificateType={certificate.certificateType}
          title={certificate.title}
          date={certificate.date}
          rank={certificate.rank}
          score={certificate.score}
          certificateId={certificate.certificateId}
          qrCodeUrl={certificate.qrCodeUrl}
        />
      </div>
    </div>
  )
}
