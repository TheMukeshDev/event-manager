'use client'

import { forwardRef, useEffect } from 'react'

export const CERTIFICATE_WIDTH = 1600
export const CERTIFICATE_HEIGHT = 900

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
    const recipientNameFontSize = name.length > 18 ? 72 : 88

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
            border: `2.5px solid ${accentColor}`,
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
            border: `1px solid ${accentColor}18`,
            pointerEvents: 'none'
          }}
        />

        <div
          className="corner corner-tl"
          style={{
            position: 'absolute',
            top: '0.15%',
            left: '0.15%',
            width: 32,
            height: 32,
            border: `1.5px solid ${accentColor}`,
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
            width: 32,
            height: 32,
            border: `1.5px solid ${accentColor}`,
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
            width: 32,
            height: 32,
            border: `1.5px solid ${accentColor}`,
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
            width: 32,
            height: 32,
            border: `1.5px solid ${accentColor}`,
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
            padding: '0.5% 1.8% 0',
            background: `radial-gradient(circle at 50% 10%, ${glowColor} 0%, transparent 40%)`
          }}
        >
          <div
            className="header-section"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 8,
              borderBottom: `1px solid ${accentColor}12`
            }}
          >
            <img
              src="/certificates/logos/csi.png"
              alt="CSI"
              className="corner-logo"
              style={{
                maxHeight: 45,
                maxWidth: 70,
                objectFit: 'contain',
                filter: `drop-shadow(0 0 8px ${accentColor}30) brightness(1.1) contrast(1.05)`
              }}
            />

            <img
              src="/certificates/logos/bbslogo.png"
              alt="BBS Group"
              className="bbs-main-logo"
              style={{
                maxHeight: 100,
                maxWidth: 200,
                objectFit: 'contain',
                filter: `drop-shadow(0 0 15px rgba(255, 215, 0, 0.5)) brightness(1.2) contrast(1.1)`
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
                  maxHeight: 45,
                  maxWidth: 80,
                  objectFit: 'contain',
                  filter: `drop-shadow(0 0 10px ${accentColor}40) brightness(1.15) contrast(1.1)`
                }}
              />
              <div
                className="techhub-header-name"
                style={{
                  fontFamily: "'Cinzel', 'Times New Roman', serif",
                  fontSize: 6,
                  fontWeight: 700,
                  color: accentColor,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginTop: 1
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
                fontSize: 36,
                fontWeight: 700,
                color: accentColor,
                textTransform: 'uppercase',
                letterSpacing: 4,
                textAlign: 'center',
                marginBottom: 8
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
                  fontSize: 12,
                  color: '#888',
                  letterSpacing: 2,
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
                  margin: '6px 0 10px',
                  lineHeight: 1.1,
                  textShadow: '0 0 20px rgba(255,255,255,0.15)'
                }}
              >
                {name}
              </div>
              <div
                className="divider"
                style={{
                  width: 280,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                  margin: '0 auto 8px'
                }}
              />
            </div>

            <div
              className="event-section"
              style={{ textAlign: 'center', marginBottom: 8 }}
            >
              <div
                className="event-text"
                style={{
                  fontSize: 14,
                  color: '#999',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 4
                }}
              >
                {bodyText}
              </div>
              <div
                className="event-name"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: 1.5
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
                gap: 4,
                marginBottom: 8
              }}
            >
              <div
                className="branding-line gold"
                style={{
                  fontSize: 10,
                  color: accentColor,
                  fontWeight: 500,
                  letterSpacing: 0.8,
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
                  gap: 2,
                  fontSize: 10,
                  color: '#888',
                  letterSpacing: 0.8
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Powered by{' '}
                  <img
                    src="/certificates/logos/unstop.png"
                    alt="Unstop"
                    className="branding-logo"
                    style={{
                      height: 28,
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      flexShrink: 0,
                      filter: `drop-shadow(0 0 6px ${accentColor}35)`
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
                style={{ display: 'flex', justifyContent: 'center', gap: 20 }}
              >
                {rank !== null && (
                  <div
                    className="score-box"
                    style={{
                      textAlign: 'center',
                      padding: '4px 16px',
                      background: `${accentColor}06`,
                      border: `1px solid ${accentColor}15`,
                      borderRadius: 3
                    }}
                  >
                    <div
                      className="score-label"
                      style={{
                        fontSize: 9,
                        color: '#777',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        marginBottom: 2
                      }}
                    >
                      Achieved Rank
                    </div>
                    <div
                      className="score-value"
                      style={{
                        fontFamily: "'Playfair Display', 'Georgia', serif",
                        fontSize: 20,
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
                      padding: '4px 16px',
                      background: `${accentColor}06`,
                      border: `1px solid ${accentColor}15`,
                      borderRadius: 3
                    }}
                  >
                    <div
                      className="score-label"
                      style={{
                        fontSize: 9,
                        color: '#777',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        marginBottom: 2
                      }}
                    >
                      Score
                    </div>
                    <div
                      className="score-value"
                      style={{
                        fontFamily: "'Playfair Display', 'Georgia', serif",
                        fontSize: 20,
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
              padding: '6px 0 2px',
              borderTop: `1px solid ${accentColor}08`
            }}
          >
            <div
              className="footer-col left"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 }}
            >
              <div
                className="footer-label"
                style={{
                  fontSize: 9,
                  color: '#555',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 2
                }}
              >
                Date of Issue
              </div>
              <div
                className="footer-value"
                style={{ fontSize: 11, color: '#999', fontWeight: 500 }}
              >
                {date}
              </div>
            </div>

            <div
              className="footer-col center"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 130 }}
            >
              <div
                className="sig-line"
                style={{
                  width: 140,
                  height: 1,
                  background: accentColor,
                  margin: '0 auto 1px',
                  opacity: 0.4
                }}
              />
              <div
                className="sig-title"
                style={{ fontSize: 9, color: accentColor, fontWeight: 600 }}
              >
                Digitally Signed by BBSCET
              </div>
              <div
                className="sig-role"
                style={{ fontSize: 7, color: '#777', lineHeight: 1.3 }}
              >
                Director, BBSCET<br />Prof. Ashutosh Shrivastava
              </div>
            </div>

            <div
              className="footer-col right"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100 }}
            >
              <div
                className="sig-line"
                style={{
                  width: 140,
                  height: 1,
                  background: accentColor,
                  margin: '0 auto 1px',
                  opacity: 0.4
                }}
              />
              <div
                className="sig-title"
                style={{ fontSize: 9, color: accentColor, fontWeight: 600 }}
              >
                Issued by Tech Hub BBS
              </div>
              <div
                className="sig-role"
                style={{ fontSize: 7, color: '#777', lineHeight: 1.3 }}
              >
                President & Coordinator<br />Mukesh Kumar
              </div>
            </div>
          </div>

          <div
            className="qr-floating"
            style={{ position: 'absolute', right: '2%', bottom: 50 }}
          >
            <div
              className="qr-verification-box"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px 16px',
                background: `${accentColor}08`,
                border: `1px solid ${accentColor}20`,
                borderRadius: 6
              }}
            >
              <div
                className="qr-mini-box"
                style={{
                  background: '#ffffff',
                  border: `2px solid ${accentColor}`,
                  borderRadius: 4,
                  padding: 3,
                  boxShadow: `0 0 10px ${accentColor}15`
                }}
              >
                <img
                  src={qrCodeUrl}
                  alt="QR"
                  className="qr-mini-img"
                  style={{ width: 80, height: 80, display: 'block' }}
                />
              </div>
              <div
                className="qr-scan-label"
                style={{
                  fontSize: 9,
                  color: accentColor,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontWeight: 600,
                  marginTop: 4
                }}
              >
                Scan to Verify
              </div>
              <div
                className="qr-cert-id"
                style={{
                  fontSize: 10,
                  color: '#999',
                  fontFamily: 'monospace',
                  letterSpacing: 0.5,
                  marginTop: 2
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
