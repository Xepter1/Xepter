/**
 * ServerScene — „Dein Server in Nürnberg" als gebautes SVG-Objekt (NAS-Stil) mit
 * lebenden Status-LEDs, Traffic-Display und fließenden Datenleitungen dahinter.
 *
 * Animationen laufen über CSS (s. index.css: srv-*, dataflow) — robust, kein rAF/JS,
 * respektiert prefers-reduced-motion automatisch.
 */

// Laufwerks-Schächte: y-Offset + LED-Farbe ('g' grün = ok, 'a' amber = Aktivität)
const BAYS = [
  { y: 0, led: 'g', delay: '0s' },
  { y: 40, led: 'g', delay: '1.3s' },
  { y: 80, led: 'a', delay: '0.6s' },
  { y: 120, led: 'g', delay: '2.2s' },
  { y: 160, led: 'g', delay: '1.7s' },
]

// Traffic-Balken im Display (x, Höhe) + Animations-Delay
const BARS = [
  [113, 6], [119, 10], [125, 8], [131, 13], [137, 5],
  [143, 9], [149, 7], [155, 12], [161, 6], [167, 8],
]

// Datenleitungen: links laufen Anfragen LILA in den Server, rechts laufen
// Antworten GRÜN heraus. Pfade enden/starten hinter dem Server-Korpus.
const FLOWS_IN = [
  { d: 'M-30 80 C 50 60, 100 100, 150 96', delay: '0s' },
  { d: 'M-30 150 C 50 146, 100 152, 150 150', delay: '0.8s' },
  { d: 'M-30 220 C 45 236, 100 202, 150 206', delay: '0.4s' },
]
const FLOWS_OUT = [
  { d: 'M270 96 C 320 100, 370 60, 450 78', delay: '0.5s' },
  { d: 'M270 150 C 330 150, 390 150, 450 150', delay: '1.3s' },
  { d: 'M270 206 C 320 200, 380 240, 450 222', delay: '0.2s' },
]

export default function ServerScene() {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* Datenfluss-Hintergrund */}
      <svg
        viewBox="0 0 420 300"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Glasfaser, an den Enden ausgeblendet — lila (rein) & grün (raus) */}
          <linearGradient id="dfLila" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b98cf7" stopOpacity="0" />
            <stop offset="0.55" stopColor="#b98cf7" stopOpacity="0.95" />
            <stop offset="1" stopColor="#b98cf7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dfGreen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#34d17b" stopOpacity="0" />
            <stop offset="0.45" stopColor="#34d17b" stopOpacity="0.95" />
            <stop offset="1" stopColor="#34d17b" stopOpacity="0" />
          </linearGradient>
          <filter id="dfGlowV" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#c9a4f7" floodOpacity="0.9" />
          </filter>
          <filter id="dfGlowG" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#7dffb0" floodOpacity="0.9" />
          </filter>
        </defs>
        {/* lila: Anfragen laufen links in den Server */}
        {FLOWS_IN.map((f, i) => (
          <g key={`in${i}`}>
            <path d={f.d} fill="none" stroke="url(#dfLila)" strokeOpacity="0.22" strokeWidth="1.4" />
            <path
              className="dataflow"
              d={f.d}
              fill="none"
              stroke="url(#dfLila)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#dfGlowV)"
              style={{ animationDelay: f.delay }}
            />
          </g>
        ))}
        {/* grün: Antworten laufen rechts aus dem Server */}
        {FLOWS_OUT.map((f, i) => (
          <g key={`out${i}`}>
            <path d={f.d} fill="none" stroke="url(#dfGreen)" strokeOpacity="0.22" strokeWidth="1.4" />
            <path
              className="dataflow"
              d={f.d}
              fill="none"
              stroke="url(#dfGreen)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#dfGlowG)"
              style={{ animationDelay: f.delay }}
            />
          </g>
        ))}
      </svg>

      {/* Server */}
      <svg
        viewBox="0 0 360 364"
        className="relative z-10 mx-auto block w-full max-w-[300px]"
        role="img"
        aria-label="Ein Server in Nürnberg, der die Website rund um die Uhr betreibt"
      >
        <defs>
          <linearGradient id="srvChassis" x1="0.15" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="#322b47" />
            <stop offset="0.45" stopColor="#1a1623" />
            <stop offset="1" stopColor="#0b0911" />
          </linearGradient>
          <linearGradient id="srvRail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#241f31" />
            <stop offset="0.5" stopColor="#15111d" />
            <stop offset="1" stopColor="#241f31" />
          </linearGradient>
          <linearGradient id="srvBay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#221d30" />
            <stop offset="1" stopColor="#100d18" />
          </linearGradient>
          <linearGradient id="srvHandle" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a3350" />
            <stop offset="1" stopColor="#211c2e" />
          </linearGradient>
          <radialGradient id="srvScreen" cx="0.5" cy="0.35" r="0.8">
            <stop offset="0" stopColor="#1d1138" />
            <stop offset="1" stopColor="#06050a" />
          </radialGradient>
          <radialGradient id="srvHalo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#8b3df0" stopOpacity="0.30" />
            <stop offset="1" stopColor="#8b3df0" stopOpacity="0" />
          </radialGradient>
          <filter id="srvShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="24" stdDeviation="22" floodColor="#000000" floodOpacity="0.7" />
          </filter>
          <filter id="srvG" x="-300%" y="-300%" width="700%" height="700%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="#34d17b" floodOpacity="0.95" />
          </filter>
          <filter id="srvA" x="-300%" y="-300%" width="700%" height="700%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="#ffb04d" floodOpacity="0.95" />
          </filter>
        </defs>

        <ellipse cx="180" cy="180" rx="175" ry="160" fill="url(#srvHalo)" />

        {/* Chassis */}
        <g filter="url(#srvShadow)">
          <rect x="84" y="20" width="192" height="324" rx="22" fill="url(#srvChassis)" stroke="#7c3aed" strokeOpacity="0.38" strokeWidth="1.5" />
          <rect x="84" y="20" width="192" height="3" rx="1.5" fill="#ffffff" opacity="0.11" />
        </g>

        {/* Rack-Schienen */}
        <rect x="96" y="120" width="9" height="206" rx="3" fill="url(#srvRail)" />
        <rect x="255" y="120" width="9" height="206" rx="3" fill="url(#srvRail)" />
        <g fill="#0a0810">
          <circle cx="100.5" cy="130" r="1.6" />
          <circle cx="100.5" cy="318" r="1.6" />
          <circle cx="259.5" cy="130" r="1.6" />
          <circle cx="259.5" cy="318" r="1.6" />
        </g>

        {/* Display */}
        <rect x="98" y="34" width="164" height="70" rx="10" fill="url(#srvScreen)" stroke="#7c3aed" strokeOpacity="0.45" />
        <text x="113" y="58" fontFamily="ui-monospace, monospace" fontSize="12.5" fill="#e7c9ff" letterSpacing="0.3">
          deinefirma.de
        </text>
        <circle className="srv-online" cx="117" cy="76" r="3.6" fill="#34d17b" filter="url(#srvG)" />
        <text x="128" y="80" fontFamily="ui-monospace, monospace" fontSize="10.5" fill="#c3b8d6">
          online · Nürnberg
        </text>
        <g fill="#9a5cf0">
          {BARS.map(([x, h], i) => (
            <rect
              key={i}
              className="srv-bar"
              x={x}
              y={96 - h + 13}
              width="3"
              height={h}
              rx="1"
              style={{ animationDelay: `${(i % 5) * 0.18}s` }}
            />
          ))}
        </g>

        {/* Laufwerks-Schächte */}
        {BAYS.map((b, i) => (
          <g key={i} transform={`translate(0,${b.y})`}>
            <rect x="110" y="124" width="140" height="34" rx="6" fill="url(#srvBay)" stroke="#000000" strokeOpacity="0.45" />
            <rect x="117" y="131" width="10" height="20" rx="3" fill="url(#srvHandle)" />
            <rect x="135" y="138" width="66" height="2.4" rx="1.2" fill="#36304a" />
            <circle
              className="srv-led"
              cx="238"
              cy="141"
              r="3.4"
              fill={b.led === 'a' ? '#ffb04d' : '#34d17b'}
              filter={b.led === 'a' ? 'url(#srvA)' : 'url(#srvG)'}
              style={{ animationDelay: b.delay }}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
