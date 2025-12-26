import './globals.css'
import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

export const metadata = {
  title: 'VibeVault',
  description: 'Link organizer with metadata and collections'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
