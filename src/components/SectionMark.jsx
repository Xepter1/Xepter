import { motion, useReducedMotion } from 'framer-motion'
import { clipUp, drawX, inView } from '../lib/anim'

/**
 * Editorial section signature — the site's recurring "one hand":
 *   a self-drawing 1px hairline → a quiet mono kicker word → an elevated <h2>
 *   that reuses the Hero's clip-reveal.
 *
 * Replaces the old numbered eyebrows ("01 — …"). Used by Projects + About.
 *
 * Props:
 *   word     — the mono kicker (e.g. "Arbeit", "Person"). NEVER a number.
 *   lines    — array of headline lines. Each item is a string, or
 *              { text, accent?, suffix? } where `accent` draws the warm spark
 *              underline under `text` and `suffix` stays on the same masked line.
 *   className — extra classes on the wrapper (e.g. spacing).
 */
export default function SectionMark({ word, lines, className = '' }) {
  const reduce = useReducedMotion()
  // Framer's `initial` overrides CSS, so honour reduced-motion in JS:
  // start already in the visible "show" state — nothing animates, nothing hides.
  const initial = reduce ? 'show' : 'hidden'

  return (
    <motion.div
      initial={initial}
      whileInView="show"
      viewport={inView}
      className={`max-w-[15ch] sm:max-w-2xl ${className}`}
    >
      {/* self-drawing hairline */}
      <motion.span
        variants={drawX}
        custom={0}
        style={{ originX: 0 }}
        className="mb-6 block h-px w-16 origin-left bg-line-2 sm:w-[88px]"
      />

      {/* quiet mono kicker word (optional) */}
      {word && (
        <span className="block overflow-hidden">
          <motion.span variants={clipUp} custom={0.12} className="kicker block">
            {word}
          </motion.span>
        </span>
      )}

      {/* elevated headline — clip-reveal per line (same device as the Hero) */}
      <h2 className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4rem)] font-medium leading-[1.0] tracking-[-0.035em]">
        {lines.map((line, i) => {
          const isObj = typeof line === 'object' && line !== null
          const text = isObj ? line.text : line
          const delay = 0.2 + i * 0.07
          return (
            <span key={i} className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={clipUp} custom={delay} className="block">
                {isObj && line.accent ? (
                  <>
                    <span className="relative inline-block">
                      {text}
                      <motion.span
                        variants={drawX}
                        custom={delay + 0.22}
                        style={{ originX: 0 }}
                        className="spark-underline absolute -bottom-1 left-0 h-[3px] w-full origin-left"
                      />
                    </span>
                    {line.suffix || ''}
                  </>
                ) : (
                  text
                )}
              </motion.span>
            </span>
          )
        })}
      </h2>
    </motion.div>
  )
}
