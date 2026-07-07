import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { isDesktopPointer } from '../../lib/motion'

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
        style={isDesktopPointer ? { y } : undefined}
        // Sobra un 10% por ARRIBA y por abajo (no solo abajo): con la imagen
        // anclada al tope, el drift positivo descubría una franja del fondo
        // justo cuando la tarjeta rozaba el borde superior del viewport.
        className={`w-full object-cover ${isDesktopPointer ? 'relative -top-[10%] h-[120%]' : 'h-full'}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
