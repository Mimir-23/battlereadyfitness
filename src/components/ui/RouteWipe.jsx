import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLocation } from 'react-router-dom'
import { EASE } from '../../lib/motion'

/**
 * Tactical curtain that sweeps up to reveal each new route. A fresh panel mounts
 * on every navigation covering the viewport, then collapses to the top edge —
 * with a battle-yellow leading line and hazard stripe for brand flair. The page
 * underneath swaps instantly, so scroll restoration happens hidden behind it.
 */
export default function RouteWipe() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()

  // No full-screen sweep for users who prefer reduced motion.
  if (reduced) return null

  return (
    <AnimatePresence>
      <motion.div
        key={pathname}
        className="pointer-events-none fixed inset-0 z-[80] origin-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="relative h-full w-full bg-ink">
          <div className="absolute inset-0 bg-grid opacity-40" />
          {/* leading edge */}
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-battle" />
          <div className="bg-hazard absolute inset-x-0 bottom-1.5 h-2 opacity-80" />
          <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-display text-5xl text-stroke-chalk opacity-40">
            BR
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
