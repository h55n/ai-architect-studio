import type { Metadata } from 'next'
import { Cormorant_Garamond, Space_Grotesk, Space_Mono } from 'next/font/google'
import '../styles/globals.css'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Architect Studio — Design Your Dream Home',
  description:
    'An AI-powered architectural design studio. Answer a few questions and watch your custom 3D home come to life in real-time.',
  keywords: ['AI architecture', '3D home design', 'AI house builder', 'architectural visualization'],
  openGraph: {
    title: 'AI Architect Studio',
    description: 'Design your dream home with AI in minutes.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${spaceGrotesk.variable} ${spaceMono.variable} font-body antialiased`}
      >
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        <div id="html-root" className="pointer-events-none absolute inset-0 z-[100]" />
        <div id="canvas-root" className="contents">
          {children}
        </div>
      </body>
    </html>
  )
}
