// Shared motion variants — calm, premium easing
export const EASE = [0.16, 1, 0.3, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: EASE },
  }),
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, delay: i * 0.08, ease: EASE },
  }),
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

// Default viewport config for whileInView
export const inView = { once: true, margin: '-90px' }

// Clip-up reveal (mask a line and slide it up) — custom = delay in seconds
export const clipUp = {
  hidden: { y: '110%' },
  show: (delay = 0) => ({
    y: '0%',
    transition: { duration: 0.72, delay, ease: EASE },
  }),
}

// Self-drawing horizontal rule / underline — custom = delay in seconds. Pair with style={{ originX: 0 }}
export const drawX = {
  hidden: { scaleX: 0 },
  show: (delay = 0) => ({
    scaleX: 1,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
}
