import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from './SectionMark'

// Kleines Browser-/App-Fenster (Ampel-Punkte oben, Inhalt darunter), gemeinsamer
// Rahmen für beide Teaser, damit sie als Paar wirken.
function Win({ glow, children }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line-2 bg-panel transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5 group-hover:border-accent/40 group-hover:shadow-[0_24px_60px_-20px_rgba(139,61,240,0.35)]">
      <div className="glow" style={{ width: 320, height: 320, ...glow }} />
      <div className="relative flex items-center gap-1.5 border-b border-line px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>
      <div className="relative flex h-52 items-center justify-center overflow-hidden p-4 sm:h-60">
        {children}
      </div>
    </div>
  )
}

// Kompaktes CMS-Admin-Mockup (abstrahiert, im Stil des CmsShowcase).
function CmsMini() {
  return (
    <div className="flex h-full w-full max-w-[360px] gap-2.5">
      {/* Sidebar */}
      <div className="hidden w-[30%] flex-col gap-2 rounded-lg border border-line bg-white/[0.02] p-2.5 sm:flex">
        <div className="mb-1 h-1.5 w-2/3 rounded bg-white/20" />
        <div className="h-1.5 w-3/4 rounded bg-white/10" />
        <div className="h-1.5 w-1/2 rounded bg-white/10" />
        <div className="h-1.5 w-2/3 rounded bg-accent/50" />
        <div className="h-1.5 w-3/5 rounded bg-white/10" />
        <div className="h-1.5 w-1/2 rounded bg-white/10" />
      </div>
      {/* Inhalt */}
      <div className="flex flex-1 flex-col gap-2 rounded-lg border border-line bg-white/[0.02] p-2.5">
        <div className="flex items-center justify-between">
          <div className="h-2 w-1/3 rounded bg-white/20" />
          <div className="rounded-full bg-spark/80 px-2 py-1 text-[7px] font-semibold text-base">
            + Erstellen
          </div>
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-md border border-line bg-white/[0.02] px-2 py-1.5"
          >
            <div className="h-1.5 w-1/2 rounded bg-white/12" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
          </div>
        ))}
      </div>
    </div>
  )
}

const CARDS = [
  {
    to: '/aussergewoehnliches',
    eyebrow: 'Motion',
    title: 'Wollen Sie außergewöhnliche Animationen?',
    glow: {
      right: '-12%',
      top: '-25%',
      background: 'radial-gradient(circle, rgba(139,61,240,0.28), transparent 60%)',
    },
    media: (
      <img
        src="/burger/d/0.webp"
        alt="Auseinandergebauter Burger"
        width={1040}
        height={1377}
        loading="lazy"
        className="max-h-full w-auto object-contain transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
      />
    ),
  },
  {
    to: '/selbst-verwalten',
    eyebrow: 'Ihr CMS',
    title: 'Wollen Sie Ihre Website selbst pflegen?',
    glow: {
      left: '-12%',
      bottom: '-25%',
      background: 'radial-gradient(circle, rgba(255,176,77,0.14), transparent 60%)',
    },
    media: <CmsMini />,
  },
]

function Arrow() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-2 text-ink-dim transition-all duration-400 group-hover:border-accent group-hover:text-accent">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 transition-transform duration-400 group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  )
}

export default function HomeTeasers() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionMark
          word="Entdecken"
          lines={['Sehen Sie selbst,', { text: 'was möglich', accent: true, suffix: ' ist.' }]}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-8"
        >
          {CARDS.map((c) => (
            <motion.div key={c.to} variants={fadeUp}>
              <Link to={c.to} className="group block">
                <Win glow={c.glow}>{c.media}</Win>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow !text-spark mb-2">{c.eyebrow}</p>
                    <h3 className="max-w-xs font-display text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl">
                      {c.title}
                    </h3>
                  </div>
                  <Arrow />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
