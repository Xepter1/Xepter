import Hero from '../components/Hero'
import Projects from '../components/Projects'
import About from '../components/About'
import ContactCTA from '../components/ContactCTA'

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Projects />
      <About />
      <ContactCTA />
    </main>
  )
}
