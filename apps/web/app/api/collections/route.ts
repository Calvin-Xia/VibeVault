import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '@vibevault/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const collections = await prisma.collection.findMany({
    where: { user: { email: session.user.email } },
    include: { links: true },
    orderBy: { name: 'asc' }
  })
  return NextResponse.json(collections)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { name } = body
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const collection = await prisma.collection.create({ data: { name, userId: user.id } })
  return NextResponse.json(collection)
}
