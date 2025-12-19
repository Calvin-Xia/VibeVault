'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { addTag } from '@/server-actions/tags'

interface Tag {
  id: string
  name: string
  color?: string
}

interface TagPickerProps {
  selectedTags: string[]
  tags: Tag[]
  onSelectTag: (tagId: string) => void
  onDeselectTag: (tagId: string) => void
  className?: string
}

export default function TagPicker({
  selectedTags,
  tags,
  onSelectTag,
  onDeselectTag,
  className = '',
}: TagPickerProps) {
  const [newTagName, setNewTagName] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isCreating, setIsCreating] = useState(false)
  
  const handleCreateTag = async () => {
    if (!newTagName.trim() || isCreating) return
    
    setIsCreating(true)
    
    try {
      const tag = await addTag(newTagName)
      onSelectTag(tag.id)
      setNewTagName('')
    } catch (error) {
      console.error('Failed to create tag:', error)
    } finally {
      setIsCreating(false)
    }
  }
  
  return (
    <div className={className}>
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTags.map(tagId => {
          const tag = tags.find(t => t.id === tagId)
          if (!tag) return null
          
          return (
            <motion.span
              key={tagId}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800"
              style={{ borderLeft: tag.color ? `3px solid ${tag.color}` : 'none' }}
            >
              <span>{tag.name}</span>
              <button
                onClick={() => onDeselectTag(tagId)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.span>
          )
        })}
      </div>
      
      {/* Create New Tag */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Add new tag..."
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
          className="flex-1 px-3 py-2 rounded-lg border bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isCreating}
        />
        <button
          onClick={handleCreateTag}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={isCreating || !newTagName.trim()}
        >
          {isCreating ? 'Creating...' : 'Add'}
        </button>
      </div>
      
      {/* Available Tags */}
      <div className="flex flex-wrap gap-2">
        {tags
          .filter(tag => !selectedTags.includes(tag.id))
          .map(tag => (
            <button
              key={tag.id}
              onClick={() => onSelectTag(tag.id)}
              className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              style={{ borderLeft: tag.color ? `3px solid ${tag.color}` : 'none' }}
            >
              {tag.name}
            </button>
          ))
        }
      </div>
    </div>
  )
}
