'use client'

import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">VibeVault</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Curate your web</h1>
        <p className="mt-2 max-w-xl text-slate-600">
          Save, tag, and visualize your favorite links with metadata polling, collections, command palette, and graph views.
        </p>
      </motion.div>
      <div className="flex items-center gap-3">
        {session ? (
          <Button asChild>
            <Link href="/links">Go to dashboard</Link>
          </Button>
        ) : (
          <Button onClick={() => signIn(undefined, { callbackUrl: '/links' })}>Sign in</Button>
        )}
        <Button asChild variant="ghost">
          <Link href="/api/export">Export JSON</Link>
        </Button>
      </div>
    </main>
  )
}
