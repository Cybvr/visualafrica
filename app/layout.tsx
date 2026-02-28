import type { Metadata, Viewport } from 'next'
import { Mulish, Neuton, DM_Serif_Display, DM_Sans } from 'next/font/google'

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

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-logo',
  display: 'swap',
  weight: ['400'],
})

const dmSansHeading = DM_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['300'],
})

export const metadata: Metadata = {
  title: 'Waddi | Lagos\'s Trusted Event Planner Marketplace',
  description:
    'Connect with the finest event vendors in Lagos. Browse inspiring video reels, select vendors and receive quotes effortlessly. Plan weddings, corporate events, kids parties, and more.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Waddi',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#120f0d' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}


import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${mulish.variable} ${neuton.variable} ${dmSerifDisplay.variable} ${dmSansHeading.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
