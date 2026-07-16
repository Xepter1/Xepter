import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE = 'https://xepter.de'

// Pro Route ein eigener Titel + Beschreibung. Ohne das liefert die SPA auf jeder
// URL denselben <head> – fuer Google sehen die Seiten dann wie Duplikate aus.
// Titel ~50–60 Zeichen, Beschreibung ~120–155 Zeichen. Texte gern anpassen.
const DEFAULT = {
  title: 'Xepter — Der erste Eindruck entscheidet.',
  description:
    'Xepter — Webentwicklung & Design. Websites, die im ersten Moment wirken und im zweiten überzeugen.',
}

const PAGE_META = {
  '/': DEFAULT,
  '/aussergewoehnliches': {
    title: 'Außergewöhnliche Websites | Xepter',
    description:
      'Individuell gestaltete Websites, die im ersten Moment wirken und im zweiten überzeugen – handgemacht statt Baukasten.',
  },
  '/selbst-verwalten': {
    title: 'Website selbst verwalten | Xepter',
    description:
      'Inhalte selbst pflegen – ganz ohne Technikwissen. Deine Website mit einfachem Redaktionssystem, jederzeit aktualisierbar.',
  },
  '/rundum-sorglos': {
    title: 'Rundum-sorglos-Paket | Xepter',
    description:
      'Hosting, Wartung, Sicherheit und Updates aus einer Hand – Du bekommst eine Website, um die Du Dich nie kümmern musst.',
  },
  '/arztpraxen': {
    title: 'Terminbuchung für Arztpraxen | Xepter',
    description:
      'Online-Terminbuchung für Deine Praxis: Patienten buchen selbst eine freie Zeit – passend zum Anliegen, ohne Anruf und ohne Gesundheitsdaten.',
  },
  '/ablauf': {
    title: 'Ablauf – So entsteht Deine Website | Xepter',
    description:
      'Von der ersten Idee bis zur fertigen Website: So läuft die Zusammenarbeit mit Xepter Schritt für Schritt ab.',
  },
  '/ueber-mich': {
    title: 'Über mich | Xepter',
    description:
      'Wer hinter Xepter steckt: persönliche Beratung und handgemachte Websites aus einer Hand – kein Agentur-Fließband.',
  },
  '/kontakt': {
    title: 'Kontakt & kostenloses Erstgespräch | Xepter',
    description:
      'Lass uns über Dein Projekt sprechen. Unverbindliches Erstgespräch – ich melde mich schnell persönlich zurück.',
  },
  '/impressum': {
    title: 'Impressum | Xepter',
    description: 'Impressum und Anbieterkennzeichnung von Xepter.',
  },
  '/datenschutz': {
    title: 'Datenschutz | Xepter',
    description:
      'Informationen zum Datenschutz und zur Verarbeitung Deiner Daten bei Xepter.',
  },
}

// Setzt (oder erstellt) ein <meta>-Tag und gibt es zurueck.
function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Setzt (oder erstellt) <link rel="canonical">.
function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function SeoManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = PAGE_META[pathname] || DEFAULT
    // Canonical ohne abschliessenden Slash (ausser Startseite)
    const canonical = pathname === '/' ? `${SITE}/` : `${SITE}${pathname}`

    document.title = meta.title
    setMeta('name', 'description', meta.description)
    setCanonical(canonical)

    // Open Graph / Social-Sharing
    setMeta('property', 'og:title', meta.title)
    setMeta('property', 'og:description', meta.description)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:type', 'website')
  }, [pathname])

  return null
}
