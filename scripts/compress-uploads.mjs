/* ------------------------------------------------------------------ */
/*  Compresión única de las imágenes ya subidas al bucket              */
/*                                                                      */
/*  Las fotos subidas desde el panel antes de que existiera la          */
/*  compresión automática pesan hasta 2 MB cada una (21 MB en total) y  */
/*  congelaban el sitio en celulares. Este script las baja, las reduce  */
/*  a máx. 1920px / WebP q80 y las vuelve a subir A LA MISMA RUTA, así  */
/*  que ninguna URL guardada en el contenido cambia.                    */
/*                                                                      */
/*  Uso (la service key NO se guarda en ningún archivo del repo):       */
/*    node scripts/compress-uploads.mjs <SUPABASE_URL> <SERVICE_KEY>    */
/* ------------------------------------------------------------------ */

import sharp from 'sharp'

const [, , RAW_URL, KEY] = process.argv
if (!RAW_URL || !KEY) {
  console.error('Uso: node scripts/compress-uploads.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY>')
  process.exit(1)
}
const URL_BASE = RAW_URL.replace(/\/+$/, '')
const HEADERS = { apikey: KEY, Authorization: `Bearer ${KEY}` }
const BUCKET = 'site-images'
// Por debajo de este peso no vale la pena reprocesar.
const SKIP_BELOW = 250 * 1024

// Las URLs de imágenes subidas que el contenido realmente usa.
const res = await fetch(`${URL_BASE}/rest/v1/site_content?select=value`, { headers: HEADERS })
if (!res.ok) {
  console.error(`No pude leer site_content: HTTP ${res.status}`)
  process.exit(1)
}
const rows = await res.json()
const used = new Set(
  JSON.stringify(rows).match(/storage\/v1\/object\/public\/site-images\/(uploads\/[\w.-]+)/g) || [],
)
const paths = [...used].map((m) => m.replace(/^storage\/v1\/object\/public\/site-images\//, ''))
console.log(`Imágenes en uso: ${paths.length}`)

let saved = 0
for (const path of paths) {
  const src = `${URL_BASE}/storage/v1/object/public/${BUCKET}/${path}`
  const img = await fetch(src)
  if (!img.ok) {
    console.log(`  SKIP (HTTP ${img.status}) ${path}`)
    continue
  }
  const buf = Buffer.from(await img.arrayBuffer())
  if (buf.length < SKIP_BELOW) {
    console.log(`  OK   ${(buf.length / 1024).toFixed(0).padStart(5)} KB  ${path} (ya liviana)`)
    continue
  }

  // rotate() aplica la orientación EXIF antes de que la compresión la pierda.
  const out = await sharp(buf)
    .rotate()
    .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  if (out.length >= buf.length) {
    console.log(`  OK   ${(buf.length / 1024).toFixed(0).padStart(5)} KB  ${path} (no mejora)`)
    continue
  }

  // Misma ruta (x-upsert): el Content-Type pasa a webp aunque la extensión
  // diga .png — los navegadores obedecen la cabecera, no la extensión.
  const up = await fetch(`${URL_BASE}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: {
      ...HEADERS,
      'Content-Type': 'image/webp',
      'x-upsert': 'true',
      'Cache-Control': 'max-age=3600',
    },
    body: out,
  })
  if (!up.ok) {
    console.log(`  FAIL (HTTP ${up.status}) ${path}: ${(await up.text()).slice(0, 120)}`)
    continue
  }
  saved += buf.length - out.length
  console.log(
    `  ✔    ${(buf.length / 1024).toFixed(0).padStart(5)} KB → ${(out.length / 1024)
      .toFixed(0)
      .padStart(4)} KB  ${path}`,
  )
}
console.log(`\nAhorro total: ${(saved / 1024 / 1024).toFixed(1)} MB`)
