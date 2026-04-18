'use client'

import { forwardRef, useEffect } from 'react'

export const CERTIFICATE_WIDTH = 2880
export const CERTIFICATE_HEIGHT = 1620

interface CertificateProps {
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

const CERTIFICATE_FONTS = [
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700',
  'https://fonts.googleapis.com/css2?family=Great+Vibes',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600',
  'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600'
]

function preloadFonts() {
  CERTIFICATE_FONTS.forEach(href => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
    }
  })
}

function getBodyText(certificateType: string): string {
  switch (certificateType) {
    case 'excellence':
      return 'for outstanding performance in'
    case 'appreciation':
      return 'for commendable performance in'
    case 'winner':
      return 'for securing First Place in'
    case 'runner-up':
      return 'for securing Second Place in'
    case 'second-runner-up':
      return 'for securing Third Place in'
    default:
      return 'for successfully participating in'
  }
}

function getAccentColor(certificateType: string): string {
  switch (certificateType) {
    case 'excellence':
      return '#FFD700'
    case 'appreciation':
      return '#4169E1'
    case 'winner':
      return '#FFD700'
    case 'runner-up':
      return '#C0C0C0'
    case 'second-runner-up':
      return '#CD7F32'
    default:
      return '#00CED1'
  }
}

function getGlowColor(certificateType: string): string {
  switch (certificateType) {
    case 'excellence':
      return 'rgba(255, 215, 0, 0.04)'
    case 'appreciation':
      return 'rgba(65, 105, 225, 0.04)'
    default:
      return 'rgba(0, 206, 209, 0.04)'
  }
}

export const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  function Certificate(
    { name, event, certificateType, title, date, rank, score, certificateId, qrCodeUrl },
    ref
  ) {
    const accentColor = getAccentColor(certificateType)
    const glowColor = getGlowColor(certificateType)
    const bodyText = getBodyText(certificateType)
    const recipientNameFontSize = name.length > 18 ? 115 : 135

    useEffect(() => {
      preloadFonts()
    }, [])

    return (
      <div
        ref={ref}
        className="certificate"
        style={{
          width: CERTIFICATE_WIDTH,
          height: CERTIFICATE_HEIGHT,
          maxWidth: 'none',
          background: 'linear-gradient(145deg, #0d0d0d 0%, #141414 50%, #0d0d0d 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif"
        }}
      >
        <div
          className="safe-area"
          style={{
            position: 'absolute',
            top: '0.6%',
            left: '0.6%',
            right: '0.6%',
            bottom: '0.6%',
            border: `4px solid ${accentColor}`,
            pointerEvents: 'none'
          }}
        />

        <div
          className="inner-safe"
          style={{
            position: 'absolute',
            top: '1.5%',
            left: '1.5%',
            right: '1.5%',
            bottom: '1.5%',
            border: `2px solid ${accentColor}18`,
            pointerEvents: 'none'
          }}
        />

        <div
          className="corner corner-tl"
          style={{
            position: 'absolute',
            top: '0.15%',
            left: '0.15%',
            width: 58,
            height: 58,
            border: `3px solid ${accentColor}`,
            borderRight: 'none',
            borderBottom: 'none'
          }}
        />
        <div
          className="corner corner-tr"
          style={{
            position: 'absolute',
            top: '0.15%',
            right: '0.15%',
            width: 58,
            height: 58,
            border: `3px solid ${accentColor}`,
            borderLeft: 'none',
            borderBottom: 'none'
          }}
        />
        <div
          className="corner corner-bl"
          style={{
            position: 'absolute',
            bottom: '0.15%',
            left: '0.15%',
            width: 58,
            height: 58,
            border: `3px solid ${accentColor}`,
            borderRight: 'none',
            borderTop: 'none'
          }}
        />
        <div
          className="corner corner-br"
          style={{
            position: 'absolute',
            bottom: '0.15%',
            right: '0.15%',
            width: 58,
            height: 58,
            border: `3px solid ${accentColor}`,
            borderLeft: 'none',
            borderTop: 'none'
          }}
        />

        <div
          className="certificate-content"
          style={{
            position: 'absolute',
            top: '1.5%',
            left: '1.5%',
            right: '1.5%',
            bottom: '1.5%',
            display: 'flex',
            flexDirection: 'column',
            padding: '0.2% 1.8% 0',
            background: `radial-gradient(circle at 50% 10%, ${glowColor} 0%, transparent 40%)`
          }}
        >
          <div
            className="header-section"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 6,
              borderBottom: `1px solid ${accentColor}12`,
              gap: 16
            }}
          >
            <img
              src="/certificates/logos/csi.png"
              alt="CSI"
              className="corner-logo"
              style={{
                height: 130,
                width: 'auto',
                maxWidth: 200,
                objectFit: 'contain',
                filter: `drop-shadow(0 0 14px ${accentColor}30) brightness(1.15) contrast(1.1) saturate(1.05)`
              }}
            />

            <img
              src="/certificates/logos/bbslogo.png"
              alt="BBS Group"
              className="bbs-main-logo"
              style={{
                height: 450,
                width: 'auto',
                maxWidth: 900,
                objectFit: 'contain',
                filter: `drop-shadow(0 0 27px rgba(255, 215, 0, 0.5)) brightness(1.3) contrast(1.15) saturate(1.1)`
              }}
            />

            <div
              className="right-techhub"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <img
                src="/certificates/logos/techhubbs.png"
                alt="Tech Hub BBS"
                className="techhub-header-logo"
                style={{
                  height: 260,
                  width: 'auto',
                  maxWidth: 460,
                  objectFit: 'contain',
                  filter: `drop-shadow(0 0 18px ${accentColor}40) brightness(1.25) contrast(1.15) saturate(1.1)`
                }}
              />
              <div
                className="techhub-header-name"
                style={{
                  fontFamily: "'Cinzel', 'Times New Roman', serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: accentColor,
                  letterSpacing: 1.8,
                  textTransform: 'uppercase',
                  marginTop: 2
                }}
              >
                Tech Hub BBS
              </div>
            </div>
          </div>

          <div
            className="main-content"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              className="main-title"
              style={{
                fontFamily: "'Cinzel', 'Times New Roman', serif",
                fontSize: 65,
                fontWeight: 700,
                color: accentColor,
                textTransform: 'uppercase',
                letterSpacing: 7,
                textAlign: 'center',
                marginBottom: 4
              }}
            >
              {title}
            </div>

            <div
              className="recipient-section"
              style={{ textAlign: 'center' }}
            >
              <div
                className="presented-to"
                style={{
                  fontSize: 22,
                  color: '#888',
                  letterSpacing: 3.6,
                  textTransform: 'uppercase'
                }}
              >
                This certificate is proudly presented to
              </div>
              <div
                className="recipient-name"
                style={{
                  fontFamily: "'Great Vibes', 'Georgia', cursive",
                  fontSize: recipientNameFontSize,
                  fontWeight: 400,
                  color: '#ffffff',
                  margin: '6px 0 8px',
                  lineHeight: 1.1,
                  textShadow: '0 0 36px rgba(255,255,255,0.15)'
                }}
              >
                {name}
              </div>
              <div
                className="divider"
                style={{
                  width: 504,
                  height: 4,
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                  margin: '0 auto 10px'
                }}
              />
            </div>

            <div
              className="event-section"
              style={{ textAlign: 'center', marginBottom: 4 }}
            >
              <div
                className="event-text"
                style={{
                  fontSize: 25,
                  color: '#999',
                  letterSpacing: 3.6,
                  textTransform: 'uppercase',
                  marginBottom: 5
                }}
              >
                {bodyText}
              </div>
              <div
                className="event-name"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: 43,
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: 2.7
                }}
              >
                {event}
              </div>
            </div>

<div
            className="branding-section"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              marginBottom: 4
            }}
          >
              <div
                className="branding-line gold"
                style={{
                  fontSize: 18,
                  color: accentColor,
                  fontWeight: 500,
                  letterSpacing: 1.4,
                  textAlign: 'center'
                }}
              >
                Organised by <strong>Tech Hub BBS</strong> in collaboration with{' '}
                <strong>Computer Society of India (CSI)</strong> &amp;{' '}
                <strong>BBS Coding Club</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 18,
                  color: '#888',
                  letterSpacing: 1.4
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 14,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Powered by{' '}
                  <img
                    src="/certificates/logos/unstop.png"
                    alt="Unstop"
                    className="branding-logo"
                    style={{
                      height: 50,
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      flexShrink: 0,
                      filter: `drop-shadow(0 0 11px ${accentColor}35)`
                    }}
                  />
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    width: '100%',
                    whiteSpace: 'nowrap'
                  }}
                >
                  National Level Technical Quiz
                </div>
              </div>
            </div>

            {(rank !== null || score !== null) && (
              <div
                className="score-row"
                style={{ display: 'flex', justifyContent: 'center', gap: 24 }}
              >
                {rank !== null && (
                  <div
                    className="score-box"
                    style={{
                      textAlign: 'center',
                      padding: '7px 29px',
                      background: `${accentColor}06`,
                      border: `2px solid ${accentColor}15`,
                      borderRadius: 5
                    }}
                  >
                    <div
                      className="score-label"
                      style={{
                        fontSize: 16,
                        color: '#777',
                        textTransform: 'uppercase',
                        letterSpacing: 1.8,
                        marginBottom: 4
                      }}
                    >
                      Achieved Rank
                    </div>
                    <div
                      className="score-value"
                      style={{
                        fontFamily: "'Playfair Display', 'Georgia', serif",
                        fontSize: 36,
                        fontWeight: 600,
                        color: accentColor
                      }}
                    >
                      #{rank}
                    </div>
                  </div>
                )}
                {score !== null && (
                  <div
                    className="score-box"
                    style={{
                      textAlign: 'center',
                      padding: '7px 29px',
                      background: `${accentColor}06`,
                      border: `2px solid ${accentColor}15`,
                      borderRadius: 5
                    }}
                  >
                    <div
                      className="score-label"
                      style={{
                        fontSize: 16,
                        color: '#777',
                        textTransform: 'uppercase',
                        letterSpacing: 1.8,
                        marginBottom: 4
                      }}
                    >
                      Score
                    </div>
                    <div
                      className="score-value"
                      style={{
                        fontFamily: "'Playfair Display', 'Georgia', serif",
                        fontSize: 36,
                        fontWeight: 600,
                        color: accentColor
                      }}
                    >
                      {score}/20
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className="footer-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              padding: '4px 0 0px',
              borderTop: `1px solid ${accentColor}08`
            }}
          >
            <div
              className="footer-col left"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 126 }}
            >
              <div
                className="footer-label"
                style={{
                  fontSize: 16,
                  color: '#555',
                  textTransform: 'uppercase',
                  letterSpacing: 1.8,
                  marginBottom: 4
                }}
              >
                Date of Issue
              </div>
              <div
                className="footer-value"
                style={{ fontSize: 20, color: '#999', fontWeight: 500 }}
              >
                {date}
              </div>
            </div>

            <div
              className="footer-col center"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 234 }}
            >
              <div
                className="sig-line"
                style={{
                  width: 252,
                  height: 2,
                  background: accentColor,
                  margin: '0 auto 2px',
                  opacity: 0.4
                }}
              />
              <div
                className="sig-title"
                style={{ fontSize: 16, color: accentColor, fontWeight: 600 }}
              >
                BBSCET
              </div>
              <div
                className="sig-role"
                style={{ fontSize: 13, color: '#777', lineHeight: 1.3 }}
              >
                Director,<br /> DR. Ashutosh Shrivastava
              </div>
            </div>

            <div
              className="footer-col right"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 180 }}
            >
              <div
                className="sig-line"
                style={{
                  width: 252,
                  height: 2,
                  background: accentColor,
                  margin: '0 auto 2px',
                  opacity: 0.4
                }}
              />
              <div
                className="sig-title"
                style={{ fontSize: 16, color: accentColor, fontWeight: 600 }}
              >
                Issued by Tech Hub BBS
              </div>
              <div
                className="sig-role"
                style={{ fontSize: 13, color: '#777', lineHeight: 1.3 }}
              >
                President & Coordinator<br />Mukesh Kumar
              </div>
            </div>
          </div>

          <div
            className="qr-floating"
            style={{ position: 'absolute', right: '2%', bottom: 55 }}
          >
            <div
              className="qr-verification-box"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 20px',
                background: `${accentColor}08`,
                border: `2px solid ${accentColor}20`,
                borderRadius: 11
              }}
            >
              <div
                className="qr-mini-box"
                style={{
                  background: '#ffffff',
                  border: `3px solid ${accentColor}`,
                  borderRadius: 7,
                  padding: 5,
                  boxShadow: `0 0 18px ${accentColor}15`
                }}
              >
                <img
                  src={qrCodeUrl}
                  alt="QR"
                  className="qr-mini-img"
                  style={{ width: 144, height: 144, display: 'block' }}
                />
              </div>
              <div
                className="qr-scan-label"
                style={{
                  fontSize: 16,
                  color: accentColor,
                  textTransform: 'uppercase',
                  letterSpacing: 0.9,
                  fontWeight: 600,
                  marginTop: 5
                }}
              >
                Scan to Verify
              </div>
              <div
                className="qr-cert-id"
                style={{
                  fontSize: 18,
                  color: '#999',
                  fontFamily: 'monospace',
                  letterSpacing: 0.9,
                  marginTop: 3
                }}
              >
                {certificateId}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
