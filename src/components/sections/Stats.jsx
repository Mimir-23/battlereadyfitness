import { motion } from 'motion/react'
import { STATS } from '../../data/site'
import { fadeUp, stagger, VIEWPORT } from '../../lib/motion'
import Counter from '../ui/Counter'

export default function Stats() {
  return (
    <section className="border-b border-iron bg-coal py-14">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 lg:grid-cols-4 lg:px-8"
      >
        {STATS.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="text-center">
            <div className="font-display text-5xl text-battle lg:text-6xl">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 font-head text-xs font-medium uppercase tracking-[0.2em] text-smoke">
              {s.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
