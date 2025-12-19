'use server'

import { auth } from '@/lib/auth'
import { prisma } from 'db'

interface ImportLink {
  id: string
  url: string
  normalizedUrl: string
  domain: string
  title?: string
  description?: string
  note?: string
  ogImage?: string
  favicon?: string
  siteName?: string
  publishedTime?: string
  status: 'INBOX' | 'READING' | 'ARCHIVED'
  favorite: boolean
  collectionId?: string
  tagIds: string[]
  createdAt: string
  updatedAt: string
  lastVisitedAt?: string
}

interface ImportTag {
  id: string
  name: string
  color?: string
  createdAt: string
}

interface ImportCollection {
  id: string
  name: string
  color?: string
  createdAt: string
  updatedAt: string
}

interface ImportData {
  version: string
  createdAt: string
  userId: string
  data: {
    links: ImportLink[]
    tags: ImportTag[]
    collections: ImportCollection[]
  }
}

export async function importData(jsonData: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  let importData: ImportData
  
  // Parse and validate JSON data
  try {
    importData = JSON.parse(jsonData)
    
    if (!importData.version || !importData.data) {
      throw new Error('Invalid import data format')
    }
  } catch (error) {
    throw new Error('Failed to parse import data: ' + (error as Error).message)
  }
  
  // Results summary
  const results = {
    importedLinks: 0,
    skippedLinks: 0,
    importedTags: 0,
    skippedTags: 0,
    importedCollections: 0,
    skippedCollections: 0,
    errors: [] as string[]
  }
  
  // Transaction to ensure atomicity
  await prisma.$transaction(async (tx) => {
    // Import collections first
    const collectionMap = new Map<string, string>()
    
    for (const collection of importData.data.collections) {
      try {
        // Check if collection already exists by name
        const existingCollection = await tx.collection.findUnique({
          where: {
            userId_name: {
              userId: session.user!.id,
              name: collection.name
            }
          }
        })
        
        if (existingCollection) {
          // Skip existing collection
          collectionMap.set(collection.id, existingCollection.id)
          results.skippedCollections++
        } else {
          // Create new collection
          const newCollection = await tx.collection.create({
            data: {
              userId: session.user!.id,
              name: collection.name,
              color: collection.color,
              createdAt: new Date(collection.createdAt),
              updatedAt: new Date(collection.updatedAt)
            }
          })
          
          collectionMap.set(collection.id, newCollection.id)
          results.importedCollections++
        }
      } catch (error) {
        results.errors.push(`Failed to import collection ${collection.name}: ${(error as Error).message}`)
      }
    }
    
    // Import tags
    const tagMap = new Map<string, string>()
    
    for (const tag of importData.data.tags) {
      try {
        // Check if tag already exists by name
        const existingTag = await tx.tag.findUnique({
          where: {
            userId_name: {
              userId: session.user!.id,
              name: tag.name
            }
          }
        })
        
        if (existingTag) {
          // Skip existing tag
          tagMap.set(tag.id, existingTag.id)
          results.skippedTags++
        } else {
          // Create new tag
          const newTag = await tx.tag.create({
            data: {
              userId: session.user!.id,
              name: tag.name,
              color: tag.color,
              createdAt: new Date(tag.createdAt)
            }
          })
          
          tagMap.set(tag.id, newTag.id)
          results.importedTags++
        }
      } catch (error) {
        results.errors.push(`Failed to import tag ${tag.name}: ${(error as Error).message}`)
      }
    }
    
    // Import links
    for (const link of importData.data.links) {
      try {
        // Check if link already exists by normalizedUrl
        const existingLink = await tx.link.findUnique({
          where: {
            userId_normalizedUrl: {
              userId: session.user!.id,
              normalizedUrl: link.normalizedUrl
            }
          }
        })
        
        if (existingLink) {
          // Skip existing link
          results.skippedLinks++
        } else {
          // Map collection and tag IDs
          const mappedCollectionId = link.collectionId ? collectionMap.get(link.collectionId) : undefined
          const mappedTagIds = link.tagIds.map(tagId => tagMap.get(tagId)).filter(Boolean) as string[]
          
          // Create new link
          const createdLink = await tx.link.create({
            data: {
              userId: session.user!.id,
              url: link.url,
              normalizedUrl: link.normalizedUrl,
              domain: link.domain,
              title: link.title,
              description: link.description,
              note: link.note,
              ogImage: link.ogImage,
              favicon: link.favicon,
              siteName: link.siteName,
              publishedTime: link.publishedTime ? new Date(link.publishedTime) : null,
              status: link.status,
              favorite: link.favorite,
              collectionId: mappedCollectionId,
              createdAt: new Date(link.createdAt),
              updatedAt: new Date(link.updatedAt),
              lastVisitedAt: link.lastVisitedAt ? new Date(link.lastVisitedAt) : null,
              metadataStatus: 'PENDING' // Set to PENDING to trigger re-fetch
            }
          })

          if (mappedTagIds.length > 0) {
            await tx.linkTag.createMany({
              data: mappedTagIds.map(tagId => ({
                linkId: createdLink.id,
                tagId
              }))
            })
          }
          
          results.importedLinks++
        }
      } catch (error) {
        results.errors.push(`Failed to import link ${link.url}: ${(error as Error).message}`)
      }
    }
  })
  
  return results
}
