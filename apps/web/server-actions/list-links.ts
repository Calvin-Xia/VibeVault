'use server'

import { auth } from '@/lib/auth'
import { prisma } from 'db'

export async function listLinks({
  page = 1,
  limit = 12,
  status,
  collectionId,
  tagIds,
  favorite,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc'
}: {
  page?: number
  limit?: number
  status?: 'INBOX' | 'READING' | 'ARCHIVED'
  collectionId?: string
  tagIds?: string[]
  favorite?: boolean
  search?: string
  sortBy?: 'createdAt' | 'lastVisitedAt' | 'domain' | 'title'
  sortOrder?: 'asc' | 'desc'
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  const skip = (page - 1) * limit
  
  // Build where clause
  const where: any = {
    userId: session.user.id
  }
  
  if (status) {
    where.status = status
  }
  
  if (collectionId) {
    where.collectionId = collectionId
  }
  
  if (tagIds && tagIds.length > 0) {
    where.tags = {
      some: {
        id: {
          in: tagIds
        }
      }
    }
  }
  
  if (favorite !== undefined) {
    where.favorite = favorite
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { note: { contains: search, mode: 'insensitive' } },
      { domain: { contains: search, mode: 'insensitive' } }
    ]
  }
  
  // Build order by clause
  const orderBy: any = {}
  orderBy[sortBy] = sortOrder
  
  // Get links with count
  const [links, total] = await Promise.all([
    prisma.link.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        tags: true,
        collection: true
      }
    }),
    prisma.link.count({ where })
  ])
  
  return {
    links,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
}
