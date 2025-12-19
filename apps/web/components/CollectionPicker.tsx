'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Collection {
  id: string
  name: string
  color?: string
}

interface CollectionPickerProps {
  selectedCollectionId?: string
  collections: Collection[]
  onSelectCollection: (collectionId?: string) => void
  className?: string
}

export default function CollectionPicker({
  selectedCollectionId,
  collections,
  onSelectCollection,
  className = '',
}: CollectionPickerProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {/* None Option */}
        <button
          onClick={() => onSelectCollection(undefined)}
          className={`px-3 py-1 rounded-full transition-colors ${selectedCollectionId === undefined
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          None
        </button>
        
        {/* Collections */}
        {collections.map(collection => (
          <button
            key={collection.id}
            onClick={() => onSelectCollection(collection.id)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${selectedCollectionId === collection.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            {collection.color && (
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: collection.color }}
              ></span>
            )}
            <span>{collection.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
