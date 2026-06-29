import { motion } from 'motion/react'
import { Reveal, VIEWPORT, isTouch } from '../../lib/motion'
import RevealText from '../RevealText'

/** Kicker + oversized display title used at the top of every major section. */
export default function SectionHeading({
  number,
  kicker,
  title,
  accent,
  align = 'center',
}) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
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
  )
}
