import { defineMiddleware } from 'astro:middleware'

/* Security headers on every server-rendered response (the CDN caches them
   along with the page). vercel.json sets the same ones for static files. */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
}

export const onRequest = defineMiddleware(async (_, next) => {
  const response = await next()
  try {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      if (!response.headers.has(name)) response.headers.set(name, value)
    }
  } catch {
    // Some responses (e.g. redirects) have immutable headers.
  }
  return response
})
