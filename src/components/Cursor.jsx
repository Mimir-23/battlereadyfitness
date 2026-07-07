import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react'

/**
 * Dumbbell cursor. A small dot tracks the pointer 1:1 while a dumbbell follows
 * with spring lag, swinging with the momentum of the movement as if carried.
 * Over interactive elements it starts doing reps (a curl-like bounce) and on
 * press it squashes, like gripping the weight. Disabled on touch devices and
 * when reduced motion is requested.
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
  // Carried-weight sway: horizontal momentum tips the bar around its resting
  // -14° tilt, springed so it settles back with a little wobble.
  const vx = useVelocity(ringX)
  const sway = useSpring(
    useTransform(vx, [-1400, 0, 1400], [10, -14, -38], { clamp: true }),
    { stiffness: 160, damping: 12 },
  )

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

      {/* dumbbell: bar + two plates per side, swinging with momentum */}
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hovering ? 1.55 : down ? 0.82 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div style={{ rotate: sway }}>
          {/* over interactive elements the dumbbell starts doing reps */}
          <motion.svg
            viewBox="0 0 48 48"
            className="block h-10 w-10"
            animate={hovering ? { y: [0, -6, 0] } : { y: 0 }}
            transition={
              hovering
                ? { duration: 0.55, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.2 }
            }
            aria-hidden="true"
          >
            <g fill="white">
              {/* grip bar with knurling gaps */}
              <rect x="13" y="22.25" width="22" height="3.5" rx="1.75" />
              {/* inner plates */}
              <rect x="8.5" y="14.5" width="4.5" height="19" rx="2" />
              <rect x="35" y="14.5" width="4.5" height="19" rx="2" />
              {/* outer plates */}
              <rect x="3.5" y="18.5" width="4" height="11" rx="2" />
              <rect x="40.5" y="18.5" width="4" height="11" rx="2" />
            </g>
          </motion.svg>
        </motion.div>
      </motion.div>
    </>
  )
}
