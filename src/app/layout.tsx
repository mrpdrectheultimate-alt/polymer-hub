import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/Navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'PolymerHub — India\'s Plastic Polymer Engineering Knowledge Platform',
    template: '%s | PolymerHub',
  },
  description: 'World-class learning platform for Plastic Polymer Engineering students. 60 lessons across 10 subjects, AI Tutor, Materials Database, Career Hub, and Daily Plastic Industry Pulse.',
  keywords: ['polymer engineering', 'plastic engineering', 'PPE', 'B.Tech plastics', 'polymer chemistry', 'CIPET', 'rubber technology', 'polymer processing'],
  openGraph: {
    title: 'PolymerHub — India\'s Plastic Polymer Engineering Knowledge Platform',
    description: 'Learn polymer engineering the way the industry actually works. 60 world-class lessons, AI Tutor, and daily industry updates.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="bg-background text-ink antialiased font-sans">
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
