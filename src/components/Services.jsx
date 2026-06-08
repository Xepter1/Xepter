import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/anim'
import { IconLayout, IconCode, IconSpark, IconGauge } from './Icons'

const SERVICES = [
  {
    icon: IconLayout,
    title: 'Webdesign',
    desc: 'Klare, zeitlose Interfaces, die deine Marke auf den Punkt bringen — durchdacht bis ins letzte Pixel.',
  },
  {
    icon: IconCode,
    title: 'Webentwicklung',
    desc: 'Schnelle, robuste Websites — sauber gebaut, von Grund auf und ohne Baukasten-Kompromisse.',
  },
  {
    icon: IconSpark,
    title: 'Markenauftritt',
    desc: 'Vom ersten Eindruck bis zum letzten Detail: ein stimmiges, wiedererkennbares Gesamtbild.',
  },
  {
    icon: IconGauge,
    title: 'Performance & SEO',
    desc: 'Sichtbar, schnell und messbar besser. Technik, die im Hintergrund arbeitet und vorne Wirkung zeigt.',
  },
]

export default function Services() {
  return (
    <section id="leistungen" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mb-16 max-w-2xl"
        >
          <span className="eyebrow">03 — Leistungen</span>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Was ich für dich baue.
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-3xl border border-line bg-card/40 p-9 transition-all duration-500 hover:border-accent/40 hover:bg-card"
              >
                <div
                  className="glow opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    width: 260,
                    height: 260,
                    right: '-15%',
                    top: '-25%',
                    background:
                      'radial-gradient(circle, rgba(191,90,242,0.18), transparent 65%)',
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line-2 bg-white/[0.02] text-accent transition-colors duration-500 group-hover:border-accent/50">
                      <Icon width={22} height={22} />
                    </span>
                    <span className="font-mono text-sm text-ink-faint">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="mt-7 font-display text-2xl font-medium tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-sm leading-relaxed text-ink-dim">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
