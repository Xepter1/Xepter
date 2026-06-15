import { useCallback, useEffect, useRef } from 'react'
import { motion, useAnimate, useInView, useReducedMotion } from 'framer-motion'

/**
 * SecurityLock — das Xepter-X verwandelt sich in ein Vorhängeschloss.
 *
 * Reines SVG mit dem Marken-Gradient (#8B3DF0 → #BF5AF2), animiert per framer-motion
 * (useAnimate-Timeline) — kein Frame-Export wie bei GearScene. Skaliert gestochen scharf,
 * winzige Bytes, läuft auf jedem Gerät weich.
 *
 * Ablauf (spielt automatisch beim Reinscrollen, Klick spielt erneut ab):
 *   1. Das X zeichnet sich groß & zentriert.
 *   2. Es schrumpft an seinen Platz und wird zum Schlüsselloch — der Korpus zeichnet
 *      sich drumherum, die Fläche füllt sich.
 *   3. Der Bügel zeichnet sich in angehobener (offener) Position.
 *   4. Der Bügel klickt mit Feder-Bounce zu — Funken-Puls + Schlüsselloch-Puls + Glow.
 *
 * Reduced-Motion: rendert direkt das fertig geschlossene Schloss, ohne Sequenz.
 */
const EXPO = [0.16, 1, 0.3, 1]

export default function SecurityLock({ className = '' }) {
  const reduce = useReducedMotion()
  const [scope, animate] = useAnimate()
  const inView = useInView(scope, { once: true, amount: 0.3 })
  const played = useRef(false)

  const play = useCallback(() => {
    animate([
      // — Reset auf den Anfangszustand (instant), damit Klick sauber neu startet —
      ['.sl-x', { opacity: 0, scale: 2.3, y: -42 }, { duration: 0 }],
      ['.sl-x-stroke', { pathLength: 0 }, { duration: 0 }],
      ['.sl-body', { pathLength: 0 }, { duration: 0 }],
      ['.sl-fill', { opacity: 0 }, { duration: 0 }],
      ['.sl-shackle-grp', { y: -28 }, { duration: 0 }],
      ['.sl-shackle', { pathLength: 0 }, { duration: 0 }],
      ['.sl-flash', { scale: 0.5, opacity: 0 }, { duration: 0 }],
      ['.sl-glow', { opacity: 0 }, { duration: 0 }],

      // 1) X erscheint groß und zeichnet sich
      ['.sl-x', { opacity: 1 }, { duration: 0.3, at: 0.1 }],
      ['.sl-x-stroke', { pathLength: 1 }, { duration: 0.6, ease: EXPO, at: 0.1 }],

      // 2) X schrumpft ins Schlüsselloch; Korpus zeichnet sich + füllt sich
      ['.sl-x', { scale: 1, y: 0 }, { duration: 0.7, ease: EXPO, at: 0.85 }],
      ['.sl-body', { pathLength: 1 }, { duration: 0.7, ease: EXPO, at: 0.9 }],
      ['.sl-fill', { opacity: 1 }, { duration: 0.6, at: 1.05 }],

      // 3) Bügel zeichnet sich (noch angehoben = offen)
      ['.sl-shackle', { pathLength: 1 }, { duration: 0.4, ease: EXPO, at: 1.45 }],

      // 4) Bügel klickt zu — Feder mit kurzem Überschwingen
      ['.sl-shackle-grp', { y: 0 }, { type: 'spring', stiffness: 360, damping: 11, at: 1.9 }],

      // 5) Klick-Funken, Schlüsselloch-Puls, Glow
      ['.sl-flash', { scale: 1.6, opacity: [0, 0.9, 0] }, { duration: 0.6, at: 2.04 }],
      ['.sl-x', { scale: [1, 1.14, 1] }, { duration: 0.42, at: 2.06 }],
      ['.sl-glow', { opacity: [0, 0.6, 0.34] }, { duration: 0.8, at: 1.98 }],
    ])
  }, [animate])

  useEffect(() => {
    if (reduce || !inView || played.current) return
    played.current = true
    play()
  }, [inView, reduce, play])

  const replay = () => {
    if (!reduce) play()
  }

  // f = "final/static state" — für reduced-motion startet alles im fertigen Zustand.
  const f = reduce
  const centerOrigin = { transformBox: 'fill-box', transformOrigin: 'center' }

  return (
    <button
      type="button"
      onClick={replay}
      aria-label="Animation des sich schließenden Schlosses erneut abspielen"
      className={`group relative block w-full cursor-pointer appearance-none bg-transparent ${className}`}
    >
      <svg
        ref={scope}
        viewBox="0 0 200 248"
        role="img"
        aria-label="Das Xepter-Logo verwandelt sich in ein Schloss, das sich schließt"
        className="mx-auto block w-full max-w-[360px] [filter:drop-shadow(0_14px_40px_rgba(139,61,240,0.28))]"
      >
        <defs>
          <linearGradient id="slGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8B3DF0" />
            <stop offset="1" stopColor="#BF5AF2" />
          </linearGradient>
          <radialGradient id="slFlash">
            <stop offset="0" stopColor="#ffb04d" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ffb04d" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ffb04d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="slGlow">
            <stop offset="0" stopColor="#BF5AF2" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#BF5AF2" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient-Glow hinter dem Schloss */}
        <motion.circle
          className="sl-glow"
          cx="100"
          cy="150"
          r="118"
          fill="url(#slGlow)"
          initial={{ opacity: f ? 0.34 : 0 }}
        />

        {/* Bügel — liegt HINTER dem Korpus, damit die Beine im Korpus verschwinden */}
        <motion.g className="sl-shackle-grp" initial={{ y: f ? 0 : -28 }}>
          <motion.path
            className="sl-shackle"
            d="M74 124 L74 96 A26 26 0 0 1 126 96 L126 124"
            fill="none"
            stroke="url(#slGrad)"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: f ? 1 : 0 }}
          />
        </motion.g>

        {/* Korpus-Fläche (deckt die Bügel-Beine ab) */}
        <motion.rect
          className="sl-fill"
          x="44"
          y="116"
          width="112"
          height="104"
          rx="26"
          fill="#0b0d13"
          initial={{ opacity: f ? 1 : 0 }}
        />

        {/* Klick-Funken am Übergang Bügel↔Korpus */}
        <motion.circle
          className="sl-flash"
          cx="100"
          cy="118"
          r="64"
          fill="url(#slFlash)"
          style={centerOrigin}
          initial={{ opacity: 0, scale: 0.5 }}
        />

        {/* Korpus-Umriss (zeichnet sich) */}
        <motion.rect
          className="sl-body"
          x="44"
          y="116"
          width="112"
          height="104"
          rx="26"
          fill="none"
          stroke="url(#slGrad)"
          strokeWidth="5"
          initial={{ pathLength: f ? 1 : 0 }}
        />

        {/* Das X — Marke → Schlüsselloch */}
        <motion.g
          className="sl-x"
          style={centerOrigin}
          initial={{ opacity: f ? 1 : 0, scale: f ? 1 : 2.3, y: f ? 0 : -42 }}
        >
          <motion.path
            className="sl-x-stroke"
            d="M80.5 147 L100 169.5 L119.5 147"
            fill="none"
            stroke="url(#slGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: f ? 1 : 0 }}
          />
          <motion.path
            className="sl-x-stroke"
            d="M80.5 192 L100 169.5 L119.5 192"
            fill="none"
            stroke="url(#slGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: f ? 1 : 0 }}
          />
        </motion.g>
      </svg>

      {!reduce && (
        <span className="mt-6 block text-center font-mono text-[0.7rem] uppercase tracking-[0.3em] text-ink-faint transition-colors duration-300 group-hover:text-spark">
          Klick zum erneut Abspielen
        </span>
      )}
    </button>
  )
}
