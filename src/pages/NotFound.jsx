import { FaArrowRightLong } from 'react-icons/fa6'
import { usePageTitle } from '../lib/usePageTitle'
import CTAButton from '../components/ui/CTAButton'

export default function NotFound() {
  usePageTitle('Page Not Found')
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink bg-grid px-5 text-center">
      <span className="pointer-events-none absolute select-none font-display text-[40vw] leading-none text-stroke-chalk opacity-20">
        404
      </span>
      <div className="relative">
        <span className="font-head text-xs font-semibold uppercase tracking-[0.3em] text-battle">
          Off the battleground
        </span>
        <h1 className="mt-4 font-display text-6xl text-chalk sm:text-7xl">
          PAGE NOT <span className="text-battle">FOUND</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-fog">
          This route doesn&apos;t exist — but the work still does. Head back and
          claim your free pass.
        </p>
        <div className="mt-8 flex justify-center">
          <CTAButton to="/">
            Back to Home <FaArrowRightLong />
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
