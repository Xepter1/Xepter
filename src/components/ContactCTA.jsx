import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, inView } from '../lib/anim'
import { IconArrowUpRight } from './Icons'

// Closing call-to-action on the home page — funnels to the dedicated /kontakt page.
export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden py-32 sm:py-44">
      <div
        className="glow"
        style={{
          width: 720,
          height: 720,
          left: '50%',
          top: '0%',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(circle, rgba(138,63,240,0.16), transparent 60%)',
        }}
      />
      <div className="grid-bg absolute inset-0 z-0 opacity-60" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8"
      >
        <span className="eyebrow">Bereit, wenn du es bist</span>
        <h2 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
          Lass uns einen bleibenden{' '}
          <span className="text-gradient">ersten Eindruck</span> schaffen.
        </h2>
        <p className="mx-auto mt-7 max-w-md text-lg leading-relaxed text-ink-dim">
          Du hast ein Projekt im Kopf oder einfach eine gute Idee? Erzähl mir
          davon — ich melde mich zeitnah zurück.
        </p>
        <Link to="/kontakt" className="btn btn-primary mt-10">
          Kontakt aufnehmen
          <IconArrowUpRight width={18} height={18} />
        </Link>
      </motion.div>
    </section>
  )
}
