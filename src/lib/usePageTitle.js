import { useEffect } from 'react'

const BASE = 'Battle Ready Fitness Bootcamp'

/** Sets the document title for a route, restoring the base title on unmount. */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — We're Simply Unique`
    return () => {
      document.title = `${BASE} — We're Simply Unique`
    }
  }, [title])
}
