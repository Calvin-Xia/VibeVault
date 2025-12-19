'use client'

import { useState } from 'react'

interface FilterBarProps {
  onSearch?: (search: string) => void
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  onViewChange?: (view: 'masonry' | 'graph') => void
  onStatusChange?: (status: 'INBOX' | 'READING' | 'ARCHIVED' | 'ALL') => void
}

export default function FilterBar({
  onSearch,
  onSortChange,
  onViewChange,
  onStatusChange,
}: FilterBarProps = {}) {
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'masonry' | 'graph'>('masonry')
  const [status, setStatus] = useState<'INBOX' | 'READING' | 'ARCHIVED' | 'ALL'>('ALL')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    onSearch?.(value)
  }
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const [newSortBy, newSortOrder] = value.split(':') as [string, 'asc' | 'desc']
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    onSortChange?.(newSortBy, newSortOrder)
  }
  
  const handleViewChange = (newView: 'masonry' | 'graph') => {
    setView(newView)
    onViewChange?.(newView)
  }
  
  const handleStatusChange = (newStatus: 'INBOX' | 'READING' | 'ARCHIVED' | 'ALL') => {
    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }
  
  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex border-b">
        {[
          { value: 'ALL', label: 'All' },
          { value: 'INBOX', label: 'Inbox' },
          { value: 'READING', label: 'Reading' },
          { value: 'ARCHIVED', label: 'Archived' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStatusChange(tab.value as any)}
            className={`px-4 py-2 font-medium transition-colors ${status === tab.value
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Main Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Search */}
        <div className="w-full md:w-64">
          <div className="relative">
            <input
              type="text"
              placeholder="Search links..."
              value={search}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 rounded-lg border bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="flex items-center gap-3">
          {/* Sort Select */}
          <select
            value={`${sortBy}:${sortOrder}`}
            onChange={handleSortChange}
            className="px-3 py-2 rounded-lg border bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt:desc">Latest</option>
            <option value="lastVisitedAt:desc">Recently Visited</option>
            <option value="domain:asc">Domain A-Z</option>
            <option value="domain:desc">Domain Z-A</option>
            <option value="title:asc">Title A-Z</option>
            <option value="title:desc">Title Z-A</option>
          </select>
          
          {/* View Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => handleViewChange('masonry')}
              className={`px-3 py-2 transition-colors ${view === 'masonry'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h18v18H3V3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z" />
              </svg>
            </button>
            <button
              onClick={() => handleViewChange('graph')}
              className={`px-3 py-2 transition-colors ${view === 'graph'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 17c-1.1 0-1.99.9-1.99 2S5.9 21 7 21s2-.9 2-2-.9-2-2-2zM1 1h22v2H1V1zm0 4h22v2H1V5zm0 4h22v2H1V9zm0 4h10v2H1v-2zm16 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
