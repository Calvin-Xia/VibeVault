import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq'
import cheerio from 'cheerio'
import { prisma } from '@vibevault/db'
import { fetch } from 'undici'

const connection = { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } }

export const metadataQueue = new Queue('metadata', connection)
new QueueEvents('metadata', connection)

export type MetadataJob = {
  linkId: string
  url: string
}

export async function enqueueMetadata(job: MetadataJob, options?: JobsOptions) {
  await metadataQueue.add('metadata', job, { attempts: 3, ...options })
  await prisma.job.upsert({
    where: { id: job.linkId },
    create: { id: job.linkId, linkId: job.linkId },
    update: { status: 'pending', attempts: 0 }
  })
}

const worker = new Worker<MetadataJob>(
  'metadata',
  async (job) => {
    const { linkId, url } = job.data
    try {
      const response = await fetch(url)
      const html = await response.text()
      const $ = cheerio.load(html)
      const title = $('meta[property="og:title"]').attr('content') || $('title').text() || undefined
      const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content')
      const image = $('meta[property="og:image"]').attr('content')
      const favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href')

      await prisma.link.update({
        where: { id: linkId },
        data: {
          title,
          description,
          image,
          favicon,
          updatedAt: new Date()
        }
      })

      await prisma.job.upsert({
        where: { id: linkId },
        update: { status: 'completed', attempts: { increment: 1 }, lastRunAt: new Date() },
        create: { id: linkId, linkId, status: 'completed', attempts: 1, lastRunAt: new Date() }
      })
    } catch (error) {
      await prisma.job.upsert({
        where: { id: linkId },
        update: { status: 'failed', attempts: { increment: 1 }, lastRunAt: new Date() },
        create: { id: linkId, linkId, status: 'failed', attempts: 1, lastRunAt: new Date() }
      })
      throw error
    }
  },
  connection
)

worker.on('completed', (job) => {
  console.log(`Metadata fetched for link ${job.data.linkId}`)
})

worker.on('failed', (job, err) => {
  console.error('Metadata worker failed', job?.data, err)
})

process.on('SIGTERM', async () => {
  await worker.close()
  await metadataQueue.close()
  await prisma.$disconnect()
  process.exit(0)
})
