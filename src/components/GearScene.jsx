import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { EASE } from '../lib/anim'

/**
 * GearScene — scroll-driven exploded-view scrub (Apple-style), wiederverwendbar.
 *
 * Frames liegen als transparente RGBA-WebP in /public/<dir>/{d,m}/<i>.webp (gegen reines
 * Schwarz freigestellt, s. scripts/process_gear_frames.py). Sie compositen über die dunkle
 * Seite per Canvas-Alpha — kein mix-blend-mode (den isoliert der animierte Wrapper, das
 * schwarze Frame bliebe als Kasten). Ein gepinntes (sticky) Viewport mappt den rohen
 * Scroll-Fortschritt auf eine FLOAT-Frameposition (keine Feder → kein Nachziehen).
 *
 * Glättung: vor-dekodierte ImageBitmaps (drawImage = billiger Blit, kein WebP-Re-Decode),
 * rAF-Coalescing (max. 1 Draw je Display-Frame) und ein Cross-Fade zwischen den zwei
 * benachbarten Frames (unterer deckt, oberer mit alpha=Bruchteil drüber) — das füllt die
 * Lücken zwischen den 97 diskreten Frames, sodass die Bewegung nicht „hält und springt".
 * Im Ruhezustand (140 ms ohne Scroll) rastet sie auf den exakten ganzen Frame ein → scharf.
 * Progressives Laden (jeder 3. Frame zuerst, fehlende → nächstgelegener geladener).
 * Mobil: nur jeder 2. Frame dekodiert + niedrigere Canvas-DPR.
 *
 * Props:
 *  dir          Asset-Ordner unter /public (z.B. 'gear' = Objektiv, 'burger').
 *  frameCount/frameW/frameH   aus dem Skript-Output (drucken bei jedem Lauf).
 *  side         'right' = Bild rechts/Text links (Default), 'left' = gespiegelt.
 *  reverse      true, wenn das Video rückwärts ist (Frame 0 = zusammengebaut sonst).
 *  eyebrow/headline/body   Texte der Sektion.
 */
export default function GearScene({
  dir = 'gear',
  frameCount = 97,
  frameW = 1500,
  frameH = 902,
  side = 'right',
  reverse = false,
  still = 0,
  eyebrow = 'Motion',
  headline = ['Sie wollen', 'aufwendige', 'Animationen?'],
  body = 'Dann scroll langsam weiter. Das Objektiv zerlegt sich in seine Einzelteile und setzt sich rückwärts wieder zusammen. Direkt im Browser, butterweich, ohne Plugins.',
}) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const counterRef = useRef(null)
  const reduce = useReducedMotion()

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const on = () => setIsMobile(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  })
  // subtle parallax: the copy drifts up gently while the object scrubs
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90])
  // mobile only: the copy overlay fades out early so the full object is free
  const copyOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0])
  // mobile only: dim the object during the first phase so the copy reads cleanly,
  // then lift the dim to reveal the full bright object
  const dimOpacity = useTransform(scrollYProgress, [0, 0.3], [0.55, 0])

  const imgLeft = side === 'left'

  useEffect(() => {
    if (reduce) return undefined
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return undefined

    const ctx = canvas.getContext('2d')
    const folder = window.matchMedia('(max-width: 1023px)').matches ? 'm' : 'd'
    const srcOf = (i) => `/${dir}/${folder}/${i}.webp`
    const bitmaps = new Array(frameCount).fill(null)
    let alive = true
    let lastDrawn = -1            // zuletzt gezeichnete FLOAT-Position (nicht nur ganzer Index)
    // Frame am Sektions-Anfang (progress 0) je nach Laufrichtung — als Float gehalten
    let current = reverse ? frameCount - 1 : 0
    let rafId = 0
    let snapTimer = 0
    let lastChangeTs = 0

    // nächstgelegener tatsächlich geladener Frame zu i (mobil ist nur jeder 2.
    // dekodiert → die Lücke füllt der Nachbar; anfangs ist evtl. noch nichts da → -1)
    const nearestLoaded = (i) => {
      const j = Math.max(0, Math.min(frameCount - 1, i))
      if (bitmaps[j]) return j
      for (let off = 1; off < frameCount; off++) {
        if (j - off >= 0 && bitmaps[j - off]) return j - off
        if (j + off < frameCount && bitmaps[j + off]) return j + off
      }
      return -1
    }

    // Zeichnet eine FLOAT-Position als Cross-Fade zwischen den zwei GELADENEN
    // Frames, die die Position einklammern: der untere deckt voll, der obere wird
    // mit alpha = Gewicht drübergeblendet. Das Gewicht ist die echte relative Lage
    // zwischen den beiden geladenen Frames — funktioniert daher auch, wenn mobil nur
    // jeder 2. Frame dekodiert ist (Klammer 2 Frames breit), ohne je zwei nicht
    // zusammengehörige Frames zu mischen (das wäre Ghosting). So läuft die Bewegung
    // kontinuierlich statt in Stufen zu „halten und springen" (= Hauptursache des
    // Ruckelns), und das ohne zeitliche Verzögerung (Position == roher Scroll-Stand).
    const draw = (pos) => {
      const p = pos < 0 ? 0 : pos > frameCount - 1 ? frameCount - 1 : pos
      const lo = Math.floor(p)
      // untere Klammer: nächster geladener Frame an/unter lo (sonst der nächste darüber)
      let a = -1
      for (let k = lo; k >= 0; k--) { if (bitmaps[k]) { a = k; break } }
      if (a < 0) { for (let k = lo + 1; k < frameCount; k++) { if (bitmaps[k]) { a = k; break } } }
      if (a < 0) return
      // obere Klammer: nächster geladener Frame über a
      let b = -1
      for (let k = a + 1; k < frameCount; k++) { if (bitmaps[k]) { b = k; break } }

      const { width: cw, height: chgt } = canvas
      // contain-fit
      const s = Math.min(cw / frameW, chgt / frameH)
      const w = frameW * s
      const h = frameH * s
      const dx = (cw - w) / 2
      const dy = (chgt - h) / 2
      ctx.clearRect(0, 0, cw, chgt)
      ctx.globalAlpha = 1
      ctx.drawImage(bitmaps[a], dx, dy, w, h)
      // oberen Frame nur dazublenden, wenn er existiert UND wir spürbar zwischen den
      // beiden geladenen Frames stehen (spart bei frac≈0 den zweiten Blit)
      if (b > a) {
        let frac = (p - a) / (b - a)
        if (frac > 0.02) {
          if (frac > 1) frac = 1
          ctx.globalAlpha = frac
          ctx.drawImage(bitmaps[b], dx, dy, w, h)
          ctx.globalAlpha = 1
        }
      }
      lastDrawn = p
      if (counterRef.current) {
        const n = Math.min(frameCount, Math.round(p) + 1)
        counterRef.current.textContent = String(n).padStart(2, '0')
      }
    }

    // coalesce draws to one per display frame
    const scheduleDraw = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        if (!alive) return
        draw(current)
      })
    }

    // Steht der Scroll still (140 ms ohne Änderung), exakt auf den nächstgelegenen
    // GELADENEN Frame einrasten → das Standbild ist gestochen scharf (kein
    // halbtransparenter Zwischenframe im Ruhezustand). Während der Bewegung bleibt der
    // Cross-Fade aktiv. Ein sich selbst nachstellender Timer (statt clear/set bei jedem
    // Scroll-Event) hält die Debounce-Semantik ohne Allokations-Müll je Scroll-Tick.
    const SNAP_MS = 140
    const runSnap = () => {
      const idle = performance.now() - lastChangeTs
      if (idle < SNAP_MS) {
        snapTimer = setTimeout(runSnap, SNAP_MS - idle) // Scroll lief weiter → nachstellen
        return
      }
      snapTimer = 0
      if (!alive) return
      const snapped = nearestLoaded(Math.round(current))
      if (snapped >= 0 && snapped !== lastDrawn) {
        current = snapped
        draw(snapped)
      }
    }
    const scheduleSnap = () => {
      lastChangeTs = performance.now()
      if (!snapTimer) snapTimer = setTimeout(runSnap, SNAP_MS)
    }

    const load = async (i) => {
      try {
        const res = await fetch(srcOf(i))
        const blob = await res.blob()
        const bmp = await createImageBitmap(blob)
        if (!alive) return
        bitmaps[i] = bmp
        if (lastDrawn === -1 || Math.abs(i - current) < Math.abs(lastDrawn - current)) {
          draw(current)
        }
      } catch {
        /* einzelner Frame fehlgeschlagen: nearest-loaded Fallback greift */
      }
    }

    const loadAll = async () => {
      // Handy: nur jeden 2. Frame dekodieren -> halber RAM (decodierte Bitmaps sind
      // teuer); der nearest-loaded Fallback zeichnet für ungerade Indizes den Nachbarn.
      const step = folder === 'm' ? 2 : 1
      const idxs = []
      for (let i = 0; i < frameCount; i += step) idxs.push(i)
      const pass1 = idxs.filter((_, k) => k % 3 === 0)
      const pass2 = idxs.filter((_, k) => k % 3 !== 0)
      await Promise.all(pass1.map(load))
      if (alive) await Promise.all(pass2.map(load))
    }

    const resize = () => {
      // DPR bei 2 gedeckelt (auf 3x-Handys spart das Fill-Rate, ohne sichtbar weicher
      // zu sein). Schärfe kommt v.a. aus der Quell-Frame-Breite (s. Skript-Presets).
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      if (lastDrawn >= 0) draw(lastDrawn)
      else draw(current)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    // Frames erst laden, wenn die Sektion in die Nähe des Viewports kommt. Spart den
    // Initial-Load: die 2. Sektion (Objektiv) lädt erst beim Heranscrollen, nicht
    // schon beim Seitenaufruf. Die 1. Sektion ist sofort in Reichweite -> lädt direkt.
    let loadStarted = false
    const io = new IntersectionObserver(
      (entries) => {
        if (!loadStarted && entries.some((e) => e.isIntersecting)) {
          loadStarted = true
          io.disconnect()
          loadAll()
        }
      },
      { rootMargin: '120% 0px' }
    )
    io.observe(wrap)

    const unsub = scrollYProgress.on('change', (v) => {
      const raw = v * (frameCount - 1) // FLOAT, nicht runden → Cross-Fade kann interpolieren
      current = Math.max(0, Math.min(frameCount - 1, reverse ? frameCount - 1 - raw : raw))
      scheduleDraw()
      scheduleSnap()
    })

    return () => {
      alive = false
      unsub()
      ro.disconnect()
      io.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
      if (snapTimer) clearTimeout(snapTimer)
      bitmaps.forEach((b) => b && b.close && b.close())
    }
  }, [scrollYProgress, reduce, dir, frameCount, frameW, frameH, reverse])

  // Reduced motion: a single static image instead of the pinned scrub
  if (reduce) {
    return (
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <div className={imgLeft ? 'lg:order-2' : ''}>
            {eyebrow && <p className="eyebrow !text-spark mb-5">{eyebrow}</p>}
            <h1 className="font-display text-[clamp(2.2rem,6vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              {headline.join(' ')}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-dim">
              {body}
            </p>
          </div>
          <img
            src={`/${dir}/d/${still}.webp`}
            alt={`Explosionsdarstellung${eyebrow ? `, ${eyebrow}` : ''}`}
            width={frameW}
            height={frameH}
            className={`w-full ${imgLeft ? 'lg:order-1' : ''}`}
            loading="lazy"
          />
        </div>
      </section>
    )
  }

  return (
    <section ref={wrapRef} className="relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* atmosphere */}
        <div className="grid-bg absolute inset-0" />
        {/* Mobile: dezenter Glow mittig hinter dem Objekt, OHNE teuren blur-Filter
            (würde den Scroll-Scrub auf dem Handy recompositen lassen). */}
        <div
          className="pointer-events-none absolute lg:hidden"
          style={{
            width: 420,
            height: 420,
            left: '50%',
            bottom: '10%',
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            zIndex: 0,
            background:
              'radial-gradient(circle, rgba(139,61,240,0.16), transparent 70%)',
          }}
        />
        {/* Desktop: seitliche Glows, je nach Seite gespiegelt */}
        <div
          className="glow hidden lg:block"
          style={{
            width: 640,
            height: 640,
            top: '6%',
            ...(imgLeft ? { left: '-8%' } : { right: '-8%' }),
            background:
              'radial-gradient(circle, rgba(139,61,240,0.2), transparent 60%)',
          }}
        />
        <div
          className="glow hidden lg:block"
          style={{
            width: 420,
            height: 420,
            bottom: '0%',
            ...(imgLeft ? { right: '-6%' } : { left: '-6%' }),
            background:
              'radial-gradient(circle, rgba(255,176,77,0.07), transparent 60%)',
          }}
        />

        <div
          className={`relative z-10 h-full w-full lg:mx-auto lg:grid lg:h-auto lg:max-w-7xl lg:items-center lg:gap-12 lg:px-8 ${
            imgLeft ? 'lg:grid-cols-[1.1fr_0.9fr]' : 'lg:grid-cols-[0.9fr_1.1fr]'
          }`}
        >
          {/* Copy — mobil ausblendendes Overlay oben, Desktop normale Spalte */}
          <motion.div
            style={{ y: copyY, opacity: isMobile ? copyOpacity : undefined }}
            className={`absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-base from-30% via-base/80 to-transparent px-5 pb-20 pt-24 sm:px-8 lg:static lg:z-auto lg:bg-none lg:p-0 lg:pb-0 ${
              imgLeft ? 'lg:order-2' : ''
            }`}
          >
            {eyebrow && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                className="eyebrow !text-spark mb-5"
              >
                {eyebrow}
              </motion.p>
            )}
            <h1 className="font-display text-[clamp(2.2rem,6vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              {headline.map((t, i) => (
                <span key={t} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1, delay: 0.25 + i * 0.1, ease: EASE }}
                  >
                    {t}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
              className="mt-6 max-w-md text-lg leading-relaxed text-ink-dim"
            >
              {body}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="mt-8 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-ink-faint"
            >
              Scroll · Frame{' '}
              <span ref={counterRef} className="text-spark">
                01
              </span>
              /{frameCount}
            </motion.p>
          </motion.div>

          {/* Object — mobil füllt es den ganzen Viewport (voll sichtbar, nichts
              abgeschnitten), Desktop sitzt es in der Spalte. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            className={`absolute inset-0 z-10 flex items-center justify-center px-4 lg:relative lg:inset-auto lg:z-auto lg:block lg:px-0 ${
              imgLeft ? 'lg:order-1' : ''
            }`}
          >
            <canvas
              ref={canvasRef}
              aria-label={`Explosionsdarstellung, gesteuert durch Scrollen${eyebrow ? ` (${eyebrow})` : ''}`}
              role="img"
              style={{ aspectRatio: `${frameW} / ${frameH}` }}
              className="h-full w-full lg:mx-auto lg:h-auto lg:max-h-[78svh]"
            />
          </motion.div>

          {/* Mobile: Abdunklung über dem Objekt in der ersten Phase (hebt den Text
              ab), löst beim Scrollen mit auf. Liegt über dem Canvas (z-10), unter
              der Copy (z-20). Auf Desktop ausgeblendet. */}
          <motion.div
            aria-hidden="true"
            style={{ opacity: dimOpacity }}
            className="pointer-events-none absolute inset-0 z-10 bg-base lg:hidden"
          />
        </div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        >
          <span className="flex h-9 w-5 justify-center rounded-full border border-line-2 pt-1.5">
            <span className="scroll-dot h-1.5 w-1.5 rounded-full bg-spark" />
          </span>
        </motion.div>
      </div>
    </section>
  )
}
