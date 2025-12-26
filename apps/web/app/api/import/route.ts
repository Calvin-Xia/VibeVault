import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '@vibevault/db'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { links = [], tags = [], collections = [] } = body
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { userId_name: { userId: user.id, name: tag.name } },
      create: { ...tag, userId: user.id },
      update: { color: tag.color }
    })
  }

  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { userId_name: { userId: user.id, name: collection.name } },
      create: { name: collection.name, userId: user.id },
      update: {}
    })
  }

  for (const link of links) {
    const created = await prisma.link.create({
      data: {
        url: link.url,
        title: link.title,
        description: link.description,
        userId: user.id
      }
    })
    if (link.tagNames?.length) {
      const tagRecords = await prisma.tag.findMany({ where: { userId: user.id, name: { in: link.tagNames } } })
      await prisma.link.update({
        where: { id: created.id },
        data: {
          tags: { createMany: { data: tagRecords.map((tag) => ({ tagId: tag.id })) } }
        }
      })
    }
  }

  return NextResponse.json({ ok: true })
}
