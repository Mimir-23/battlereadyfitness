import { motion, useScroll, useVelocity, useSpring, useTransform } from 'motion/react'
import { FaFire } from 'react-icons/fa6'
import { MARQUEE } from '../../data/site'

/** Infinite scrolling word band that skews with scroll velocity. */
export default function Marquee({ reverse }) {
  const items = [...MARQUEE, ...MARQUEE]
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { stiffness: 200, damping: 40 })
  const skewX = useTransform(smooth, [-2000, 0, 2000], [-8, 0, 8], { clamp: true })

  return (
    <div
      className={`relative overflow-hidden border-y border-iron py-4 ${
        reverse ? 'bg-ink' : 'bg-battle'
      }`}
    >
      <motion.div style={{ skewX }} className="w-max">
        <div
          className="flex w-max items-center gap-8 whitespace-nowrap"
          style={{
            animation: reverse
              ? 'var(--animate-marquee-rev)'
              : 'var(--animate-marquee)',
          }}
        >
          {items.map((word, i) => (
            <span key={i} className="flex items-center gap-8">
              <span
                className={`font-display text-2xl tracking-wide ${
                  reverse ? 'text-stroke-chalk' : 'text-ink'
                }`}
              >
                {word}
              </span>
              <FaFire className={reverse ? 'text-battle' : 'text-ink/70'} size={18} />
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
