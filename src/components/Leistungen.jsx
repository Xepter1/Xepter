import { motion } from 'framer-motion'
import { fadeUp, stagger, inView } from '../lib/anim'
import SectionMark from './SectionMark'
import CmsShowcase from './CmsShowcase'

const FEATURES = [
  'Bilder & Galerien hochladen',
  'News & Ankündigungen schreiben',
  'Banner ein- und ausblenden',
  'Termine & Konzerte verwalten',
]

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export default function Leistungen() {
  return (
    <section id="leistungen" className="relative overflow-hidden py-28 sm:py-36">
      <div
        className="glow"
        style={{
          width: 620,
          height: 620,
          right: '-12%',
          top: '8%',
          background:
            'radial-gradient(circle, rgba(139,61,240,0.16), transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
          {/* Left — copy */}
          <div className="order-2 lg:order-1">
            <SectionMark
              word="Leistungen"
              lines={[
                'Deine Website',
                { text: 'pflegst du', accent: true, suffix: ' selbst.' },
              ]}
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-9"
            >
              <motion.p
                variants={fadeUp}
                className="max-w-md text-lg leading-relaxed text-ink-dim"
              >
                Bei mir bekommst du keine starre Seite, die bei jeder Kleinigkeit
                den Entwickler braucht. Über einen sicheren{' '}
                <span className="text-ink">Admin-Login</span> pflegst du deine
                Inhalte selbst — so einfach, wie du es kennst.
              </motion.p>

              <motion.ul
                variants={fadeUp}
                className="mt-8 grid gap-x-8 gap-y-3.5 sm:grid-cols-2"
              >
                {FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-[0.98rem] text-ink"
                  >
                    <Check />
                    {f}
                  </li>
                ))}
              </motion.ul>

              <motion.p
                variants={fadeUp}
                className="mt-8 max-w-md text-base leading-relaxed text-ink-faint"
              >
                Ein eigenes, voll ausgestattetes CMS — kein Baukasten, keine
                monatliche Lizenz. Es gehört zu deiner Website dazu.
              </motion.p>
            </motion.div>
          </div>

          {/* Right — iMac with the live CMS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <CmsShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
