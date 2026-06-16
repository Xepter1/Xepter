import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from '../components/SectionMark'
import JourneyRoad from '../components/JourneyRoad'
import ContactCTA from '../components/ContactCTA'

const ico = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  width: 28,
  height: 28,
  'aria-hidden': true,
}

function IcoChat() {
  return (
    <svg viewBox="0 0 24 24" {...ico}>
      <path d="M4 5h13a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-2-2V7a2 2 0 0 1 1-2Z" />
      <path d="M8 9h7M8 12h4" />
    </svg>
  )
}
function IcoDesign() {
  return (
    <svg viewBox="0 0 24 24" {...ico}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 9v11" />
    </svg>
  )
}
function IcoCode() {
  return (
    <svg viewBox="0 0 24 24" {...ico}>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
    </svg>
  )
}
function IcoRocket() {
  return (
    <svg viewBox="0 0 24 24" {...ico}>
      <path d="M5 15c-1.5 1-2 5-2 5s4-.5 5-2c.6-.9.5-2.1-.3-2.9-.8-.8-2-1-2.7-.1Z" />
      <path d="M9 13c5-9 11-9 11-9s0 6-9 11" />
      <path d="M9 13l-2-2M11 15l2 2" />
      <circle cx="14.5" cy="9.5" r="1.4" />
    </svg>
  )
}
function IcoSupport() {
  return (
    <svg viewBox="0 0 24 24" {...ico}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
      <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
      <path d="M20 19a4 4 0 0 1-4 3h-2" />
    </svg>
  )
}

const STATIONS = [
  {
    title: 'Kostenloses Erstgespräch',
    body: 'Wir lernen uns kennen, ganz unverbindlich. Du erzählst mir von deiner Idee, ich sage dir ehrlich, was geht. Kostet nichts und verpflichtet zu nichts.',
    icon: <IcoChat />,
  },
  {
    title: 'Konzept und Design',
    body: 'Wir bauen die Struktur und deine Designsprache. Klar, eigenständig, zu dir passend. Auf Wunsch hole ich einen Grafikdesigner mit ins Boot.',
    icon: <IcoDesign />,
  },
  {
    title: 'Umsetzung',
    body: 'Jetzt wird gebaut. Schnell, sauber und bis ins letzte Detail. Du bekommst Zwischenstände zu sehen, nichts entsteht an dir vorbei.',
    icon: <IcoCode />,
  },
  {
    title: 'Go Live',
    body: 'Domain, Technik, Server in Nürnberg, DSGVO-konform. Ich richte alles ein und bringe deine Seite sicher online. Du musst dich um nichts kümmern.',
    icon: <IcoRocket />,
  },
  {
    title: 'Immer für dich da',
    body: 'Nach dem Launch ist nicht Schluss. Ich bleibe dein fester Ansprechpartner, für Updates, Fragen und alles, was später noch kommt.',
    icon: <IcoSupport />,
  },
]

export default function AblaufPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-36 sm:pt-44">
      <div
        className="glow"
        style={{
          width: 640,
          height: 640,
          left: '-12%',
          top: '2%',
          background: 'radial-gradient(circle, rgba(139,61,240,0.18), transparent 60%)',
        }}
      />

      <section className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionMark
          word="Der Weg"
          wordAccent
          rule={false}
          lines={['So arbeiten', { text: 'wir zusammen', accent: true, suffix: '.' }]}
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-9"
        >
          <motion.p variants={fadeUp} className="max-w-md text-lg leading-relaxed text-ink-dim">
            Von der ersten Idee bis weit nach dem Launch. Scroll dich die Straße
            entlang und sieh, wie aus deinem Vorhaben{' '}
            <span className="text-ink">deine Website</span> wird.
          </motion.p>
        </motion.div>
      </section>

      <div className="mt-12 sm:mt-16">
        <JourneyRoad stations={STATIONS} />
      </div>

      <ContactCTA />
    </main>
  )
}
