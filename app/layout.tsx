import type { Metadata } from 'next'
import { Inter, Amiri, Noto_Nastaliq_Urdu } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Providers } from '@/lib/Providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
})

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nastaliq',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NoorWeb - آپ کا مکمل اسلامی ساتھی',
  description: 'Your complete Islamic companion - Quran, Prayer Times, Hadith, Duas, and more',
  keywords: ['Islam', 'Quran', 'Prayer Times', 'Hadith', 'Islamic App', 'Muslim', 'Namaz'],
  authors: [{ name: 'NoorWeb Team' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable} ${nastaliq.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0e7a6e',
                color: '#fff',
                borderRadius: '12px',
              },
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  )
}
