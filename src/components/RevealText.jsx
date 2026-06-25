import { motion } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Clip-up reveal for headings. The text sits in an overflow-hidden box and
 * wipes up into view once on scroll. Lightweight (motion only — no GSAP/
 * SplitType), and works with any children including nested spans.
 */
export default function RevealText({ as: Tag = 'h2', children, className = '', delay = 0 }) {
  const MotionTag = motion[Tag] || motion.h2
  return (
    <MotionTag className={`reveal-mask ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: '110%', opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </MotionTag>
  )
}
