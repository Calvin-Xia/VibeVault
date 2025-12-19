'use server'

import { auth } from '@/lib/auth'
import { prisma } from 'db'

export async function addCollection(name: string, color?: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  if (!name.trim()) {
    throw new Error('Collection name is required')
  }
  
  return prisma.collection.create({
    data: {
      userId: session.user.id,
      name: name.trim(),
      color
    }
  })
}

export async function renameCollection(id: string, name: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  if (!name.trim()) {
    throw new Error('Collection name is required')
  }

  const collection = await prisma.collection.findFirst({
    where: {
      id,
      userId: session.user.id
    },
    select: {
      id: true
    }
  })

  if (!collection) {
    throw new Error('Unauthorized')
  }
  
  return prisma.collection.update({
    where: {
      id: collection.id
    },
    data: {
      name: name.trim()
    }
  })
}

export async function deleteCollection(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const collection = await prisma.collection.findFirst({
    where: {
      id,
      userId: session.user.id
    },
    select: {
      id: true
    }
  })

  if (!collection) {
    throw new Error('Unauthorized')
  }
  
  return prisma.collection.delete({
    where: {
      id: collection.id
    }
  })
}

export async function listCollections() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  return prisma.collection.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
