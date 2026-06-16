import { useEffect, useRef, useState } from 'react'
import { useScroll, useReducedMotion } from 'framer-motion'
import StationCard from './StationCard'

/*
 * JourneyRoad — eine kurvige Straße, die du beim Scrollen entlangfährst.
 *
 * EIN SVG-Pfad ist die einzige Wahrheitsquelle für (a) die sich selbst zeichnende
 * "gereiste" Straße (strokeDashoffset, pathLength=1), (b) den reisenden Lichtpunkt
 * (Position via vorberechnete Punkt-LUT entlang des Pfads) und (c) die fünf
 * Stationsanker. So sitzen Licht, Aufleuchten und Schilder garantiert deckungsgleich.
 *
 * Kein Pinning: Die Straße steht in voller Höhe im normalen Fluss, das SVG ist
 * h-auto (gleiche Aspect Ratio wie die viewBox) -> KEIN Letterboxing -> Karten
 * lassen sich exakt in Prozent platzieren. Bewegung folgt der GearScene-Doktrin:
 * eine rAF-Schleife, frameraten-unabhängig geglättet, parkt im Leerlauf. Pro Frame
 * nur Transform + drei strokeDashoffsets (compositor-billig), React-State ändert
 * sich nur bei Stationswechsel (5x).
 */

// Strichbreiten: asphalt/edge/Mittellinie behalten vector-effect:non-scaling-stroke
// (Breite = Screen-Px, fix). Die GEZEICHNETEN Pfade (halo/overlay/core) tragen KEIN
// non-scaling-stroke mehr — sonst misst der Browser den strokeDashoffset in Screen-Px
// statt in viewBox-Einheiten und der Strich läuft dem Lichtpunkt voraus (siehe apply()).
// Ohne non-scaling skaliert ihre Breite mit dem SVG, daher hier in viewBox-Einheiten
// angegeben (~px / Maßstab, Desktop ~0.576, Mobile ~0.73), damit die Optik gleich bleibt.
const ROAD = {
  desktop: {
    w: 1000,
    h: 8000,
    d: 'M 500 120 C 830 586, 830 1206, 500 1672 C 170 2138, 170 2758, 500 3224 C 830 3690, 830 4310, 500 4776 C 170 5242, 170 5862, 500 6328 C 830 6794, 830 7414, 500 7880',
    asphalt: 24,
    overlay: 12,
    halo: 29.5,
    core: 4.2,
  },
  mobile: {
    w: 480,
    h: 8400,
    d: 'M 240 120 C 390 610, 390 1262, 240 1752 C 90 2242, 90 2894, 240 3384 C 390 3874, 390 4526, 240 5016 C 90 5506, 90 6158, 240 6648 C 390 7138, 390 7790, 240 8280',
    asphalt: 20,
    overlay: 8,
    halo: 19,
    core: 2.7,
  },
}

const THRESH = [0.1, 0.3, 0.5, 0.7, 0.9]
// Vorlauf: Stationen leuchten schon auf, wenn das Licht noch diesen Bruchteil VOR
// dem Stationsanker ist -> die Station wird aktiv, während sie noch weiter unten im
// Bild ist (statt erst nahe am oberen Rand). Größerer Wert = früher/weiter unten.
const ACTIVATE_LEAD = 0.06

export default function JourneyRoad({ stations }) {
  const reduce = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const on = () => setIsMobile(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const rd = isMobile ? ROAD.mobile : ROAD.desktop

  const wrapRef = useRef(null)
  const pathRef = useRef(null)
  const haloRef = useRef(null)
  const overlayRef = useRef(null)
  const coreRef = useRef(null)
  const markerRef = useRef(null)
  const trail1Ref = useRef(null)
  const trail2Ref = useRef(null)
  const fogRef = useRef(null)

  const lenRef = useRef(0)
  const [anchors, setAnchors] = useState([]) // {x,y,side} in viewBox coords
  const [activeIndex, setActiveIndex] = useState(reduce ? stations.length - 1 : -1)

  // Das Licht soll beim Scrollen auf ~konstanter Bildschirmhöhe "fahren" (obere
  // Mitte), nicht von oben nach unten durchs Bild wandern. Mit ['start start',
  // 'end end'] war der Lichtpunkt an den vollen Section-Scroll gekoppelt: zu Beginn
  // klebte er am oberen Rand (Straße wirkte voraus, "Licht hinkt hinterher"), gegen
  // Ende rutschte er unter den unteren Rand -> die gezeichnete Straße füllte den
  // ganzen Schirm, der Verlauf voraus war nicht mehr zu sehen ("lila Linie überholt").
  // Gleicher Viewport-Anker (35 % von oben) für Start UND Ende hält das Licht nahezu
  // ortsfest: gereiste Straße oben, Straße voraus unten bleiben immer sichtbar.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 0.35', 'end 0.35'],
  })

  // Pfad messen -> Punkt-LUT + Stationsanker (einmal je Layout, nicht pro Frame).
  // Robust gegen Safari/WebKit: getTotalLength() liefert vor dem Layout teils 0 ->
  // dann säße der Marker am Startpunkt fest, während die Straße schon zeichnet
  // ("der Strich läuft dem Licht voraus"). Daher Retry bis len > 0, plus Re-Measure
  // bei load, und den Marker direkt auf die aktuelle Scroll-Position setzen.
  useEffect(() => {
    const path = pathRef.current
    if (!path) return undefined
    let cancelled = false
    let rafId = 0
    const measure = () => {
      if (cancelled) return
      const len = path.getTotalLength()
      if (!len) {
        rafId = requestAnimationFrame(measure)
        return
      }
      lenRef.current = len
      const a = THRESH.map((p) => {
        const pt = path.getPointAtLength(p * len)
        return { x: pt.x, y: pt.y, side: pt.x > rd.w / 2 ? 'right' : 'left' }
      })
      setAnchors(a)
      const prog = Math.max(0, Math.min(1, scrollYProgress.get()))
      const mp = path.getPointAtLength(prog * len)
      if (markerRef.current) {
        markerRef.current.setAttribute('transform', `translate(${mp.x} ${mp.y})`)
      }
    }
    measure()
    const onLoad = () => measure()
    window.addEventListener('load', onLoad)
    const t = setTimeout(measure, 350)
    return () => {
      cancelled = true
      window.removeEventListener('load', onLoad)
      clearTimeout(t)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [rd, scrollYProgress])

  // Marker-Position UND Straßen-Zeichnung speisen sich aus DERSELBEN gemessenen Länge
  // (getTotalLength), nicht mehr aus pathLength="1" vs getTotalLength. Sonst laufen
  // sie in Safari auseinander (Licht zu spät, Strich zu weit).
  const measuredLen = () => {
    let len = lenRef.current
    if (!len && pathRef.current) {
      len = pathRef.current.getTotalLength()
      if (len) lenRef.current = len
    }
    return len
  }
  const pointAt = (t) => {
    const path = pathRef.current
    const len = measuredLen()
    if (!len || !path) return [rd.w / 2, 0]
    const pt = path.getPointAtLength(Math.max(0, Math.min(1, t)) * len)
    return [pt.x, pt.y]
  }

  // rAF-Schleife (GearScene-Doktrin) — schreibt direkt in die Refs
  useEffect(() => {
    const setT = (ref, t) => {
      const [x, y] = pointAt(t)
      if (ref.current) ref.current.setAttribute('transform', `translate(${x} ${y})`)
    }
    const apply = (d) => {
      // Strich-Fortschritt über pathLength="1": die Dash-Mathematik rechnet in
      // NORMIERTER Länge (0..1) = derselbe Bruchteil d, mit dem das Licht via
      // getPointAtLength positioniert wird. Strich (Offset 1-d) und Licht teilen
      // sich d -> die Linie entsteht exakt dort, wo das Licht war. WICHTIG: die
      // gezeichneten Pfade dürfen KEIN vector-effect:non-scaling-stroke tragen,
      // sonst würde der Dashoffset in Screen-Px statt viewBox-Einheiten gemessen
      // und der Strich liefe dem Licht voraus (~1.74x bei 0.58x Downscale).
      const off = String(1 - d)
      for (const ref of [haloRef, overlayRef, coreRef]) {
        if (ref.current) {
          ref.current.style.strokeDasharray = '1 1'
          ref.current.style.strokeDashoffset = off
        }
      }
      setT(markerRef, d)
      setT(trail1Ref, d - 0.006)
      setT(trail2Ref, d - 0.013)
      // Licht löst sich am Ziel sanft auf (passend zur weich ausgeblendeten Straße),
      // statt als harter Punkt im Dunkeln zu enden. Reduced-motion: sichtbar lassen.
      if (!reduce) {
        const tail = 1 - Math.max(0, Math.min(1, (d - 0.93) / 0.06))
        if (markerRef.current) markerRef.current.style.opacity = String(tail)
        if (trail1Ref.current) trail1Ref.current.style.opacity = String(0.4 * tail)
        if (trail2Ref.current) trail2Ref.current.style.opacity = String(0.22 * tail)
      }
      if (fogRef.current) {
        fogRef.current.style.opacity = String(Math.max(0, Math.min(1, (d - 0.82) / 0.16)))
      }
      let idx = -1
      for (let i = 0; i < THRESH.length; i++) if (d >= THRESH[i] - ACTIVATE_LEAD) idx = i
      setActiveIndex((prev) => (prev === idx ? prev : idx))
    }

    if (reduce) {
      let raf = 0
      const draw = () => {
        apply(1)
        if (!lenRef.current) raf = requestAnimationFrame(draw)
      }
      draw()
      return () => {
        if (raf) cancelAnimationFrame(raf)
      }
    }

    const TAU = 0.06
    const EPS = 0.0006
    let displayed = Math.max(0, Math.min(1, scrollYProgress.get()))
    let lastT = 0
    let running = false
    let rafId = 0

    const tick = (now) => {
      if (!running) return
      if (!lastT) lastT = now - 16
      let dt = (now - lastT) / 1000
      lastT = now
      if (dt > 0.1) dt = 0.1
      const target = Math.max(0, Math.min(1, scrollYProgress.get()))
      const alpha = 1 - Math.exp(-dt / TAU)
      displayed += (target - displayed) * alpha
      const atTarget = Math.abs(target - displayed) < EPS
      if (atTarget) displayed = target
      apply(displayed)
      if (atTarget) {
        running = false
        rafId = 0
        return
      }
      rafId = requestAnimationFrame(tick)
    }
    const startLoop = () => {
      if (running) return
      running = true
      lastT = 0
      rafId = requestAnimationFrame(tick)
    }

    apply(displayed)
    const unsub = scrollYProgress.on('change', startLoop)
    startLoop()
    return () => {
      running = false
      unsub()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [reduce, rd, scrollYProgress, stations.length])

  // Anfangszustand der "gereisten" Straße: nichts gezeichnet (apply() setzt dann
  // den Dashoffset). Über pathLength="1" ist die volle Länge = 1 -> Offset 1 = leer.
  // Bei reduced-motion direkt voll.
  const initDraw = reduce ? {} : { strokeDasharray: '1 1', strokeDashoffset: 1 }

  return (
    <section
      ref={wrapRef}
      className="relative z-10"
      aria-label="Der Ablauf als Reise entlang einer Straße"
    >
      {/* Sonnenaufgang am Ziel — über die VOLLE Breite (nicht in der schmalen
          Straßen-Spalte, sonst wirkt es wie ein rechteckiges Band). Der Glow saß
          früher am unteren Rand am hellsten und wurde von der Section-Kante hart
          abgeschnitten (gerade Linie Warm->Schwarz). Daher: Verlauf etwas nach oben
          gezogen + maskImage blendet den unteren Rand weich auf transparent aus. */}
      <div
        ref={fogRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%]"
        style={{
          opacity: reduce ? 1 : 0,
          background:
            'radial-gradient(50% 58% at 50% 74%, rgba(255,176,77,0.20), transparent 72%), radial-gradient(72% 68% at 50% 70%, rgba(191,90,242,0.10), transparent 70%)',
          maskImage: 'linear-gradient(to top, transparent 0%, #000 24%, #000 100%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, #000 24%, #000 100%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[36rem] px-5 sm:px-0">
        {/* atmosphere */}
        <div className="grid-bg absolute inset-0 -z-10 opacity-50" />

        <svg
          viewBox={`0 0 ${rd.w} ${rd.h}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-auto w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="roadWarm" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={rd.h}>
              <stop offset="0" stopColor="#8b3df0" />
              <stop offset="0.55" stopColor="#bf5af2" />
              <stop offset="1" stopColor="#ffb04d" />
            </linearGradient>
            <radialGradient id="markerGlow">
              <stop offset="0" stopColor="#ffb04d" stopOpacity="0.9" />
              <stop offset="0.4" stopColor="#ffb04d" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ffb04d" stopOpacity="0" />
            </radialGradient>
            {/* Die Straße löst sich am Ziel weich auf (statt harter Kappe ins Schwarz).
                Ausblendung beginnt UNTER der letzten Station (~0.91 der Höhe) und ist
                vor dem Pfad-Ende (0.985) komplett transparent -> kein harter Rand. */}
            <linearGradient id="roadFade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={rd.h}>
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.91" stopColor="#fff" />
              <stop offset="0.97" stopColor="#000" />
            </linearGradient>
            <mask id="roadMask">
              <rect width={rd.w} height={rd.h} fill="url(#roadFade)" />
            </mask>
          </defs>

          {/* gesamte Straße (Asphalt + gereister Glow) wird am unteren Ende
              ausgeblendet, damit sie in den Sonnenaufgang-Glow übergeht statt
              hart abzubrechen. Stationsknoten + reisendes Licht bleiben außerhalb. */}
          <g mask="url(#roadMask)">
          {/* 1. Asphalt-Basis (misst auch den Pfad) */}
          <path
            ref={pathRef}
            d={rd.d}
            fill="none"
            stroke="#1a1e29"
            strokeWidth={rd.asphalt}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* feine Kante */}
          <path
            d={rd.d}
            fill="none"
            stroke="var(--color-line-2)"
            strokeWidth={rd.asphalt + 2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ opacity: 0.5 }}
          />
          <path
            d={rd.d}
            fill="none"
            stroke="#1a1e29"
            strokeWidth={rd.asphalt}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Mittellinie, fließend */}
          <path
            className="road-dash"
            d={rd.d}
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="2"
            strokeDasharray="2 26"
            vectorEffect="non-scaling-stroke"
          />

          {/* gereiste Straße: Halo + Verlauf + heller Kern, teilen den Dashoffset */}
          {/* KEIN vector-effect:non-scaling-stroke hier — sonst würde der
              strokeDashoffset in Screen-Px statt viewBox-Einheiten gemessen und der
              Strich liefe dem Lichtpunkt voraus. Breiten stehen daher in viewBox-
              Einheiten (siehe ROAD). */}
          <path
            ref={haloRef}
            d={rd.d}
            pathLength="1"
            fill="none"
            stroke="var(--color-spark)"
            strokeWidth={rd.halo}
            strokeLinecap="round"
            style={{ ...initDraw, opacity: 0.16 }}
          />
          <path
            ref={overlayRef}
            d={rd.d}
            pathLength="1"
            fill="none"
            stroke="url(#roadWarm)"
            strokeWidth={rd.overlay}
            strokeLinecap="round"
            style={initDraw}
          />
          <path
            ref={coreRef}
            d={rd.d}
            pathLength="1"
            fill="none"
            stroke="#fff"
            strokeWidth={rd.core}
            strokeLinecap="round"
            style={{ ...initDraw, opacity: 0.85 }}
          />
          </g>

          {/* Stationsknoten auf der Straße */}
          {anchors.map((a, i) => (
            <g key={i}>
              <circle
                cx={a.x}
                cy={a.y}
                r="13"
                fill="var(--color-base)"
                stroke={activeIndex >= i ? 'var(--color-spark)' : 'var(--color-line-2)'}
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />
              {activeIndex >= i && (
                <circle cx={a.x} cy={a.y} r="5" fill="var(--color-spark)" />
              )}
            </g>
          ))}

          {/* reisendes Licht: Schweif + Halo + Kern */}
          <circle ref={trail2Ref} r="5" fill="var(--color-spark)" style={{ opacity: reduce ? 0 : 0.22 }} />
          <circle ref={trail1Ref} r="7.5" fill="var(--color-spark)" style={{ opacity: reduce ? 0 : 0.4 }} />
          <g ref={markerRef}>
            {/* mehrschichtiges Glühen: der Kopf schmilzt weich in den Asphalt voraus,
                statt als harte helle Kappe abzubrechen ("Licht hart abgeschnitten") */}
            <circle r="120" fill="url(#markerGlow)" style={{ opacity: 0.3 }} />
            <circle r="56" fill="url(#markerGlow)" />
            <circle r="9.5" fill="var(--color-spark)" />
            <circle r="3.6" fill="#fff" />
          </g>
        </svg>

        {/* Karten-Ebene: liegt deckungsgleich über dem SVG (gleiche Aspect Ratio) */}
        <div className="pointer-events-none absolute inset-0">
          {anchors.map((a, i) => {
            const leftPct = (a.x / rd.w) * 100
            const topPct = (a.y / rd.h) * 100
            const st = stations[i]
            if (!st) return null
            const style = isMobile
              ? { top: `${topPct}%`, left: '50%', transform: 'translate(-50%, 1.1rem)', width: '88%' }
              : {
                  top: `${topPct}%`,
                  left: `${leftPct}%`,
                  transform:
                    a.side === 'right'
                      ? 'translate(2rem, -50%)'
                      : 'translate(calc(-100% - 2rem), -50%)',
                }
            return (
              <div
                key={i}
                className="pointer-events-auto absolute w-[clamp(16.5rem,26vw,22.5rem)]"
                style={style}
              >
                <StationCard
                  eyebrow={`Station 0${i + 1}`}
                  title={st.title}
                  body={st.body}
                  icon={st.icon}
                  lit={reduce ? true : activeIndex >= i}
                  reduce={reduce}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
