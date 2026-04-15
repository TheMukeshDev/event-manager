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
        return 'rgba(255, 215, 0, 0.06)'
      case 'appreciation':
        return 'rgba(65, 105, 225, 0.06)'
      default:
        return 'rgba(0, 206, 209, 0.06)'
    }
  }

  const borderColor = getBorderColor()
  const accentColor = getAccentColor()
  const glowColor = getGlowColor()
  
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
      padding: 40px 50px;
    }
    
    .border {
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      bottom: 12px;
      border: 3px solid ${borderColor};
      pointer-events: none;
    }
    
    .inner-border {
      position: absolute;
      top: 22px;
      left: 22px;
      right: 22px;
      bottom: 22px;
      border: 1px solid ${borderColor}30;
      pointer-events: none;
    }
    
    .corner {
      position: absolute;
      width: 60px;
      height: 60px;
      border: 2px solid ${accentColor};
    }
    
    .corner-tl { top: 3px; left: 3px; border-right: none; border-bottom: none; }
    .corner-tr { top: 3px; right: 3px; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 3px; left: 3px; border-right: none; border-top: none; }
    .corner-br { bottom: 3px; right: 3px; border-left: none; border-top: none; }
    
    .content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 20px 30px;
      background: radial-gradient(circle at center top, ${glowColor} 0%, transparent 60%);
    }
    
    .top-logos {
      position: absolute;
      top: 35px;
      left: 35px;
      right: 35px;
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
      max-height: 45px;
      max-width: 90px;
      object-fit: contain;
    }
    
    .unstop-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .unstop-logo-img {
      max-height: 32px;
      max-width: 70px;
      object-fit: contain;
      margin-bottom: 3px;
    }
    
    .unstop-text {
      font-size: 8px;
      color: #888;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    .logo-section {
      text-align: center;
      margin-top: 10px;
    }
    
    .org-name {
      font-family: 'Source Sans 3', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #aaa;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    
    .main-logo {
      font-family: 'Cinzel', serif;
      font-size: 32px;
      font-weight: 700;
      color: ${accentColor};
      letter-spacing: 6px;
      text-transform: uppercase;
      margin-bottom: 5px;
      text-shadow: 0 0 20px ${accentColor}40;
    }
    
    .main-logo-img {
      max-height: 45px;
      margin-bottom: 6px;
    }
    
    .tagline {
      font-size: 10px;
      color: #666;
      letter-spacing: 2px;
    }
    
    .title {
      font-family: 'Cinzel', serif;
      font-size: 36px;
      font-weight: 700;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-top: 15px;
      margin-bottom: 4px;
      text-align: center;
    }
    
    .certificate-type-badge {
      display: inline-block;
      padding: 4px 16px;
      background: ${accentColor}12;
      border: 1px solid ${accentColor}35;
      border-radius: 20px;
      font-size: 10px;
      color: ${accentColor};
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    
    .presented-text {
      font-size: 11px;
      color: #888;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    
    .name {
      font-family: 'Great Vibes', cursive;
      font-size: ${data.name.length > 18 ? '52' : '62'}px;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
      margin-bottom: 18px;
      line-height: 1.2;
      max-width: 90%;
      text-shadow: 0 0 30px rgba(255,255,255,0.15);
    }
    
    .divider {
      width: 200px;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${accentColor}, transparent);
      margin-bottom: 18px;
    }
    
    .event-text {
      font-size: 12px;
      color: #999;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 5px;
      text-align: center;
    }
    
    .event-name {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 2px;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .branding-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      margin-bottom: 15px;
    }
    
    .organiser-text {
      font-size: 10px;
      color: #aaa;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    
    .organiser-text span {
      color: ${accentColor};
      font-weight: 600;
    }
    
    .collab-text {
      font-size: 9px;
      color: #888;
      letter-spacing: 1px;
      text-align: center;
    }
    
    .collab-text span {
      color: ${accentColor};
    }
    
    .powered-text {
      font-size: 9px;
      color: #777;
      letter-spacing: 1px;
    }
    
    .powered-text span {
      color: ${accentColor};
      font-weight: 500;
    }
    
    .details {
      display: flex;
      gap: 35px;
      margin-bottom: 20px;
    }
    
    .detail-item {
      text-align: center;
      padding: 10px 22px;
      background: ${accentColor}08;
      border: 1px solid ${accentColor}25;
      border-radius: 6px;
    }
    
    .detail-label {
      font-size: 9px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 3px;
    }
    
    .detail-value {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 600;
      color: ${accentColor};
    }
    
    .footer-main {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
      padding: 0 10px;
    }
    
    .signature-section {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: flex-end;
      padding-bottom: 10px;
    }
    
    .signature-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 280px;
    }
    
    .signature-line {
      width: 180px;
      height: 1px;
      background: ${accentColor};
      margin-bottom: 6px;
      opacity: 0.6;
    }
    
    .signature-title {
      font-family: 'Cinzel', serif;
      font-size: 12px;
      color: ${accentColor};
      font-weight: 600;
      margin-bottom: 2px;
    }
    
    .signature-role {
      font-size: 9px;
      color: #aaa;
      letter-spacing: 0.5px;
      text-align: center;
      line-height: 1.4;
    }
    
    .signature-name {
      font-family: 'Great Vibes', cursive;
      font-size: 20px;
      color: #fff;
      margin-top: 4px;
    }
    
    .cert-info-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      min-width: 200px;
    }
    
    .qr-container {
      background: #fff;
      border: 3px solid ${accentColor};
      border-radius: 10px;
      padding: 10px;
      box-shadow: 0 0 25px ${accentColor}30, 0 4px 15px rgba(0,0,0,0.3);
    }
    
    .qr-image {
      width: 90px;
      height: 90px;
      display: block;
    }
    
    .qr-label {
      font-size: 10px;
      color: ${accentColor};
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
      margin-top: 6px;
    }
    
    .qr-sublabel {
      font-size: 8px;
      color: #888;
      margin-top: 2px;
    }
    
    .cert-id-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    
    .cert-id-label {
      font-size: 9px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    
    .cert-id {
      font-size: 10px;
      color: #ccc;
      font-family: 'Source Sans 3', monospace;
      letter-spacing: 2px;
      padding: 5px 10px;
      background: ${accentColor}10;
      border: 1px solid ${accentColor}30;
      border-radius: 4px;
    }
    
    .date-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    
    .date-label {
      font-size: 9px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    
    .date-value {
      font-size: 11px;
      color: #ccc;
      font-weight: 500;
    }
    
    @media (max-width: 1123px) {
      .certificate {
        transform: scale(0.9);
        transform-origin: center;
      }
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
        <img src="${collegeLogoUrl}" alt="BBSCET" class="logo-img" onerror="this.style.display='none'" />
      </div>
      <div class="unstop-logo">
        <img src="${unstopLogoUrl}" alt="Unstop" class="unstop-logo-img" onerror="this.style.display='none'" />
        <span class="unstop-text">Powered by</span>
      </div>
    </div>
    
    <div class="content">
      <div class="logo-section">
        <div class="org-name">Organised by</div>
        <img src="${techHubLogoUrl}" alt="Tech Hub BBS" class="main-logo-img" onerror="this.style.display='none'" />
        <div class="main-logo">Tech Hub BBS</div>
        <div class="tagline">Empowering Innovation & Technical Excellence</div>
      </div>
      
      <div>
        <div class="title">${getTitle()}</div>
        <div class="certificate-type-badge">${getTitle()}</div>
      </div>
      
      <div>
        <div class="presented-text">This certificate is proudly presented to</div>
        <div class="name">${data.name}</div>
        <div class="divider"></div>
        
        <div class="event-text">${getBodyText()}</div>
        <div class="event-name">${data.event}</div>
      </div>
      
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
      
      <div class="footer-main">
        <div class="cert-info-block">
          <div class="date-container">
            <div class="date-label">Date of Issue</div>
            <div class="date-value">${data.date}</div>
          </div>
        </div>
        
        <div class="signature-section">
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-title">Digitally Signed by BBSCET</div>
            <div class="signature-role">Director, BBSCET<br/>Prof. Ashutosh Shrivastava</div>
          </div>
          
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-title">Issued by Tech Hub BBS</div>
            <div class="signature-role">President & Student Coordinator<br/>Mukesh Kumar</div>
          </div>
        </div>
        
        <div class="cert-info-block">
          <div class="qr-container">
            <img src="${qrCodeUrl}" alt="QR Code" class="qr-image" />
          </div>
          <div class="qr-label">Scan to Verify</div>
          <div class="qr-sublabel">Verify Authenticity Online</div>
          
          <div class="cert-id-container" style="margin-top: 10px;">
            <div class="cert-id-label">Certificate ID</div>
            <div class="cert-id">${data.certificateId}</div>
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
