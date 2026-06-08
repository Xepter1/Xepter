import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { fadeUp, inView, EASE } from '../lib/anim'
import { IconArrowUpRight } from './Icons'

// Screenshots liegen lokal unter /public/projects/ (eigenständig, schnell).
// Austauschen? Einfach die JPGs ersetzen oder img-Pfad anpassen.
const PROJECTS = [
  {
    name: 'Landshuter Symphonieorchester',
    desc: 'Webauftritt für ein klassisches Symphonieorchester — Konzertkalender, Programm und digitale Bühne für die Klassik.',
    tag: 'Kultur',
    url: 'https://symphonieorchester.fraunhofer-lab.de/',
    img: '/projects/symphonieorchester.jpg',
    imgMobile: '/projects/mobile/symphonieorchester.jpg',
    accent: '#3B82F6',
  },
  {
    name: 'DesignbyEms',
    desc: 'Markenauftritt und Portfolio für ein kreatives Designstudio — reduziert, elegant und ganz auf die Arbeit fokussiert.',
    tag: 'Branding',
    url: 'https://designbyems.de/',
    img: '/projects/designbyems.jpg',
    imgMobile: '/projects/mobile/designbyems.jpg',
    accent: '#22D3EE',
  },
  {
    name: 'Tankstelle Stettner',
    desc: 'Digitaler Auftritt einer regionalen Tankstelle — Services, Standort und Kontakt klar auf den Punkt gebracht.',
    tag: 'Lokal',
    url: 'https://datenschutz.fraunhofer-lab.de/',
    img: '/projects/tankstelle-stettner.jpg',
    imgMobile: '/projects/mobile/tankstelle-stettner.jpg',
    accent: '#38C9F5',
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const flip = index % 2 === 1

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
        <div className="mb-5 flex items-baseline gap-4">
          <span className="font-mono text-sm text-accent">
            0{index + 1}
          </span>
          <span className="h-px flex-1 bg-line" />
          <span className="rounded-full border border-line-2 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-faint">
            {project.tag}
          </span>
        </div>

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

export default function Projects() {
  return (
    <section id="projekte" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mb-20 max-w-2xl"
        >
          <span className="eyebrow">01 — Ausgewählte Arbeiten</span>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Projekte, die einen{' '}
            <span className="text-gradient">Eindruck</span> hinterlassen.
          </h2>
        </motion.div>

        {/* Rows */}
        <div className="flex flex-col gap-24 sm:gap-32">
          {PROJECTS.map((p, i) => (
            <Row key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
