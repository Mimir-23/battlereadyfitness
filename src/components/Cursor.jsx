import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

/**
 * Weight-plate cursor. A small dot tracks the pointer 1:1 while an olympic
 * plate (rim, grip notches, center hole) follows with spring lag — and rolls
 * like a real plate as the pointer moves horizontally. It grows over
 * interactive elements and squashes on press, like gripping the weight.
 * Disabled on touch devices and when reduced motion is requested.
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
  // The plate rolls with horizontal travel, like a wheel on the gym floor.
  const roll = useTransform(ringX, (v) => v * 0.6)

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

      {/* olympic weight plate: rim, inner face, grip notches, center hole */}
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hovering ? 1.7 : down ? 0.8 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.svg
          viewBox="0 0 40 40"
          className="block h-9 w-9"
          style={{ rotate: roll }}
          aria-hidden="true"
        >
          <g stroke="white" fill="none">
            {/* plate rim */}
            <circle cx="20" cy="20" r="17.5" strokeWidth="3" />
            {/* inner face edge */}
            <circle cx="20" cy="20" r="10.5" strokeWidth="1" opacity="0.65" />
            {/* barbell sleeve hole */}
            <circle cx="20" cy="20" r="3.75" strokeWidth="1.5" />
            {/* grip notches (rotate with the roll so the plate reads as spinning) */}
            {[0, 120, 240].map((a) => (
              <line
                key={a}
                x1="20"
                y1="6.5"
                x2="20"
                y2="12.5"
                strokeWidth="1.5"
                opacity="0.8"
                transform={`rotate(${a} 20 20)`}
              />
            ))}
          </g>
        </motion.svg>
      </motion.div>
    </>
  )
}
