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
 * Kontaktformular = mailto: öffnet das Mailprogramm des Besuchers mit
 * vorausgefüllter Nachricht an mail@xepter.de (kein Backend, kein Drittanbieter).
 * Offen: echte SOCIALS-URLs eintragen (href stehen noch auf '#').
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
    const data = new FormData(e.currentTarget)
    const name = (data.get('name') || '').toString().trim()
    const subject = (data.get('subject') || '').toString().trim()
    const msg = (data.get('msg') || '').toString().trim()
    const body = `Name: ${name}\n\n${msg}`
    const href = `mailto:mail@xepter.de?subject=${encodeURIComponent(
      subject || 'Anfrage über xepter.de'
    )}&body=${encodeURIComponent(body)}`
    window.location.href = href
    setSent(true)
  }

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 pb-24 sm:pt-32">
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
          <span className="eyebrow !text-spark">Kontakt</span>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
            Lass uns einen bleibenden{' '}
            <span className="text-gradient">ersten Eindruck</span> schaffen.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-dim">
            Ob konkretes Projekt oder lose Idee, schreib mir ein paar Zeilen.
            Ich antworte innerhalb von 24 Stunden.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20 sm:mt-12">
          {/* Left — quote, direct line + socials */}
          <motion.div {...fade(0.15)} className="flex flex-col gap-10">
            <div className="hidden lg:block">
              <p className="max-w-sm text-lg font-medium leading-relaxed text-spark">
                „Der erste Eindruck entscheidet." Und er beginnt mit deiner
                ersten Nachricht.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:mail@xepter.de"
                className="group inline-flex items-center gap-3 font-display text-2xl font-medium tracking-tight text-ink transition-colors hover:text-accent sm:text-3xl"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line-2 text-accent transition-colors group-hover:border-accent/50">
                  <IconMail width={20} height={20} />
                </span>
                mail@xepter.de
              </a>
              <a
                href="tel:+4915144227255"
                className="group inline-flex items-center gap-3 font-display text-xl font-medium tracking-tight text-ink transition-colors hover:text-accent sm:text-2xl"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line-2 text-accent transition-colors group-hover:border-accent/50">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width={20}
                    height={20}
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                0151 44227255
              </a>
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
          </motion.div>

          {/* Right — form */}
          <motion.div
            {...fade(0.25)}
            className="rounded-3xl border border-line-2 bg-card/50 p-7 sm:p-10"
          >
            {!sent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <Field id="name" label="Name" type="text" placeholder="Dein Name" autoComplete="name" />
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
                  Öffnet dein E-Mail-Programm mit vorausgefüllter Nachricht
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
                <h3 className="mt-6 font-display text-2xl font-medium">Mailprogramm geöffnet</h3>
                <p className="mt-3 max-w-xs text-ink-dim">
                  Deine Nachricht liegt vorausgefüllt in deinem E-Mail-Programm.
                  Klick dort auf Senden. Falls sich nichts geöffnet hat, schreib
                  direkt an mail@xepter.de.
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
