import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from '../components/SectionMark'
import ContactCTA from '../components/ContactCTA'
import { IconGlobe, IconMail, IconLock, IconArrowRight } from '../components/Icons'

const PILLARS = [
  {
    Icon: IconGlobe,
    title: 'Deine Domain',
    body: 'Ich sichere deine Wunsch-Adresse, richte sie ein und verwalte sie. Du musst dich mit keinem Anbieter-Konto und keinen DNS-Einstellungen herumschlagen.',
  },
  {
    Icon: IconMail,
    title: 'Deine eigene E-Mail',
    body: 'Schluss mit @gmail oder @gmx. Du bekommst professionelle Adressen auf deiner eigenen Domain — name@deinefirma.de, sauber eingerichtet und einsatzbereit.',
  },
  {
    Icon: IconLock,
    title: 'Sicherheit inklusive',
    body: 'Server in Deutschland, DSGVO-konform, tägliche Backups. Das volle Programm — und du musst dich um nichts davon kümmern.',
    to: '/sicherheit',
    linkLabel: 'Wie ich das mache',
  },
]

export default function RundumSorglosPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-36 pb-4 sm:pt-44">
      <div
        className="glow"
        style={{
          width: 620,
          height: 620,
          left: '-10%',
          top: '4%',
          background: 'radial-gradient(circle, rgba(255,176,77,0.1), transparent 60%)',
        }}
      />
      <div
        className="glow"
        style={{
          width: 560,
          height: 560,
          right: '-10%',
          top: '10%',
          background: 'radial-gradient(circle, rgba(139,61,240,0.16), transparent 60%)',
        }}
      />

      <section className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionMark
          word="Rundum-sorglos"
          wordAccent
          lines={[
            'Du machst dein Ding.',
            { text: 'Den Rest', accent: true, suffix: ' mach ich.' },
          ]}
        />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-9 max-w-xl text-lg leading-relaxed text-ink-dim"
        >
          Domain, E-Mail, Technik, Sicherheit — der ganze Kram, der dich
          eigentlich nur aufhält. Ich kümmere mich darum, du hast{' '}
          <span className="text-ink">einen Ansprechpartner</span> und den Kopf
          frei fürs Wesentliche.
        </motion.p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6"
        >
          {PILLARS.map(({ Icon, title, body, to, linkLabel }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border border-line bg-panel p-7 transition-colors duration-500 hover:border-accent/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line-2 text-accent">
                <Icon width={24} height={24} />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">
                {title}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-dim">{body}</p>
              {to && (
                <Link
                  to={to}
                  className="group mt-5 inline-flex items-center gap-2 text-[0.95rem] font-medium text-spark"
                >
                  {linkLabel}
                  <IconArrowRight
                    width={17}
                    height={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      <ContactCTA />
    </main>
  )
}
