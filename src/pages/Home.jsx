import { useEffect } from 'react'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import Testimonials from '../components/Testimonials'
import HomeTeasers from '../components/HomeTeasers'
import ContactCTA from '../components/ContactCTA'

export default function Home() {
  // Den /leistungen-Hero (Burger) im Leerlauf vorwärmen, solange der Besucher auf der
  // Startseite ist. Beim Wechsel auf /leistungen liegen die Frames dann schon im Cache,
  // der Scrub startet sofort. Bewusst sparsam: nur jeder 3. Frame (~1/3 der Bytes, reicht
  // für einen sofort nutzbaren Scrub) und nur die zur Viewport-Größe passende Auflösung.
  useEffect(() => {
    const ric = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 1500))
    const cic = window.cancelIdleCallback || window.clearTimeout
    const folder = window.matchMedia('(max-width: 1023px)').matches ? 'm' : 'd'
    const handle = ric(() => {
      for (let i = 0; i < 97; i += 3) {
        const img = new Image()
        img.fetchPriority = 'low'
        img.src = `/burger/${folder}/${i}.webp`
      }
    })
    return () => cic(handle)
  }, [])

  return (
    <main className="relative">
      <Hero />
      <Projects />
      <HomeTeasers />
      <Testimonials />
      <ContactCTA />
    </main>
  )
}
