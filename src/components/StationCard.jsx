import { motion } from 'framer-motion'
import { fadeUp, inView } from '../lib/anim'

/*
 * StationCard — eine Reise-Station als "Fenster" im Win-Stil aus HomeTeasers.
 * macOS-Ampelpunkte leuchten (lit) auf, sobald das reisende Licht die Station
 * passiert — gleiche Mechanik wie der Hover-Effekt, nur scroll-getriggert.
 * `active` steuert das Reinfaden, `lit` das Aufleuchten + den Lift.
 * Klassen der Ampelpunkte sind bewusst statisch (Tailwind v4 kompiliert keine
 * dynamisch zusammengebauten Arbitrary-Klassen) — identisch zu HomeTeasers.
 */
const DOT = 'h-2.5 w-2.5 rounded-full transition-all duration-300'

export default function StationCard({ eyebrow, title, body, icon, image, imageAlt, lit, reduce }) {
  return (
    <motion.article
      variants={fadeUp}
      initial={reduce ? 'show' : 'hidden'}
      whileInView="show"
      viewport={inView}
      className={`relative w-full overflow-hidden rounded-xl border bg-panel transition-[border-color,box-shadow] duration-500 ${
        lit
          ? 'border-accent/40 shadow-[0_24px_60px_-20px_rgba(139,61,240,0.35)]'
          : 'border-line-2'
      }`}
    >
      <div
        className="glow"
        style={{
          width: 220,
          height: 220,
          right: '-20%',
          top: '-45%',
          background:
            'radial-gradient(circle, rgba(139,61,240,0.18), transparent 60%)',
        }}
      />

      <div className="relative flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className={`${DOT} ${lit ? 'bg-[#ff5f57] shadow-[0_0_8px_#ff5f5799]' : 'bg-white/15'}`} />
        <span className={`${DOT} delay-[70ms] ${lit ? 'bg-[#febc2e] shadow-[0_0_8px_#febc2e99]' : 'bg-white/15'}`} />
        <span className={`${DOT} delay-[140ms] ${lit ? 'bg-[#28c840] shadow-[0_0_8px_#28c84099]' : 'bg-white/15'}`} />
        <span className="ml-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-ink-faint">
          {eyebrow}
        </span>
      </div>

      <div className="relative p-7">
        <div className={`mb-4 transition-colors duration-500 ${lit ? 'text-spark' : 'text-ink-dim'}`}>
          {icon}
        </div>
        <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
          {title}
        </h3>
        <p className="mt-2.5 leading-relaxed text-ink-dim">{body}</p>

        {image && (
          <div className="relative mt-5 overflow-hidden rounded-lg border border-line-2">
            <img
              src={image}
              alt={imageAlt}
              width={1080}
              height={1529}
              loading="lazy"
              className="aspect-[5/4] w-full object-cover object-[center_38%]"
            />
            {/* dezent abdunkeln, damit das Foto in den dunklen Reise-Look passt */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/45 via-transparent to-transparent" />
          </div>
        )}
      </div>
    </motion.article>
  )
}
