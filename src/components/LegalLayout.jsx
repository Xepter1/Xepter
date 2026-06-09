import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { EASE } from '../lib/anim'
import { IconArrowUp } from './Icons'

/**
 * Shared chrome for the Impressum / Datenschutz pages.
 * Calm, readable long-form layout that matches the site aesthetic.
 */
export default function LegalLayout({ eyebrow, title, intro, children }) {
  return (
    <main className="relative min-h-screen overflow-hidden pt-36 pb-28 sm:pt-44">
      <div className="grid-bg absolute inset-0 z-0" />
      <div
        className="glow"
        style={{
          width: 620,
          height: 620,
          right: '-12%',
          top: '-8%',
          background:
            'radial-gradient(circle, rgba(138,63,240,0.16), transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1] tracking-[-0.03em]">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim">
              {intro}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="legal-prose mt-12"
        >
          {children}
        </motion.div>

        <div className="mt-16 hairline" />
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-accent"
          >
            <IconArrowUp width={16} height={16} className="-rotate-90" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </main>
  )
}
