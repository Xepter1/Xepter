import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from './SectionMark'

// Kleines Browser-/App-Fenster (Ampel-Punkte oben, Inhalt darunter), gemeinsamer
// Rahmen für beide Teaser, damit sie als Paar wirken.
function Win({ glow, children }) {
  const ref = useRef(null)
  // macOS-Ampel: Desktop leuchtet beim Hover. Touch-Geräte (kein Hover) lassen die
  // Punkte aufleuchten, sobald die Kachel beim Scrollen die Bildschirmmitte erreicht.
  const [lit, setLit] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(hover: hover)').matches) return undefined
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setLit(e.isIntersecting), {
      rootMargin: '-35% 0px -35% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-xl border border-line-2 bg-panel transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5 group-hover:border-accent/40 group-hover:shadow-[0_24px_60px_-20px_rgba(139,61,240,0.35)]"
    >
      <div className="glow" style={{ width: 320, height: 320, ...glow }} />
      <div className="relative flex items-center gap-1.5 border-b border-line px-3.5 py-2.5">
        {/* grau im Ruhezustand; leuchten links→rechts versetzt auf — per Hover (Desktop)
            oder beim Reinscrollen in die Mitte (Handy, via `lit`). */}
        <span
          className={`h-2.5 w-2.5 rounded-full transition-all duration-300 group-hover:bg-[#ff5f57] group-hover:shadow-[0_0_8px_#ff5f5799] ${
            lit ? 'bg-[#ff5f57] shadow-[0_0_8px_#ff5f5799]' : 'bg-white/15'
          }`}
        />
        <span
          className={`h-2.5 w-2.5 rounded-full transition-all delay-[70ms] duration-300 group-hover:bg-[#febc2e] group-hover:shadow-[0_0_8px_#febc2e99] ${
            lit ? 'bg-[#febc2e] shadow-[0_0_8px_#febc2e99]' : 'bg-white/15'
          }`}
        />
        <span
          className={`h-2.5 w-2.5 rounded-full transition-all delay-[140ms] duration-300 group-hover:bg-[#28c840] group-hover:shadow-[0_0_8px_#28c84099] ${
            lit ? 'bg-[#28c840] shadow-[0_0_8px_#28c84099]' : 'bg-white/15'
          }`}
        />
      </div>
      <div className="relative flex h-52 items-center justify-center overflow-hidden p-4 sm:h-60">
        {children}
      </div>
    </div>
  )
}

// Statisches Mini-Schloss (geschlossen) — Vorschau auf die Rundum-sorglos-Szene.
// Gleicher Look wie SecurityLock (dunkle Kachel + echtes Logo), nur ohne Animation.
function LockMini() {
  return (
    <svg
      viewBox="0 34 240 288"
      role="img"
      aria-label="Schloss mit Xepter-Logo"
      className="h-[94%] w-auto"
    >
      <defs>
        <linearGradient id="lmBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1426" />
          <stop offset="1" stopColor="#0a0810" />
        </linearGradient>
        <linearGradient id="lmShackle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#caa6f7" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <filter id="lmShadow" x="-40%" y="-30%" width="180%" height="180%">
          <feDropShadow dx="0" dy="14" stdDeviation="13" floodColor="#000000" floodOpacity="0.55" />
        </filter>
      </defs>
      <path
        d="M97,150 L97,104 A27,27 0 0 1 151,104 L151,150"
        fill="none"
        stroke="url(#lmShackle)"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <g filter="url(#lmShadow)">
        <rect x="52" y="138" width="144" height="140" rx="26" fill="url(#lmBody)" stroke="#7c3aed" strokeOpacity="0.5" strokeWidth="1.5" />
      </g>
      <g transform="translate(124,208) scale(0.74) translate(-56.86,-64.42)">
        <path d="M38.39,70.69h26.77l6.68,5.08-36.56,53.07H0s38.39-58.15,38.39-58.15Z" fill="#e0abff" />
        <path d="M38.25,4.76l18.61,29.78L78.44,0h35.28l-38.39,58.15h-36.94L0,0h29.66c3.49,0,6.74,1.8,8.59,4.76Z" fill="#e0abff" />
        <polygon points="65.16 70.69 79.68 128.83 93.08 113.12 112.8 107.04 65.16 70.69" fill="#7a2bd6" />
        <polygon points="79.73 51.49 36.79 55.73 38.39 58.15 75.33 58.15 79.73 51.49" fill="#7a2bd6" />
      </g>
    </svg>
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
    title: 'Du willst aufwendige Animationen?',
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
    eyebrow: 'Dein CMS',
    title: 'Du willst deine Website selbst pflegen?',
    glow: {
      left: '-12%',
      bottom: '-25%',
      background: 'radial-gradient(circle, rgba(255,176,77,0.14), transparent 60%)',
    },
    media: <CmsMini />,
  },
  {
    to: '/rundum-sorglos',
    eyebrow: 'Rundum-sorglos',
    title: 'Du willst dich um nichts kümmern?',
    glow: {
      right: '-12%',
      bottom: '-25%',
      background: 'radial-gradient(circle, rgba(139,61,240,0.26), transparent 60%)',
    },
    media: <LockMini />,
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
          rule={false}
          lines={['Sieh selbst,', { text: 'was möglich', accent: true, suffix: ' ist.' }]}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
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
