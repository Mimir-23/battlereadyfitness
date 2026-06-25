/** Five "jump rope" bars that bounce in sequence — small brand loader/accent. */
export default function RopeLoader() {
  return (
    <div className="flex items-end gap-1.5" aria-label="Loading">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="block w-1.5 rounded-full bg-battle"
          style={{
            height: 28,
            animation: 'var(--animate-rope)',
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  )
}
