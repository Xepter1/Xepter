import { useCallback, useEffect, useRef } from 'react'
import { motion, useAnimate, useInView, useReducedMotion } from 'framer-motion'

/**
 * SecurityLock — ein Vorhängeschloss mit dem echten Xepter-Logo als Emblem.
 *
 * Reines SVG mit dem Marken-Lila — kein Frame-Export. Der Korpus (dunkle, dezent
 * gerundete Kachel) und das Logo stehen von Anfang an; das Einzige, was sich bewegt,
 * ist der Bügel: er fällt herein und rastet per Feder ein („klick"). Kein Neon-Glow,
 * kein End-Blitz — nur ein weicher, dunkler Schatten für Tiefe.
 *
 * Die viewBox lässt oben genug Luft, damit der angehobene (offene) Bügel nicht
 * abgeschnitten wird.
 *
 * Spielt automatisch beim Reinscrollen (einmal), Klick spielt erneut ab.
 * Reduced-Motion: rendert direkt das geschlossene Schloss.
 *
 * Logo-Geometrie + Dark-Mode-Farben aus Xepter_X.svg / Xepter_logo_inv.svg
 * (Arme #e0abff, Cursor + Sliver #7a2bd6).
 */
function XepterMark() {
  return (
    <g transform="translate(124,208) scale(0.74) translate(-56.86,-64.42)">
      <path
        d="M38.39,70.69h26.77l6.68,5.08-36.56,53.07H0s38.39-58.15,38.39-58.15Z"
        fill="#e0abff"
      />
      <path
        d="M38.25,4.76l18.61,29.78L78.44,0h35.28l-38.39,58.15h-36.94L0,0h29.66c3.49,0,6.74,1.8,8.59,4.76Z"
        fill="#e0abff"
      />
      <polygon
        points="65.16 70.69 79.68 128.83 93.08 113.12 112.8 107.04 65.16 70.69"
        fill="#7a2bd6"
      />
      <polygon
        points="79.73 51.49 36.79 55.73 38.39 58.15 75.33 58.15 79.73 51.49"
        fill="#7a2bd6"
      />
    </g>
  )
}

export default function SecurityLock({ className = '' }) {
  const reduce = useReducedMotion()
  const [scope, animate] = useAnimate()
  const inView = useInView(scope, { once: true, amount: 0.3 })
  const played = useRef(false)

  const play = useCallback(() => {
    animate([
      ['.sl-shackle', { y: -24 }, { duration: 0 }],
      ['.sl-body', { scale: 1 }, { duration: 0 }],
      ['.sl-shackle', { y: 0 }, { type: 'spring', stiffness: 300, damping: 17, at: 0.45 }],
      ['.sl-body', { scale: [1, 0.986, 1] }, { duration: 0.34, ease: 'easeOut', at: 0.95 }],
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

  return (
    <button
      type="button"
      onClick={replay}
      aria-label="Animation des sich schließenden Schlosses erneut abspielen"
      className={`group relative block w-full cursor-pointer appearance-none bg-transparent ${className}`}
    >
      <svg
        ref={scope}
        viewBox="0 34 240 288"
        role="img"
        aria-label="Ein Schloss mit dem Xepter-Logo, dessen Bügel sich schließt"
        className="mx-auto block w-full max-w-[190px] sm:max-w-[240px] lg:max-w-[300px]"
      >
        <defs>
          <linearGradient id="slBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1426" />
            <stop offset="1" stopColor="#0a0810" />
          </linearGradient>
          <linearGradient id="slShackle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#caa6f7" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <filter id="slShadow" x="-40%" y="-30%" width="180%" height="180%">
            <feDropShadow dx="0" dy="16" stdDeviation="15" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Bügel — liegt hinter dem Korpus, damit die Beine verschwinden */}
        <motion.path
          className="sl-shackle"
          d="M97,150 L97,104 A27,27 0 0 1 151,104 L151,150"
          fill="none"
          stroke="url(#slShackle)"
          strokeWidth="18"
          strokeLinecap="round"
          initial={{ y: reduce ? 0 : -24 }}
        />

        {/* Korpus + Logo — rasten beim Schließen mit einem dezenten „thunk" ein */}
        <motion.g
          className="sl-body"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          initial={{ scale: 1 }}
        >
          <g filter="url(#slShadow)">
            <rect
              x="52"
              y="138"
              width="144"
              height="140"
              rx="26"
              fill="url(#slBody)"
              stroke="#7c3aed"
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
          </g>
          <XepterMark />
        </motion.g>
      </svg>
    </button>
  )
}
