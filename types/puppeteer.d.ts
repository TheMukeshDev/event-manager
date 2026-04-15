declare module '@sparticuz/chromium' {
  export const args: string[]
  export function executablePath(): Promise<string>
  export default {
    args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: async () => {
      const version = process.env.CHROMIUM_VERSION || '128.0.0'
      return `https://github.com/Sparticuz/chromium/releases/download/v${version}/chromium-v${version}-linux-x64.zip`
    }
  }
}

declare module 'puppeteer-core' {
  import { Browser, Page } from 'puppeteer'
  
  export function launch(options: {
    args?: string[]
    defaultViewport?: { width: number; height: number }
    executablePath?: string
    headless?: boolean
  }): Promise<Browser>
  
  export default { launch }
}