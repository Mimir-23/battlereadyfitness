import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

const ALLOWED =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Interactive card surface: a cursor-tracking radial glow (via CSS `--mx/--my`)
 * plus an optional subtle 3D tilt toward the pointer. Falls back to a plain
 * element on touch / reduced-motion. Pass `as={motion.article}` etc. when you
 * need a specific element/variants.
 */
export default function Spotlight({
  children,
  className = '',
  tilt = true,
  strength = 8,
  ...rest
}) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 18 })
  const sry = useSpring(ry, { stiffness: 150, damping: 18 })
  const rotateX = useTransform(srx, (v) => `${v}deg`)
  const rotateY = useTransform(sry, (v) => `${v}deg`)

  const onMove = (e) => {
    if (!ALLOWED || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ref.current.style.setProperty('--mx', `${px * 100}%`)
    ref.current.style.setProperty('--my', `${py * 100}%`)
    if (tilt) {
      ry.set((px - 0.5) * strength)
      rx.set((0.5 - py) * strength)
    }
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={tilt && ALLOWED ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className={`spotlight ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
