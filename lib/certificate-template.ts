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
        return 'rgba(255, 215, 0, 0.05)'
      case 'appreciation':
        return 'rgba(65, 105, 225, 0.05)'
      default:
        return 'rgba(0, 206, 209, 0.05)'
    }
  }

  const borderColor = getBorderColor()
  const accentColor = getAccentColor()
  const glowColor = getGlowColor()
  const title = getTitle()
  
  const verifyUrl = `${VERIFY_BASE_URL}/verify/${data.certificateId}`
  const qrCodeUrl = data.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}&format=png`

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
      padding: 35px 45px;
    }
    
    .border {
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 3px solid ${borderColor};
      pointer-events: none;
    }
    
    .inner-border {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 1px solid ${borderColor}25;
      pointer-events: none;
    }
    
    .corner {
      position: absolute;
      width: 50px;
      height: 50px;
      border: 2px solid ${accentColor};
    }
    
    .corner-tl { top: 2px; left: 2px; border-right: none; border-bottom: none; }
    .corner-tr { top: 2px; right: 2px; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 2px; left: 2px; border-right: none; border-top: none; }
    .corner-br { bottom: 2px; right: 2px; border-left: none; border-top: none; }
    
    .content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 15px 25px;
      background: radial-gradient(circle at 50% 15%, ${glowColor} 0%, transparent 50%);
    }
    
    .top-bar {
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
      max-width: 85px;
      object-fit: contain;
    }
    
    .unstop-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .unstop-logo-img {
      max-height: 28px;
      max-width: 65px;
      object-fit: contain;
    }
    
    .unstop-label {
      font-size: 7px;
      color: #777;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    
    .header {
      text-align: center;
      padding: 10px 0;
    }
    
    .org-label {
      font-size: 11px;
      font-weight: 500;
      color: #999;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    
    .org-logo {
      max-height: 50px;
      margin-bottom: 6px;
    }
    
    .org-name {
      font-family: 'Cinzel', serif;
      font-size: 28px;
      font-weight: 700;
      color: ${accentColor};
      letter-spacing: 5px;
      text-transform: uppercase;
      text-shadow: 0 0 25px ${accentColor}35;
    }
    
    .tagline {
      font-size: 9px;
      color: #555;
      letter-spacing: 2px;
      margin-top: 4px;
    }
    
    .main-title {
      font-family: 'Cinzel', serif;
      font-size: 34px;
      font-weight: 700;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 4px;
      text-align: center;
      margin-top: 12px;
    }
    
    .presented-to {
      font-size: 10px;
      color: #888;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 20px;
      margin-bottom: 8px;
      text-align: center;
    }
    
    .recipient-name {
      font-family: 'Great Vibes', cursive;
      font-size: ${data.name.length > 18 ? '50' : '58'}px;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
      margin-bottom: 15px;
      line-height: 1.2;
      text-shadow: 0 0 25px rgba(255,255,255,0.12);
    }
    
    .divider-line {
      width: 220px;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${accentColor}, transparent);
      margin: 0 auto 15px;
    }
    
    .event-text {
      font-size: 11px;
      color: #999;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 4px;
      text-align: center;
    }
    
    .event-name {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 2px;
      margin-bottom: 18px;
      text-align: center;
    }
    
    .branding-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      margin-bottom: 15px;
    }
    
    .organised-by {
      font-size: 9px;
      color: #aaa;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    
    .organised-by span {
      color: ${accentColor};
      font-weight: 600;
    }
    
    .collaboration {
      font-size: 8px;
      color: #777;
      letter-spacing: 1px;
      text-align: center;
    }
    
    .collaboration span {
      color: ${accentColor};
    }
    
    .powered {
      font-size: 8px;
      color: #666;
      letter-spacing: 1px;
    }
    
    .powered span {
      color: ${accentColor};
      font-weight: 500;
    }
    
    .score-details {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 20px;
    }
    
    .detail-box {
      text-align: center;
      padding: 8px 20px;
      background: ${accentColor}08;
      border: 1px solid ${accentColor}20;
      border-radius: 5px;
    }
    
    .detail-box-label {
      font-size: 8px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 2px;
    }
    
    .detail-box-value {
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      font-weight: 600;
      color: ${accentColor};
    }
    
    .footer-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      padding-top: 15px;
      border-top: 1px solid ${accentColor}15;
    }
    
    .footer-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .footer-label {
      font-size: 8px;
      color: #777;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 4px;
    }
    
    .footer-value {
      font-size: 10px;
      color: #bbb;
      font-weight: 500;
    }
    
    .signature-block {
      min-width: 200px;
    }
    
    .signature-line {
      width: 150px;
      height: 1px;
      background: ${accentColor};
      margin: 0 auto 5px;
      opacity: 0.5;
    }
    
    .signature-title {
      font-size: 10px;
      color: ${accentColor};
      font-weight: 600;
      margin-bottom: 2px;
    }
    
    .signature-role {
      font-size: 8px;
      color: #999;
      line-height: 1.4;
    }
    
    .signature-name {
      font-family: 'Great Vibes', cursive;
      font-size: 18px;
      color: #fff;
      margin-top: 3px;
    }
    
    .qr-block {
      min-width: 140px;
    }
    
    .qr-frame {
      background: #ffffff;
      border: 2px solid ${accentColor};
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 0 20px ${accentColor}25, 0 3px 10px rgba(0,0,0,0.25);
      display: inline-block;
    }
    
    .qr-code {
      width: 80px;
      height: 80px;
      display: block;
    }
    
    .qr-text {
      font-size: 8px;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      margin-top: 6px;
    }
    
    .qr-subtext {
      font-size: 7px;
      color: #777;
      margin-top: 1px;
    }
    
    .cert-id-display {
      font-size: 9px;
      color: #aaa;
      font-family: 'Source Sans 3', monospace;
      letter-spacing: 1.5px;
      padding: 4px 8px;
      background: ${accentColor}08;
      border: 1px solid ${accentColor}20;
      border-radius: 3px;
      margin-top: 8px;
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
      <div class="top-bar">
        <div class="collab-logos">
          <img src="${csiLogoUrl}" alt="CSI" class="logo-img" onerror="this.style.display='none'" />
          <img src="${collegeLogoUrl}" alt="BBSCET" class="logo-img" onerror="this.style.display='none'" />
        </div>
        <div class="unstop-wrapper">
          <img src="${unstopLogoUrl}" alt="Unstop" class="unstop-logo-img" onerror="this.style.display='none'" />
          <span class="unstop-label">Powered by</span>
        </div>
      </div>
      
      <div class="header">
        <div class="org-label">Organised by</div>
        <img src="${techHubLogoUrl}" alt="Tech Hub BBS" class="org-logo" onerror="this.style.display='none'" />
        <div class="org-name">Tech Hub BBS</div>
        <div class="tagline">Empowering Innovation & Technical Excellence</div>
      </div>
      
      <div>
        <div class="main-title">${title}</div>
        
        <div class="presented-to">This certificate is proudly presented to</div>
        <div class="recipient-name">${data.name}</div>
        <div class="divider-line"></div>
        
        <div class="event-text">${getBodyText()}</div>
        <div class="event-name">${data.event}</div>
      </div>
      
      <div class="branding-footer">
        <div class="organised-by">Organised by <span>Tech Hub BBS</span></div>
        <div class="collaboration">In collaboration with <span>Computer Society of India</span> and <span>BBS Coding Club</span></div>
        <div class="powered">Powered by <span>Unstop</span></div>
      </div>
      
      <div class="score-details">
        ${data.rank ? `
        <div class="detail-box">
          <div class="detail-box-label">Achieved Rank</div>
          <div class="detail-box-value">#${data.rank}</div>
        </div>
        ` : ''}
        ${data.score !== null ? `
        <div class="detail-box">
          <div class="detail-box-label">Score</div>
          <div class="detail-box-value">${data.score}/20</div>
        </div>
        ` : ''}
      </div>
      
      <div class="footer-section">
        <div class="footer-block">
          <div class="footer-label">Date of Issue</div>
          <div class="footer-value">${data.date}</div>
        </div>
        
        <div class="footer-block signature-block">
          <div class="signature-line"></div>
          <div class="signature-title">Digitally Signed by BBSCET</div>
          <div class="signature-role">Director, BBSCET<br/>Prof. Ashutosh Shrivastava</div>
        </div>
        
        <div class="footer-block signature-block">
          <div class="signature-line"></div>
          <div class="signature-title">Issued by Tech Hub BBS</div>
          <div class="signature-role">President & Student Coordinator<br/>Mukesh Kumar</div>
        </div>
        
        <div class="footer-block qr-block">
          <div class="qr-frame">
            <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
          </div>
          <div class="qr-text">Scan to Verify</div>
          <div class="qr-subtext">Verify Authenticity Online</div>
          <div class="cert-id-display">${data.certificateId}</div>
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
