import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '@vibevault/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { tags: true, collections: true, links: { include: { tags: { include: { tag: true } } } } } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = {
    tags: user.tags,
    collections: user.collections,
    links: user.links.map((link) => ({
      id: link.id,
      url: link.url,
      title: link.title,
      description: link.description,
      tagNames: link.tags.map((t) => t.tag.name)
    }))
  }

  return NextResponse.json(payload)
}
