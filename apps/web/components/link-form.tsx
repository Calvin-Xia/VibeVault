'use client'

import { useState } from 'react'
import { Tag, Collection } from '@vibevault/db'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { LinkWithRelations } from './types'

export function LinkForm({
  tags,
  collections,
  onSubmit,
  initial
}: {
  tags: Tag[]
  collections: Collection[]
  initial?: Partial<LinkWithRelations>
  onSubmit: (payload: { url: string; title?: string; description?: string; tagIds: string[]; collectionIds: string[] }) => Promise<void>
}) {
  const [url, setUrl] = useState(initial?.url || '')
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [tagIds, setTagIds] = useState<string[]>(initial?.tags?.map((t) => t.tagId) || [])
  const [collectionIds, setCollectionIds] = useState<string[]>(initial?.collections?.map((c) => c.collectionId) || [])
  const [loading, setLoading] = useState(false)

  const toggle = (value: string, list: string[], setter: (vals: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit({ url, title, description, tagIds, collectionIds })
    setLoading(false)
    if (!initial) {
      setUrl('')
      setTitle('')
      setDescription('')
      setTagIds([])
      setCollectionIds([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <Input placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} required className="flex-1" />
        <Button type="submit" disabled={loading}>
          {initial ? 'Update' : 'Save link'}
        </Button>
      </div>
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        {tags.map((tag) => (
          <button
            type="button"
            key={tag.id}
            onClick={() => toggle(tag.id, tagIds, setTagIds)}
            className={`rounded-full px-2 py-1 ${tagIds.includes(tag.id) ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}
          >
            #{tag.name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        {collections.map((collection) => (
          <button
            type="button"
            key={collection.id}
            onClick={() => toggle(collection.id, collectionIds, setCollectionIds)}
            className={`rounded-full px-2 py-1 ${collectionIds.includes(collection.id) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
          >
            {collection.name}
          </button>
        ))}
      </div>
    </form>
  )
}
