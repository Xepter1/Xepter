import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from '../components/SectionMark'
import SecurityLock from '../components/SecurityLock'
import ServerScene from '../components/ServerScene'
import InfraScene from '../components/InfraScene'
import ContactCTA from '../components/ContactCTA'

/* ── Eigene Mini-Grafiken pro Karte (kein Standard-Icon) ───────────────── */

function MotifRechenzentrum() {
  return (
    <svg width="92" height="76" viewBox="0 0 92 76" aria-hidden="true">
      <defs>
        <linearGradient id="mdc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#221d30" />
          <stop offset="1" stopColor="#100d18" />
        </linearGradient>
      </defs>
      <rect x="10" y="6" width="56" height="64" rx="9" fill="url(#mdc)" stroke="#7c3aed" strokeOpacity="0.4" />
      {[15, 32, 49].map((y, i) => (
        <g key={y}>
          <rect x="18" y={y} width="40" height="11" rx="3" fill="#161320" />
          <rect x="22" y={y + 3.5} width="4" height="4" rx="1" fill="#3a3350" />
          <circle cx="52" cy={y + 5.5} r="2.4" fill={i === 2 ? '#ffb04d' : '#34d17b'} />
        </g>
      ))}
      <rect x="58" y="48" width="26" height="18" rx="5" fill="#15111d" stroke="#7c3aed" strokeOpacity="0.5" />
      <text x="71" y="60.5" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="700" fontSize="11" fill="#e0abff">DE</text>
    </svg>
  )
}

function MotifDsgvo() {
  return (
    <svg width="92" height="76" viewBox="0 0 92 76" aria-hidden="true">
      <defs>
        <linearGradient id="msh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a5cf0" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <path d="M46 6 L70 16 V36 C70 52 60 64 46 70 C32 64 22 52 22 36 V16 Z" fill="url(#msh)" opacity="0.16" stroke="#9a5cf0" strokeOpacity="0.55" strokeWidth="1.5" />
      <path d="M37 38 L43 45 L56 30" fill="none" stroke="#e0abff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MotifBackups() {
  return (
    <svg width="92" height="76" viewBox="0 0 92 76" aria-hidden="true">
      <defs>
        <linearGradient id="mdisk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2440" />
          <stop offset="1" stopColor="#15111f" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="52" rx="22" ry="7" fill="#15111f" />
      <path d="M18 38 V52 A22 7 0 0 0 62 52 V38 Z" fill="url(#mdisk)" />
      <ellipse cx="40" cy="38" rx="22" ry="7" fill="#352d50" stroke="#7c3aed" strokeOpacity="0.4" />
      <path d="M18 26 V38 A22 7 0 0 0 62 38 V26 Z" fill="url(#mdisk)" />
      <ellipse cx="40" cy="26" rx="22" ry="7" fill="#352d50" stroke="#7c3aed" strokeOpacity="0.4" />
      <circle cx="40" cy="26" r="2.6" fill="#34d17b" />
      <path d="M62 20 A26 14 0 1 1 60 16" fill="none" stroke="#e0abff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M60 9 L62 17 L54 17.5 Z" fill="#e0abff" />
    </svg>
  )
}

function MotifDomain() {
  return (
    <svg width="116" height="76" viewBox="0 0 116 76" aria-hidden="true">
      <rect x="6" y="24" width="104" height="28" rx="14" fill="#15111d" stroke="#7c3aed" strokeOpacity="0.45" />
      <path d="M22 38 a4 4 0 0 1 8 0" fill="none" stroke="#34d17b" strokeWidth="2" />
      <rect x="21" y="37.5" width="10" height="7" rx="1.6" fill="#34d17b" />
      <text x="40" y="42.5" fontFamily="ui-monospace, monospace" fontSize="12.5" fill="#e0abff">deinefirma.de</text>
    </svg>
  )
}

function MotifEmail() {
  return (
    <svg width="92" height="76" viewBox="0 0 92 76" aria-hidden="true">
      <rect x="14" y="14" width="64" height="44" rx="8" fill="#15111d" stroke="#7c3aed" strokeOpacity="0.45" />
      <path d="M18 20 L46 40 L74 20" fill="none" stroke="#9a5cf0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="46" cy="50" r="9" fill="#0c0a12" stroke="#e0abff" strokeOpacity="0.7" />
      <text x="46" y="54" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" fill="#e0abff">@</text>
    </svg>
  )
}

const SICHERHEIT = [
  {
    Motif: MotifRechenzentrum,
    title: 'Deutsches Rechenzentrum',
    body: 'Deine Daten liegen auf einem Server in Nürnberg — nicht in den USA. Deutsches Datenschutzrecht, kurze Wege, volle Kontrolle.',
  },
  {
    Motif: MotifDsgvo,
    title: 'DSGVO-konform',
    body: 'SSL-Verschlüsselung, lokal eingebundene Schriften, kein Tracking. Deshalb braucht deine Seite nicht mal ein Cookie-Banner.',
  },
  {
    Motif: MotifBackups,
    title: 'Tägliche Backups',
    body: 'Jeden Tag eine automatische Sicherung. Falls doch mal etwas schiefgeht, ist deine Seite in Minuten wiederhergestellt.',
  },
]

const TECHNIK = [
  {
    Motif: MotifDomain,
    title: 'Deine Domain',
    body: 'Ich sichere deine Wunsch-Adresse, richte sie ein und verwalte sie. Kein Anbieter-Konto, keine DNS-Einstellungen, um die du dich kümmern musst.',
  },
  {
    Motif: MotifEmail,
    title: 'Deine eigene E-Mail',
    body: 'Professionelle Adressen auf deiner eigenen Domain — name@deinefirma.de, sauber eingerichtet. Schluss mit @gmail oder @gmx.',
  },
]

function PillarCard({ Motif, title, body }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-line bg-panel p-7 transition-colors duration-500 hover:border-accent/40"
    >
      <div className="flex h-[76px] items-end">
        <Motif />
      </div>
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

      {/* Dein Server — die Infrastruktur-Bühne */}
      <section className="relative z-10 mx-auto mt-28 max-w-7xl px-5 sm:mt-36 sm:px-8">
        <SectionMark
          word="Dein Server"
          wordAccent
          rule={false}
          lines={['Steht in Nürnberg.', { text: 'Läuft', accent: true, suffix: '.' }]}
        />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-9 max-w-xl text-lg leading-relaxed text-ink-dim"
        >
          Deine Website lebt auf einem Server in einem deutschen Rechenzentrum —{' '}
          <span className="text-ink">rund um die Uhr</span> überwacht und betreut.
          Anfragen rein, Antworten raus, alles im grünen Bereich. Du merkst davon
          nichts. Genau so soll es sein.
        </motion.p>

        {/* Desktop: volle Infrastruktur-Bühne · Mobil: kompakter Server */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-14"
        >
          <div className="hidden lg:block">
            <InfraScene />
          </div>
          <div className="lg:hidden">
            <ServerScene />
          </div>
        </motion.div>
      </section>

      {/* Sicherheit — Vertrauens-Punkte mit eigenen Mini-Grafiken */}
      <section className="relative z-10 mx-auto mt-28 max-w-7xl px-5 sm:mt-36 sm:px-8">
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
      <section className="relative z-10 mx-auto mt-28 max-w-7xl px-5 pb-4 sm:mt-36 sm:px-8">
        <SectionMark
          word="Domain & E-Mail"
          wordAccent
          rule={false}
          lines={['Und der Rest?', { text: 'Mach ich', accent: true, suffix: '.' }]}
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
