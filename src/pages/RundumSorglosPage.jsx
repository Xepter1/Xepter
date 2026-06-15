import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from '../components/SectionMark'
import SecurityLock from '../components/SecurityLock'
import ContactCTA from '../components/ContactCTA'
import {
  IconServer,
  IconShieldCheck,
  IconRefresh,
  IconGlobe,
  IconMail,
} from '../components/Icons'

const SICHERHEIT = [
  {
    Icon: IconServer,
    title: 'Deutsches Rechenzentrum',
    body: 'Deine Daten liegen auf einem Server in Nürnberg — nicht in den USA. Deutsches Datenschutzrecht, kurze Wege, volle Kontrolle.',
  },
  {
    Icon: IconShieldCheck,
    title: 'DSGVO-konform',
    body: 'SSL-Verschlüsselung, lokal eingebundene Schriften, kein Tracking. Deshalb braucht deine Seite nicht mal ein Cookie-Banner.',
  },
  {
    Icon: IconRefresh,
    title: 'Tägliche Backups',
    body: 'Jeden Tag eine automatische Sicherung. Falls doch mal etwas schiefgeht, ist deine Seite in Minuten wiederhergestellt.',
  },
]

const TECHNIK = [
  {
    Icon: IconGlobe,
    title: 'Deine Domain',
    body: 'Ich sichere deine Wunsch-Adresse, richte sie ein und verwalte sie. Kein Anbieter-Konto, keine DNS-Einstellungen, um die du dich kümmern musst.',
  },
  {
    Icon: IconMail,
    title: 'Deine eigene E-Mail',
    body: 'Professionelle Adressen auf deiner eigenen Domain — name@deinefirma.de, sauber eingerichtet. Schluss mit @gmail oder @gmx.',
  },
]

function PillarCard({ Icon, title, body }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-line bg-panel p-7 transition-colors duration-500 hover:border-accent/40"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line-2 text-accent">
        <Icon width={24} height={24} />
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">
        {title}
      </h3>
      <p className="mt-3 leading-relaxed text-ink-dim">{body}</p>
    </motion.div>
  )
}

export default function RundumSorglosPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-36 sm:pt-44">
      <div
        className="glow"
        style={{
          width: 640,
          height: 640,
          right: '-10%',
          top: '2%',
          background: 'radial-gradient(circle, rgba(139,61,240,0.18), transparent 60%)',
        }}
      />

      {/* Hero — Sicherheit ganz am Anfang, mit dem Schloss als Herzstück */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Mobil: Text zuerst, Schloss darunter. Desktop: Text links, Schloss rechts. */}
          <div className="order-1 lg:order-1">
            <SectionMark
              word="Rundum-sorglos"
              wordAccent
              lines={[
                'Deine Website —',
                { text: 'verschlossen', accent: true, suffix: '.' },
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
                Domain, E-Mail, Technik, Sicherheit — der ganze Kram, der dich
                eigentlich nur aufhält. Ich kümmere mich darum, du hast{' '}
                <span className="text-ink">einen Ansprechpartner</span> und den
                Kopf frei fürs Wesentliche.
              </motion.p>
            </motion.div>
          </div>

          <div className="order-2 lg:order-2">
            <SecurityLock />
          </div>
        </div>
      </section>

      {/* Sicherheit — die drei Vertrauens-Punkte */}
      <section className="relative z-10 mx-auto mt-28 max-w-7xl px-5 sm:mt-32 sm:px-8">
        <SectionMark
          word="Sicherheit"
          wordAccent
          rule={false}
          lines={['Sicher ist', { text: 'sicher', accent: true, suffix: '.' }]}
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6"
        >
          {SICHERHEIT.map((p) => (
            <PillarCard key={p.title} {...p} />
          ))}
        </motion.div>
      </section>

      {/* Domain & E-Mail */}
      <section className="relative z-10 mx-auto mt-28 max-w-7xl px-5 pb-4 sm:mt-32 sm:px-8">
        <SectionMark
          word="Domain & E-Mail"
          wordAccent
          rule={false}
          lines={['Und der Rest?', { text: 'Läuft', accent: true, suffix: '.' }]}
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6"
        >
          {TECHNIK.map((p) => (
            <PillarCard key={p.title} {...p} />
          ))}
        </motion.div>
      </section>

      <ContactCTA />
    </main>
  )
}
