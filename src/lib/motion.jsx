/* eslint-disable react-refresh/only-export-components */
import { motion } from 'motion/react'

/* Shared easing + variants used across every animated section. */

export const EASE = [0.16, 1, 0.3, 1]

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
