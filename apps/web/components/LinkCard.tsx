import { motion } from 'framer-motion'
import { cn, formatDate, truncateText } from '@/lib/utils'

interface LinkCardProps {
  id: string
  title: string
  url: string
  domain: string
  createdAt: Date | string
  ogImage?: string
  favicon?: string
  tags?: Array<{ id: string; name: string; color?: string }>
  favorite: boolean
}

export default function LinkCard({
  id,
  title,
  url,
  domain,
  createdAt,
  ogImage,
  favicon,
  tags = [],
  favorite,
}: LinkCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border p-4 hover:shadow-md transition-shadow"
    >
      {/* Preview Image */}
      {ogImage && (
        <div className="mb-3 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={ogImage}
            alt={title}
            className="w-full h-40 object-cover"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="space-y-2">
        {/* Title and Favicon */}
        <div className="flex items-start gap-2">
          {favicon && (
            <img
              src={favicon}
              alt={`${domain} favicon`}
              className="w-6 h-6 rounded-full flex-shrink-0"
              loading="lazy"
            />
          )}
          <h3 className="font-medium line-clamp-2">
            {title}
          </h3>
        </div>
        
        {/* Domain and Date */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{domain}</span>
          <span>•</span>
          <span>{formatDate(createdAt)}</span>
        </div>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs px-2 py-1 rounded-full bg-gray-100"
                style={{ borderLeft: tag.color ? `3px solid ${tag.color}` : 'none' }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t">
        <button
          className={cn(
            "p-2 rounded-full hover:bg-gray-100 transition-colors",
            favorite && "text-yellow-500"
          )}
        >
          <svg className="w-5 h-5" fill={favorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => window.open(url, '_blank', 'noopener noreferrer')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
          
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
