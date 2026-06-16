import { useState } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../lib/anim'
import {
  IconArrowUpRight,
  IconFacebook,
  IconLinkedin,
  IconInstagram,
  IconMail,
} from '../components/Icons'

/*
 * Kontaktformular → POST an den selbst gehosteten Dienst (form.xepter.de), der
 * die Anfrage per SMTP an mail@xepter.de mailt. Kein Drittanbieter, keine
 * mailto-Abhängigkeit. Endpunkt via VITE_CONTACT_ENDPOINT überschreibbar.
 */
const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT || 'https://form.xepter.de/api/kontakt'

const SOCIALS = [
  { icon: IconFacebook, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590947094348' },
  { icon: IconInstagram, label: 'Instagram', href: 'https://www.instagram.com/xepter.de' },
  { icon: IconLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/129663999' },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
})

export default function ContactPage() {
  // idle | sending | sent | error
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const payload = {
      name: (data.get('name') || '').toString().trim(),
      email: (data.get('email') || '').toString().trim(),
      phone: (data.get('phone') || '').toString().trim(),
      subject: (data.get('subject') || '').toString().trim(),
      message: (data.get('msg') || '').toString().trim(),
      firma: (data.get('firma') || '').toString(), // Honeypot (Bots füllen es)
    }
    setStatus('sending')
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden pt-24 pb-24 sm:pt-28">
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
          <h1 className="mt-5 font-display text-[clamp(2.3rem,5.5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
            Lass uns einen bleibenden{' '}
            <span className="text-gradient">ersten Eindruck</span> schaffen.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim">
            Ob konkretes Projekt oder lose Idee, schreib mir ein paar Zeilen.
            Ich antworte innerhalb von 24 Stunden.
          </p>
          <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-spark/40 bg-spark-soft px-4 py-2 text-sm font-medium text-ink">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-spark shadow-[0_0_8px_var(--color-spark)]"
            />
            Das Erstgespräch ist kostenlos &amp; unverbindlich
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20 sm:mt-10">
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
                      target="_blank"
                      rel="noopener noreferrer"
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
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex min-h-[380px] flex-col items-center justify-center text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-accent-soft text-accent">
                  <IconMail width={26} height={26} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-medium">Nachricht gesendet</h3>
                <p className="mt-3 max-w-xs text-ink-dim">
                  Danke! Deine Anfrage ist bei mir angekommen. Ich melde mich
                  innerhalb von 24 Stunden.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn btn-ghost mt-7 h-11 px-5 text-sm"
                >
                  Noch eine Nachricht
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <Field id="name" label="Name" type="text" placeholder="Dein Name" autoComplete="name" />
                <Field
                  id="email"
                  label="E-Mail"
                  type="email"
                  placeholder="name@beispiel.de"
                  autoComplete="email"
                />
                <Field
                  id="phone"
                  label="Telefon"
                  type="tel"
                  placeholder="Für einen schnellen Rückruf"
                  autoComplete="tel"
                  required={false}
                />
                <Field
                  id="subject"
                  label="Betreff"
                  type="text"
                  placeholder="Worum geht es?"
                  required={false}
                />
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

                {/* Honeypot: für Menschen unsichtbar, Bots füllen es aus */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
                >
                  <label>
                    Firma
                    <input type="text" name="firma" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                {status === 'error' && (
                  <p className="rounded-xl border border-spark/40 bg-spark-soft px-4 py-3 text-sm text-ink">
                    Das hat leider nicht geklappt. Bitte versuch es noch einmal —
                    oder schreib direkt an{' '}
                    <a href="mailto:mail@xepter.de" className="font-medium text-spark underline">
                      mail@xepter.de
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn btn-primary mt-1 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? 'Wird gesendet …' : 'Nachricht senden'}
                  {status !== 'sending' && <IconArrowUpRight width={18} height={18} />}
                </button>
                <p className="text-center font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint">
                  Geht direkt an mein Postfach · Antwort innerhalb von 24 h
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}

function Field({ id, label, type, placeholder, autoComplete, required = true }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink-dim">
        {label}
        {!required && <span className="ml-1 text-ink-faint">(optional)</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="rounded-xl border border-line-2 bg-base/60 px-4 py-3 text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:outline-none"
      />
    </div>
  )
}
