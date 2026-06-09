import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { EASE } from '../lib/anim'
import Macbook from './Macbook'
import { IconArrowRight, IconArrowUpRight } from './Icons'

const LINES = ['Ich baue', 'Websites,', 'die überzeugen.']

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] overflow-hidden pt-28 sm:pt-32"
    >
      {/* atmosphere */}
      <div className="grid-bg absolute inset-0 z-0" />
      <div
        className="glow"
        style={{
          width: 620,
          height: 620,
          right: '-6%',
          top: '4%',
          background:
            'radial-gradient(circle, rgba(139,61,240,0.28), transparent 60%)',
        }}
      />
      <div
        className="glow"
        style={{
          width: 460,
          height: 460,
          left: '-8%',
          bottom: '2%',
          background:
            'radial-gradient(circle, rgba(191,90,242,0.16), transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1800px] grid-cols-1 items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:px-16 xl:px-24">
        {/* Left — copy */}
        <div className="order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="eyebrow mb-5"
          >
            Der erste Eindruck entscheidet.
          </motion.p>

          <h1 className="font-display text-[clamp(2.8rem,8.2vw,5.8rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            {LINES.map((t, i) => (
              <span key={t} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 2 ? 'text-gradient' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, delay: 0.35 + i * 0.12, ease: EASE }}
                >
                  {t}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
            className="mt-8 max-w-md text-lg leading-relaxed text-ink-dim"
          >
            Ich gestalte und entwickle Websites, die im ersten Moment wirken — und
            im zweiten überzeugen. Klar, schnell und kompromisslos im Detail.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a href="#projekte" className="btn btn-primary">
              Projekte ansehen
              <IconArrowRight width={19} height={19} />
            </a>
            <Link to="/kontakt" className="btn btn-ghost">
              Kontakt aufnehmen
              <IconArrowUpRight width={18} height={18} />
            </Link>
          </motion.div>
        </div>

        {/* Right — MacBook */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
          className="order-1 lg:order-2 lg:justify-self-end"
        >
          <Macbook />
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="eyebrow !text-ink-faint !tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-line-2 pt-1.5">
          <span className="scroll-dot h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
      </motion.div>
    </section>
  )
}
