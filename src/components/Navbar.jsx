import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { EASE } from '../lib/anim'
import { useGo } from '../lib/nav'
import Wordmark from './Wordmark'

// id  → home-page section (smooth-scroll anchor)
// to  → its own route (page)
const NAV = [
  { label: 'Projekte', id: 'projekte' },
  { label: 'Außergewöhnliches', to: '/aussergewoehnliches' },
  { label: 'Selbst verwalten', to: '/selbst-verwalten' },
  { label: 'Über mich', to: '/ueber-mich' },
]

// Warm-orange underline that wipes in from the left on hover (or stays lit on the active route)
function NavUnderline({ active = false }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-1.5 left-4 right-4 h-[1.5px] origin-left rounded-full bg-spark transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 ${
        active ? 'scale-x-100' : 'scale-x-0'
      }`}
    />
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const go = useGo()
  const { pathname } = useLocation()
  const onContact = pathname === '/kontakt'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menu])

  const handleSection = (e, id) => {
    e.preventDefault()
    setMenu(false)
    go(id)
  }

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled || onContact
            ? 'glass border-b border-line'
            : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-[68px] max-w-[1800px] items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-24">
          {/* Wordmark */}
          <Link
            to="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                go('top')
              }
              setMenu(false)
            }}
            className="group flex items-center gap-2"
            aria-label="Xepter — Startseite"
          >
            <Wordmark
              className="font-display text-[1.35rem] font-semibold tracking-tight text-ink"
              alt=""
              spark
            />
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)] transition-all duration-500 group-hover:scale-150 group-hover:bg-spark group-hover:shadow-[0_0_16px_var(--color-spark)]" />
          </Link>

          {/* Desktop links (erst ab lg, weil 4 längere Labels bei md quetschen) */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((l) =>
              l.to ? (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenu(false)}
                  className={`group relative px-4 py-2 text-[0.93rem] transition-colors duration-300 hover:text-ink ${
                    pathname === l.to ? 'text-ink' : 'text-ink-dim'
                  }`}
                >
                  {l.label}
                  <NavUnderline active={pathname === l.to} />
                </Link>
              ) : (
                <a
                  key={l.id}
                  href={`/#${l.id}`}
                  onClick={(e) => handleSection(e, l.id)}
                  className="group relative px-4 py-2 text-[0.93rem] text-ink-dim transition-colors duration-300 hover:text-ink"
                >
                  {l.label}
                  <NavUnderline />
                </a>
              )
            )}
            <Link
              to="/kontakt"
              onClick={() => setMenu(false)}
              className="btn btn-spark-outline ml-3 h-11 px-5 text-[0.9rem]"
            >
              Kontakt
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenu((m) => !m)}
            className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-line-2 lg:hidden"
            aria-label={menu ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={menu}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-[1.6px] w-5 bg-ink transition-all duration-300 ${
                  menu ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-[1.6px] w-5 bg-ink transition-all duration-300 ${
                  menu ? '-rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 h-[1.6px] w-5 bg-ink transition-all duration-300 ${
                  menu ? 'top-1.5 opacity-0' : 'top-3'
                }`}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-center px-8 lg:hidden mobile-menu"
          >
            <div className="flex flex-col gap-2">
              {NAV.map((l, i) =>
                l.to ? (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i + 0.1, ease: EASE }}
                  >
                    <Link
                      to={l.to}
                      onClick={() => setMenu(false)}
                      className="font-display text-[clamp(1.75rem,7.5vw,2.25rem)] font-medium tracking-tight text-ink"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={l.id}
                    href={`/#${l.id}`}
                    onClick={(e) => handleSection(e, l.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i + 0.1, ease: EASE }}
                    className="font-display text-[clamp(1.75rem,7.5vw,2.25rem)] font-medium tracking-tight text-ink"
                  >
                    {l.label}
                  </motion.a>
                )
              )}
            </div>
            <Link
              to="/kontakt"
              onClick={() => setMenu(false)}
              className="btn btn-spark mt-10 w-full justify-center"
            >
              Kontakt
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
