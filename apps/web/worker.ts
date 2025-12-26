import { Queue } from 'bullmq'
import { prisma } from '@vibevault/db'

const queue = new Queue('metadata', { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } })

export async function enqueueMetadata(job: { linkId: string; url: string }) {
  await queue.add('metadata', job, { attempts: 3 })
  await prisma.job.upsert({
    where: { id: job.linkId },
    create: { id: job.linkId, linkId: job.linkId, status: 'pending' },
    update: { status: 'pending' }
  })
}
