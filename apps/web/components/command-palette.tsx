'use client'

import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Input } from './ui/input'
import Link from 'next/link'
import clsx from 'clsx'

const commands = [
  { label: 'Links', href: '/links' },
  { label: 'Collections', href: '/collections' },
  { label: 'Tags', href: '/tags' },
  { label: 'Import JSON', href: '/api/import' },
  { label: 'Export JSON', href: '/api/export' }
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useHotkeys('ctrl+k,cmd+k', (e) => {
    e.preventDefault()
    setOpen((prev) => !prev)
  })

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  const filtered = commands.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <button
        className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        onClick={() => setOpen(true)}
      >
        ⌘K
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 px-4 py-20">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
            <Input
              autoFocus
              placeholder="Jump to..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mb-3"
            />
            <div className="flex flex-col gap-2">
              {filtered.map((cmd) => (
                <Link
                  key={cmd.href}
                  href={cmd.href}
                  className={clsx(
                    'rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                  )}
                  onClick={() => setOpen(false)}
                >
                  {cmd.label}
                </Link>
              ))}
              {filtered.length === 0 && <p className="text-xs text-slate-500">No results</p>}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
