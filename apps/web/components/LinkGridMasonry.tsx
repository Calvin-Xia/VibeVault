import { motion } from 'framer-motion'
import LinkCard from './LinkCard'

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

interface LinkGridMasonryProps {
  links: Link[]
  isLoading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

export default function LinkGridMasonry({
  links,
  isLoading = false,
  onLoadMore,
  hasMore = false,
}: LinkGridMasonryProps) {
  return (
    <div>
      {/* Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <LinkCard
            key={link.id}
            id={link.id}
            title={link.title || link.url}
            url={link.url}
            domain={link.domain}
            createdAt={link.createdAt}
            ogImage={link.ogImage}
            favicon={link.favicon}
            tags={link.tags}
            favorite={link.favorite}
          />
        ))}
        
        {/* Loading Skeletons */}
        {isLoading && Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={`skeleton-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border p-4"
          >
            <div className="h-40 bg-gray-100 rounded-xl mb-3 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded mb-2 w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded mb-3 w-1/2 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded-full px-3 animate-pulse"></div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-white/80 backdrop-blur-sm border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
