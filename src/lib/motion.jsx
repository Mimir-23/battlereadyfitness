/* eslint-disable react-refresh/only-export-components */
import { motion } from 'motion/react'

/* Shared easing + variants used across every animated section. */

export const EASE = [0.16, 1, 0.3, 1]

/* Touch devices: scroll-driven reveals (IntersectionObserver) are unreliable on
   mobile — slow JS hydration or Safari quirks can leave a section stuck at
   opacity:0 ("blank / half-loaded" home). On touch we therefore skip the whole
   scroll-observer dance and render everything in its final visible state from
   the first paint. Reveal animations stay as a desktop-only enhancement. */
export const isTouch =
  typeof window !== 'undefined' &&
  !window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

/* Shared viewport trigger. Low threshold + a positive bottom rootMargin so a
   section starts revealing ~180px BEFORE it scrolls into view — by the time it
   reaches the screen it's already there (no "blank until you scroll" feel). */
export const VIEWPORT = { once: true, amount: 0.01, margin: '0px 0px 180px 0px' }

/* Spread onto any motion element that drives a variant-based reveal. On desktop
   it reveals on scroll; on touch it jumps straight to "show" (no observer, so
   content can never be left invisible). Children variants still resolve because
   the parent broadcasts the "show" label. */
export const reveal = isTouch
  ? { initial: false, animate: 'show' }
  : { initial: 'hidden', whileInView: 'show', viewport: VIEWPORT }

/** Fades + lifts its children into view once, on scroll (desktop) — or renders
    them immediately visible on touch. */
export function Reveal({ children, className, variants = fadeUp }) {
  return (
    <motion.div className={className} variants={variants} {...reveal}>
      {children}
    </motion.div>
  )
}
