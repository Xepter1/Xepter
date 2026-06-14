import { Link } from 'react-router-dom'
import { IconArrowUp } from './Icons'
import { useGo } from '../lib/nav'
import Wordmark from './Wordmark'

const SECTIONS = [{ label: 'Projekte', id: 'projekte' }]

export default function Footer() {
  const go = useGo()

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Big wordmark */}
        <div className="flex items-end justify-between gap-6 py-14">
          <div>
            <div className="flex items-center gap-2">
              <Wordmark className="font-display text-4xl font-semibold tracking-tight sm:text-5xl" />
              <span className="mb-1 h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
            </div>
            <p className="mt-3 max-w-xs text-ink-faint">
              Weil der erste Eindruck zählt!
            </p>
          </div>

          <button
            onClick={() => go('top')}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line-2 text-ink-dim transition-all duration-400 hover:-translate-y-1 hover:border-accent hover:text-accent"
            aria-label="Zurück nach oben"
          >
            <IconArrowUp width={20} height={20} />
          </button>
        </div>

        <div className="hairline" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-5 py-7 sm:flex-row">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {SECTIONS.map((l) => (
              <a
                key={l.id}
                href={`/#${l.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  go(l.id)
                }}
                className="text-sm text-ink-faint transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/aussergewoehnliches"
              className="text-sm text-ink-faint transition-colors hover:text-ink"
            >
              Außergewöhnliches
            </Link>
            <Link
              to="/selbst-verwalten"
              className="text-sm text-ink-faint transition-colors hover:text-ink"
            >
              Selbst verwalten
            </Link>
            <Link
              to="/ueber-mich"
              className="text-sm text-ink-faint transition-colors hover:text-ink"
            >
              Über mich
            </Link>
            <Link
              to="/kontakt"
              className="text-sm text-ink-faint transition-colors hover:text-ink"
            >
              Kontakt
            </Link>
            <Link
              to="/impressum"
              className="text-sm text-ink-faint transition-colors hover:text-ink"
            >
              Impressum
            </Link>
            <Link
              to="/datenschutz"
              className="text-sm text-ink-faint transition-colors hover:text-ink"
            >
              Datenschutz
            </Link>
          </nav>
          <p className="font-mono text-xs text-ink-faint">
            © 2026 Xepter
          </p>
        </div>
      </div>
    </footer>
  )
}
