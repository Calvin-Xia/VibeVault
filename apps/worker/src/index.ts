import { prisma } from 'db'
import { load } from 'cheerio'
import { fetch } from 'undici'

// Config
const POLL_INTERVAL = 5000 // 5 seconds
const FETCH_TIMEOUT = 10000 // 10 seconds

// Fetch metadata from URL
async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url, {
      timeout: FETCH_TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      redirect: 'follow'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const html = await response.text()
    const $ = load(html)
    
    // Extract metadata
    const metadata = {
      title: getMetaTag($, 'og:title') || $('title').text() || '',
      description: getMetaTag($, 'og:description') || getMetaTag($, 'description') || '',
      siteName: getMetaTag($, 'og:site_name') || '',
      ogImage: getMetaTag($, 'og:image') || getMetaTag($, 'twitter:image') || '',
      favicon: getFavicon($, url) || '',
      publishedTime: getMetaTag($, 'article:published_time') || getMetaTag($, 'published_time') || ''
    }
    
    return metadata
  } catch (error) {
    console.error('Error fetching metadata:', error)
    throw error
  }
}

// Helper functions
function getMetaTag($: any, name: string): string {
  const tag = $(`meta[property="${name}"]`).attr('content') || 
             $(`meta[name="${name}"]`).attr('content') || 
             ''
  return tag.trim()
}

function getFavicon($: any, url: string): string {
  let favicon = $('link[rel="icon"]').attr('href') ||
               $('link[rel="shortcut icon"]').attr('href') ||
               $('link[rel="apple-touch-icon"]').attr('href') ||
               ''
  
  if (favicon && !favicon.startsWith('http')) {
    // Make absolute URL
    const urlObj = new URL(url)
    favicon = new URL(favicon, urlObj.origin).toString()
  }
  
  return favicon.trim()
}

// Process a single job
async function processJob(job: any) {
  console.log(`Processing job ${job.id} of type ${job.type}`)
  
  try {
    // Update job status to RUNNING
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: 'RUNNING',
        attempts: { increment: 1 }
      }
    })
    
    // Process based on job type
    if (job.type === 'FETCH_METADATA') {
      const { linkId } = JSON.parse(job.payload)
      
      // Get link
      const link = await prisma.link.findUnique({
        where: { id: linkId }
      })
      
      if (!link) {
        throw new Error(`Link not found: ${linkId}`)
      }
      
      // Fetch metadata
      const metadata = await fetchMetadata(link.url)
      
      // Update link metadata
      await prisma.link.update({
        where: { id: linkId },
        data: {
          title: metadata.title,
          description: metadata.description,
          siteName: metadata.siteName,
          ogImage: metadata.ogImage,
          favicon: metadata.favicon,
          publishedTime: metadata.publishedTime ? new Date(metadata.publishedTime) : null,
          metadataStatus: 'READY'
        }
      })
    }
    
    // Update job status to DONE
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: 'DONE',
        updatedAt: new Date()
      }
    })
    
    console.log(`Job ${job.id} completed successfully`)
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error)
    
    // Update job status to FAILED
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date()
      }
    })
    
    // Also update link metadata status to FAILED
    if (job.type === 'FETCH_METADATA') {
      const { linkId } = job.payload
      await prisma.link.update({
        where: { id: linkId },
        data: {
          metadataStatus: 'FAILED',
          metadataError: error instanceof Error ? error.message : 'Unknown error'
        }
      })
    }
  }
}

// Poll for jobs
async function pollJobs() {
  try {
    // Get queued jobs
    const jobs = await prisma.job.findMany({
      where: { status: 'QUEUED' },
      orderBy: { createdAt: 'asc' },
      take: 10 // Process up to 10 jobs at a time
    })
    
    if (jobs.length > 0) {
      console.log(`Found ${jobs.length} queued jobs`)
      
      // Process jobs in parallel
      await Promise.all(jobs.map(job => processJob(job)))
    }
  } catch (error) {
    console.error('Error polling jobs:', error)
  }
}

// Start worker
async function startWorker() {
  console.log('Worker started, polling for jobs every', POLL_INTERVAL / 1000, 'seconds')
  
  // Initial poll
  await pollJobs()
  
  // Set up interval
  setInterval(pollJobs, POLL_INTERVAL)
}

// Handle shutdown
process.on('SIGINT', () => {
  console.log('Worker shutting down...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('Worker shutting down...')
  process.exit(0)
})

// Start the worker
startWorker()
