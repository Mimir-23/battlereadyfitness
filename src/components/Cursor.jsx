import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

/**
 * Tactical targeting-reticle cursor. A small dot tracks the pointer 1:1 while an
 * outlined ring follows with spring lag and expands over interactive elements —
 * a "lock-on" feel that fits the Battle Ready brand. Disabled on touch devices
 * and when reduced motion is requested.
 */
export default function Cursor() {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  })
  const [hovering, setHovering] = useState(false)
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 })
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 })

  useEffect(() => {
    if (!enabled) return

    document.body.classList.add('has-cursor')

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      if (e.target.closest?.('a, button, [data-cursor], input, textarea, select'))
        setHovering(true)
    }
    const out = (e) => {
      if (e.target.closest?.('a, button, [data-cursor], input, textarea, select'))
        setHovering(false)
    }
    const dn = () => setDown(true)
    const up = () => setDown(false)

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    window.addEventListener('mousedown', dn)
    window.addEventListener('mouseup', up)

    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      window.removeEventListener('mousedown', dn)
      window.removeEventListener('mouseup', up)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      {/* center dot */}
      <motion.div
        className="cursor-dot"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <span className="block h-1.5 w-1.5 rounded-full bg-white" />
      </motion.div>

      {/* reticle ring with crosshair ticks */}
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hovering ? 1.9 : down ? 0.8 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <span className="relative block h-9 w-9 rounded-full border border-white">
          {/* ticks */}
          <span className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 -translate-y-1/2 bg-white" />
          <span className="absolute bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2 translate-y-1/2 bg-white" />
          <span className="absolute left-0 top-1/2 h-px w-1.5 -translate-x-1/2 -translate-y-1/2 bg-white" />
          <span className="absolute right-0 top-1/2 h-px w-1.5 translate-x-1/2 -translate-y-1/2 bg-white" />
        </span>
      </motion.div>
    </>
  )
}
