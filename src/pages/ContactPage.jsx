import { useState } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../lib/anim'
import {
  IconArrowUpRight,
  IconGithub,
  IconLinkedin,
  IconInstagram,
  IconMail,
} from '../components/Icons'

/*
 * TODO (Xepter): Kontaktdaten + Formular-Endpunkt nachtragen.
 * - SOCIALS: echte URLs eintragen (href).
 * - EMAIL: echte Adresse eintragen.
 * - Formular: an einen Endpunkt hängen (Formspree, Resend, eigene API-Route)
 *   und handleSubmit ersetzen.
 */
const SOCIALS = [
  { icon: IconGithub, label: 'GitHub', href: '#' },
  { icon: IconLinkedin, label: 'LinkedIn', href: '#' },
  { icon: IconInstagram, label: 'Instagram', href: '#' },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
})

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Platzhalter — noch kein Endpunkt verbunden.
    setSent(true)
  }

  return (
    <main className="relative min-h-screen overflow-hidden pt-36 pb-28 sm:pt-44">
      <div className="grid-bg absolute inset-0 z-0" />
      <div
        className="glow"
        style={{
          width: 720,
          height: 720,
          right: '-10%',
          top: '-6%',
          background:
            'radial-gradient(circle, rgba(139,61,240,0.22), transparent 60%)',
        }}
      />
      <div
        className="glow"
        style={{
          width: 480,
          height: 480,
          left: '-8%',
          bottom: '0%',
          background:
            'radial-gradient(circle, rgba(191,90,242,0.14), transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <motion.div {...fade(0.05)} className="max-w-3xl">
          <span className="eyebrow">Kontakt</span>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
            Lass uns einen bleibenden{' '}
            <span className="text-gradient">ersten Eindruck</span> schaffen.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-dim">
            Ob konkretes Projekt oder lose Idee — schreib mir ein paar Zeilen.
            Ich antworte in der Regel innerhalb von 24 Stunden.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
          {/* Left — direct + socials */}
          <motion.div {...fade(0.15)} className="flex flex-col gap-10">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                Direkter Draht
              </h2>
              <a
                href="mailto:hallo@xepter.de"
                className="group mt-4 inline-flex items-center gap-3 font-display text-2xl font-medium tracking-tight text-ink transition-colors hover:text-accent sm:text-3xl"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line-2 text-accent transition-colors group-hover:border-accent/50">
                  <IconMail width={20} height={20} />
                </span>
                hallo@xepter.de
              </a>
              <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint">
                ✶ Platzhalter — echte Adresse folgt
              </p>
            </div>

            <div>
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                Social
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {SOCIALS.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-line-2 text-ink-dim transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent"
                    >
                      <Icon width={20} height={20} />
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="mt-auto hidden lg:block">
              <p className="max-w-xs text-sm leading-relaxed text-ink-faint">
                „Der erste Eindruck entscheidet." — und beginnt oft mit einer
                ersten Nachricht.
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            {...fade(0.25)}
            className="rounded-3xl border border-line-2 bg-card/50 p-7 sm:p-10"
          >
            {!sent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id="name" label="Name" type="text" placeholder="Dein Name" autoComplete="name" />
                  <Field id="email" label="E-Mail" type="email" placeholder="du@beispiel.de" autoComplete="email" />
                </div>
                <Field id="subject" label="Betreff" type="text" placeholder="Worum geht es?" />
                <div className="flex flex-col gap-2">
                  <label htmlFor="msg" className="text-sm font-medium text-ink-dim">
                    Nachricht
                  </label>
                  <textarea
                    id="msg"
                    name="msg"
                    rows={5}
                    required
                    placeholder="Erzähl mir von deinem Projekt …"
                    className="resize-none rounded-xl border border-line-2 bg-base/60 px-4 py-3 text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:outline-none"
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-1 w-full justify-center">
                  Nachricht senden
                  <IconArrowUpRight width={18} height={18} />
                </button>
                <p className="text-center font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint">
                  ✶ Formular wird in Kürze scharf geschaltet
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex min-h-[380px] flex-col items-center justify-center text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-accent-soft text-accent">
                  <IconMail width={26} height={26} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-medium">Fast geschafft!</h3>
                <p className="mt-3 max-w-xs text-ink-dim">
                  Der Versand wird bald aktiviert. Bis dahin: Danke fürs
                  Vorbeischauen — wir hören uns!
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn btn-ghost mt-7 h-11 px-5 text-sm"
                >
                  Zurück
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}

function Field({ id, label, type, placeholder, autoComplete }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink-dim">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="rounded-xl border border-line-2 bg-base/60 px-4 py-3 text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:outline-none"
      />
    </div>
  )
}
