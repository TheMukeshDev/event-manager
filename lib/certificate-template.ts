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
  const qrCodeUrl = data.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verifyUrl)}&format=png`

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
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    
    .certificate {
      width: 100%;
      max-width: 960px;
      aspect-ratio: 16 / 9;
      background: linear-gradient(145deg, #0d0d0d 0%, #141414 50%, #0d0d0d 100%);
      position: relative;
    }
    
    .safe-area {
      position: absolute;
      top: 0.8%;
      left: 0.8%;
      right: 0.8%;
      bottom: 0.8%;
      border: 2.5px solid ${borderColor};
      pointer-events: none;
    }
    
    .inner-safe {
      position: absolute;
      top: 1.8%;
      left: 1.8%;
      right: 1.8%;
      bottom: 1.8%;
      border: 1px solid ${borderColor}18;
      pointer-events: none;
    }
    
    .corner {
      position: absolute;
      width: 35px;
      height: 35px;
      border: 1.5px solid ${accentColor};
    }
    
    .corner-tl { top: 0.2%; left: 0.2%; border-right: none; border-bottom: none; }
    .corner-tr { top: 0.2%; right: 0.2%; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 0.2%; left: 0.2%; border-right: none; border-top: none; }
    .corner-br { bottom: 0.2%; right: 0.2%; border-left: none; border-top: none; }
    
    .certificate-content {
      position: absolute;
      top: 1.8%;
      left: 1.8%;
      right: 1.8%;
      bottom: 1.8%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.2% 2%;
      background: radial-gradient(circle at 50% 10%, ${glowColor} 0%, transparent 40%);
    }
    
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .collab-logos {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .logo-img {
      max-height: 30px;
      max-width: 65px;
      object-fit: contain;
    }
    
    .unstop-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .unstop-logo-img {
      max-height: 20px;
      max-width: 45px;
      object-fit: contain;
    }
    
    .unstop-label {
      font-size: 5px;
      color: #555;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-top: 1px;
    }
    
    .header-section {
      text-align: center;
      padding: 0.5% 0;
    }
    
    .org-label {
      font-size: 8px;
      font-weight: 500;
      color: #777;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    
    .org-logo {
      max-height: 36px;
      margin-bottom: 3px;
    }
    
    .org-name {
      font-family: 'Cinzel', serif;
      font-size: 20px;
      font-weight: 700;
      color: ${accentColor};
      letter-spacing: 3.5px;
      text-transform: uppercase;
      text-shadow: 0 0 15px ${accentColor}25;
    }
    
    .tagline {
      font-size: 6px;
      color: #333;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    
    .main-title {
      font-family: 'Cinzel', serif;
      font-size: 24px;
      font-weight: 700;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 2.5px;
      text-align: center;
      margin-top: 0.5%;
    }
    
    .recipient-section {
      text-align: center;
      padding: 0.3% 0;
    }
    
    .presented-to {
      font-size: 7px;
      color: #666;
      letter-spacing: 1.2px;
      text-transform: uppercase;
    }
    
    .recipient-name {
      font-family: 'Great Vibes', cursive;
      font-size: ${data.name.length > 18 ? '38' : '44'}px;
      font-weight: 400;
      color: #ffffff;
      margin: 0.3% 0 0.8%;
      line-height: 1.1;
      text-shadow: 0 0 15px rgba(255,255,255,0.08);
    }
    
    .divider {
      width: 150px;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${accentColor}, transparent);
      margin: 0 auto 0.8%;
    }
    
    .event-section {
      text-align: center;
    }
    
    .event-text {
      font-size: 8px;
      color: #777;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    
    .event-name {
      font-family: 'Playfair Display', serif;
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 1.2px;
    }
    
    .branding-line {
      text-align: center;
      font-size: 6px;
      color: #666;
      letter-spacing: 0.8px;
      margin: 0.6% 0;
    }
    
    .branding-line span {
      color: ${accentColor};
      font-weight: 500;
    }
    
    .score-row {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 0.6% 0;
    }
    
    .score-box {
      text-align: center;
      padding: 4px 12px;
      background: ${accentColor}05;
      border: 1px solid ${accentColor}15;
      border-radius: 3px;
    }
    
    .score-label {
      font-size: 5.5px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 1px;
    }
    
    .score-value {
      font-family: 'Playfair Display', serif;
      font-size: 12px;
      font-weight: 600;
      color: ${accentColor};
    }
    
    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 0.8%;
      border-top: 1px solid ${accentColor}10;
    }
    
    .footer-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .footer-label {
      font-size: 5.5px;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 2px;
    }
    
    .footer-value {
      font-size: 7.5px;
      color: #999;
      font-weight: 500;
    }
    
    .footer-col.signature {
      min-width: 130px;
    }
    
    .sig-line {
      width: 100px;
      height: 1px;
      background: ${accentColor};
      margin: 0 auto 3px;
      opacity: 0.35;
    }
    
    .sig-title {
      font-size: 7px;
      color: ${accentColor};
      font-weight: 600;
    }
    
    .sig-role {
      font-size: 5.5px;
      color: #777;
      line-height: 1.25;
    }
    
    .sig-name {
      font-family: 'Great Vibes', cursive;
      font-size: 13px;
      color: #fff;
      margin-top: 1px;
    }
    
    .footer-col.qr {
      min-width: 90px;
    }
    
    .qr-box {
      background: #ffffff;
      border: 1.5px solid ${accentColor};
      border-radius: 5px;
      padding: 4px;
      box-shadow: 0 0 12px ${accentColor}18, 0 1px 5px rgba(0,0,0,0.15);
    }
    
    .qr-img {
      width: 55px;
      height: 55px;
      display: block;
    }
    
    .qr-text {
      font-size: 5.5px;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 0.4px;
      font-weight: 600;
      margin-top: 3px;
    }
    
    .qr-sub {
      font-size: 5px;
      color: #555;
      margin-top: 0.5px;
    }
    
    .cert-id-box {
      font-size: 6.5px;
      color: #888;
      font-family: monospace;
      letter-spacing: 0.8px;
      padding: 2px 5px;
      background: ${accentColor}05;
      border: 1px solid ${accentColor}12;
      border-radius: 2px;
      margin-top: 4px;
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
      defaultViewport: { width: 960, height: 540 },
      executablePath: await chromium.executablePath(),
      headless: true
    })
    
    const page = await browser.newPage()
    await page.setContent(template, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      landscape: true
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
      defaultViewport: { width: 960, height: 540 },
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
