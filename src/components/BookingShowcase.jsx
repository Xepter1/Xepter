/**
 * Booking Showcase — der iMac aus dem CmsShowcase, diesmal mit dem
 * Terminbuchungstool für Arztpraxen: die Wochenansicht (Schritt „Termin"),
 * Spalten = Tage, dunkle Pillen = freie Zeiten, leere Spalte = ausgebucht.
 *
 * Praxis und Ärztin sind bewusst erfunden („Muster") — hier stehen keine
 * echten Praxisdaten. Dekorativ (aria-hidden).
 */
const DAY_SHORT = ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA']

// Freie Zeiten je Wochentag (Mo–Fr). Leeres Array = der Tag ist voll.
// Max. 3 Zeiten pro Spalte — mehr passen nicht in die feste Bildschirmhöhe.
const SLOTS = [
  ['08:00', '09:30', '11:30'],
  ['08:30', '14:00'],
  [],
  ['09:00', '10:00', '16:30'],
  ['08:30', '11:30'],
]

const pad = (n) => String(n).padStart(2, '0')
const dm = (d) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`

// Kommender Montag bis Freitag. Rechnet sich aus dem Tagesdatum: die Woche liegt
// immer in der Zukunft und das Mockup veraltet nie (anders als feste Datumsangaben).
function nextWorkWeek() {
  const today = new Date()
  const untilMonday = (8 - today.getDay()) % 7 || 7
  return [0, 1, 2, 3, 4].map((i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + untilMonday + i)
    return d
  })
}

export default function BookingShowcase() {
  const days = nextWorkWeek()

  return (
    <div className="imac" aria-hidden="true">
      <div className="imac-head">
        <div className="imac-screen">
          <div className="safari safari--light">
            {/* Safari toolbar */}
            <div className="safari-bar">
              <div className="safari-dots">
                <span className="safari-dot safari-dot--r" />
                <span className="safari-dot safari-dot--y" />
                <span className="safari-dot safari-dot--g" />
              </div>
              <div className="safari-url">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
                ihre-praxis.de/termin
              </div>
            </div>

            {/* Terminbuchung */}
            <div className="bk">
              <div className="bk-doc">
                <span className="bk-avatar">AM</span>
                <span className="bk-doc-text">
                  <span className="bk-doc-name">Dr. med. Anna Muster</span>
                  <span className="bk-doc-role">Allgemeinmedizin</span>
                </span>
                <span className="bk-next">
                  <span className="bk-next-dot" />
                  Nächster Termin: Mo, {dm(days[0])}
                </span>
              </div>

              <div className="bk-week">
                <span className="bk-arrow">‹</span>
                <span className="bk-week-label">
                  Mo, {dm(days[0])} – Fr, {dm(days[4])}
                </span>
                <span className="bk-arrow">›</span>
              </div>

              <div className="bk-grid">
                {days.map((d, i) => (
                  <div className="bk-col" key={i}>
                    <div className="bk-day">{DAY_SHORT[d.getDay()]}</div>
                    <div className="bk-date">{dm(d)}</div>
                    <div className="bk-slots">
                      {SLOTS[i].length ? (
                        SLOTS[i].map((t) => (
                          <span className="bk-slot" key={t}>
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="bk-none">–</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="imac-chin">
        <img src="/logo.png" alt="" />
      </div>
      <div className="imac-neck" />
      <div className="imac-foot" />
    </div>
  )
}
