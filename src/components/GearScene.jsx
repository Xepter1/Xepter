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
 * Scroll-Fortschritt 1:1 auf einen Frame-Index (keine Feder → kein Nachziehen/Ruckeln).
 *
 * Glättung: vor-dekodierte ImageBitmaps (drawImage = billiger Blit, kein WebP-Re-Decode),
 * rAF-Coalescing (max. 1 Draw je Display-Frame), progressives Laden (jeder 3. Frame zuerst,
 * fehlende → nächstgelegener geladener). Mobil: niedrigere Canvas-DPR.
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
    let lastDrawn = -1
    // Frame am Sektions-Anfang (progress 0) je nach Laufrichtung
    let current = reverse ? frameCount - 1 : 0
    let rafId = 0

    const draw = (idx) => {
      // nearest loaded frame, preferring the requested one
      let img = bitmaps[idx]
      if (!img) {
        for (let off = 1; off < frameCount && !img; off++) {
          img = bitmaps[idx - off] || bitmaps[idx + off]
        }
      }
      if (!img) return
      const { width: cw, height: chgt } = canvas
      ctx.clearRect(0, 0, cw, chgt)
      // contain-fit
      const s = Math.min(cw / frameW, chgt / frameH)
      const w = frameW * s
      const h = frameH * s
      ctx.drawImage(img, (cw - w) / 2, (chgt - h) / 2, w, h)
      lastDrawn = idx
      if (counterRef.current) {
        counterRef.current.textContent = String(idx + 1).padStart(2, '0')
      }
    }

    // coalesce draws to one per display frame
    const scheduleDraw = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        if (current !== lastDrawn) draw(current)
      })
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
      const raw = Math.round(v * (frameCount - 1))
      current = Math.max(0, Math.min(frameCount - 1, reverse ? frameCount - 1 - raw : raw))
      scheduleDraw()
    })

    return () => {
      alive = false
      unsub()
      ro.disconnect()
      io.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
      bitmaps.forEach((b) => b && b.close && b.close())
    }
  }, [scrollYProgress, reduce, dir, frameCount, frameW, frameH, reverse])

  // Reduced motion: a single static image instead of the pinned scrub
  if (reduce) {
    return (
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <div className={imgLeft ? 'lg:order-2' : ''}>
            <p className="eyebrow !text-spark mb-5">{eyebrow}</p>
            <h1 className="font-display text-[clamp(2.2rem,6vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              {headline.join(' ')}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-dim">
              {body}
            </p>
          </div>
          <img
            src={`/${dir}/d/${still}.webp`}
            alt={`Explosionsdarstellung, ${eyebrow}`}
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
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="eyebrow !text-spark mb-5"
            >
              {eyebrow}
            </motion.p>
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
              aria-label={`Explosionsdarstellung, gesteuert durch Scrollen (${eyebrow})`}
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
