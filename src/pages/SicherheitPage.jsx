import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from '../components/SectionMark'
import SecurityLock from '../components/SecurityLock'
import ContactCTA from '../components/ContactCTA'
import { IconServer, IconShieldCheck, IconRefresh, IconArrowRight } from '../components/Icons'

const PILLARS = [
  {
    Icon: IconServer,
    title: 'Deutsches Rechenzentrum',
    body: 'Deine Daten liegen auf einem Server in Nürnberg — nicht in den USA. Deutsches Datenschutzrecht, kurze Wege, volle Kontrolle.',
  },
  {
    Icon: IconShieldCheck,
    title: 'DSGVO-konform',
    body: 'Verschlüsselte Verbindung (SSL), lokal eingebundene Schriften, kein Tracking. Deshalb braucht deine Seite nicht mal ein Cookie-Banner.',
  },
  {
    Icon: IconRefresh,
    title: 'Tägliche Backups',
    body: 'Jeden Tag eine automatische Sicherung. Sollte doch mal etwas schiefgehen, ist deine Seite in Minuten wiederhergestellt.',
  },
]

export default function SicherheitPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-36 sm:pt-44">
      <div
        className="glow"
        style={{
          width: 640,
          height: 640,
          right: '-10%',
          top: '2%',
          background: 'radial-gradient(circle, rgba(139,61,240,0.2), transparent 60%)',
        }}
      />

      {/* Intro + Schloss */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <SectionMark
              word="Sicherheit"
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
                Hinter jeder Seite, die ich baue, steckt die gleiche Sorgfalt wie
                davor. Server in Deutschland, verschlüsselte Verbindung, tägliche
                Backups — damit du dich um eines nie kümmern musst:{' '}
                <span className="text-ink">ob alles sicher ist.</span>
              </motion.p>

              <motion.div variants={fadeUp} className="mt-9">
                <Link to="/rundum-sorglos" className="btn btn-spark-outline">
                  Teil von Rundum-sorglos
                  <IconArrowRight width={18} height={18} />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Schloss-Animation */}
          <div className="order-1 lg:order-2">
            <SecurityLock />
          </div>
        </div>
      </section>

      {/* Vertrauens-Säulen */}
      <section className="relative z-10 mx-auto mt-28 max-w-7xl px-5 pb-4 sm:mt-36 sm:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6"
        >
          {PILLARS.map(({ Icon, title, body }) => (
            <motion.div
              key={title}
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
          ))}
        </motion.div>
      </section>

      <ContactCTA />
    </main>
  )
}
