import { ReactNode } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth'
import { CommandPalette } from '../../components/command-palette'
import { Button } from '../../components/ui/button'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <Link href="/links" className="rounded-lg px-3 py-1 hover:bg-slate-100">
            Links
          </Link>
          <Link href="/collections" className="rounded-lg px-3 py-1 hover:bg-slate-100">
            Collections
          </Link>
          <Link href="/tags" className="rounded-lg px-3 py-1 hover:bg-slate-100">
            Tags
          </Link>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CommandPalette />
          <span className="hidden text-xs sm:inline">{session?.user?.email}</span>
          <Button asChild variant="ghost">
            <Link href="/api/auth/signout">Sign out</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
