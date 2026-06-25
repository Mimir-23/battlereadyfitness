/**
 * Drifting ember particles for the "intensity / fire" motif. Pure CSS animation,
 * GPU-friendly (transform/opacity only). Positions are randomised once at module
 * load (outside render, so components stay pure). Auto-hides under reduced motion.
 */

// Pre-generated pool — sliced per instance. Built once when the module loads.
const POOL = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 1.5 + Math.random() * 2.5,
  delay: Math.random() * 7,
  duration: 5 + Math.random() * 5,
  bottom: Math.random() * 30,
}))

export default function EmberField({ count = 18 }) {
  const embers = POOL.slice(0, count)

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
      aria-hidden="true"
    >
      {embers.map((e) => (
        <span
          key={e.id}
          className="absolute rounded-full bg-battle"
          style={{
            left: `${e.left}%`,
            bottom: `${e.bottom}%`,
            width: e.size,
            height: e.size,
            filter: 'blur(0.5px)',
            boxShadow: '0 0 6px rgba(255,210,0,0.8)',
            animation: `ember ${e.duration}s linear ${e.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
