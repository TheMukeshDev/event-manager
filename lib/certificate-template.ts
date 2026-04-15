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

const VERIFY_BASE_URL = process.env.NEXT_PUBLIC_VERIFY_BASE_URL || 'https://techhub-bbs.vercel.app'

const LOGO_BASE = ''

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
        return 'WINNER CERTIFICATE'
      case 'runner-up':
        return 'RUNNER-UP CERTIFICATE'
      case 'second-runner-up':
        return 'SECOND RUNNER-UP CERTIFICATE'
      default:
        return 'CERTIFICATE OF PARTICIPATION'
    }
  }

  const getBodyText = () => {
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

  const getGlowColor = () => {
    switch (certificateType) {
      case 'excellence':
        return 'rgba(255, 215, 0, 0.08)'
      case 'appreciation':
        return 'rgba(65, 105, 225, 0.08)'
      default:
        return 'rgba(0, 206, 209, 0.08)'
    }
  }

  const borderColor = getBorderColor()
  const accentColor = getAccentColor()
  const glowColor = getGlowColor()
  
  const verifyUrl = `${VERIFY_BASE_URL}/verify/${data.certificateId}`
  const qrCodeUrl = data.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verifyUrl)}&format=png`

  const techHubLogoUrl = '/certificates/logos/techhubbs.png'
  const csiLogoUrl = '/certificates/logos/csi.png'
  const collegeLogoUrl = '/certificates/logos/bbslogo.png'
  const unstopLogoUrl = '/certificates/logos/unstop.png'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate - ${data.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Great+Vibes&family=Playfair+Display:wght@400;500;600&family=Source+Sans+3:wght@300;400;500;600&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Source Sans 3', sans-serif;
      background: #0a0a0a;
    }
    
    .certificate {
      width: 1123px;
      height: 794px;
      background: linear-gradient(145deg, #0d0d0d 0%, #141414 50%, #0d0d0d 100%);
      position: relative;
      padding: 50px;
    }
    
    .border {
      position: absolute;
      top: 15px;
      left: 15px;
      right: 15px;
      bottom: 15px;
      border: 4px solid ${borderColor};
      pointer-events: none;
    }
    
    .inner-border {
      position: absolute;
      top: 25px;
      left: 25px;
      right: 25px;
      bottom: 25px;
      border: 1px solid ${borderColor}40;
      pointer-events: none;
    }
    
    .corner {
      position: absolute;
      width: 80px;
      height: 80px;
      border: 2px solid ${accentColor};
    }
    
    .corner-tl { top: 5px; left: 5px; border-right: none; border-bottom: none; }
    .corner-tr { top: 5px; right: 5px; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 5px; left: 5px; border-right: none; border-top: none; }
    .corner-br { bottom: 5px; right: 5px; border-left: none; border-top: none; }
    
    .content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 35px 50px;
      background: radial-gradient(circle at center, ${glowColor} 0%, transparent 70%);
    }
    
    .top-logos {
      position: absolute;
      top: 45px;
      left: 50px;
      right: 50px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .collab-logos {
      display: flex;
      gap: 15px;
      align-items: center;
    }
    
    .logo-img {
      max-height: 40px;
      max-width: 100px;
      object-fit: contain;
    }
    
    .unstop-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .unstop-logo-img {
      max-height: 35px;
      max-width: 80px;
      object-fit: contain;
      margin-bottom: 3px;
    }
    
    .unstop-text {
      font-size: 9px;
      color: #666;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    .logo-section {
      text-align: center;
      margin-bottom: 15px;
    }
    
    .org-name {
      font-family: 'Playfair Display', serif;
      font-size: 13px;
      font-weight: 500;
      color: #888;
      letter-spacing: 5px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    
    .main-logo {
      font-family: 'Cinzel', serif;
      font-size: 26px;
      font-weight: 700;
      color: ${accentColor};
      letter-spacing: 5px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    
    .tagline {
      font-size: 10px;
      color: #555;
      letter-spacing: 2px;
    }
    
    .title {
      font-family: 'Cinzel', serif;
      font-size: 38px;
      font-weight: 700;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 5px;
      margin-top: 25px;
      margin-bottom: 6px;
      text-align: center;
    }
    
    .certificate-type-badge {
      display: inline-block;
      padding: 5px 18px;
      background: ${accentColor}15;
      border: 1px solid ${accentColor}40;
      border-radius: 20px;
      font-size: 11px;
      color: ${accentColor};
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 25px;
    }
    
    .presented-text {
      font-size: 12px;
      color: #666;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    
    .name {
      font-family: 'Great Vibes', cursive;
      font-size: ${data.name.length > 18 ? '48' : '58'}px;
      font-weight: 400;
      color: #fff;
      text-align: center;
      margin-bottom: 20px;
      line-height: 1.3;
      max-width: 90%;
    }
    
    .divider {
      width: 180px;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${accentColor}, transparent);
      margin-bottom: 20px;
    }
    
    .event-text {
      font-size: 13px;
      color: #777;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 6px;
      text-align: center;
    }
    
    .event-name {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 3px;
      margin-bottom: 25px;
      text-align: center;
    }
    
    .branding-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
    }
    
    .organiser-text {
      font-size: 11px;
      color: #888;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .organiser-text span {
      color: ${accentColor};
      font-weight: 600;
    }
    
    .collab-text {
      font-size: 10px;
      color: #666;
      letter-spacing: 1px;
      text-align: center;
    }
    
    .collab-text span {
      color: ${accentColor};
    }
    
    .powered-text {
      font-size: 10px;
      color: #555;
      letter-spacing: 1px;
    }
    
    .powered-text span {
      color: ${accentColor};
      font-weight: 500;
    }
    
    .details {
      display: flex;
      gap: 40px;
      margin-bottom: 25px;
    }
    
    .detail-item {
      text-align: center;
      padding: 12px 25px;
      background: ${accentColor}08;
      border: 1px solid ${accentColor}30;
      border-radius: 6px;
    }
    
    .detail-label {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 4px;
    }
    
    .detail-value {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 600;
      color: ${accentColor};
    }
    
    .footer-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      margin-top: auto;
      padding: 0 20px;
    }
    
    .footer-left {
      text-align: left;
    }
    
    .footer-center {
      text-align: center;
    }
    
    .footer-right {
      text-align: right;
    }
    
    .footer-label {
      font-size: 10px;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 5px;
    }
    
    .footer-value {
      font-size: 12px;
      color: #888;
    }
    
    .signature {
      font-family: 'Great Vibes', cursive;
      font-size: 18px;
      color: ${accentColor};
      margin-bottom: 4px;
    }
    
    .cert-id {
      font-size: 10px;
      color: #444;
      font-family: monospace;
      letter-spacing: 3px;
      padding: 6px 12px;
      background: ${accentColor}10;
      border-radius: 4px;
    }
    
    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .qr-image {
      width: 80px;
      height: 80px;
      border: 2px solid ${borderColor};
      border-radius: 6px;
      margin-bottom: 5px;
    }
    
    .qr-label {
      font-size: 9px;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 1px;
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
    
    <div class="top-logos">
      <div class="collab-logos">
        <img src="${csiLogoUrl}" alt="CSI" class="logo-img" onerror="this.style.display='none'" />
        <img src="${collegeLogoUrl}" alt="College" class="logo-img" onerror="this.style.display='none'" />
      </div>
      <div class="unstop-logo">
        <img src="${unstopLogoUrl}" alt="Unstop" class="unstop-logo-img" onerror="this.style.display='none'" />
        <span class="unstop-text">Powered by</span>
      </div>
    </div>
    
    <div class="content">
      <div class="logo-section">
        <div class="org-name">Organised by</div>
        <img src="${techHubLogoUrl}" alt="Tech Hub BBS" class="logo-img" style="max-height: 35px; margin: 5px 0;" onerror="this.style.display='none'" />
        <div class="main-logo" style="margin-top: 0;">Tech Hub BBS</div>
        <div class="tagline">Empowering Innovation & Technical Excellence</div>
      </div>
      
      <div class="title">${getTitle()}</div>
      <div class="certificate-type-badge">${getTitle()}</div>
      
      <div class="presented-text">This certificate is proudly presented to</div>
      <div class="name">${data.name}</div>
      <div class="divider"></div>
      
      <div class="event-text">${getBodyText()}</div>
      <div class="event-name">${data.event}</div>
      
      <div class="branding-section">
        <p class="organiser-text">Organised by <span>Tech Hub BBS</span></p>
        <p class="collab-text">In collaboration with <span>Computer Society of India</span> and <span>BBS Coding Club</span></p>
        <p class="powered-text">Powered by <span>Unstop</span></p>
      </div>
      
      <div class="details">
        ${data.rank ? `
        <div class="detail-item">
          <div class="detail-label">Achieved Rank</div>
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
      
      <div class="footer-section">
        <div class="footer-left">
          <div class="footer-label">Date of Issue</div>
          <div class="footer-value">${data.date}</div>
        </div>
        
        <div class="footer-center">
          <div class="cert-id">${data.certificateId}</div>
        </div>
        
        <div class="footer-right">
          <div class="qr-section">
            <img src="${qrCodeUrl}" alt="QR Code" class="qr-image" />
            <div class="qr-label">Scan to Verify</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
}

export async function generatePDF(template: string): Promise<Buffer> {
  try {
    const puppeteer = await import('puppeteer-core')
    const chromium = await import('@sparticuz/chromium')
    
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