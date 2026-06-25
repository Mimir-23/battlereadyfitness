import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { useSmoothScroll } from './lib/useSmoothScroll'

import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import ScrollProgress from './components/ui/ScrollProgress'
import GrainOverlay from './components/ui/GrainOverlay'
import RouteWipe from './components/ui/RouteWipe'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import FloatingActions from './components/layout/FloatingActions'

import Home from './pages/Home'
import Schedule from './pages/Schedule'
import Memberships from './pages/Memberships'
import NotFound from './pages/NotFound'

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
  const [loading, setLoading] = useState(true)

  // Lock scrolling while the preloader is on screen.
  useEffect(() => {
    const lenis = lenisRef.current
    if (loading) {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
    // Always restore scrolling if this effect/component tears down.
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [loading, lenisRef])

  // Safety net: never let the preloader leave the page scroll-locked.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Cursor />
      <AnimatePresence>
        {loading && <Preloader key="preloader" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <GrainOverlay />
      <ScrollProgress />
      <ScrollManager lenisRef={lenisRef} />
      <RouteWipe />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home loaded={!loading} />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}
