import { useReducedMotion } from 'framer-motion'

/**
 * InfraScene — die „Infrastruktur-Bühne" für Desktop (Rundum-sorglos):
 * Besucher → Server (Nürnberg) → Deine Website, mit Standort- und
 * Verfügbarkeits-Karte und Datenpaketen, die über die Leitungen sausen.
 *
 * Bewegung: Pakete via SMIL <animateMotion> entlang der echten Pfade; LEDs,
 * Traffic, „online"-Punkte und Knoten-Pings via CSS (s. index.css). Alles
 * respektiert prefers-reduced-motion (Pakete entfallen, CSS-Animationen aus).
 */

// Verbindungs-Pfade (Besucher→Server links, Server→Website rechts)
const L1 = 'M150,300 C 320,250 420,255 560,262'
const L2 = 'M150,300 C 340,300 430,305 560,308'
const L3 = 'M150,300 C 320,360 430,360 560,360'
const R1 = 'M840,262 C 1010,255 1160,250 1330,300'
const R2 = 'M840,308 C 1010,305 1180,300 1330,300'
const R3 = 'M840,360 C 1010,360 1160,355 1330,300'
const LINES = [L1, L2, L3, R1, R2, R3]

// Datenpakete: Pfad, Farbe (g=grün/Besucher-Seite, v=violett/Website-Seite), Dauer, Start-Versatz
const PACKETS = [
  { p: L1, c: 'g', dur: 2.6, begin: 0 },
  { p: L1, c: 'g', dur: 2.6, begin: 1.5 },
  { p: L2, c: 'g', dur: 2.9, begin: 0.9 },
  { p: L3, c: 'g', dur: 2.7, begin: 0.4 },
  { p: R1, c: 'v', dur: 2.8, begin: 0.3 },
  { p: R2, c: 'v', dur: 2.6, begin: 1.2 },
  { p: R2, c: 'v', dur: 2.6, begin: 2.4 },
  { p: R3, c: 'v', dur: 2.9, begin: 0.7 },
]

// 5 Laufwerks-Schächte (y-Offset, LED-Paar)
const BAYS = [
  { y: 0, leds: ['g', 'g'], delay: '0s' },
  { y: 64, leds: ['g', 'g'], delay: '1.3s' },
  { y: 128, leds: ['g', 'a'], delay: '0.6s' },
  { y: 192, leds: ['g', 'g'], delay: '2.1s' },
  { y: 256, leds: ['g', 'g'], delay: '1.7s' },
]

// Traffic-Balken (x, Höhe)
const TRAFFIC = [
  [578, 8], [585, 4], [592, 12], [599, 7], [606, 10], [613, 5],
  [620, 14], [627, 9], [634, 6], [641, 11], [648, 8], [655, 13],
]

// Uptime-Balken (31 Stück, einer amber)
const UPTIME = Array.from({ length: 31 }, (_, i) => ({
  x: 1028 + i * 10,
  h: [18, 20, 16, 19, 17, 20, 18, 15, 19, 20, 17, 19, 20, 18, 16, 20, 19, 17, 20, 18, 19, 20, 17, 19, 20, 18, 16, 20, 19, 17, 20][i],
  amber: i === 7,
}))

const ledFill = (c) => (c === 'a' ? '#ffb04d' : '#34d17b')

export default function InfraScene() {
  const reduce = useReducedMotion()

  return (
    <svg
      viewBox="0 0 1400 560"
      className="mx-auto block w-full"
      role="img"
      aria-label="Datenfluss: Besucher zu deinem Server in Nürnberg und weiter zu deiner Website, alles online"
    >
      <defs>
        <linearGradient id="isPanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14111d" />
          <stop offset="1" stopColor="#0b0911" />
        </linearGradient>
        <linearGradient id="isInset" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d0a15" />
          <stop offset="1" stopColor="#08060d" />
        </linearGradient>
        <linearGradient id="isBig" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9a4f7" />
        </linearGradient>
        <linearGradient id="isLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c3aed" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="#7c3aed" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="isGGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#34d17b" stopOpacity="0.9" />
          <stop offset="1" stopColor="#34d17b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="isVGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#a571f5" stopOpacity="0.9" />
          <stop offset="1" stopColor="#a571f5" stopOpacity="0" />
        </radialGradient>
        <filter id="isPktG" x="-200%" y="-200%" width="500%" height="500%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#7dffb0" floodOpacity="0.9" />
        </filter>
        <filter id="isPktV" x="-200%" y="-200%" width="500%" height="500%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#c9a4f7" floodOpacity="0.9" />
        </filter>
        <filter id="isDs" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#000000" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* feines Raster */}
      <g stroke="#ffffff" strokeOpacity="0.025">
        {[70, 140, 210, 280, 350, 420, 490].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="1400" y2={y} />
        ))}
        {[140, 280, 420, 700, 980, 1120, 1260].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="560" />
        ))}
      </g>

      {/* Verbindungslinien */}
      <g fill="none" stroke="url(#isLine)" strokeWidth="1.8">
        {LINES.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* Datenpakete */}
      {!reduce && (
        <g>
          {PACKETS.map((pk, i) => (
            <circle
              key={i}
              r="4"
              fill={pk.c === 'g' ? '#9affc4' : '#c9a4f7'}
              filter={pk.c === 'g' ? 'url(#isPktG)' : 'url(#isPktV)'}
              opacity="0"
            >
              <animateMotion
                dur={`${pk.dur}s`}
                begin={`${pk.begin}s`}
                repeatCount="indefinite"
                path={pk.p}
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              />
              <animate
                attributeName="opacity"
                dur={`${pk.dur}s`}
                begin={`${pk.begin}s`}
                repeatCount="indefinite"
                values="0;1;1;0"
                keyTimes="0;0.12;0.85;1"
              />
            </circle>
          ))}
        </g>
      )}

      {/* BESUCHER */}
      <circle cx="150" cy="300" r="26" fill="none" stroke="#34d17b" strokeOpacity="0.18" />
      <circle cx="150" cy="300" r="16" fill="none" stroke="#34d17b" strokeOpacity="0.32" />
      <circle className="node-ping" cx="150" cy="300" r="16" fill="none" stroke="#34d17b" strokeWidth="1.5" />
      <circle cx="150" cy="300" r="22" fill="url(#isGGlow)" />
      <circle cx="150" cy="300" r="6.5" fill="#34d17b" />
      <text x="150" y="348" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" letterSpacing="2" fill="#6b7384">BESUCHER</text>

      {/* DEINE WEBSITE */}
      <circle cx="1330" cy="300" r="26" fill="none" stroke="#a571f5" strokeOpacity="0.18" />
      <circle cx="1330" cy="300" r="16" fill="none" stroke="#a571f5" strokeOpacity="0.32" />
      <circle className="node-ping" cx="1330" cy="300" r="16" fill="none" stroke="#a571f5" strokeWidth="1.5" style={{ animationDelay: '1.4s' }} />
      <circle cx="1330" cy="300" r="22" fill="url(#isVGlow)" />
      <circle cx="1330" cy="300" r="6.5" fill="#a571f5" />
      <text x="1330" y="348" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" letterSpacing="1.5" fill="#6b7384">DEINE WEBSITE</text>

      {/* STANDORT-Karte */}
      <g filter="url(#isDs)">
        <rect x="55" y="95" width="320" height="132" rx="16" fill="url(#isPanel)" stroke="#7c3aed" strokeOpacity="0.3" />
      </g>
      <circle cx="362" cy="110" r="2.2" fill="#7c3aed" opacity="0.5" />
      <circle cx="68" cy="212" r="2.2" fill="#7c3aed" opacity="0.5" />
      <text x="83" y="135" fontFamily="var(--font-mono)" fontSize="12.5" letterSpacing="3" fill="#9a5cf0">STANDORT</text>
      <circle className="srv-online" cx="92" cy="170" r="6" fill="#34d17b" />
      <text x="108" y="178" fontFamily="var(--font-display)" fontWeight="700" fontSize="27" fill="#f3f6fb">Nürnberg, DE</text>
      <text x="83" y="208" fontFamily="var(--font-sans)" fontSize="15" fill="#aab2c2">Deutsches Rechenzentrum</text>

      {/* SERVER */}
      <g filter="url(#isDs)">
        <rect x="540" y="70" width="320" height="468" rx="22" fill="url(#isPanel)" stroke="#7c3aed" strokeOpacity="0.4" />
      </g>
      <g fill="#7c3aed" opacity="0.45">
        <circle cx="556" cy="86" r="2.4" />
        <circle cx="844" cy="86" r="2.4" />
        <circle cx="556" cy="522" r="2.4" />
        <circle cx="844" cy="522" r="2.4" />
      </g>
      <rect x="562" y="92" width="276" height="92" rx="12" fill="url(#isInset)" stroke="#7c3aed" strokeOpacity="0.25" />
      <circle className="srv-online" cx="582" cy="124" r="5" fill="#34d17b" />
      <text x="596" y="130" fontFamily="var(--font-mono)" fontSize="16" fill="#e7e3f0">deinefirma.de</text>
      <text x="816" y="129" textAnchor="end" fontFamily="var(--font-mono)" fontSize="12" letterSpacing="1.5" fill="#34d17b">ONLINE</text>
      <text x="578" y="156" fontFamily="var(--font-mono)" fontSize="12.5" fill="#9a8fb0">Nürnberg, DE</text>
      <text x="822" y="156" textAnchor="end" fontFamily="var(--font-mono)" fontSize="12.5" fill="#9a8fb0">PING 9 ms</text>
      <g fill="#9a5cf0">
        {TRAFFIC.map(([x, h], i) => (
          <rect
            key={i}
            className="srv-bar"
            x={x}
            y={176 - h + 8}
            width="3.5"
            height={h}
            rx="1"
            style={{ animationDelay: `${(i % 6) * 0.16}s` }}
          />
        ))}
      </g>
      {BAYS.map((b, i) => (
        <g key={i} transform={`translate(0,${b.y})`}>
          <rect x="562" y="200" width="276" height="54" rx="11" fill="#100d18" stroke="#000000" strokeOpacity="0.4" />
          <g stroke="#4a4360" strokeWidth="2.4" strokeLinecap="round">
            <line x1="582" y1="221" x2="598" y2="221" />
            <line x1="582" y1="227" x2="594" y2="227" />
            <line x1="582" y1="233" x2="598" y2="233" />
          </g>
          <rect x="616" y="224" width="150" height="3" rx="1.5" fill="#2a2540" />
          <circle className="srv-led" cx="800" cy="227" r="3.6" fill={ledFill(b.leds[0])} style={{ animationDelay: b.delay }} />
          <circle className="srv-led" cx="816" cy="227" r="3.6" fill={ledFill(b.leds[1])} style={{ animationDelay: `${parseFloat(b.delay) + 0.4}s` }} />
        </g>
      ))}

      {/* VERFÜGBARKEIT-Karte (nach links versetzt, damit der Website-Knoten frei steht) */}
      <g transform="translate(-70,0)">
        <g filter="url(#isDs)">
          <rect x="1000" y="100" width="360" height="212" rx="18" fill="url(#isPanel)" stroke="#7c3aed" strokeOpacity="0.35" />
        </g>
        <text x="1028" y="150" fontFamily="var(--font-mono)" fontSize="12.5" letterSpacing="3" fill="#9a5cf0">VERFÜGBARKEIT</text>
        <rect x="1250" y="132" width="92" height="28" rx="14" fill="#34d17b" fillOpacity="0.12" stroke="#34d17b" strokeOpacity="0.4" />
        <circle className="srv-online" cx="1270" cy="146" r="4" fill="#34d17b" />
        <text x="1283" y="151" fontFamily="var(--font-mono)" fontSize="11.5" letterSpacing="1.5" fill="#5fe39a">ONLINE</text>
        <text x="1026" y="232" fontFamily="var(--font-display)" fontWeight="700" fontSize="62" fill="url(#isBig)">99,99%</text>
        <text x="1028" y="262" fontFamily="var(--font-sans)" fontSize="15" fill="#aab2c2">Uptime · letzte 90 Tage</text>
        <g>
          {UPTIME.map((b, i) => (
            <rect key={i} x={b.x} y={300 - b.h} width="6" height={b.h} rx="2" fill={b.amber ? '#ffb04d' : '#34d17b'} />
          ))}
        </g>
      </g>
    </svg>
  )
}
