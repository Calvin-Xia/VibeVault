import { prisma } from '@vibevault/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'

export default async function CollectionsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return <p>Sign in to manage collections</p>

  const collections = await prisma.collection.findMany({
    where: { user: { email: session.user.email } },
    include: { links: true },
    orderBy: { name: 'asc' }
  })

  async function createCollection(data: FormData) {
    'use server'
    const name = data.get('name') as string
    const user = await prisma.user.findUnique({ where: { email: session.user!.email! } })
    if (!user) return
    await prisma.collection.create({ data: { name, userId: user.id } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Collections</h1>
        <p className="text-sm text-slate-600">Group links into themed sets and views.</p>
      </div>
      <form action={createCollection} className="flex items-center gap-3">
        <Input name="name" placeholder="Reading list" required />
        <Button type="submit">Create</Button>
      </form>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {collections.map((collection) => (
          <div key={collection.id} className="card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{collection.name}</h3>
              <span className="text-xs text-slate-500">{collection.links.length} links</span>
            </div>
            <div className="mt-2 flex gap-2 text-xs text-slate-500">
              <form
                action={async (form) => {
                  'use server'
                  const name = (form.get('name') as string) || collection.name
                  await prisma.collection.update({ where: { id: collection.id }, data: { name } })
                }}
                className="flex items-center gap-2"
              >
                <Input name="name" defaultValue={collection.name} className="bg-transparent" />
                <Button type="submit" variant="outline">
                  Rename
                </Button>
              </form>
              <form
                action={async () => {
                  'use server'
                  await prisma.collection.delete({ where: { id: collection.id } })
                }}
              >
                <Button variant="ghost" type="submit" className="text-rose-600">
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
