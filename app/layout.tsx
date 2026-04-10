import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'Tech Hub BBS - Innovate. Connect. Elevate.',
  description: 'Join Tech Hub BBS in Prayagraj, U.P. - A premier group of institutions dedicated to innovation, connection, and excellence. Participate in exciting tech events, competitions, and networking opportunities.',
  keywords: ['Tech Hub BBS', 'Prayagraj', 'tech events', 'innovation', 'technology', 'competitions', 'education', 'tech competition', 'engineering', 'U.P. India'],
  authors: [{ name: 'Tech Hub BBS Group of Institutions' }],
  creator: 'Tech Hub BBS',
  publisher: 'Tech Hub BBS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://techhub-bbs.vercel.app',
    title: 'Tech Hub BBS - Innovate. Connect. Elevate.',
    description: 'Premier tech events platform for BBS group of institutions. Connect, innovate, and compete in exciting technology competitions in Prayagraj.',
    siteName: 'Tech Hub BBS Events',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tech Hub BBS - Innovation, Connection, Excellence',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Hub BBS - Innovate. Connect. Elevate.',
    description: 'Join exciting tech events and competitions. Connect with innovators and showcase your skills on our platform.',
    images: ['/og-image.png'],
    creator: '@TechHubBBS',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'mask-icon',
        url: '/icon.svg',
        color: '#00D9FF',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="theme-color" content="#00D9FF" />
        <meta name="color-scheme" content="dark" />
        <meta name="msapplication-TileColor" content="#001a33" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased bg-black text-white overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
