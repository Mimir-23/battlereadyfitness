import { supabase, IMAGE_BUCKET } from '../lib/supabase'

/* ------------------------------------------------------------------ */
/*  Admin data access                                                  */
/*  Thin helpers around Supabase for saving content, uploading images   */
/*  and reading the change history. All write paths are protected by    */
/*  RLS (admins only) on the server.                                    */
/* ------------------------------------------------------------------ */

/** Save (insert or update) one section's content. */
export async function saveSection(key, value, email) {
  const { error } = await supabase
    .from('site_content')
    .upsert(
      { key, value, updated_at: new Date().toISOString(), updated_by: email ?? null },
      { onConflict: 'key' },
    )
  if (error) throw error
}

/** Read one section's currently saved value (null = no override). */
export async function fetchSectionValue(key) {
  const { data, error } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  if (error) throw error
  return data?.value ?? null
}

/** Revert a section to its built-in default by deleting its override row. */
export async function resetSection(key) {
  const { error } = await supabase.from('site_content').delete().eq('key', key)
  if (error) throw error
}

/** When was each section last edited (key → { updated_at, updated_by }). */
export async function fetchSavedMeta() {
  const { data, error } = await supabase
    .from('site_content')
    .select('key, updated_at, updated_by')
  if (error) throw error
  const map = {}
  for (const row of data || []) map[row.key] = row
  return map
}

/** Recent change history, newest first. */
export async function fetchHistory(limit = 30) {
  const { data, error } = await supabase
    .from('content_history')
    .select('id, key, changed_at, changed_by')
    .order('changed_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

/* Solo formatos raster: un SVG puede llevar <script> y serviría XSS desde la
   URL pública del bucket, así que queda fuera a propósito. */
const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

/* Reduce la imagen ANTES de subirla: una foto de cámara (3-8 MB, 4000px)
   multiplicada por toda la galería congelaba el sitio en celulares. 1920px de
   lado mayor y WebP ~0.82 dejan cada foto en 150-400 KB sin pérdida visible.
   GIF se sube tal cual (el canvas mataría la animación). */
async function compressImage(file) {
  if (file.type === 'image/gif') return file
  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file

  const MAX = 1920
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', 0.82))
  // Sin soporte webp en canvas, o si no ganamos peso: se sube el original.
  if (!blob || blob.size >= file.size) return file
  return new File([blob], 'image.webp', { type: 'image/webp' })
}

/** Upload an image to storage (compressed) and return its public URL. */
export async function uploadImage(original) {
  if (!IMAGE_TYPES[original.type])
    throw new Error('Formato no permitido. Usa JPG, PNG, WebP, GIF o AVIF.')
  const file = await compressImage(original)
  const ext = IMAGE_TYPES[file.type]
  const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const path = `uploads/${safe}`

  // Un año de caché: el nombre del archivo es único (timestamp + aleatorio),
  // así que nunca se sirve una versión vieja — y las visitas repetidas no
  // vuelven a descargar ninguna foto.
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type })
  if (error) throw error

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
