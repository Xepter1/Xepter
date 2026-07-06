import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from './SectionMark'

// Konkret statt schmalzig: was der Kunde tatsächlich bekommt — ein fester
// Ansprechpartner, der vom Erstgespräch bis nach dem Launch dranbleibt.
const VALUE = [
  {
    title: 'Ein fester Ansprechpartner.',
    body: 'Vom ersten Gespräch bis nach dem Launch redest du immer mit mir, nicht mit einem Support-Team.',
  },
  {
    title: 'Unterstützung, die bleibt.',
    body: 'Fragen, Updates oder kleine Änderungen? Ein kurzer Anruf genügt.',
  },
  {
    title: 'Verlässliche Antwort.',
    body: 'Ich melde mich innerhalb von 24 Stunden zurück.',
  },
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
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-24">
          {/* Left — narrative */}
          <div>
            <SectionMark
              word="Über mich"
              wordAccent
              rule={false}
              lines={['Ingenieurs­denken trifft auf', 'gestalterischen Anspruch.']}
            />

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-9 space-y-6 text-lg leading-relaxed text-ink-dim"
            >
              <p>
                Ich bin <span className="text-ink">Patrick</span>, 27, und
                studiere Wirtschaftsingenieurwesen. Seit ich ein Kind bin,
                programmiere ich leidenschaftlich gerne.
              </p>
              <p>
                In den letzten Jahren habe ich unter anderem als{' '}
                <span className="text-ink">Ausbilder für Informatiker</span> bei
                der <span className="text-ink">DRÄXLMAIER Group</span>{' '}
                gearbeitet und dabei gelernt, dass sauberer Code und klare
                Vermittlung Hand in Hand gehen. Durch meine Erfahrungen aus dem
                Studium verbinde ich Ingenieurwissenschaften mit Informatikskills
                und einem feinen Gespür für Ästhetik, das in jedes Projekt
                fließt, das meinen Namen trägt.
              </p>
              <p className="font-medium text-spark">
                So entstehen Websites, die nicht nur gut aussehen, sondern
                durchdacht funktionieren.
              </p>
            </motion.div>

            {/* Was du bekommst — konkrete Vertrauenspunkte, ruhige Listen-Optik */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-10 border-t border-line pt-8"
            >
              <motion.p variants={fadeUp} className="eyebrow !text-spark mb-6">
                Was du bekommst
              </motion.p>
              <motion.ul variants={fadeUp} className="space-y-4">
                {VALUE.map((v) => (
                  <li key={v.title} className="flex items-start gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-spark shadow-[0_0_8px_var(--color-spark)]"
                    />
                    <span className="leading-relaxed text-ink-dim">
                      <span className="font-medium text-ink">{v.title}</span>{' '}
                      {v.body}
                    </span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </div>

          {/* Right — portrait */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <motion.div
              variants={fadeUp}
              className="group relative mx-auto max-w-[260px] overflow-hidden rounded-3xl border border-line-2 bg-card sm:max-w-[300px] lg:mx-0 lg:max-w-none"
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
                src="/ich.jpg"
                alt="Patrick Fraunhofer, Webentwickler & Webdesigner aus Adlkofen bei Landshut (Xepter)"
                width={884}
                height={1400}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base via-base/15 to-transparent" />
              <div className="absolute bottom-0 left-0 z-10 p-6">
                <p className="font-display text-2xl font-semibold leading-none text-ink">
                  Patrick
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
