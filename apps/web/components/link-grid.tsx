'use client'

import { LinkWithRelations } from './types'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import Link from 'next/link'

type LinkGridProps = {
  links: LinkWithRelations[]
  onDelete: (id: string) => void
  onEdit: (link: LinkWithRelations) => void
}

export function LinkGrid({ links, onDelete, onEdit }: LinkGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <motion.div key={link.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
          {link.image ? <img src={link.image} alt="preview" className="mb-3 h-32 w-full rounded-xl object-cover" /> : null}
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link href={link.url} className="text-base font-semibold text-indigo-700" target="_blank">
                {link.title || link.url}
              </Link>
              {link.description ? <p className="text-sm text-slate-600">{link.description}</p> : null}
            </div>
            <Button variant="ghost" onClick={() => onEdit(link)}>
              Edit
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
            {link.tags.map((tag) => (
              <span key={tag.tagId} className="rounded-full bg-slate-100 px-2 py-1" style={{ borderColor: tag.tag.color }}>
                #{tag.tag.name}
              </span>
            ))}
            {link.collections.map((c) => (
              <span key={c.collectionId} className="rounded-full bg-indigo-50 px-2 py-1 text-indigo-700">
                {c.collection.name}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>{new Date(link.createdAt).toLocaleDateString()}</span>
            <button className="text-rose-600" onClick={() => onDelete(link.id)}>
              Delete
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
