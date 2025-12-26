import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '@vibevault/db'
import { enqueueMetadata } from '../../../worker'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || undefined
  const tagId = searchParams.get('tagId') || undefined
  const collectionId = searchParams.get('collectionId') || undefined
  const sort = searchParams.get('sort') || 'createdAt'
  const page = Number(searchParams.get('page') || '1')
  const pageSize = Number(searchParams.get('pageSize') || '20')

  const where = {
    user: { email: session.user.email },
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { url: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {}),
    ...(collectionId ? { collections: { some: { collectionId } } } : {}),
    ...(tagId ? { tags: { some: { tagId } } } : {})
  }

  const [links, total] = await Promise.all([
    prisma.link.findMany({
      where,
      include: { tags: { include: { tag: true } }, collections: { include: { collection: true } } },
      orderBy: { [sort]: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.link.count({ where })
  ])

  return NextResponse.json({ links, total })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { url, title, description, tagIds = [], collectionIds = [] } = body

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const link = await prisma.link.create({
    data: {
      url,
      title,
      description,
      userId: user.id,
      tags: { create: tagIds.map((tagId: string) => ({ tagId })) },
      collections: { create: collectionIds.map((collectionId: string) => ({ collectionId })) }
    }
  })

  await enqueueMetadata({ linkId: link.id, url: link.url })

  return NextResponse.json(link)
}
