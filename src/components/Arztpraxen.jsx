import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from './SectionMark'
import BookingShowcase from './BookingShowcase'

const FEATURES = [
  'Rund um die Uhr buchbar',
  'Termin mit einem Klick in Apple- oder Google-Kalender',
  'Bestätigung und Erinnerung per E-Mail',
  'Ohne Gesundheitsdaten — DSGVO-freundlich gedacht',
]

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export default function Arztpraxen() {
  return (
    <section
      id="arztpraxen"
      className="relative overflow-hidden pt-36 pb-28 sm:pt-44 sm:pb-36"
    >
      <div
        className="glow"
        style={{
          width: 620,
          height: 620,
          right: '-12%',
          top: '8%',
          background:
            'radial-gradient(circle, rgba(139,61,240,0.16), transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
          {/* Left — copy */}
          <div className="order-2 lg:order-1">
            <SectionMark
              as="h1"
              word="Für Arztpraxen"
              wordAccent
              rule={false}
              lines={[
                'Termine buchen',
                { text: 'sich von selbst', accent: true, suffix: '.' },
              ]}
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-9"
            >
              <motion.p
                variants={fadeUp}
                className="max-w-md text-lg leading-relaxed text-ink-dim"
              >
                Das Telefon klingelt, während im Behandlungszimmer jemand wartet.
                Mit einem eigenen{' '}
                <span className="text-ink">Terminbuchungstool</span> suchen sich
                Patienten selbst eine freie Zeit — und Deine Praxis legt fest,
                welche Zeiten das sind.
              </motion.p>

              <motion.ul
                variants={fadeUp}
                className="mt-8 grid gap-x-8 gap-y-3.5 sm:grid-cols-2"
              >
                {FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-[0.98rem] text-ink"
                  >
                    <Check />
                    {f}
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </div>

          {/* Right — iMac mit dem Buchungstool */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <BookingShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
