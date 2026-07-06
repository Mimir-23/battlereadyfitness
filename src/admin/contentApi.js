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

/** Upload an image to storage and return its public URL. */
export async function uploadImage(file) {
  const ext = IMAGE_TYPES[file.type]
  if (!ext) throw new Error('Formato no permitido. Usa JPG, PNG, WebP, GIF o AVIF.')
  const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const path = `uploads/${safe}`

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })
  if (error) throw error

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
