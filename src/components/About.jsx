import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/anim'

const STATS = [
  { k: '6.', v: 'Semester', sub: 'Wirtschaftsingenieurwesen' },
  { k: '∞', v: 'Leidenschaft', sub: 'Code seit jungen Jahren' },
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
            'radial-gradient(circle, rgba(44,123,242,0.16), transparent 60%)',
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
                Ich bin{' '}
                <span className="text-ink">Xepter</span> — Student des
                Wirtschaftsingenieurwesens im sechsten Semester. Seit jungen
                Jahren schreibe ich Code: aus Neugier, aus Leidenschaft und aus
                dem Anspruch, Dinge spürbar besser zu machen.
              </p>
              <p>
                Was als Hobby begann, ist zu meiner Handschrift geworden. Ich
                verbinde das analytische, strukturierte Denken eines Ingenieurs
                mit einem feinen Gespür für Ästhetik — und genau diese Mischung
                fließt in jedes Projekt, das meinen Namen trägt.
              </p>
              <p className="text-ink">
                Das Ergebnis: Websites, die nicht nur gut aussehen, sondern
                durchdacht funktionieren.
              </p>
            </div>
          </motion.div>

          {/* Right — stats + monogram */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="flex flex-col gap-5"
          >
            <motion.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-3xl border border-line-2 bg-gradient-to-br from-card to-base p-8"
            >
              <div
                className="glow"
                style={{
                  width: 240,
                  height: 240,
                  right: '-20%',
                  top: '-30%',
                  background:
                    'radial-gradient(circle, rgba(56,201,245,0.25), transparent 65%)',
                }}
              />
              <span className="font-display text-[5rem] font-semibold leading-none text-gradient">
                X
              </span>
              <p className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-ink-faint">
                Webentwicklung & Design
              </p>
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
