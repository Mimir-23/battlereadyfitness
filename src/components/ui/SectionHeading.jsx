import { motion } from 'motion/react'
import { Reveal, VIEWPORT, isTouch } from '../../lib/motion'
import RevealText from '../RevealText'
import Parallax from './Parallax'

/** Kicker + oversized display title used at the top of every major section. */
export default function SectionHeading({
  number,
  kicker,
  title,
  accent,
  align = 'center',
}) {
  return (
    <div className={`relative max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {/* giant stencil index behind the title, drifting on a deeper plane */}
      {number && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 -top-16 z-0 flex ${
            align === 'center' ? 'justify-center' : 'justify-start'
          }`}
        >
          <Parallax speed={26}>
            <span className="font-display text-[9rem] leading-none text-stroke-chalk opacity-35 select-none">
              {number}
            </span>
          </Parallax>
        </div>
      )}

      <div className="relative z-10">
        <Reveal>
          <div
            className={`flex items-center gap-3 ${
              align === 'center' ? 'justify-center' : ''
            }`}
          >
            {number && (
              <span className="font-display text-2xl text-stroke leading-none">
                {number}
              </span>
            )}
            <span className="font-head text-xs font-semibold uppercase tracking-[0.3em] text-battle">
              {kicker}
            </span>
          </div>
        </Reveal>
        <RevealText
          as="h2"
          className="mt-3 font-display text-5xl leading-[0.95] text-chalk lg:text-6xl"
        >
          {title} {accent && <span className="text-battle">{accent}</span>}
        </RevealText>
        <motion.div
          initial={isTouch ? false : { scaleX: 0 }}
          whileInView={isTouch ? undefined : { scaleX: 1 }}
          animate={isTouch ? { scaleX: 1 } : undefined}
          viewport={isTouch ? undefined : VIEWPORT}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className={`mt-5 h-0.5 w-24 origin-left bg-gradient-to-r from-battle to-transparent ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        />
      </div>
    </div>
  )
}
