/**
 * Optimiza las imágenes del sitio: redimensiona y convierte a WebP.
 * Uso:  node scripts/optimize-images.mjs
 * Genera los .webp junto a los originales (los .jpg/.png se conservan).
 */
import { readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..', 'public')

// Ancho máximo por uso real: hero/banner a pantalla completa, tarjetas ~600px
// renderizados (x2 para pantallas retina).
const JOBS = [
  { file: 'images/hero.jpg', width: 1920, quality: 72 },
  { file: 'images/cta.jpg', width: 1600, quality: 72 },
  { file: 'images/bootcamp.jpg', width: 1280, quality: 72 },
  { file: 'images/kickboxing.jpg', width: 1280, quality: 72 },
  { file: 'images/coach.jpg', width: 1280, quality: 72 },
  { file: 'images/g1.jpg', width: 1280, quality: 72 },
  { file: 'images/g2.jpg', width: 1280, quality: 72 },
  { file: 'images/g3.jpg', width: 1280, quality: 72 },
  { file: 'images/g4.jpg', width: 1280, quality: 72 },
  // Logo con transparencia (PNG → WebP con alfa).
  { file: 'logo-removebg-preview.png', out: 'logo.webp', width: 480, quality: 85 },
]

const kb = (n) => `${(n / 1024).toFixed(0)} KB`

let before = 0
let after = 0

for (const job of JOBS) {
  const src = path.join(ROOT, job.file)
  const out = path.join(ROOT, job.out ?? job.file.replace(/\.(jpe?g|png)$/i, '.webp'))

  const input = await readFile(src)
  const buf = await sharp(input)
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality })
    .toBuffer()
  await writeFile(out, buf)

  const inSize = (await stat(src)).size
  before += inSize
  after += buf.length
  console.log(
    `${job.file.padEnd(32)} ${kb(inSize).padStart(8)} → ${kb(buf.length).padStart(8)}  (${path.basename(out)})`,
  )
}

console.log('-'.repeat(64))
console.log(`Total: ${kb(before)} → ${kb(after)}  (ahorro ${(100 - (after / before) * 100).toFixed(0)}%)`)
