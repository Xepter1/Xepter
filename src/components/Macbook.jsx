import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Wordmark from './Wordmark'
import MacTerminal from './MacTerminal'

/**
 * Pure-CSS 3D MacBook Pro.
 * Lid is closed on mount, then opens slowly; the brand "Xepter"
 * boots onto the display. A gentle pointer-driven tilt adds life.
 */
export default function Macbook() {
  const [open, setOpen] = useState(false)
  const [rendered, setRendered] = useState(false) // brand "born" after terminal build
  const [runId, setRunId] = useState(0) // bump to replay the boot sequence
  const deviceRef = useRef(null)
  const reduce = useReducedMotion()

  // Open sequence
  useEffect(() => {
    if (reduce) {
      setOpen(true)
      setRendered(true) // no terminal animation — show the brand directly
      return
    }
    const t = setTimeout(() => setOpen(true), 650)
    return () => clearTimeout(t)
  }, [reduce])

  // Click the open display to replay the build sequence (delight)
  const replay = () => {
    if (reduce || !open) return
    setRendered(false)
    setRunId((n) => n + 1)
  }

  // Subtle parallax tilt following the cursor (desktop, motion allowed)
  useEffect(() => {
    if (reduce) return
    const el = deviceRef.current
    if (!el) return
    let raf = 0
    // Oscillate gently around the upright, front-facing resting pose (rotateX 8°)
    const onMove = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const ry = ((e.clientX - cx) / cx) * 5 // -5° .. 5°
      const rx = 8 - ((e.clientY - cy) / cy) * 3 // 5° .. 11°
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transition = '' // track the cursor instantly
        el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
      })
    }
    const onLeave = () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = 'rotateX(8deg) rotateY(0deg)'
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [reduce])

  return (
    <div className="mac-stage" aria-hidden="true">
      <div className="mac-float">
        <div
          ref={deviceRef}
          className={`device ${open ? 'is-open' : ''} ${
            rendered ? 'is-rendered' : ''
          }`}
        >
          <div className="lid">
            <div className="lid-shell">
              <div
                className="screen"
                style={{ containerType: 'inline-size' }}
                onClick={replay}
              >
                {!reduce && (
                  <MacTerminal
                    key={runId}
                    start={open}
                    onDone={() => setRendered(true)}
                  />
                )}
                <div className="screen-brand">
                  <span className="screen-logo-wrap">
                    <Wordmark
                      className="screen-logo"
                      logoEm={0.78}
                      dy="0.04em"
                    />
                    <span className="screen-dot" aria-hidden="true" />
                  </span>
                  <span className="screen-tagline">
                    Weil der erste{' '}
                    <span className="text-gradient screen-em">Eindruck</span>{' '}
                    zählt!
                  </span>
                </div>
                <div className="screen-glare" />
              </div>
            </div>
            <div className="lid-back" aria-hidden="true" />
          </div>
          <div className="base" />
          <div className="mac-shadow" />
        </div>
      </div>
    </div>
  )
}
