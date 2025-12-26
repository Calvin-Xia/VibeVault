import { prisma } from '@vibevault/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'

export default async function TagsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return <p>Sign in to manage tags</p>
  const tags = await prisma.tag.findMany({ where: { user: { email: session.user.email } }, orderBy: { name: 'asc' } })

  async function createTag(data: FormData) {
    'use server'
    const name = data.get('name') as string
    const color = (data.get('color') as string) || '#a855f7'
    const user = await prisma.user.findUnique({ where: { email: session.user!.email! } })
    if (!user) return
    await prisma.tag.create({ data: { name, color, userId: user.id } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tags</h1>
        <p className="text-sm text-slate-600">Organize links with colored labels.</p>
      </div>
      <form action={createTag} className="flex items-center gap-3">
        <Input name="name" placeholder="Design" required />
        <Input name="color" type="color" className="w-20" />
        <Button type="submit">Add tag</Button>
      </form>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tags.map((tag) => (
          <form
            key={tag.id}
            action={async (form) => {
              'use server'
              const name = (form.get('name') as string) || tag.name
              const color = (form.get('color') as string) || tag.color
              await prisma.tag.update({ where: { id: tag.id }, data: { name, color } })
            }}
            className="card flex items-center justify-between gap-2 p-3"
          >
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: tag.color || '#111827' }}>
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: tag.color || '#a855f7' }} />
              <Input name="name" defaultValue={tag.name} className="bg-transparent" />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Input name="color" type="color" defaultValue={tag.color || '#a855f7'} className="h-8 w-16" />
              <Button type="submit" variant="ghost">
                Save
              </Button>
            </div>
          </form>
        ))}
      </div>
    </div>
  )
}
