import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from '../components/SectionMark'
import SecurityLock from '../components/SecurityLock'
import ServerScene from '../components/ServerScene'
import ContactCTA from '../components/ContactCTA'

const SICHERHEIT = [
  {
    title: 'Deutsches Rechenzentrum',
    body: 'Deine Daten liegen auf einem Server in Nürnberg, nicht in den USA. Deutsches Datenschutzrecht, kurze Wege, volle Kontrolle.',
  },
  {
    title: 'DSGVO-konform',
    body: 'SSL-Verschlüsselung, lokal eingebundene Schriften, kein Tracking. Deshalb braucht deine Seite nicht mal ein Cookie-Banner.',
  },
  {
    title: 'Tägliche Backups',
    body: 'Jeden Tag eine automatische Sicherung. Falls doch mal etwas schiefgeht, ist deine Seite in Minuten wiederhergestellt.',
  },
]

const TECHNIK = [
  {
    title: 'Deine Domain',
    body: 'Ich sichere deine Wunsch-Adresse, richte sie ein und verwalte sie. Kein Anbieter-Konto, keine DNS-Einstellungen, um die du dich kümmern musst.',
  },
  {
    title: 'Deine eigene E-Mail',
    body: 'Professionelle Adressen auf deiner eigenen Domain: name@deinefirma.de, sauber eingerichtet. Schluss mit @gmail oder @gmx.',
  },
]

/* Redaktionelle Zeile statt Kachel: Titel links, Text rechts, dünne Trennlinien
   (über das umschließende divide-y). Nur ein dezenter Akzentpunkt, kein Icon. */
function PillarRow({ title, body }) {
  return (
    <motion.div
      variants={fadeUp}
      className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-[minmax(0,19rem)_1fr] sm:gap-12 sm:py-9"
    >
      <h3 className="flex items-start gap-3 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        <span
          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent sm:mt-3"
          aria-hidden="true"
        />
        {title}
      </h3>
      <p className="leading-relaxed text-ink-dim sm:text-lg">{body}</p>
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
              rule={false}
              lines={[
                'Maximale Sicherheit',
                { text: 'für dich', accent: true, suffix: '.' },
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
                Domain, E-Mail, Technik, Sicherheit. Der ganze Kram, der dich
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

      {/* Dein Server — das Signature-Visual */}
      <section className="relative z-10 mx-auto mt-28 max-w-7xl px-5 sm:mt-36 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Mobil: Text zuerst, Server darunter. Desktop: Server links, Text rechts. */}
          <div className="order-1 lg:order-2">
            <SectionMark
              word="Dein Server"
              wordAccent
              rule={false}
              lines={['Meine Server', 'stehen in', { text: 'Nürnberg', accent: true, suffix: '.' }]}
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
                Deine Website lebt auf einem Server in einem deutschen
                Rechenzentrum, <span className="text-ink">rund um die Uhr</span>{' '}
                überwacht und betreut. Du merkst davon nichts. Genau so soll es
                sein.
              </motion.p>
            </motion.div>
          </div>

          <div className="order-2 lg:order-1">
            <ServerScene />
          </div>
        </div>

        {/* Die drei Sicherheits-Punkte direkt unter dem Server */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-16 divide-y divide-line border-y border-line sm:mt-20"
        >
          {SICHERHEIT.map((p) => (
            <PillarRow key={p.title} {...p} />
          ))}
        </motion.div>
      </section>

      {/* Domain & E-Mail */}
      <section className="relative z-10 mx-auto mt-28 max-w-7xl px-5 pb-4 sm:mt-36 sm:px-8">
        <SectionMark
          word="Inklusive"
          wordAccent
          rule={false}
          lines={['Eigene Domain', { text: 'und E-Mail', accent: true, suffix: '.' }]}
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-12 divide-y divide-line border-y border-line"
        >
          {TECHNIK.map((p) => (
            <PillarRow key={p.title} {...p} />
          ))}
        </motion.div>
      </section>

      <ContactCTA />
    </main>
  )
}
