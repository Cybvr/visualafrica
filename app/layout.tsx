import type { Metadata, Viewport } from 'next'
import { Mulish, Neuton } from 'next/font/google'

import './globals.css'

const mulish = Mulish({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const neuton = Neuton({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '700'],
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
    <html lang="en" className={`${mulish.variable} ${neuton.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
