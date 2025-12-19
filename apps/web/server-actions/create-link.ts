'use server'

import { auth } from '@/lib/auth'
import { prisma } from 'db'

// Helper function to normalize URL
function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    
    // Remove hash
    urlObj.hash = ''
    
    // Remove tracking parameters
    const trackingParams = ['utm_*', 'fbclid', 'gclid', 'cid', 'ref', 'source', 'campaign', 'medium']
    for (const param of Array.from(urlObj.searchParams.keys())) {
      if (trackingParams.some(trackingParam => 
        trackingParam.endsWith('*') 
          ? param.startsWith(trackingParam.slice(0, -1)) 
          : param === trackingParam
      )) {
        urlObj.searchParams.delete(param)
      }
    }
    
    return urlObj.toString()
  } catch (error) {
    return url
  }
}

// Helper function to extract domain
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch (error) {
    return ''
  }
}

export async function createLink(url: string, collectionId?: string, tagIds?: string[]) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  // Validate URL
  if (!url || !url.startsWith('http')) {
    throw new Error('Invalid URL')
  }
  
  const normalizedUrl = normalizeUrl(url)
  const domain = extractDomain(url)
  
  // Create Link
  const link = await prisma.link.create({
    data: {
      userId: session.user.id,
      url,
      normalizedUrl,
      domain,
      status: 'INBOX',
      metadataStatus: 'PENDING',
      collectionId
    },
    include: {
      collection: true
    }
  })
  
  // Connect tags if provided
  if (tagIds && tagIds.length > 0) {
    await prisma.linkTag.createMany({
      data: tagIds.map(tagId => ({
        linkId: link.id,
        tagId
      }))
    })
  }
  
  // Create Job for fetching metadata
  await prisma.job.create({
    data: {
      userId: session.user.id,
      type: 'FETCH_METADATA',
      payload: JSON.stringify({ linkId: link.id }),
      status: 'QUEUED'
    }
  })
  
  return link
}
