'use server'

import { auth } from '@/lib/auth'
import { prisma } from 'db'

export async function addTag(name: string, color?: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  if (!name.trim()) {
    throw new Error('Tag name is required')
  }
  
  return prisma.tag.create({
    data: {
      userId: session.user.id,
      name: name.trim(),
      color
    }
  })
}

export async function renameTag(id: string, name: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  if (!name.trim()) {
    throw new Error('Tag name is required')
  }
  
  return prisma.tag.update({
    where: {
      id,
      userId: session.user.id
    },
    data: {
      name: name.trim()
    }
  })
}

export async function deleteTag(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  return prisma.tag.delete({
    where: {
      id,
      userId: session.user.id
    }
  })
}

export async function listTags() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  return prisma.tag.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
