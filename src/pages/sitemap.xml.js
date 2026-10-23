/* Sitemap of the public pages (the panel and the API stay out). */
export const prerender = true

const PAGES = ['/', '/schedule', '/memberships', '/terms']

export function GET({ site }) {
  const urls = PAGES.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n')
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  )
}
