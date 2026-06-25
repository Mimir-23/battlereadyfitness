import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

/** Scroll-linked parallax image inside a clipped, relatively-positioned parent. */
export default function ParallaxImage({ src, alt, className = '', strength = 80 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength])
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="h-[120%] w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
