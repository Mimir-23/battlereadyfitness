import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { useContentMeta } from './content/ContentProvider'

import Cursor from './components/Cursor'
import ScrollProgress from './components/ui/ScrollProgress'
import GrainOverlay from './components/ui/GrainOverlay'
import RouteWipe from './components/ui/RouteWipe'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import FloatingActions from './components/layout/FloatingActions'
import RopeLoader from './components/ui/RopeLoader'

// Home is the landing page — keep it eager. Secondary routes load on demand so
// they stay out of the initial mobile bundle.
import Home from './pages/Home'
const Schedule = lazy(() => import('./pages/Schedule'))
const Memberships = lazy(() => import('./pages/Memberships'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Admin panel — fully lazy (incl. the Supabase SDK) so it never weighs on the
// public site bundle.
const AdminApp = lazy(() => import('./pages/admin/AdminApp'))

/** Branded fallback while a lazy route chunk loads. */
function RouteFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-ink">
      <RopeLoader />
    </div>
  )
}

/**
 * Keeps scroll position sane across route changes: jumps to a `#hash` target
 * when present (e.g. arriving on /#programs), otherwise resets to the top.
 * Uses the Lenis instance when available so it stays in sync with smooth scroll.
 */
function ScrollManager({ lenisRef }) {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    let cancelled = false
    let tries = 0

    const toTop = () => {
      const lenis = lenisRef.current
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }

    // Hash targets may not exist until the new route finishes rendering, so
    // poll a few frames before giving up and resetting to the top.
    const seek = () => {
      if (cancelled) return
      const lenis = lenisRef.current
      if (hash) {
        const el = document.querySelector(hash)
        if (el) {
          if (lenis) lenis.scrollTo(el, { offset: -72 })
          else el.scrollIntoView()
          return
        }
        if (tries++ < 30) {
          requestAnimationFrame(seek)
          return
        }
      }
      toTop()
    }

    requestAnimationFrame(seek)
    return () => {
      cancelled = true
    }
  }, [pathname, hash, lenisRef])

  return null
}

export default function App() {
  const lenisRef = useSmoothScroll()
  const { pathname } = useLocation()
  const { ready } = useContentMeta()
  const isAdminArea = pathname.startsWith('/admin')

  // Make sure nothing leaves the document scroll-locked.
  useEffect(() => {
    document.documentElement.style.overflow = ''
  }, [])

  // The admin panel is its own self-contained app shell — no public chrome
  // (navbar, footer, smooth-scroll, cursor effects).
  if (isAdminArea) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <AdminApp />
      </Suspense>
    )
  }

  // Espera el contenido real antes de pintar. Si pintáramos con los valores
  // por defecto, el móvil descargaría TODAS las fotos de fábrica y, al llegar
  // el contenido de Supabase (~200 ms), las descargaría TODAS otra vez con
  // las URLs nuevas — el doble de datos en la conexión más lenta. El fetch
  // tiene timeout: si Supabase no responde, se pinta con los defaults.
  if (!ready) return <RouteFallback />

  return (
    <>
      <Cursor />

      <GrainOverlay />
      <ScrollProgress />
      <ScrollManager lenisRef={lenisRef} />
      <RouteWipe />
      <Navbar />

      <main>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/memberships" element={<Memberships />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}
