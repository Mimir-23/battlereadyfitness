import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, animate } from 'motion/react'
import { EASE, isTouch } from '../../lib/motion'

/** Counts up from 0 to `value` the first time it scrolls into view (desktop) —
    or on mount on touch, where scroll observers are unreliable. */
export default function Counter({ value, suffix }) {
  const ref = useRef(null)
  const scrolledIntoView = useInView(ref, { once: true, amount: 0.01, margin: '0px 0px 120px 0px' })
  const inView = isTouch || scrolledIntoView
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
