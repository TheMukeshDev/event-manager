declare module 'qrcode' {
  export interface QRCodeToDataURLOptions {
    width?: number
    margin?: number
    color?: {
      dark?: string
      light?: string
    }
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  }

  export interface QRCodeToBufferOptions extends QRCodeToDataURLOptions {}

  export function toDataURL(data: string, options?: QRCodeToDataURLOptions): Promise<string>
  export function toBuffer(data: string, options?: QRCodeToBufferOptions): Promise<Buffer>
}
