import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'

import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const dmSansSerif = DM_Sans({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['700'],
})

export const metadata: Metadata = {
  title: 'Visual Africa | Lagos\'s Trusted Event Planner Marketplace',
  description:
    'Connect with the finest event vendors in Lagos. Browse inspiring video reels, select vendors and receive quotes effortlessly. Plan weddings, corporate events, kids parties, and more.',
}

export const viewport: Viewport = {
  themeColor: '#7d3aed',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSansSerif.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
