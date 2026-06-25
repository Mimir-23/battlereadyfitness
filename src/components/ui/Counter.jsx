import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, animate } from 'motion/react'
import { EASE } from '../../lib/motion'

/** Counts up from 0 to `value` the first time it scrolls into view. */
export default function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, value, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, mv])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}
