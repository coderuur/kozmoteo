import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kozmo-Teo',
  description: 'Bilinçaltı İnanç Eşleştirme Motoru',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
