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
        return 'rgba(255, 215, 0, 0.04)'
      case 'appreciation':
        return 'rgba(65, 105, 225, 0.04)'
      default:
        return 'rgba(0, 206, 209, 0.04)'
    }
  }

  const borderColor = getBorderColor()
  const accentColor = getAccentColor()
  const glowColor = getGlowColor()
  const title = getTitle()
  
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
    }
    
    .safe-area {
      position: absolute;
      top: 8px;
      left: 8px;
      right: 8px;
      bottom: 8px;
      border: 3px solid ${borderColor};
      pointer-events: none;
    }
    
    .inner-safe {
      position: absolute;
      top: 18px;
      left: 18px;
      right: 18px;
      bottom: 18px;
      border: 1px solid ${borderColor}20;
      pointer-events: none;
    }
    
    .corner {
      position: absolute;
      width: 40px;
      height: 40px;
      border: 2px solid ${accentColor};
    }
    
    .corner-tl { top: 1px; left: 1px; border-right: none; border-bottom: none; }
    .corner-tr { top: 1px; right: 1px; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 1px; left: 1px; border-right: none; border-top: none; }
    .corner-br { bottom: 1px; right: 1px; border-left: none; border-top: none; }
    
    .certificate-content {
      position: absolute;
      top: 18px;
      left: 18px;
      right: 18px;
      bottom: 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 12px 20px;
      background: radial-gradient(circle at 50% 12%, ${glowColor} 0%, transparent 45%);
    }
    
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .collab-logos {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    .logo-img {
      max-height: 35px;
      max-width: 75px;
      object-fit: contain;
    }
    
    .unstop-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .unstop-logo-img {
      max-height: 24px;
      max-width: 55px;
      object-fit: contain;
    }
    
    .unstop-label {
      font-size: 6px;
      color: #666;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    
    .header-section {
      text-align: center;
      padding: 6px 0;
    }
    
    .org-label {
      font-size: 10px;
      font-weight: 500;
      color: #888;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    
    .org-logo {
      max-height: 42px;
      margin-bottom: 4px;
    }
    
    .org-name {
      font-family: 'Cinzel', serif;
      font-size: 24px;
      font-weight: 700;
      color: ${accentColor};
      letter-spacing: 4px;
      text-transform: uppercase;
      text-shadow: 0 0 20px ${accentColor}30;
    }
    
    .tagline {
      font-size: 8px;
      color: #444;
      letter-spacing: 1.5px;
      margin-top: 3px;
    }
    
    .main-title {
      font-family: 'Cinzel', serif;
      font-size: 30px;
      font-weight: 700;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 3px;
      text-align: center;
      margin-top: 8px;
    }
    
    .recipient-section {
      text-align: center;
      padding: 4px 0;
    }
    
    .presented-to {
      font-size: 9px;
      color: #777;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    
    .recipient-name {
      font-family: 'Great Vibes', cursive;
      font-size: ${data.name.length > 18 ? '44' : '52'}px;
      font-weight: 400;
      color: #ffffff;
      margin: 4px 0 10px;
      line-height: 1.15;
      text-shadow: 0 0 20px rgba(255,255,255,0.1);
    }
    
    .divider {
      width: 180px;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${accentColor}, transparent);
      margin: 0 auto 10px;
    }
    
    .event-section {
      text-align: center;
    }
    
    .event-text {
      font-size: 10px;
      color: #888;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    
    .event-name {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 1.5px;
    }
    
    .branding-line {
      text-align: center;
      font-size: 8px;
      color: #777;
      letter-spacing: 1px;
      margin: 8px 0;
    }
    
    .branding-line span {
      color: ${accentColor};
      font-weight: 500;
    }
    
    .score-row {
      display: flex;
      justify-content: center;
      gap: 25px;
      margin: 8px 0;
    }
    
    .score-box {
      text-align: center;
      padding: 6px 16px;
      background: ${accentColor}06;
      border: 1px solid ${accentColor}18;
      border-radius: 4px;
    }
    
    .score-label {
      font-size: 7px;
      color: #777;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2px;
    }
    
    .score-value {
      font-family: 'Playfair Display', serif;
      font-size: 14px;
      font-weight: 600;
      color: ${accentColor};
    }
    
    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 10px;
      border-top: 1px solid ${accentColor}12;
    }
    
    .footer-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .footer-label {
      font-size: 7px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 3px;
    }
    
    .footer-value {
      font-size: 9px;
      color: #aaa;
      font-weight: 500;
    }
    
    .footer-col.signature {
      min-width: 160px;
    }
    
    .sig-line {
      width: 120px;
      height: 1px;
      background: ${accentColor};
      margin: 0 auto 4px;
      opacity: 0.4;
    }
    
    .sig-title {
      font-size: 9px;
      color: ${accentColor};
      font-weight: 600;
    }
    
    .sig-role {
      font-size: 7px;
      color: #888;
      line-height: 1.3;
    }
    
    .sig-name {
      font-family: 'Great Vibes', cursive;
      font-size: 16px;
      color: #fff;
      margin-top: 2px;
    }
    
    .footer-col.qr {
      min-width: 110px;
    }
    
    .qr-box {
      background: #ffffff;
      border: 2px solid ${accentColor};
      border-radius: 6px;
      padding: 6px;
      box-shadow: 0 0 15px ${accentColor}20, 0 2px 8px rgba(0,0,0,0.2);
    }
    
    .qr-img {
      width: 65px;
      height: 65px;
      display: block;
    }
    
    .qr-text {
      font-size: 7px;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      margin-top: 4px;
    }
    
    .qr-sub {
      font-size: 6px;
      color: #666;
      margin-top: 1px;
    }
    
    .cert-id-box {
      font-size: 8px;
      color: #999;
      font-family: monospace;
      letter-spacing: 1px;
      padding: 3px 6px;
      background: ${accentColor}06;
      border: 1px solid ${accentColor}15;
      border-radius: 3px;
      margin-top: 6px;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="safe-area"></div>
    <div class="inner-safe"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    
    <div class="certificate-content">
      <div class="top-row">
        <div class="collab-logos">
          <img src="${csiLogoUrl}" alt="CSI" class="logo-img" onerror="this.style.display='none'" />
          <img src="${collegeLogoUrl}" alt="BBSCET" class="logo-img" onerror="this.style.display='none'" />
        </div>
        <div class="unstop-wrapper">
          <img src="${unstopLogoUrl}" alt="Unstop" class="unstop-logo-img" onerror="this.style.display='none'" />
          <span class="unstop-label">Powered by</span>
        </div>
      </div>
      
      <div class="header-section">
        <div class="org-label">Organised by</div>
        <img src="${techHubLogoUrl}" alt="Tech Hub BBS" class="org-logo" onerror="this.style.display='none'" />
        <div class="org-name">Tech Hub BBS</div>
        <div class="tagline">Empowering Innovation & Technical Excellence</div>
      </div>
      
      <div class="main-title">${title}</div>
      
      <div class="recipient-section">
        <div class="presented-to">This certificate is proudly presented to</div>
        <div class="recipient-name">${data.name}</div>
        <div class="divider"></div>
      </div>
      
      <div class="event-section">
        <div class="event-text">${getBodyText()}</div>
        <div class="event-name">${data.event}</div>
      </div>
      
      <div class="branding-line">
        Organised by <span>Tech Hub BBS</span> &nbsp;|&nbsp; In collaboration with <span>Computer Society of India</span> and <span>BBS Coding Club</span> &nbsp;|&nbsp; Powered by <span>Unstop</span>
      </div>
      
      <div class="score-row">
        ${data.rank ? `
        <div class="score-box">
          <div class="score-label">Achieved Rank</div>
          <div class="score-value">#${data.rank}</div>
        </div>
        ` : ''}
        ${data.score !== null ? `
        <div class="score-box">
          <div class="score-label">Score</div>
          <div class="score-value">${data.score}/20</div>
        </div>
        ` : ''}
      </div>
      
      <div class="footer-row">
        <div class="footer-col">
          <div class="footer-label">Date of Issue</div>
          <div class="footer-value">${data.date}</div>
        </div>
        
        <div class="footer-col signature">
          <div class="sig-line"></div>
          <div class="sig-title">Digitally Signed by BBSCET</div>
          <div class="sig-role">Director, BBSCET<br/>Prof. Ashutosh Shrivastava</div>
        </div>
        
        <div class="footer-col signature">
          <div class="sig-line"></div>
          <div class="sig-title">Issued by Tech Hub BBS</div>
          <div class="sig-role">President & Student Coordinator<br/>Mukesh Kumar</div>
        </div>
        
        <div class="footer-col qr">
          <div class="qr-box">
            <img src="${qrCodeUrl}" alt="QR" class="qr-img" />
          </div>
          <div class="qr-text">Scan to Verify</div>
          <div class="qr-sub">Verify Authenticity Online</div>
          <div class="cert-id-box">${data.certificateId}</div>
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

export async function generateImage(template: string): Promise<Buffer> {
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
    
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true
    })
    
    await browser.close()
    
    return Buffer.from(screenshot as string, 'base64')
  } catch (error) {
    console.error('Image generation error:', error)
    throw new Error('Failed to generate image')
  }
}
