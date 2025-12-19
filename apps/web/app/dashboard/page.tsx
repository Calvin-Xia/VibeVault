'use client'

import { useState, useTransition, useEffect } from 'react'
import AppShell from '@/components/AppShell'
import LinkGridMasonry from '@/components/LinkGridMasonry'
import { createLink } from '@/server-actions/create-link'
import { listLinks } from '@/server-actions/list-links'

interface Link {
  id: string
  title: string
  url: string
  domain: string
  createdAt: Date | string
  ogImage?: string
  favicon?: string
  tags: Array<{ id: string; name: string; color?: string }>
  favorite: boolean
}

export default function DashboardPage() {
  const [url, setUrl] = useState('')
  const [links, setLinks] = useState<Link[]>([])
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)
  
  // Load initial links
  useEffect(() => {
    loadLinks()
  }, [])
  
  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadLinks()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Load links from server
  const loadLinks = async () => {
    setIsLoading(true)
    try {
      const result = await listLinks({})
      setLinks(result.links)
    } catch (error) {
      console.error('Failed to load links:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) return
    
    // Optimistic UI - add link immediately
    const tempLink: Link = {
      id: `temp-${Date.now()}`,
      title: url,
      url: url,
      domain: new URL(url).hostname.replace('www.', ''),
      createdAt: new Date(),
      tags: [],
      favorite: false
    }
    
    setLinks(prev => [tempLink, ...prev])
    setUrl('')
    
    // Send to server
    startTransition(async () => {
      try {
        const newLink = await createLink(url)
        
        // Replace temp link with actual link
        setLinks(prev => 
          prev.map(link => 
            link.id === tempLink.id ? newLink : link
          )
        )
      } catch (error) {
        // Remove temp link if error
        setLinks(prev => prev.filter(link => link.id !== tempLink.id))
        console.error('Failed to create link:', error)
      }
    })
  }
  
  return (
    <AppShell>
      {/* Add Link Form */}
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="url"
            placeholder="Add a new link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={isPending || !url.trim()}
          >
            {isPending ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>
      
      {/* Links Grid */}
      <LinkGridMasonry
        links={links}
        isLoading={isLoading}
      />
    </AppShell>
  )
}
