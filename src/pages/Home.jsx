import Hero from '../components/Hero'
import Projects from '../components/Projects'
import ContactCTA from '../components/ContactCTA'

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Projects />
      <ContactCTA />
    </main>
  )
}
