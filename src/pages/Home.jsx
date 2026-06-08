import Hero from '../components/Hero'
import Projects from '../components/Projects'
import About from '../components/About'
import Services from '../components/Services'
import ContactCTA from '../components/ContactCTA'

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Projects />
      <About />
      <Services />
      <ContactCTA />
    </main>
  )
}
