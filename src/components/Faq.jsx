import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, stagger, inView, EASE } from '../lib/anim'
import SectionMark from './SectionMark'

/*
 * FAQ — bewusst hochwertig statt 08/15-Akkordeon: ruhige Typo, dünne Trennlinien,
 * weiches Höhen-Easing beim Auf-/Zuklappen, das „+" dreht sich zum „×".
 * Es ist immer höchstens eine Frage offen (ruhiger Lesefluss).
 *
 * Neue Frage? Einfach unten ins Array. Antworten bleiben bewusst kurz & ehrlich.
 */
const FAQ = [
  {
    q: 'Brauche ich eigene Texte und Bilder?',
    a: 'Nicht zwingend. Wenn du Material hast, super. Wenn nicht, entwickeln wir Inhalte und Bildsprache gemeinsam, du musst nicht mit fertigen Texten kommen. Und für eine ganz neue Designsprache oder ein frisches Branding hole ich auf Wunsch einen Grafikdesigner mit dazu.',
  },
  {
    q: 'Wem gehört am Ende die Domain?',
    a: 'Dir. Die Domain läuft auf dich, du bleibst jederzeit Eigentümer. Ich richte sie ein und kümmere mich auf Wunsch um die Technik dahinter. Abhängig bist du dadurch nicht.',
  },
  {
    q: 'Was kostet eine Website?',
    a: 'Das hängt vom Umfang ab, jedes Projekt ist anders. Im kostenlosen Erstgespräch schauen wir uns deins an, danach bekommst du ein klares, transparentes Angebot. Keine versteckten Kosten.',
  },
  {
    q: 'Wie lange dauert ein Projekt?',
    a: 'Je nach Umfang meist zwei bis vier Wochen. Den genauen Zeitrahmen legen wir gleich zu Beginn gemeinsam fest, damit du planen kannst.',
  },
  {
    q: 'Kann ich die Website später selbst pflegen?',
    a: 'Ja. Auf Wunsch bekommst du einen einfachen Login, über den du Inhalte, Bilder und Termine selbst änderst, ganz ohne Programmierkenntnisse.',
  },
  {
    q: 'Ist die Website DSGVO-konform?',
    a: 'Ja. Deutsche Server, lokal eingebundene Schriften, kein Tracking. Deshalb braucht deine Seite nicht mal ein Cookiebanner.',
  },
  {
    q: 'Was passiert nach dem Launch?',
    a: 'Ich bleibe dein Ansprechpartner. Updates, kleine Änderungen oder Fragen? Ein kurzer Anruf genügt. Du stehst nie allein da.',
  },
]

function PlusIcon({ open }) {
  return (
    <span className="relative ml-6 block h-4 w-4 shrink-0" aria-hidden="true">
      <span className="absolute left-0 top-1/2 h-[1.6px] w-4 -translate-y-1/2 rounded-full bg-current" />
      <span
        className={`absolute left-1/2 top-0 h-4 w-[1.6px] -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ease-[var(--ease-out-expo)] ${
          open ? 'scale-y-0' : 'scale-y-100'
        }`}
      />
    </span>
  )
}

function Item({ q, a, open, onToggle }) {
  return (
    <motion.div variants={fadeUp} className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span
          className={`font-display text-lg font-medium tracking-tight transition-colors duration-300 sm:text-xl ${
            open ? 'text-accent' : 'text-ink group-hover:text-accent'
          }`}
        >
          {q}
        </span>
        <span
          className={`transition-colors duration-300 ${
            open ? 'text-accent' : 'text-ink-dim group-hover:text-accent'
          }`}
        >
          <PlusIcon open={open} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 pr-8 text-[1.02rem] leading-relaxed text-ink-dim">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div
        className="glow"
        style={{
          width: 560,
          height: 560,
          right: '-12%',
          top: '10%',
          background:
            'radial-gradient(circle, rgba(139,61,240,0.14), transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionMark
          word="FAQ"
          wordAccent
          rule={false}
          lines={['Häufige', { text: 'Fragen', accent: true, suffix: '.' }]}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-12 max-w-3xl border-t border-line sm:mt-14"
        >
          {FAQ.map((f, i) => (
            <Item
              key={f.q}
              q={f.q}
              a={f.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
