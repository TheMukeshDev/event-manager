import QRCode from 'qrcode'

export async function generateQRCodeBase64(data: string, size: number = 200): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: size,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
    return qrDataUrl
  } catch (error) {
    console.error('QR code generation failed:', error)
    throw new Error('Failed to generate QR code')
  }
}

export async function generateQRCodeBuffer(data: string, size: number = 200): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(data, {
      width: size,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
    return buffer
  } catch (error) {
    console.error('QR code generation failed:', error)
    throw new Error('Failed to generate QR code')
  }
}
