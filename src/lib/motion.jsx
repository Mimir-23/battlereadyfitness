/* eslint-disable react-refresh/only-export-components */
import { motion } from 'motion/react'

/* Shared easing + variants used across every animated section. */

export const EASE = [0.16, 1, 0.3, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

/* Shared viewport trigger — low threshold so sections reveal as soon as they
   peek into view (prevents "blank until you scroll far" on small screens). */
export const VIEWPORT = { once: true, amount: 0.15 }

/** Fades + lifts its children into view once, on scroll. */
export function Reveal({ children, className, variants = fadeUp }) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  )
}
