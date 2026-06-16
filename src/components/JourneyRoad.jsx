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

const ROAD = {
  desktop: {
    w: 1000,
    h: 8000,
    d: 'M 500 120 C 830 586, 830 1206, 500 1672 C 170 2138, 170 2758, 500 3224 C 830 3690, 830 4310, 500 4776 C 170 5242, 170 5862, 500 6328 C 830 6794, 830 7414, 500 7880',
    asphalt: 24,
    overlay: 7,
    halo: 17,
    core: 2.4,
  },
  mobile: {
    w: 480,
    h: 8400,
    d: 'M 240 120 C 390 610, 390 1262, 240 1752 C 90 2242, 90 2894, 240 3384 C 390 3874, 390 4526, 240 5016 C 90 5506, 90 6158, 240 6648 C 390 7138, 390 7790, 240 8280',
    asphalt: 20,
    overlay: 6,
    halo: 14,
    core: 2,
  },
}

const THRESH = [0.1, 0.3, 0.5, 0.7, 0.9]

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

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
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
      const len = measuredLen()
      if (len) {
        const arr = `${len} ${len}`
        const off = String((1 - d) * len)
        for (const ref of [haloRef, overlayRef, coreRef]) {
          if (ref.current) {
            ref.current.style.strokeDasharray = arr
            ref.current.style.strokeDashoffset = off
          }
        }
      }
      setT(markerRef, d)
      setT(trail1Ref, d - 0.006)
      setT(trail2Ref, d - 0.013)
      if (fogRef.current) {
        fogRef.current.style.opacity = String(Math.max(0, Math.min(1, (d - 0.82) / 0.16)))
      }
      let idx = -1
      for (let i = 0; i < THRESH.length; i++) if (d >= THRESH[i]) idx = i
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
  // dasharray/offset aus der gemessenen Länge). Bei reduced-motion direkt voll.
  const initDraw = reduce ? {} : { strokeDasharray: '0 99999' }

  return (
    <section
      ref={wrapRef}
      className="relative z-10"
      aria-label="Der Ablauf als Reise entlang einer Straße"
    >
      {/* Sonnenaufgang am Ziel — über die VOLLE Breite (nicht in der schmalen
          Straßen-Spalte, sonst wirkt es wie ein rechteckiges Band). Nur Opacity
          animiert, weiche Radials ohne harte Kanten. */}
      <div
        ref={fogRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          opacity: reduce ? 1 : 0,
          background:
            'radial-gradient(38% 50% at 50% 100%, rgba(255,176,77,0.22), transparent 70%), radial-gradient(62% 62% at 50% 100%, rgba(191,90,242,0.10), transparent 66%)',
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
          </defs>

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
          <path
            ref={haloRef}
            d={rd.d}
            fill="none"
            stroke="var(--color-spark)"
            strokeWidth={rd.halo}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ ...initDraw, opacity: 0.16 }}
          />
          <path
            ref={overlayRef}
            d={rd.d}
            fill="none"
            stroke="url(#roadWarm)"
            strokeWidth={rd.overlay}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={initDraw}
          />
          <path
            ref={coreRef}
            d={rd.d}
            fill="none"
            stroke="#fff"
            strokeWidth={rd.core}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ ...initDraw, opacity: 0.85 }}
          />

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
            <circle r="42" fill="url(#markerGlow)" />
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
                className="pointer-events-auto absolute w-[clamp(15rem,23vw,20rem)]"
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
