import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, inView, EASE } from '../lib/anim'
import { IconArrowUpRight } from './Icons'
import SectionMark from './SectionMark'

// Screenshots liegen lokal unter /public/projects/ (eigenständig, schnell).
// Austauschen? Einfach die JPGs ersetzen oder img-Pfad anpassen.
const PROJECTS = [
  {
    name: 'Landshuter Symphonieorchester',
    desc: 'Konzeption einer Website für ein klassisches Symphonieorchester mit Konzertkalender, Newsübersicht und Galerie. Mit CMS für die selbstständige Pflege.',
    tag: 'Kultur',
    year: '2026',
    url: 'https://symphonieorchester.fraunhofer-lab.de/',
    img: '/projects/symphonieorchester.jpg',
    imgMobile: '/projects/mobile/symphonieorchester.jpg',
    accent: '#3B82F6',
  },
  {
    name: 'DesignbyEms',
    desc: 'Konzeption der Website für die Grafikdesignerin Emili Gassner, reduziert, elegant und ganz auf ihre Arbeit fokussiert.',
    tag: 'Branding',
    year: '2026',
    url: 'https://designbyems.de/',
    img: '/projects/designbyems.jpg',
    imgMobile: '/projects/mobile/designbyems.jpg',
    accent: '#22D3EE',
  },
]

function Preview({ project, flip }) {
  const [failed, setFailed] = useState(false)
  const [mFailed, setMFailed] = useState(false)
  const host = new URL(project.url).host

  return (
    <div className="preview-wrap">
      <div className="browser group-hover:-translate-y-1 transition-transform duration-700 ease-out">
      <div className="browser-bar">
        <span className="browser-dot" style={{ background: '#ff5f57' }} />
        <span className="browser-dot" style={{ background: '#febc2e' }} />
        <span className="browser-dot" style={{ background: '#28c840' }} />
        <span className="ml-3 truncate rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[0.72rem] text-ink-faint">
          {host}
        </span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden bg-card">
        {!failed ? (
          <img
            src={project.img}
            alt={`Screenshot der Website ${project.name}`}
            loading="lazy"
            width={1600}
            height={1000}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `radial-gradient(120% 120% at 30% 10%, ${project.accent}33, transparent 60%), #0c0e14`,
            }}
          >
            <span className="font-display text-3xl font-semibold tracking-tight text-ink/90">
              {project.name}
            </span>
          </div>
        )}
        {/* sheen */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/40 via-transparent to-transparent" />
        </div>
      </div>

      {project.imgMobile && (
        <div
          className={`phone-overlay ${
            flip ? 'phone-overlay--left' : 'phone-overlay--right'
          }`}
        >
          <div className="phone">
            <div className="phone-screen">
              {!mFailed ? (
                <img
                  src={project.imgMobile}
                  alt={`${project.name} – mobile Ansicht`}
                  loading="lazy"
                  onError={() => setMFailed(true)}
                  className="phone-shot"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(160deg, ${project.accent}33, #0c0e14)`,
                  }}
                />
              )}
            </div>
            <div className="phone-island" />
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ project, index }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const flip = index % 2 === 1

  // "You are here" — only the row crossing the viewport centre is active,
  // so at most one warm tick is ever lit.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '-45% 0px -45% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <motion.article
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
    >
      {/* Preview */}
      <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ y }}
        className={`block ${flip ? 'lg:order-2' : ''}`}
        aria-label={`${project.name} — Live ansehen (öffnet in neuem Tab)`}
      >
        <Preview project={project} flip={flip} />
      </motion.a>

      {/* Copy */}
      <div className={flip ? 'lg:order-1' : ''}>
        <p className="spec mb-4 flex items-center gap-3">
          {/* you-are-here tick — violet hairline by default, warm spark on the centred/hovered row */}
          <span
            aria-hidden="true"
            className={`inline-block h-px w-5 origin-left transition-[background-color,transform] duration-300 group-hover:scale-x-150 group-hover:bg-spark ${
              active ? 'scale-x-150 bg-spark' : 'bg-line-2'
            }`}
          />
          {project.live ? (
            <span className="inline-flex items-center gap-1.5 text-spark">
              Live
              <span
                aria-hidden="true"
                className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-spark"
              />
            </span>
          ) : (
            <span>{project.year}</span>
          )}
        </p>

        <h3 className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          {project.name}
        </h3>

        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-dim">
          {project.desc}
        </p>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link mt-7 inline-flex items-center gap-2 text-ink transition-colors hover:text-accent"
        >
          <span className="relative font-medium">
            Live ansehen
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover/link:scale-x-100" />
          </span>
          <IconArrowUpRight
            width={18}
            height={18}
            className="transition-transform duration-500 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </a>
      </div>
    </motion.article>
  )
}

// "Open slot" — replaces a real project: the mockups invite the next client
// instead of showing a screenshot ("Hier könnte deine Website stehen").
function CtaPreview() {
  return (
    <div className="preview-wrap">
      <div className="browser group-hover:-translate-y-1 transition-transform duration-700 ease-out">
        <div className="browser-bar">
          <span className="browser-dot" style={{ background: '#ff5f57' }} />
          <span className="browser-dot" style={{ background: '#febc2e' }} />
          <span className="browser-dot" style={{ background: '#28c840' }} />
          <span className="ml-3 truncate rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[0.72rem] text-ink-faint">
            deine-website.de
          </span>
        </div>

        <div
          className="relative flex aspect-[16/10] flex-col items-center justify-center overflow-hidden px-6 text-center"
          style={{
            background:
              'radial-gradient(120% 110% at 50% 0%, rgba(255,176,77,0.12), transparent 55%), #0b0d13',
          }}
        >
          <div className="grid-bg absolute inset-0 opacity-40" />
          <h4 className="relative font-display text-[clamp(1.3rem,3vw,2.3rem)] font-semibold leading-[1.05] tracking-tight text-ink">
            Das hier könnte
            <br />
            deine Website sein.
          </h4>
          <span className="relative mt-4 font-mono text-[0.58rem] uppercase tracking-[0.3em] text-ink-faint">
            designed by Xepter
          </span>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/40 via-transparent to-transparent" />
        </div>
      </div>

      <div className="phone-overlay phone-overlay--right">
        <div className="phone">
          <div className="phone-screen">
            <div
              className="flex h-full w-full flex-col items-center justify-center px-2 text-center"
              style={{
                background:
                  'radial-gradient(120% 80% at 50% 0%, rgba(255,176,77,0.16), transparent 60%), #0a0a0c',
              }}
            >
              <span className="font-display text-[0.6rem] font-semibold leading-tight text-ink">
                Das hier könnte deine Website sein.
              </span>
              <span className="mt-2 h-1 w-1 rounded-full bg-spark shadow-[0_0_8px_var(--color-spark)]" />
            </div>
          </div>
          <div className="phone-island" />
        </div>
      </div>
    </div>
  )
}

function CtaRow() {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
    >
      <Link
        to="/kontakt"
        className="block"
        aria-label="Dein Projekt — Kontakt aufnehmen"
      >
        <CtaPreview />
      </Link>

      <div>
        <p className="spec mb-4 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-block h-px w-5 origin-left bg-spark transition-transform duration-300 group-hover:scale-x-150"
          />
          <span>Nächstes Projekt</span>
          <span aria-hidden="true" className="opacity-40">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5 text-spark">
            Frei
            <span
              aria-hidden="true"
              className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-spark"
            />
          </span>
        </p>

        <h3 className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          Jetzt?
        </h3>

        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-dim">
          Hier ist Platz für deine Website, gestaltet und entwickelt mit
          demselben Anspruch wie die Projekte oben. Lass uns deine zur nächsten
          machen, die hier steht.
        </p>

        <Link
          to="/kontakt"
          className="group/link mt-7 inline-flex items-center gap-2 text-ink transition-colors hover:text-spark"
        >
          <span className="relative font-medium">
            Projekt starten
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-spark transition-transform duration-500 group-hover/link:scale-x-100" />
          </span>
          <IconArrowUpRight
            width={18}
            height={18}
            className="transition-transform duration-500 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </Link>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  return (
    <section id="projekte" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <SectionMark
          lines={[
            'Projekte, die einen',
            { text: 'Eindruck', accent: true, suffix: ' hinterlassen.' },
          ]}
          className="mb-20"
        />

        {/* Rows */}
        <div className="flex flex-col gap-24 sm:gap-32">
          {PROJECTS.map((p, i) => (
            <Row key={p.name} project={p} index={i} />
          ))}
          <CtaRow />
        </div>
      </div>
    </section>
  )
}
