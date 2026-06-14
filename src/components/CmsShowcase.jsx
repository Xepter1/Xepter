/**
 * CMS Showcase — a pure-CSS iMac with a Safari window showing Patrick's real
 * CMS (Payload, dark, German) for the Landshuter Symphonieorchester site.
 * Faithful recreation of the admin (collections + content) — static draft,
 * to be animated later. Decorative (aria-hidden).
 */
const NAV_INHALTE = [
  'Seiten',
  'Konzerte / Termine',
  'Neuigkeiten',
  'Mitwirkende',
  'Galerie',
  'Medien',
]
const NAV_VERWALTUNG = ['Benutzer', 'Einstellungen']

const EVENTS = [
  {
    title: 'Frühjahrskonzert: Beethoven & Dvořák',
    date: '21. März 2026',
    location: 'Stadttheater Landshut',
    live: true,
  },
  {
    title: 'Sommerserenade im Hofgarten',
    date: '11. Juli 2026',
    location: 'Hofgarten der Stadtresidenz',
    live: true,
  },
  {
    title: 'Adventskonzert (Rückblick)',
    date: '14. Dez. 2025',
    location: 'Basilika St. Martin',
    live: false,
  },
]

export default function CmsShowcase() {
  return (
    <div className="imac" aria-hidden="true">
      <div className="imac-head">
        <div className="imac-screen">
          <div className="safari">
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
                ihre-website.de/admin
              </div>
            </div>

            {/* Payload admin */}
            <div className="pl">
              <aside className="pl-side">
                <div className="pl-brand">
                  <img src="/logo.png" alt="" />
                  <span>CMS</span>
                </div>

                <div className="pl-group">Inhalte</div>
                {NAV_INHALTE.map((label) => (
                  <div
                    key={label}
                    className={`pl-nav ${
                      label === 'Konzerte / Termine' ? 'is-active' : ''
                    }`}
                  >
                    <span className="dot" />
                    {label}
                  </div>
                ))}

                <div className="pl-group">Verwaltung</div>
                {NAV_VERWALTUNG.map((label) => (
                  <div key={label} className="pl-nav">
                    <span className="dot" />
                    {label}
                  </div>
                ))}

                <div className="pl-account">
                  <span className="pl-avatar" />
                  Patrick
                </div>
              </aside>

              <main className="pl-main">
                <div className="pl-head">
                  <div>
                    <div className="pl-crumb">Inhalte</div>
                    <div className="pl-title">Konzerte / Termine</div>
                  </div>
                  <div className="pl-btn">＋ Erstellen</div>
                </div>

                <div className="pl-table">
                  <div className="pl-row pl-row--head">
                    <span>Titel</span>
                    <span>Datum</span>
                    <span>Status</span>
                  </div>
                  {EVENTS.map((e) => (
                    <div className="pl-row" key={e.title}>
                      <span className="ptitle">{e.title}</span>
                      <span className="pmeta">{e.date}</span>
                      <span
                        className={`pl-badge ${e.live ? '' : 'pl-badge--off'}`}
                      >
                        <span className="bdot" />
                        {e.live ? 'Veröffentlicht' : 'Entwurf'}
                      </span>
                    </div>
                  ))}
                </div>
              </main>
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
