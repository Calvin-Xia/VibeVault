import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '@vibevault/db'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { title, description, tagIds = [], collectionIds = [] } = body

  const link = await prisma.link.findFirst({ where: { id: params.id, user: { email: session.user.email } } })
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.link.update({
    where: { id: link.id },
    data: {
      title,
      description,
      tags: { deleteMany: {}, create: tagIds.map((tagId: string) => ({ tagId })) },
      collections: { deleteMany: {}, create: collectionIds.map((collectionId: string) => ({ collectionId })) }
    },
    include: { tags: { include: { tag: true } }, collections: { include: { collection: true } } }
  })

  return NextResponse.json(updated)
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const link = await prisma.link.findFirst({ where: { id: params.id, user: { email: session.user.email } } })
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.link.delete({ where: { id: link.id } })
  return NextResponse.json({ ok: true })
}
