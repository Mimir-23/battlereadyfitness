import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Only run Lenis on real pointer (mouse) devices. On phones/tablets we let the
   browser handle scrolling natively — Lenis virtualised scrolling can fight
   touch input and lock the page, so native is both safer and smoother there. */
const isDesktopPointer =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* Singleton compartido: componentes sueltos (p. ej. el botón "volver arriba")
   necesitan desplazar la página SIN pasar por props. Usar window.scrollTo
   nativo con Lenis activo hace que ambos peleen por la posición. */
let activeLenis = null

/** The live Lenis instance, or null on touch / reduced motion. */
export function getLenis() {
  return activeLenis
}

/**
 * Initialises Lenis smooth scrolling on desktop mouse devices and drives it with
 * a plain rAF loop (no GSAP dependency). Returns a ref holding the Lenis
 * instance (null on touch / reduced motion), used elsewhere for programmatic
 * scrolling.
 */
export function useSmoothScroll() {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (prefersReduced || !isDesktopPointer) return

    const lenis = new Lenis({
      duration: 1.1,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
    })
    lenisRef.current = lenis
    activeLenis = lenis

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Anchor links → smooth scroll via Lenis
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -72, duration: 1.2 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
      if (activeLenis === lenis) activeLenis = null
    }
  }, [])

  return lenisRef
}
