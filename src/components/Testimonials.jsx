import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from './SectionMark'
import { IconArrowUpRight } from './Icons'

/*
 * Kundenstimmen — editorial statt 08/15-Karussell: großer Zitat-Auftakt,
 * ruhige Typo, dezente Trennlinie, Attribution mit Avatar-Initialen.
 * Neue Stimme? Einfach unten ins Array eintragen — Layout wächst mit
 * (1 Stimme = zentriert, ab 2 = zweispaltig auf Desktop).
 *
 * avatar (optional): Pfad zu Foto/Logo unter /public. Fehlt es, werden die
 * `initials` als Kreis gezeigt.
 */
const TESTIMONIALS = [
  {
    lead: 'Total happy mit der Website!',
    body: 'Patrick hat mir für mein Unternehmen eine Website erstellt, inklusive Kontaktformular mit direkter Verknüpfung zur E-Mail-Adresse. Meine Domain habe ich auch über ihn erworben, alles einwandfrei verlaufen. Ich bin super zufrieden mit dem Ergebnis und kann ihn jedem empfehlen, der eine hochwertige Website braucht.',
    name: 'Emili Gaßner',
    role: 'Grafikdesignerin · DesignbyEms',
    url: 'https://designbyems.de/',
    initials: 'EG',
  },
]

function Avatar({ src, initials, name }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={48}
        height={48}
        loading="lazy"
        className="h-12 w-12 shrink-0 rounded-full border border-line-2 object-cover"
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line-2 bg-card font-display text-sm font-semibold text-spark"
    >
      {initials}
    </span>
  )
}

function Testimonial({ t }) {
  const Name = t.url ? (
    <a
      href={t.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex items-center gap-1.5 font-medium text-ink transition-colors hover:text-accent"
    >
      {t.name}
      <IconArrowUpRight
        width={14}
        height={14}
        className="text-ink-faint transition-all duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-accent"
      />
    </a>
  ) : (
    <span className="font-medium text-ink">{t.name}</span>
  )

  return (
    <motion.figure variants={fadeUp} className="relative">
      {/* übergroßes Anführungszeichen als ruhiges Ornament */}
      <span
        aria-hidden="true"
        className="pointer-events-none block font-display text-[5rem] leading-[0.7] text-spark/25"
      >
        &ldquo;
      </span>

      <blockquote className="mt-2">
        <p className="font-display text-2xl font-medium leading-snug tracking-tight text-ink sm:text-[1.7rem]">
          {t.lead}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-ink-dim">{t.body}</p>
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-4 border-t border-line pt-6">
        <Avatar src={t.avatar} initials={t.initials} name={t.name} />
        <span className="leading-tight">
          {Name}
          <span className="mt-0.5 block text-sm text-ink-dim">{t.role}</span>
        </span>
      </figcaption>
    </motion.figure>
  )
}

export default function Testimonials() {
  const multi = TESTIMONIALS.length > 1

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div
        className="glow"
        style={{
          width: 560,
          height: 560,
          left: '-10%',
          top: '12%',
          background:
            'radial-gradient(circle, rgba(255,176,77,0.08), transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionMark
          word="Kundenstimmen"
          wordAccent
          rule={false}
          lines={['Das sagen', { text: 'meine Kunden', accent: true, suffix: '.' }]}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className={`mt-14 grid gap-x-14 gap-y-16 sm:mt-16 ${
            multi ? 'lg:grid-cols-2' : 'max-w-3xl'
          }`}
        >
          {TESTIMONIALS.map((t) => (
            <Testimonial key={t.name} t={t} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
