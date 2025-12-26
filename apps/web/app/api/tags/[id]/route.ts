import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '@vibevault/db'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { name, color } = body

  const tag = await prisma.tag.findFirst({ where: { id: params.id, user: { email: session.user.email } } })
  if (!tag) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.tag.update({ where: { id: params.id }, data: { name, color } })
  return NextResponse.json(updated)
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tag = await prisma.tag.findFirst({ where: { id: params.id, user: { email: session.user.email } } })
  if (!tag) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.tag.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
