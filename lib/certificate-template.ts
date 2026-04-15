export interface CertificateData {
  certificateId: string
  name: string
  event: string
  score: number | null
  rank: number | null
  certificateType: string
  date: string
  qrCodeUrl?: string
}

export function getCertificateTemplate(certificateType: string, data: CertificateData): string {
  const getTitle = () => {
    switch (certificateType) {
      case 'excellence':
        return 'CERTIFICATE OF EXCELLENCE'
      case 'appreciation':
        return 'CERTIFICATE OF APPRECIATION'
      case 'participation':
        return 'CERTIFICATE OF PARTICIPATION'
      case 'winner':
        return 'WINNER'
      case 'runner-up':
        return 'RUNNER-UP'
      case 'second-runner-up':
        return 'SECOND RUNNER-UP'
      default:
        return 'CERTIFICATE OF PARTICIPATION'
    }
  }

  const getSubtitle = () => {
    switch (certificateType) {
      case 'excellence':
        return 'For outstanding performance'
      case 'appreciation':
        return 'For excellent participation'
      case 'participation':
        return 'For participating in'
      case 'winner':
        return 'First Place'
      case 'runner-up':
        return 'Second Place'
      case 'second-runner-up':
        return 'Third Place'
      default:
        return 'For participating in'
    }
  }

  const getBorderColor = () => {
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

  const getAccentColor = () => {
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

  const borderColor = getBorderColor()
  const accentColor = getAccentColor()
  
  const qrCodeUrl = data.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://techquiz2026.vercel.app/verify/${data.certificateId}`)}&format=png`

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate - ${data.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Great+Vibes&family=Poppins:wght@300;400;500;600&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Poppins', sans-serif;
      background: #0a0a0a;
    }
    
    .certificate {
      width: 1123px;
      height: 794px;
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
      position: relative;
      padding: 40px;
    }
    
    .border {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 3px solid ${borderColor};
      pointer-events: none;
    }
    
    .inner-border {
      position: absolute;
      top: 30px;
      left: 30px;
      right: 30px;
      bottom: 30px;
      border: 1px solid ${borderColor}80;
      pointer-events: none;
    }
    
    .corner {
      position: absolute;
      width: 60px;
      height: 60px;
      border: 2px solid ${accentColor};
    }
    
    .corner-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
    .corner-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 10px; left: 10px; border-right: none; border-top: none; }
    .corner-br { bottom: 10px; right: 10px; border-left: none; border-top: none; }
    
    .content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 600;
      color: ${accentColor};
      letter-spacing: 4px;
      margin-bottom: 20px;
      text-transform: uppercase;
    }
    
    .title {
      font-family: 'Cinzel', serif;
      font-size: 48px;
      font-weight: 700;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 8px;
      margin-bottom: 10px;
    }
    
    .subtitle {
      font-size: 16px;
      color: #888;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 40px;
    }
    
    .presented {
      font-size: 14px;
      color: #666;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    
    .name {
      font-family: 'Great Vibes', cursive;
      font-size: ${data.name.length > 25 ? '48' : '60'}px;
      font-weight: 400;
      color: #fff;
      text-align: center;
      margin-bottom: 30px;
      line-height: 1.2;
    }
    
    .event-text {
      font-size: 18px;
      color: #aaa;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .event-name {
      font-size: 28px;
      font-weight: 600;
      color: ${accentColor};
      letter-spacing: 2px;
    }
    
    .details {
      display: flex;
      gap: 60px;
      margin-top: 30px;
      margin-bottom: 40px;
    }
    
    .detail-item {
      text-align: center;
    }
    
    .detail-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }
    
    .detail-value {
      font-size: 24px;
      font-weight: 600;
      color: ${accentColor};
    }
    
    .footer {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 0 40px;
      margin-top: auto;
    }
    
    .footer-item {
      text-align: center;
    }
    
    .footer-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    
    .footer-value {
      font-size: 14px;
      color: #888;
    }
    
    .certificate-id {
      position: absolute;
      bottom: 40px;
      font-size: 12px;
      color: #444;
      font-family: monospace;
      letter-spacing: 2px;
    }
    
    .achievement-badge {
      position: absolute;
      top: 80px;
      right: 80px;
      background: linear-gradient(135deg, ${accentColor}30, ${accentColor}10);
      border: 1px solid ${accentColor};
      padding: 15px 30px;
      border-radius: 4px;
    }
    
    .achievement-text {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      color: ${accentColor};
      letter-spacing: 2px;
    }
    
    .qr-code {
      position: absolute;
      bottom: 30px;
      right: 40px;
      text-align: center;
    }
    
    .qr-image {
      width: 80px;
      height: 80px;
      border: 1px solid ${borderColor};
      border-radius: 4px;
    }
    
    .qr-label {
      font-size: 10px;
      color: #666;
      margin-top: 4px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="border"></div>
    <div class="inner-border"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    
    <div class="content">
      ${certificateType !== 'participation' ? `
      <div class="achievement-badge">
        <span class="achievement-text">${getTitle()}</span>
      </div>
      ` : ''}
      
      <div class="logo">Tech Hub BBS</div>
      <div class="title">${getTitle()}</div>
      <div class="subtitle">${getSubtitle()}</div>
      
      <div class="presented">This certificate is proudly presented to</div>
      <div class="name">${data.name}</div>
      
      <div class="event-text">
        ${certificateType === 'participation' ? 'For successfully participating in' : 'For outstanding performance in'}
      </div>
      <div class="event-name">${data.event}</div>
      
      <div class="details">
        ${data.rank ? `
        <div class="detail-item">
          <div class="detail-label">Rank</div>
          <div class="detail-value">#${data.rank}</div>
        </div>
        ` : ''}
        ${data.score !== null ? `
        <div class="detail-item">
          <div class="detail-label">Score</div>
          <div class="detail-value">${data.score}/20</div>
        </div>
        ` : ''}
      </div>
      
      <div class="footer">
        <div class="footer-item">
          <div class="footer-label">Date</div>
          <div class="footer-value">${data.date}</div>
        </div>
        <div class="footer-item">
          <div class="footer-label">Authorized By</div>
          <div class="footer-value">Tech Hub BBS</div>
        </div>
      </div>
      
      <div class="certificate-id">Certificate ID: ${data.certificateId}</div>
      
      <div class="qr-code">
        <img src="${qrCodeUrl}" alt="QR Code" class="qr-image" />
        <div class="qr-label">Scan to verify</div>
      </div>
    </div>
  </div>
</body>
</html>`
}

export async function generatePDF(template: string): Promise<Buffer> {
  try {
    const puppeteer = require('puppeteer-core')
    const chromium = require('@sparticuz/chromium')
    
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1123, height: 794 },
      executablePath: await chromium.executablePath(),
      headless: true
    })
    
    const page = await browser.newPage()
    await page.setContent(template, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      landscape: false
    })
    
    await browser.close()
    
    return Buffer.from(pdf)
  } catch (error) {
    console.error('PDF generation error:', error)
    throw new Error('Failed to generate PDF')
  }
}