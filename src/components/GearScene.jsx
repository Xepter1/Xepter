import { useEffect, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { EASE } from '../lib/anim'

/**
 * GearScene — scroll-driven exploded-view of a gearbox (Apple-style scrub).
 *
 * 97 transparent frames (RGBA WebP, gearbox keyed off pure black via luminance) live in
 * /public/gear/{d,m}/<i>.webp. They composite straight over the near-black page through
 * the canvas alpha, so the background is gone and the metal keeps soft glowing edges —
 * no fragile keying, no white halos, and no mix-blend-mode (which a transformed wrapper
 * isolated, leaving the black frame as a box). A pinned (sticky) viewport maps the
 * section's raw scroll progress straight to a frame index on a <canvas>, so the scrub
 * stays 1:1 with the finger (no spring lag, which used to read as stutter).
 *
 * Loading is progressive: every 3rd frame first (a usable scrub after ~1/3 of
 * the bytes), then the rest. While a frame is missing, the nearest loaded
 * neighbour is drawn, so scrubbing never blanks.
 */
const FRAME_COUNT = 97
const FRAME_W = 1500
const FRAME_H = 902

function frameSrc(folder, i) {
  return `/gear/${folder}/${i}.webp`
}

export default function GearScene() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const counterRef = useRef(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  })
  // subtle parallax: the copy drifts up gently while the gearbox scrubs
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -64])

  useEffect(() => {
    if (reduce) return undefined
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return undefined

    const ctx = canvas.getContext('2d')
    const folder = window.matchMedia('(max-width: 1023px)').matches ? 'm' : 'd'
    // Pre-decoded ImageBitmaps: drawImage stays a cheap GPU blit, no
    // per-frame WebP re-decode (the main source of scrub jank).
    const bitmaps = new Array(FRAME_COUNT).fill(null)
    let alive = true
    let lastDrawn = -1
    let current = 0
    let rafId = 0

    const draw = (idx) => {
      // nearest loaded frame, preferring the requested one
      let img = bitmaps[idx]
      if (!img) {
        for (let off = 1; off < FRAME_COUNT && !img; off++) {
          img = bitmaps[idx - off] || bitmaps[idx + off]
        }
      }
      if (!img) return
      const { width: cw, height: chgt } = canvas
      ctx.clearRect(0, 0, cw, chgt)
      // contain-fit
      const s = Math.min(cw / FRAME_W, chgt / FRAME_H)
      const w = FRAME_W * s
      const h = FRAME_H * s
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
        const res = await fetch(frameSrc(folder, i))
        const blob = await res.blob()
        const bmp = await createImageBitmap(blob)
        if (!alive) return
        bitmaps[i] = bmp
        // first paint + refresh whenever a better frame for the current
        // position arrives
        if (lastDrawn === -1 || Math.abs(i - current) < Math.abs(lastDrawn - current)) {
          draw(current)
        }
      } catch {
        /* einzelner Frame fehlgeschlagen: nearest-loaded Fallback greift */
      }
    }

    const loadAll = async () => {
      const pass1 = []
      const pass2 = []
      for (let i = 0; i < FRAME_COUNT; i++) {
        ;(i % 3 === 0 ? pass1 : pass2).push(i)
      }
      await Promise.all(pass1.map(load))
      if (alive) await Promise.all(pass2.map(load))
    }

    const resize = () => {
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
    loadAll()

    const unsub = scrollYProgress.on('change', (v) => {
      current = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, Math.round(v * (FRAME_COUNT - 1)))
      )
      scheduleDraw()
    })

    return () => {
      alive = false
      unsub()
      ro.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
      bitmaps.forEach((b) => b && b.close && b.close())
    }
  }, [scrollYProgress, reduce])

  // Reduced motion: a single static image instead of the pinned scrub
  if (reduce) {
    return (
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow !text-spark mb-5">Motion</p>
            <h1 className="font-display text-[clamp(2.2rem,6vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              Sie wollen aufwendige Animationen?
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-dim">
              Genau so etwas entsteht hier. Aufwendig im Detail, leichtgewichtig
              im Browser und gebaut, um in Erinnerung zu bleiben.
            </p>
          </div>
          <img
            src={frameSrc('d', 0)}
            alt="Explosionsdarstellung eines Objektivs"
            width={FRAME_W}
            height={FRAME_H}
            className="w-full"
            loading="eager"
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
        {/* Mobile: ein dezenter Glow mittig hinter dem Objekt (das Layout stapelt,
            die Desktop-Glows würden seitlich verrutschen) */}
        <div
          className="glow lg:hidden"
          style={{
            width: 360,
            height: 360,
            left: '50%',
            bottom: '12%',
            transform: 'translateX(-50%)',
            background:
              'radial-gradient(circle, rgba(139,61,240,0.18), transparent 60%)',
          }}
        />
        {/* Desktop: seitliche Glows neben/hinter dem Objekt */}
        <div
          className="glow hidden lg:block"
          style={{
            width: 640,
            height: 640,
            right: '-8%',
            top: '6%',
            background:
              'radial-gradient(circle, rgba(139,61,240,0.2), transparent 60%)',
          }}
        />
        <div
          className="glow hidden lg:block"
          style={{
            width: 420,
            height: 420,
            left: '-6%',
            bottom: '0%',
            background:
              'radial-gradient(circle, rgba(255,176,77,0.07), transparent 60%)',
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-5 pt-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:pt-0">
          {/* Left — copy */}
          <motion.div style={{ y: copyY }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="eyebrow !text-spark mb-5"
            >
              Motion
            </motion.p>
            <h1 className="font-display text-[clamp(2.2rem,6vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              {['Sie wollen', 'aufwendige', 'Animationen?'].map((t, i) => (
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
              Dann scroll langsam weiter. Das Objektiv zerlegt sich in seine
              Einzelteile und setzt sich rückwärts wieder zusammen. Direkt im
              Browser, butterweich, ohne Plugins.
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
              /{FRAME_COUNT}
            </motion.p>
          </motion.div>

          {/* Right — the gearbox */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            className="relative"
          >
            <canvas
              ref={canvasRef}
              aria-label="Explosionsdarstellung eines Objektivs, gesteuert durch Scrollen"
              role="img"
              className="mx-auto aspect-[1500/902] w-full max-h-[60svh] lg:max-h-[78svh]"
            />
          </motion.div>
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
