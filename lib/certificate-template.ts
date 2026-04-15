export interface CertificateData {
  certificateId: string
  name: string
  event: string
  score: number | null
  rank: number | null
  certificateType: string
  date: string
  qrCodeBase64?: string
  logos?: {
    techHub: string
    bbsGroup: string
    csi: string
    unstop: string
  }
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
  const recipientNameFontSize = data.name.length > 18 ? '72' : '88'

  const techHubLogo = data.logos?.techHub || '/certificates/logos/techhubbs.png'
  const bbsGroupLogo = data.logos?.bbsGroup || '/certificates/logos/bbslogo.png'
  const csiLogo = data.logos?.csi || '/certificates/logos/csi.png'
  const unstopLogo = data.logos?.unstop || '/certificates/logos/unstop.png'
  const qrCodeUrl = data.qrCodeBase64 || ''

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate - ${data.name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Great+Vibes&family=Playfair+Display:wght@400;500;600&family=Source+Sans+3:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Source Sans 3', 'Segoe UI', sans-serif;
      background: #0a0a0a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }
    
    .certificate {
      width: 1600px;
      height: 900px;
      max-width: none;
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
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid ${accentColor}12;
    }
    
    .corner-logo {
      max-height: 45px;
      max-width: 70px;
      object-fit: contain;
      filter: drop-shadow(0 0 8px ${accentColor}30) brightness(1.1) contrast(1.05);
    }
    
    .main-header {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .bbs-main-logo {
      max-height: 100px;
      max-width: 200px;
      object-fit: contain;
      filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5)) brightness(1.2) contrast(1.1);
    }
    
    .right-techhub {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .techhub-header-logo {
      max-height: 45px;
      max-width: 80px;
      object-fit: contain;
      filter: drop-shadow(0 0 10px ${accentColor}40) brightness(1.15) contrast(1.1);
    }
    
    .techhub-header-name {
      font-family: 'Cinzel', 'Times New Roman', serif;
      font-size: 6px;
      font-weight: 700;
      color: ${accentColor};
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 1px;
    }
    
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .main-title {
      font-family: 'Cinzel', 'Times New Roman', serif;
      font-size: 36px;
      font-weight: 700;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 4px;
      text-align: center;
      margin-bottom: 8px;
    }
    
    .recipient-section {
      text-align: center;
    }
    
    .presented-to {
      font-size: 12px;
      color: #888;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .recipient-name {
      font-family: 'Great Vibes', 'Georgia', cursive;
      font-size: ${recipientNameFontSize}px;
      font-weight: 400;
      color: #ffffff;
      margin: 6px 0 10px;
      line-height: 1.1;
      text-shadow: 0 0 20px rgba(255,255,255,0.15);
    }
    
    .divider {
      width: 280px;
      height: 2px;
      background: linear-gradient(90deg, transparent, ${accentColor}, transparent);
      margin: 0 auto 8px;
    }
    
    .event-section {
      text-align: center;
      margin-bottom: 8px;
    }
    
    .event-text {
      font-size: 14px;
      color: #999;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    
    .event-name {
      font-family: 'Playfair Display', 'Georgia', serif;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 1.5px;
    }
    
    .branding-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      margin-bottom: 8px;
    }
    
    .branding-line {
      font-size: 10px;
      color: #888;
      letter-spacing: 0.8px;
      text-align: center;
    }
    
    .branding-line.gold {
      color: ${accentColor};
      font-weight: 500;
    }
    
    .branding-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      white-space: nowrap;
    }
    
    .branding-logo {
      height: 28px;
      width: auto;
      object-fit: contain;
      display: block;
      flex-shrink: 0;
      filter: drop-shadow(0 0 6px ${accentColor}35);
    }
    
    .branding-quiz {
      text-align: center;
      width: 100%;
      white-space: nowrap;
    }
    
    .score-row {
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    
    .score-box {
      text-align: center;
      padding: 4px 16px;
      background: ${accentColor}06;
      border: 1px solid ${accentColor}15;
      border-radius: 3px;
    }
    
    .score-label {
      font-size: 9px;
      color: #777;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2px;
    }
    
    .score-value {
      font-family: 'Playfair Display', 'Georgia', serif;
      font-size: 20px;
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
      padding: 10px 16px;
      background: ${accentColor}08;
      border: 1px solid ${accentColor}20;
      border-radius: 6px;
    }
    
    .qr-mini-box {
      background: #ffffff;
      border: 2px solid ${accentColor};
      border-radius: 4px;
      padding: 3px;
      box-shadow: 0 0 10px ${accentColor}15;
    }
    
    .qr-mini-img {
      width: 80px;
      height: 80px;
      display: block;
    }
    
    .qr-scan-label {
      font-size: 9px;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      margin-top: 4px;
    }
    
    .qr-cert-id {
      font-size: 10px;
      color: #999;
      font-family: monospace;
      letter-spacing: 0.5px;
      margin-top: 2px;
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
      font-size: 9px;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2px;
    }
    
    .footer-value {
      font-size: 11px;
      color: #999;
      font-weight: 500;
    }
    
    .sig-line {
      width: 140px;
      height: 1px;
      background: ${accentColor};
      margin: 0 auto 1px;
      opacity: 0.4;
    }
    
    .sig-title {
      font-size: 9px;
      color: ${accentColor};
      font-weight: 600;
    }
    
    .sig-role {
      font-size: 7px;
      color: #777;
      line-height: 1.3;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .certificate {
      animation: fadeIn 0.3s ease-out;
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
        <img src="${csiLogo}" alt="CSI" class="corner-logo" />
        
        <div class="main-header">
          <img src="${bbsGroupLogo}" alt="BBS Group" class="bbs-main-logo" />
        </div>
        
        <div class="right-techhub">
          <img src="${techHubLogo}" alt="Tech Hub BBS" class="techhub-header-logo" />
          <div class="techhub-header-name">Tech Hub BBS</div>
        </div>
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
        
        <div class="branding-section">
          <div class="branding-line gold">Organised by <strong>Tech Hub BBS</strong> in collaboration with <strong>Computer Society of India (CSI)</strong> &amp; <strong>BBS Coding Club</strong></div>
          <div class="branding-line">
            <div class="branding-row">Powered by <img src="${unstopLogo}" alt="Unstop" class="branding-logo" /></div>
            <div class="branding-quiz">National Level Technical Quiz</div>
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

async function waitForFonts(timeout: number = 10000): Promise<void> {
  if (document.fonts) {
    try {
      await document.fonts.ready
      await new Promise<void>((resolve) => setTimeout(resolve, 500))
    } catch {
      await new Promise<void>((resolve) => setTimeout(resolve, 2000))
    }
  }
}

async function waitForImages(): Promise<void> {
  const images = Array.from(document.querySelectorAll('img'))
  const promises = images.map((img) => {
    return new Promise<void>((resolve) => {
      if (img.complete && img.naturalHeight !== 0) {
        resolve()
      } else {
        img.onload = () => resolve()
        img.onerror = () => resolve()
      }
    })
  })
  await Promise.all(promises)
}

async function waitForRender(): Promise<void> {
  await waitForFonts()
  await waitForImages()
  await new Promise<void>((resolve) => setTimeout(resolve, 1000))
}

export async function generatePDF(template: string): Promise<Buffer> {
  try {
    const puppeteer = await import('puppeteer-core')
    const chromium = await import('@sparticuz/chromium')

    const CERT_WIDTH = 1600
    const CERT_HEIGHT = 900

    const browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--allow-file-access-from-files',
        '--enable-features=NetworkService'
      ],
      defaultViewport: { width: CERT_WIDTH, height: CERT_HEIGHT },
      executablePath: await chromium.executablePath(),
      headless: true
    })

    const page = await browser.newPage()

    await page.setContent(template, { waitUntil: 'networkidle2', timeout: 30000 })
    
    // Wait for fonts and images to load
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        Promise.all([
          document.fonts.ready,
          ...Array.from(document.images).map(img => {
            if (img.complete) return Promise.resolve<void>(undefined)
            return new Promise<void>((res) => {
              img.onload = () => res()
              img.onerror = () => res()
            })
          })
        ]).then(() => {
          setTimeout(() => resolve(), 1000)
        })
      })
    })

    const pdf = await page.pdf({
      width: `${CERT_WIDTH}px`,
      height: `${CERT_HEIGHT}px`,
      printBackground: true,
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

    const CERT_WIDTH = 1600
    const CERT_HEIGHT = 900

    const browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--allow-file-access-from-files',
        '--enable-features=NetworkService'
      ],
      defaultViewport: { width: CERT_WIDTH, height: CERT_HEIGHT },
      executablePath: await chromium.executablePath(),
      headless: true
    })

    const page = await browser.newPage()

    await page.setContent(template, { waitUntil: 'networkidle2', timeout: 30000 })
    
    // Wait for fonts and images to load
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        Promise.all([
          document.fonts.ready,
          ...Array.from(document.images).map(img => {
            if (img.complete) return Promise.resolve<void>(undefined)
            return new Promise<void>((res) => {
              img.onload = () => res()
              img.onerror = () => res()
            })
          })
        ]).then(() => {
          setTimeout(() => resolve(), 1000)
        })
      })
    })

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      omitBackground: false
    })

    await browser.close()

    return Buffer.from(screenshot as string, 'base64')
  } catch (error) {
    console.error('Image generation error:', error)
    throw new Error('Failed to generate image')
  }
}
