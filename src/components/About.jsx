import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/anim'

const STATS = [
  { k: '4', v: 'Jahre Ausbilder', sub: 'Informatiker · DRÄXLMAIER Group' },
  { k: '∞', v: 'Leidenschaft', sub: 'Code seit der Kindheit' },
  { k: '3', v: 'Projekte', sub: 'live & im Einsatz' },
]

export default function About() {
  return (
    <section id="ueber" className="relative overflow-hidden py-28 sm:py-36">
      <div
        className="glow"
        style={{
          width: 520,
          height: 520,
          left: '-10%',
          top: '20%',
          background:
            'radial-gradient(circle, rgba(139,61,240,0.16), transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
          {/* Left — narrative */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <span className="eyebrow">02 — Über mich</span>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              Ingenieurs­denken trifft auf gestalterischen Anspruch.
            </h2>

            <div className="mt-9 space-y-6 text-lg leading-relaxed text-ink-dim">
              <p>
                Ich bin <span className="text-ink">Xepter</span> — Student des
                Wirtschaftsingenieurwesens. Seit ich ein Kind bin, programmiere
                ich leidenschaftlich gerne: aus Neugier, aus Spieltrieb und aus
                dem Anspruch, Dinge spürbar besser zu machen.
              </p>
              <p>
                Die letzten vier Jahre habe ich als{' '}
                <span className="text-ink">Ausbilder für Informatiker</span> bei
                der <span className="text-ink">DRÄXLMAIER Group</span>{' '}
                gearbeitet — und dabei gelernt, dass sauberer Code und klare
                Vermittlung Hand in Hand gehen. Ingenieurs­denken, technische
                Tiefe und ein feines Gespür für Ästhetik fließen heute in jedes
                Projekt, das meinen Namen trägt.
              </p>
              <p className="text-ink">
                Das Ergebnis: Websites, die nicht nur gut aussehen, sondern
                durchdacht funktionieren.
              </p>
            </div>
          </motion.div>

          {/* Right — portrait + stats */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="flex flex-col gap-5"
          >
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl border border-line-2 bg-card"
            >
              <div
                className="glow z-10"
                style={{
                  width: 240,
                  height: 240,
                  right: '-20%',
                  top: '-30%',
                  background:
                    'radial-gradient(circle, rgba(191,90,242,0.25), transparent 65%)',
                }}
              />
              <img
                src="/xepter-portrait.jpg"
                alt="Xepter — Freelance Webentwickler"
                width={675}
                height={900}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base via-base/15 to-transparent" />
              <div className="absolute bottom-0 left-0 z-10 p-6">
                <p className="font-display text-2xl font-semibold leading-none text-ink">
                  Xepter
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                  Webentwicklung &amp; Design
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-3">
              {STATS.map((s) => (
                <motion.div
                  key={s.v}
                  variants={fadeUp}
                  className="rounded-2xl border border-line bg-white/[0.02] p-5 transition-colors duration-500 hover:border-accent/40"
                >
                  <div className="font-display text-3xl font-semibold text-ink">
                    {s.k}
                  </div>
                  <div className="mt-1 text-sm font-medium text-ink">{s.v}</div>
                  <div className="mt-1 text-xs leading-snug text-ink-faint">
                    {s.sub}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
