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
  const qrCodeUrl = data.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&format=png`

  const techHubLogoUrl = '/certificates/logos/techhubbs.png'
  const bbsGroupLogoUrl = '/certificates/logos/bbsgroup.png'
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
    
    @font-face {
      font-family: 'Great Vibes';
      src: url('https://fonts.gstatic.com/s/greatvibes/v16/RWmMoKWR8V214OGfVQOc40C7Qd7yj0e7C7S.woff2') format('woff2');
      font-weight: 400;
      font-display: swap;
    }
    
    body {
      font-family: 'Source Sans 3', sans-serif;
      background: #0a0a0a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    
    .certificate {
      width: 100%;
      max-width: 960px;
      aspect-ratio: 16 / 9;
      background: linear-gradient(145deg, #0d0d0d 0%, #141414 50%, #0d0d0d 100%);
      position: relative;
      overflow: hidden;
    }
    
    .safe-area {
      position: absolute;
      top: 0.6%;
      left: 0.6%;
      right: 0.6%;
      bottom: 0.6%;
      border: 2.5px solid ${borderColor};
      pointer-events: none;
    }
    
    .inner-safe {
      position: absolute;
      top: 1.5%;
      left: 1.5%;
      right: 1.5%;
      bottom: 1.5%;
      border: 1px solid ${borderColor}18;
      pointer-events: none;
    }
    
    .corner {
      position: absolute;
      width: 32px;
      height: 32px;
      border: 1.5px solid ${accentColor};
    }
    
    .corner-tl { top: 0.15%; left: 0.15%; border-right: none; border-bottom: none; }
    .corner-tr { top: 0.15%; right: 0.15%; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 0.15%; left: 0.15%; border-right: none; border-top: none; }
    .corner-br { bottom: 0.15%; right: 0.15%; border-left: none; border-top: none; }
    
    .certificate-content {
      position: absolute;
      top: 1.5%;
      left: 1.5%;
      right: 1.5%;
      bottom: 1.5%;
      display: flex;
      flex-direction: column;
      padding: 0.5% 1.8% 0;
      background: radial-gradient(circle at 50% 10%, ${glowColor} 0%, transparent 40%);
    }
    
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 6px;
      border-bottom: 1px solid ${accentColor}12;
    }
    
    .corner-logo {
      max-height: 40px;
      max-width: 60px;
      object-fit: contain;
      opacity: 0.9;
    }
    
    .main-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .bbs-main-logo {
      max-height: 55px;
      max-width: 120px;
      object-fit: contain;
      filter: drop-shadow(0 0 6px ${accentColor}25) brightness(1.05);
      margin-bottom: 2px;
    }
    
    .techhub-header-logo {
      max-height: 38px;
      max-width: 65px;
      object-fit: contain;
      margin-bottom: 1px;
    }
    
    .techhub-header-name {
      font-family: 'Cinzel', serif;
      font-size: 8px;
      font-weight: 700;
      color: ${accentColor};
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    
    .techhub-header-tagline {
      font-size: 3.5px;
      color: #555;
      letter-spacing: 0.6px;
    }
    
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .main-title {
      font-family: 'Cinzel', serif;
      font-size: 18px;
      font-weight: 700;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 2px;
      text-align: center;
      margin-bottom: 4px;
    }
    
    .recipient-section {
      text-align: center;
    }
    
    .presented-to {
      font-size: 6px;
      color: #888;
      letter-spacing: 1.2px;
      text-transform: uppercase;
    }
    
    .recipient-name {
      font-family: 'Great Vibes', cursive;
      font-size: ${data.name.length > 18 ? '36' : '44'}px;
      font-weight: 400;
      color: #ffffff;
      margin: 3px 0 5px;
      line-height: 1.1;
      text-shadow: 0 0 15px rgba(255,255,255,0.1);
    }
    
    .divider {
      width: 140px;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${accentColor}, transparent);
      margin: 0 auto 4px;
    }
    
    .event-section {
      text-align: center;
      margin-bottom: 4px;
    }
    
    .event-text {
      font-size: 7px;
      color: #999;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    
    .event-name {
      font-family: 'Playfair Display', serif;
      font-size: 12px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 0.8px;
    }
    
    .branding-line {
      text-align: center;
      font-size: 4.5px;
      color: #777;
      letter-spacing: 0.6px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }
    
    .branding-line span {
      color: ${accentColor};
      font-weight: 500;
    }
    
    .branding-logo {
      height: 7px;
      width: auto;
      vertical-align: middle;
    }
    
    .score-row {
      display: flex;
      justify-content: center;
      gap: 12px;
    }
    
    .score-box {
      text-align: center;
      padding: 2px 8px;
      background: ${accentColor}06;
      border: 1px solid ${accentColor}15;
      border-radius: 3px;
    }
    
    .score-label {
      font-size: 4.5px;
      color: #777;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 1px;
    }
    
    .score-value {
      font-family: 'Playfair Display', serif;
      font-size: 10px;
      font-weight: 600;
      color: ${accentColor};
    }
    
    .qr-floating {
      position: absolute;
      right: 2%;
      bottom: 50px;
    }
    
    .qr-verification-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 5px 8px;
      background: ${accentColor}08;
      border: 1px solid ${accentColor}20;
      border-radius: 5px;
    }
    
    .qr-mini-box {
      background: #ffffff;
      border: 1.5px solid ${accentColor};
      border-radius: 3px;
      padding: 2px;
      box-shadow: 0 0 6px ${accentColor}12;
    }
    
    .qr-mini-img {
      width: 40px;
      height: 40px;
      display: block;
    }
    
    .qr-scan-label {
      font-size: 4.5px;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 0.3px;
      font-weight: 600;
      margin-top: 2px;
    }
    
    .qr-cert-id {
      font-size: 5px;
      color: #999;
      font-family: monospace;
      letter-spacing: 0.4px;
      margin-top: 1px;
    }
    
    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 6px 0 2px;
      border-top: 1px solid ${accentColor}08;
    }
    
    .footer-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .footer-col.left {
      min-width: 70px;
    }
    
    .footer-col.center {
      min-width: 130px;
    }
    
    .footer-col.right {
      min-width: 100px;
    }
    
    .footer-label {
      font-size: 4.5px;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 1px;
    }
    
    .footer-value {
      font-size: 5.5px;
      color: #999;
      font-weight: 500;
    }
    
    .sig-line {
      width: 70px;
      height: 1px;
      background: ${accentColor};
      margin: 0 auto 1px;
      opacity: 0.4;
    }
    
    .sig-title {
      font-size: 4.5px;
      color: ${accentColor};
      font-weight: 600;
    }
    
    .sig-role {
      font-size: 3.5px;
      color: #777;
      line-height: 1.2;
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
      <div class="header-section">
        <img src="${csiLogoUrl}" alt="CSI" class="corner-logo" onerror="this.style.display='none'" />
        
        <div class="main-header">
          <img src="${bbsGroupLogoUrl}" alt="BBS Group" class="bbs-main-logo" onerror="this.style.display='none'" />
          <img src="${techHubLogoUrl}" alt="Tech Hub BBS" class="techhub-header-logo" onerror="this.style.display='none'" />
          <div class="techhub-header-name">Tech Hub BBS</div>
          <div class="techhub-header-tagline">Empowering Innovation & Technical Excellence</div>
        </div>
        
        <img src="${unstopLogoUrl}" alt="Unstop" class="corner-logo" onerror="this.style.display='none'" />
      </div>
      
      <div class="main-content">
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
          Organised by <span>Tech Hub BBS</span> &nbsp;|&nbsp; In collaboration with <span>CSI</span> &amp; <span>BBS Coding Club</span> &nbsp;|&nbsp; Powered by <img src="${unstopLogoUrl}" alt="Unstop" class="branding-logo" />
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
      </div>
      
      <div class="footer-row">
        <div class="footer-col left">
          <div class="footer-label">Date of Issue</div>
          <div class="footer-value">${data.date}</div>
        </div>
        
        <div class="footer-col center">
          <div class="sig-line"></div>
          <div class="sig-title">Digitally Signed by BBSCET</div>
          <div class="sig-role">Director, BBSCET<br/>Prof. Ashutosh Shrivastava</div>
        </div>
        
        <div class="footer-col right">
          <div class="sig-line"></div>
          <div class="sig-title">Issued by Tech Hub BBS</div>
          <div class="sig-role">President & Coordinator<br/>Mukesh Kumar</div>
        </div>
      </div>
      
      <div class="qr-floating">
        <div class="qr-verification-box">
          <div class="qr-mini-box">
            <img src="${qrCodeUrl}" alt="QR" class="qr-mini-img" />
          </div>
          <div class="qr-scan-label">Scan to Verify</div>
          <div class="qr-cert-id">${data.certificateId}</div>
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
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.executablePath(),
      headless: true
    })

    const page = await browser.newPage()

    await page.setContent(template, { waitUntil: 'networkidle0', timeout: 30000 })

    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        if (document.readyState === 'complete') {
          setTimeout(resolve, 500)
        } else {
          window.addEventListener('load', () => setTimeout(resolve, 500))
        }
      })
    })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      landscape: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 }
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
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.executablePath(),
      headless: true
    })

    const page = await browser.newPage()

    await page.setContent(template, { waitUntil: 'networkidle0', timeout: 30000 })

    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        if (document.readyState === 'complete') {
          setTimeout(resolve, 500)
        } else {
          window.addEventListener('load', () => setTimeout(resolve, 500))
        }
      })
    })

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true,
      omitBackground: false
    })

    await browser.close()

    return Buffer.from(screenshot as string, 'base64')
  } catch (error) {
    console.error('Image generation error:', error)
    throw new Error('Failed to generate image')
  }
}
