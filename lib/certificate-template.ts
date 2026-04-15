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
      justify-content: space-between;
      padding: 0.8% 1.8%;
      background: radial-gradient(circle at 50% 10%, ${glowColor} 0%, transparent 40%);
    }
    
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8% 0;
      border-bottom: 1px solid ${accentColor}15;
    }
    
    .left-header {
      display: flex;
      align-items: center;
      flex: 1;
    }
    
    .csi-logo {
      max-height: 65px;
      max-width: 85px;
      object-fit: contain;
    }
    
    .center-header {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }
    
    .bbs-group-logo {
      max-height: 95px;
      max-width: 230px;
      object-fit: contain;
    }
    
    .right-header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex: 1;
    }
    
    .techhub-logo {
      max-height: 65px;
      max-width: 100px;
      object-fit: contain;
    }
    
    .middle-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8% 0;
    }
    
    .qr-verification-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      background: ${accentColor}06;
      border: 1px solid ${accentColor}18;
      border-radius: 5px;
      margin-right: 2%;
    }
    
    .qr-mini-box {
      background: #ffffff;
      border: 1.5px solid ${accentColor};
      border-radius: 3px;
      padding: 3px;
      box-shadow: 0 0 10px ${accentColor}15;
    }
    
    .qr-mini-img {
      width: 50px;
      height: 50px;
      display: block;
    }
    
    .qr-scan-label {
      font-size: 6px;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      margin-top: 4px;
    }
    
    .qr-cert-id {
      font-size: 7px;
      color: #999;
      font-family: monospace;
      letter-spacing: 0.6px;
      margin-top: 2px;
    }
    
    .center-header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .bbs-group-logo {
      max-height: 70px;
      margin-bottom: 5px;
    }
    
    .techhub-logo {
      max-height: 80px;
      margin-bottom: 4px;
    }
    
    .techhub-name {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      font-weight: 700;
      color: ${accentColor};
      letter-spacing: 2.5px;
      text-transform: uppercase;
      text-shadow: 0 0 12px ${accentColor}20;
    }
    
    .techhub-tagline {
      font-size: 5.5px;
      color: #444;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    
    .main-title {
      font-family: 'Cinzel', serif;
      font-size: 26px;
      font-weight: 700;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 2.5px;
      text-align: center;
      margin-top: 0.3%;
    }
    
    .recipient-section {
      text-align: center;
      padding: 0.2% 0;
    }
    
    .presented-to {
      font-size: 8px;
      color: #888;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    
    .recipient-name {
      font-family: 'Great Vibes', cursive;
      font-size: ${data.name.length > 18 ? '46' : '54'}px;
      font-weight: 400;
      color: #ffffff;
      margin: 0.25% 0 0.7%;
      line-height: 1.1;
      text-shadow: 0 0 18px rgba(255,255,255,0.12);
    }
    
    .divider {
      width: 170px;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${accentColor}, transparent);
      margin: 0 auto 0.7%;
    }
    
    .event-section {
      text-align: center;
    }
    
    .event-text {
      font-size: 9px;
      color: #999;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    
    .event-name {
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 1.2px;
    }
    
    .branding-line {
      text-align: center;
      font-size: 6px;
      color: #777;
      letter-spacing: 0.8px;
      margin: 0.5% 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    
    .branding-line span {
      color: ${accentColor};
      font-weight: 500;
    }
    
    .branding-logo {
      height: 10px;
      width: auto;
      vertical-align: middle;
    }
    
    .score-row {
      display: flex;
      justify-content: center;
      gap: 22px;
      margin: 0.5% 0;
    }
    
    .score-box {
      text-align: center;
      padding: 4px 12px;
      background: ${accentColor}06;
      border: 1px solid ${accentColor}18;
      border-radius: 4px;
    }
    
    .score-label {
      font-size: 6px;
      color: #777;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 1px;
    }
    
    .score-value {
      font-family: 'Playfair Display', serif;
      font-size: 13px;
      font-weight: 600;
      color: ${accentColor};
    }
    
    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 0.3%;
      margin-top: 0.3%;
      border-top: 1px solid ${accentColor}08;
    }
    
    .footer-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .footer-col.left {
      min-width: 80px;
    }
    
    .footer-col.center {
      min-width: 150px;
    }
    
    .footer-col.right {
      min-width: 100px;
    }
    
    .footer-label {
      font-size: 5px;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 1px;
    }
    
    .footer-value {
      font-size: 7px;
      color: #999;
      font-weight: 500;
    }
    
    .sig-line {
      width: 90px;
      height: 1px;
      background: ${accentColor};
      margin: 0 auto 2px;
      opacity: 0.4;
    }
    
    .sig-title {
      font-size: 6px;
      color: ${accentColor};
      font-weight: 600;
    }
    
    .sig-role {
      font-size: 5px;
      color: #777;
      line-height: 1.2;
    }
    
    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 6px;
    }
    
    .qr-box {
      background: #ffffff;
      border: 2px solid ${accentColor};
      border-radius: 5px;
      padding: 4px;
      box-shadow: 0 0 12px ${accentColor}18, 0 1px 5px rgba(0,0,0,0.15);
    }
    
    .qr-img {
      width: 52px;
      height: 52px;
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
      color: #666;
      margin-top: 0.5px;
    }
    
    .cert-id-box {
      font-size: 7px;
      color: #aaa;
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
        <div class="left-header">
          <img src="${csiLogoUrl}" alt="CSI" class="csi-logo" onerror="this.style.display='none'" />
        </div>
        
        <div class="center-header">
          <img src="${bbsGroupLogoUrl}" alt="BBS Group" class="bbs-group-logo" onerror="this.style.display='none'" />
        </div>
        
        <div class="right-header">
          <img src="${techHubLogoUrl}" alt="Tech Hub BBS" class="techhub-logo" onerror="this.style.display='none'" />
        </div>
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
        Organised by <span>Tech Hub BBS</span> &nbsp;|&nbsp; In collaboration with <span>Computer Society of India</span> and <span>BBS Coding Club</span> &nbsp;|&nbsp; Powered by <img src="${unstopLogoUrl}" alt="Unstop" class="branding-logo" />
      </div>
      
      <div class="middle-section">
        <div style="flex: 1;"></div>
        <div class="qr-verification-box">
          <div class="qr-mini-box">
            <img src="${qrCodeUrl}" alt="QR" class="qr-mini-img" />
          </div>
          <div class="qr-scan-label">Scan to Verify</div>
          <div class="qr-cert-id">${data.certificateId}</div>
        </div>
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
          <div class="sig-role">President & Student Coordinator<br/>Mukesh Kumar</div>
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
