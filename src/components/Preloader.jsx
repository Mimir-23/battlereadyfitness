import { useEffect, useState } from 'react'
import { motion, animate } from 'motion/react'
import logo from '/logo-removebg-preview.png'

const WORDS = ['LOADING THE BATTLEGROUND', 'GEARING UP', 'ARE YOU READY?']

/**
 * Brand intro. Counts a "power meter" 0→100 while cycling battle-cry phrases,
 * then calls onDone so the parent can wipe it away to reveal the hero.
 */
export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0)
  const [word, setWord] = useState(0)

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 2,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setTimeout(onDone, 350),
    })
    const wordTimer = setInterval(
      () => setWord((w) => (w + 1) % WORDS.length),
      650,
    )
    return () => {
      controls.stop()
      clearInterval(wordTimer)
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-ink bg-grid"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
    >
      {/* oversized outlined backdrop word */}
      <span className="pointer-events-none absolute select-none font-display text-[28vw] leading-none text-stroke-chalk opacity-30">
        BR
      </span>

      <motion.img
        src={logo}
        alt="Battle Ready Fitness"
        className="relative h-14 w-auto sm:h-16"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative mt-10 w-64 sm:w-80">
        <div className="mb-2 flex items-end justify-between">
          <span className="font-head text-[10px] uppercase tracking-[0.3em] text-smoke">
            {WORDS[word]}
          </span>
          <span className="font-display text-3xl leading-none text-battle">
            {count}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-iron">
          <div
            className="h-full rounded-full bg-battle transition-[width] duration-100 ease-linear"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>

      {/* bottom hazard accent */}
      <div className="bg-hazard absolute inset-x-0 bottom-0 h-1.5 opacity-70" />
    </motion.div>
  )
}
