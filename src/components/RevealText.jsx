import { motion } from 'motion/react'
import { isTouch } from '../lib/motion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Fade-up reveal for headings. On desktop it animates the heading element itself
 * on scroll. On touch it renders fully visible immediately — scroll observers
 * are unreliable on mobile and could otherwise leave a title hidden.
 */
export default function RevealText({ as: Tag = 'h2', children, className = '', delay = 0 }) {
  const MotionTag = motion[Tag] || motion.h2
  if (isTouch) {
    return <Tag className={className}>{children}</Tag>
  }
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
