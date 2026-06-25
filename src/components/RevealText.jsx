import { motion } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Fade-up reveal for headings. Animates the heading element itself (reliable on
 * mobile) rather than an inner clipped span — that earlier approach could leave
 * the observer un-triggered, hiding titles. Works with any children.
 */
export default function RevealText({ as: Tag = 'h2', children, className = '', delay = 0 }) {
  const MotionTag = motion[Tag] || motion.h2
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01, margin: '0px 0px 180px 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  )
}
