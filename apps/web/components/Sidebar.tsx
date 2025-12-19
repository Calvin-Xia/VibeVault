import { useState } from 'react'

export default function Sidebar() {
  const [collections] = useState([
    { id: '1', name: 'Work', color: '#3b82f6' },
    { id: '2', name: 'Study', color: '#10b981' },
    { id: '3', name: 'Inspiration', color: '#8b5cf6' },
    { id: '4', name: 'Papers', color: '#ef4444' },
  ])
  
  const [tags] = useState([
    { id: '1', name: 'react', color: '#61dafb' },
    { id: '2', name: 'nextjs', color: '#000000' },
    { id: '3', name: 'tailwind', color: '#38bdf8' },
    { id: '4', name: 'prisma', color: '#2d3748' },
  ])
  
  return (
    <aside className="w-64 bg-white/80 backdrop-blur-sm border-r p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          VibeVault
        </h1>
      </div>
      
      {/* Status Filters */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Status
        </h2>
        <div className="space-y-1">
          {[
            { name: 'Inbox', count: 12 },
            { name: 'Reading', count: 5 },
            { name: 'Archived', count: 23 },
          ].map((status) => (
            <button
              key={status.name}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <span>{status.name}</span>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                {status.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Collections */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Collections
        </h2>
        <div className="space-y-1">
          {collections.map((collection) => (
            <button
              key={collection.id}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: collection.color }}></span>
              <span>{collection.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
              style={{ borderLeft: `3px solid ${tag.color}` }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
