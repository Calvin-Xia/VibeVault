'use server'

import { auth } from '@/lib/auth'
import { prisma } from 'db'

export async function exportData() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  // Get user data
  const [links, tags, collections] = await Promise.all([
    prisma.link.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        tags: true,
        collection: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.tag.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.collection.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  ])
  
  // Format data for export
  const exportData = {
    version: '1.0',
    createdAt: new Date().toISOString(),
    userId: session.user.id,
    data: {
      links: links.map(link => ({
        id: link.id,
        url: link.url,
        normalizedUrl: link.normalizedUrl,
        domain: link.domain,
        title: link.title,
        description: link.description,
        note: link.note,
        ogImage: link.ogImage,
        favicon: link.favicon,
        siteName: link.siteName,
        publishedTime: link.publishedTime?.toISOString(),
        status: link.status,
        favorite: link.favorite,
        collectionId: link.collectionId,
        tagIds: link.tags.map(tag => tag.id),
        createdAt: link.createdAt.toISOString(),
        updatedAt: link.updatedAt.toISOString(),
        lastVisitedAt: link.lastVisitedAt?.toISOString()
      })),
      tags: tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        createdAt: tag.createdAt.toISOString()
      })),
      collections: collections.map(collection => ({
        id: collection.id,
        name: collection.name,
        color: collection.color,
        createdAt: collection.createdAt.toISOString(),
        updatedAt: collection.updatedAt.toISOString()
      }))
    }
  }
  
  return exportData
}
