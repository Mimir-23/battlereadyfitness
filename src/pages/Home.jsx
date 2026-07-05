import { usePageTitle } from '../lib/usePageTitle'
import Hero from '../components/sections/Hero'
import Marquee from '../components/ui/Marquee'
import Stats from '../components/sections/Stats'
import Programs from '../components/sections/Programs'
import WhyUs from '../components/sections/WhyUs'
import Gallery from '../components/sections/Gallery'
import Videos from '../components/sections/Videos'
import Testimonial from '../components/sections/Testimonial'
import CTABand from '../components/sections/CTABand'
import Contact from '../components/sections/Contact'

/** Landing page — all the anchored sections, composed in order. */
export default function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <Programs />
      <WhyUs />
      <Gallery />
      <Videos />
      <Marquee reverse />
      <Testimonial />
      <CTABand />
      <Contact />
    </>
  )
}
