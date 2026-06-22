import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Reveals its text content character-by-character on scroll. Renders as the tag
 * given by `as` (default h2). Pass any className for styling.
 */
export default function RevealText({
  as: Tag = 'h2',
  children,
  className = '',
  stagger = 0.018,
  y = 70,
  delay = 0,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced) return

    const split = new SplitType(el, { types: 'lines,words,chars' })

    const tween = gsap.from(split.chars, {
      yPercent: y,
      opacity: 0,
      rotateX: -40,
      stagger,
      delay,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      split.revert()
    }
  }, [stagger, y, delay])

  return (
    <Tag ref={ref} className={`reveal-mask ${className}`}>
      {children}
    </Tag>
  )
}
