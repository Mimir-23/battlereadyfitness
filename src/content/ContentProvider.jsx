/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { DEFAULT_CONTENT } from './defaults'
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isSupabaseConfigured,
} from '../lib/supabaseEnv'

/* ------------------------------------------------------------------ */
/*  Content layer                                                      */
/*  Loads admin-saved overrides from Supabase and merges them over the */
/*  defaults (one row per top-level section key). The public site reads */
/*  content through useContent(); if Supabase isn't configured or a     */
/*  request fails, it transparently falls back to the defaults so the   */
/*  site always renders.                                                */
/* ------------------------------------------------------------------ */

const ContentContext = createContext({
  content: DEFAULT_CONTENT,
  ready: true,
  refresh: async () => {},
})

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [ready, setReady] = useState(!isSupabaseConfigured)

  const load = useCallback(async () => {
    // When unconfigured, `ready` already starts true (see useState) and the
    // site renders defaults — nothing to fetch.
    if (!isSupabaseConfigured) return
    try {
      // Lightweight REST read — keeps the heavy SDK out of the public bundle.
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/site_content?select=key,value`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        },
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const overrides = {}
      for (const row of data || []) overrides[row.key] = row.value

      // Migración: los testimonios pasaron de una reseña única a una lista.
      // Un valor guardado con el formato antiguo ({ quote, author… }) se
      // convierte al vuelo para que el sitio y el editor sigan funcionando.
      const t = overrides.testimonial
      if (t && !Array.isArray(t.items)) {
        overrides.testimonial = {
          image: t.image || DEFAULT_CONTENT.testimonial.image,
          items: t.quote
            ? [{ quote: t.quote, highlight: t.highlight || '', author: t.author || '', role: t.role || '' }]
            : DEFAULT_CONTENT.testimonial.items,
        }
      }

      setContent({ ...DEFAULT_CONTENT, ...overrides })
    } catch (err) {
      // Keep defaults so the public site never breaks on a bad/slow request.
      console.warn(
        'Contenido remoto no disponible, usando valores por defecto:',
        err?.message || err,
      )
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    // load() only calls setState after an awaited fetch (never synchronously).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  return (
    <ContentContext.Provider value={{ content, ready, refresh: load }}>
      {children}
    </ContentContext.Provider>
  )
}

/** The merged, ready-to-render site content. */
export function useContent() {
  return useContext(ContentContext).content
}

/** Full context (content + ready flag + refresh) for code that needs it. */
export function useContentMeta() {
  return useContext(ContentContext)
}
