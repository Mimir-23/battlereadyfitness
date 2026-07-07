import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { isDesktopPointer } from '../../lib/motion'

/**
 * Scroll-linked vertical drift for decorative layers (glow orbs, watermarks,
 * badges). While the element crosses the viewport it slides from +speed to
 * -speed px, so it appears to sit on a deeper plane than the page content.
 * Desktop-only — on touch it renders static (same policy as ParallaxImage).
 */
export default function Parallax({ children, className = '', speed = 60, ...rest }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])
  return (
    <motion.div
      ref={ref}
      style={isDesktopPointer ? { y } : undefined}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
