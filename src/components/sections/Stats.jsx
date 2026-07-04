import { motion } from 'motion/react'
import { useContent } from '../../content/ContentProvider'
import { fadeUp, stagger, reveal } from '../../lib/motion'
import Counter from '../ui/Counter'

export default function Stats() {
  const STATS = useContent().stats
  return (
    <section className="relative border-b border-iron bg-coal py-14">
      {/* thin hazard accent along the top edge */}
      <div className="bg-hazard absolute inset-x-0 top-0 h-1 opacity-60" />
      <motion.div
        variants={stagger}
        {...reveal}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-iron lg:px-8"
      >
        {STATS.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="text-center lg:px-8">
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
