import { dangerouslyDeleteByTag } from '@vercel/functions'
import { CONTENT_TAG } from './content.js'

/**
 * Drops every cached public page so the next visit renders fresh content.
 * On Vercel it's a hard delete of the CDN entries (a soft invalidation would
 * still serve one stale copy first); locally it clears the in-memory cache.
 */
export async function purgeContent(cache) {
  await Promise.allSettled([
    dangerouslyDeleteByTag(CONTENT_TAG),
    cache?.enabled ? cache.invalidate({ tags: [CONTENT_TAG] }) : null,
  ])
}
