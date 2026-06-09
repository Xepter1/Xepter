import { useEffect, useRef, useState } from 'react'

/**
 * macOS-style Terminal that "builds" the brand on the MacBook display.
 * Commands/code type themselves char-by-char (syntax-highlighted), then
 * build + deploy logs stream in. When finished it calls onDone() so the
 * parent can fade the terminal out and reveal the rendered brand.
 *
 * Decorative only (aria-hidden on the device). Skipped under reduced motion.
 */
const PROMPT = 'xepter ~ %'

// Each line: { prompt?, type? (typed char-by-char), tokens:[{t,c}] }
const SCRIPT = [
  { prompt: true, type: true, tokens: [
    { t: 'cat ', c: 'cmd' }, { t: 'src/Brand.jsx', c: 'arg' },
  ] },
  { prompt: false, type: true, tokens: [
    { t: 'export ', c: 'kw' }, { t: 'const ', c: 'kw' }, { t: 'Brand', c: 'fn' },
    { t: ' = () => ', c: 'punc' }, { t: '<h1>', c: 'tag' },
    { t: 'Xepter', c: 'accent' }, { t: '</h1>', c: 'tag' },
  ] },
  { prompt: true, type: true, tokens: [{ t: 'npm run build', c: 'cmd' }] },
  { prompt: false, type: false, tokens: [
    { t: '✓ ', c: 'ok' }, { t: '412 modules · compiled in 0.82s', c: 'dim' },
  ] },
  { prompt: true, type: true, tokens: [{ t: 'deploy --prod', c: 'cmd' }] },
  { prompt: false, type: false, tokens: [
    { t: '● ', c: 'live' }, { t: 'live · xepter.de', c: 'dim' },
  ] },
]

const lineLen = (l) => l.tokens.reduce((n, t) => n + t.t.length, 0)

function Tokens({ tokens, revealed }) {
  let left = revealed
  const out = []
  for (let k = 0; k < tokens.length && left > 0; k++) {
    const slice = tokens[k].t.slice(0, left)
    out.push(
      <span className={`tok ${tokens[k].c}`} key={k}>
        {slice}
      </span>
    )
    left -= tokens[k].t.length
  }
  return out
}

export default function MacTerminal({ start, onDone }) {
  const [lines, setLines] = useState([])
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!start) return
    let cancelled = false
    const timers = []
    const wait = (ms) =>
      new Promise((r) => timers.push(setTimeout(r, ms)))

    const run = async () => {
      setLines([])
      await wait(300) // brief boot after the lid opens
      for (let i = 0; i < SCRIPT.length; i++) {
        if (cancelled) return
        const line = SCRIPT[i]
        const total = lineLen(line)
        setLines((p) => [
          ...p,
          { ...line, revealed: line.type ? 0 : total, typing: !!line.type },
        ])
        if (line.type) {
          for (let c = 1; c <= total; c++) {
            if (cancelled) return
            await wait(26 + Math.random() * 36)
            setLines((p) => {
              const a = [...p]
              a[a.length - 1] = { ...a[a.length - 1], revealed: c }
              return a
            })
          }
          setLines((p) => {
            const a = [...p]
            a[a.length - 1] = { ...a[a.length - 1], typing: false }
            return a
          })
          await wait(line.prompt ? 240 : 520)
        } else {
          await wait(260)
        }
      }
      await wait(820)
      if (!cancelled) onDoneRef.current && onDoneRef.current()
    }
    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [start])

  return (
    <div className="term" aria-hidden="true">
      <div className="term-bar">
        <span className="term-dot term-dot--r" />
        <span className="term-dot term-dot--y" />
        <span className="term-dot term-dot--g" />
        <span className="term-title">xepter — zsh — 80×24</span>
      </div>
      <div className="term-body">
        {lines.map((ln, i) => (
          <div className="term-line" key={i}>
            {ln.prompt && <span className="tok prompt">{PROMPT} </span>}
            <Tokens tokens={ln.tokens} revealed={ln.revealed} />
            {i === lines.length - 1 && ln.typing && (
              <span className="term-caret" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
