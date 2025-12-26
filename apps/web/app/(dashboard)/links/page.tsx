import { prisma } from '@vibevault/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { LinkGrid } from '../../../components/link-grid'
import { LinkForm } from '../../../components/link-form'
import { GraphView } from '../../../components/graph-view'
import { LinkWithRelations } from '../../../components/types'
import Link from 'next/link'
import { Suspense } from 'react'

async function getData(email: string) {
  const [links, tags, collections] = await Promise.all([
    prisma.link.findMany({
      where: { user: { email } },
      include: { tags: { include: { tag: true } }, collections: { include: { collection: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.tag.findMany({ where: { user: { email } }, orderBy: { name: 'asc' } }),
    prisma.collection.findMany({ where: { user: { email } }, orderBy: { name: 'asc' } })
  ])
  return { links, tags, collections }
}

export default async function LinksPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-slate-900">Links</h1>
        <Link href="/api/auth/signin" className="text-indigo-600">
          Sign in to manage your links
        </Link>
      </div>
    )
  }

  const { links, tags, collections } = await getData(session.user.email)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Links</h1>
          <p className="text-sm text-slate-600">Create, filter, and visualize your saved URLs.</p>
        </div>
        <Link href="/api/export" className="text-sm text-indigo-700">
          Export JSON
        </Link>
      </div>

      <Suspense fallback={<div>Loading form...</div>}>
        <LinkForm
          tags={tags}
          collections={collections}
          onSubmit={async (payload) => {
            'use server'
            const link = await prisma.link.create({
              data: {
                url: payload.url,
                title: payload.title,
                description: payload.description,
                user: { connect: { email: session.user!.email! } },
                tags: { create: payload.tagIds.map((tagId) => ({ tagId })) },
                collections: { create: payload.collectionIds.map((collectionId) => ({ collectionId })) }
              }
            })
            await prisma.job.create({ data: { id: link.id, linkId: link.id } })
          }}
        />
      </Suspense>

      <Filters tags={tags.map((t) => ({ id: t.id, label: t.name }))} collections={collections.map((c) => ({ id: c.id, label: c.name }))} />

      <LinkDashboard initialLinks={links} tags={tags} collections={collections} />
    </div>
  )
}

function Filters({
  tags,
  collections
}: {
  tags: { id: string; label: string }[]
  collections: { id: string; label: string }[]
}) {
  return (
    <div className="flex flex-wrap gap-2 text-xs font-medium">
      {tags.map((tag) => (
        <span key={tag.id} className="rounded-full bg-slate-100 px-2 py-1">#{tag.label}</span>
      ))}
      {collections.map((collection) => (
        <span key={collection.id} className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{collection.label}</span>
      ))}
    </div>
  )
}

function LinkDashboard({
  initialLinks,
  tags,
  collections
}: {
  initialLinks: LinkWithRelations[]
  tags: Awaited<ReturnType<typeof prisma.tag.findMany>>
  collections: Awaited<ReturnType<typeof prisma.collection.findMany>>
}) {
  return (
    <div className="space-y-6">
      <LinkGrid
        links={initialLinks}
        onDelete={async (id) => {
          'use server'
          await prisma.link.delete({ where: { id } })
        }}
        onEdit={async (link) => {
          'use server'
          await prisma.link.update({
            where: { id: link.id },
            data: {
              title: link.title,
              description: link.description
            }
          })
        }}
      />
      <GraphView links={initialLinks} />
    </div>
  )
}
