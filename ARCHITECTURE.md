# Xepter — Portfolio · Architektur & Stand

> Persönliche Portfolio-Website von **Xepter** (Patrick — Freelance Webentwickler,
> Wirtschaftsingenieur-Student). Marken-Claim: **„Der erste Eindruck entscheidet."**
> Premium, dunkel, ruhig — mit gezielten „Wow"-Momenten.
> Stand: Juni 2026 · fast launch-ready.

> **Für die nächste KI:** Diese Datei ist die Single Source of Truth zum Aufbau. Bei Änderungen
> bitte hier nachziehen. Farben/Animationen leben fast alle in `src/index.css`. Verifizieren am
> besten im **echten Browser** (Preview friert On-Load-/Timer-Animationen ein — s. §10).

---

## 1. Stack

| Bereich | Wahl |
|---|---|
| Framework | **React 18.3** + **Vite 6** |
| Styling | **Tailwind CSS v4** (CSS-first, `@theme`-Tokens in `src/index.css`) via `@tailwindcss/vite` |
| Animation | **Framer Motion 11** (Scroll-Reveals, Hero-Sequenz, `<MotionConfig reducedMotion="user">`) |
| Routing | **React Router v7** (`BrowserRouter`) |
| Fonts | **Clash Display** + **Satoshi** (Fontshare, `<link>` in `index.html`) · **JetBrains Mono** (Google) |

Befehle: `npm install` · `npm run dev` (→ localhost:5173) · `npm run build` (→ `/dist`) · `npm run preview`.

---

## 2. Verzeichnisstruktur

```
index.html                 # Font-Links, Meta, theme-color #07080C, Favicon → /favicon.png
vite.config.js             # react + tailwindcss Plugins, server.host
vercel.json                # SPA-Rewrite (alle Routen → index.html)
Dockerfile                 # Multi-Stage: Node-Build → nginx-Serve (s. §9)
nginx.conf                 # nginx-Config mit SPA-Fallback (try_files → index.html)
docker-compose.yml         # Portainer-Git-Stack: build . → Port 8088:80 (PROD)
.dockerignore
Bilder/                    # Quell-/Scratch-Assets (gitignored) — u.a. logo.jpeg (Original-Logo)
public/
  logo.png                 # >>> freigestelltes Marken-Logo (das „X"), s. §6 <<<
  favicon.png              # Favicon = Logo auf dunkler Platte (in index.html referenziert)
  favicon.svg              # LEGACY (altes gezeichnetes X), nicht mehr referenziert
  xepter-portrait.jpg      # Portrait für „Über mich" (675×900)
  _redirects               # SPA-Fallback (Netlify/Cloudflare)
  projects/                # Desktop-Screenshots 1600×1000 .jpg (Browser-Frame)
    mobile/                # Mobile-Screenshots 560×1212 .jpg (im iPhone)
src/
  main.jsx
  index.css                # >>> Design-Tokens + ALLE bespoke CSS (s. §3) <<<
  App.jsx                  # Router + MotionConfig + ScrollManager + ScrollProgress
  lib/
    anim.js                # Motion-Varianten: fadeUp, fadeIn, stagger, inView, EASE
    nav.js                 # useGo() — Smart-Scroll / Cross-Page-Navigation
  components/
    Navbar.jsx             # Fixed Nav, Glass-on-Scroll, Mobile-Menü; NAV-Array (Anchor|Route)
    Wordmark.jsx           # „Xepter"-Wortmarke: ersetzt das X durch /logo.png (s. §6)
    Hero.jsx               # Kicker + H1 „Ich baue Websites, die überzeugen." + CTAs + <Macbook/>
    Macbook.jsx            # CSS-3D-MacBook; bootet ein macOS-Terminal → Marke (s. §4)
    MacTerminal.jsx        # Typewriter-Terminal (Code → build → deploy) im MacBook-Display (s. §4)
    Projects.jsx           # Galerie: Browser-Frame + iPhone-Overlay (s. §5)
    Leistungen.jsx         # Leistungen-Sektion: Text + <CmsShowcase/> (s. §7)
    CmsShowcase.jsx        # CSS-iMac + Safari + Payload-Admin (CMS-Showcase, s. §7)
    About.jsx              # „Über mich": echte Bio + Portrait-Karte (nur Portrait, keine Stats)
    ContactCTA.jsx         # Abschluss-CTA auf der Startseite → /kontakt
    Footer.jsx             # Wordmark, Nav (Anchor|Route), Legal-Links, Back-to-top
    Icons.jsx              # Inline-SVG-Icons (Stroke 1.6)
    SectionMark.jsx        # Editorial Section-Kicker + Headline + Spark-Underline (Framer)
    LegalLayout.jsx        # Gemeinsames Layout für Impressum/Datenschutz
  pages/
    Home.jsx               # Hero → Projects → ContactCTA  (Leistungen & Über mich sind eigene Seiten!)
    LeistungenPage.jsx     # /leistungen — rendert <Leistungen/>
    UeberMichPage.jsx      # /ueber-mich — rendert <About/>
    ContactPage.jsx        # /kontakt — Formular + Socials
    ImpressumPage.jsx      # /impressum
    DatenschutzPage.jsx    # /datenschutz
```

---

## 3. Design-System (`src/index.css`, Block `@theme`)

**Surfaces:** `--color-base #07080c` · `--color-panel #0c0e14` · `--color-card #111420` · `--color-card-2 #161a28`
**Ink:** `--color-ink #f3f6fb` · `--color-ink-dim #aab2c2` · `--color-ink-faint #6b7384` · `--color-ink-meta #828b9c`
**Lines:** `--color-line rgba(255,255,255,.08)` · `--color-line-2 rgba(255,255,255,.14)`
**Akzent (elektrisches Violett):** `--color-accent #bf5af2` · `--color-accent-2 #8b3df0` · `--color-accent-soft`
**Spark (warmes Amber, NUR „Aliveness": H2-Underline, Live-Punkt, aktiver Tick):** `--color-spark #ffb04d`
**Fonts:** `--font-display` (Clash Display) · `--font-sans` (Satoshi) · `--font-mono` (JetBrains Mono)
**Easing:** `--ease-out-expo cubic-bezier(.16,1,.3,1)`

> ⚠️ **Hinweis Farben:** Es gibt **viele hartcodierte `rgba(191,90,242,…)` / `rgba(139,61,240,…)`** (Violett)
> in `index.css` UND in den Glow-`style`-Attributen der Komponenten (Hero/About/ContactCTA/LegalLayout/
> ContactPage). Beim Umfärben ALLE mitziehen, nicht nur die Tokens. (Ein Lila/Aubergine-Re-Theme wurde
> 2026-06 im Branch `lab` getestet und vom User **verworfen** — `main` bleibt beim Violett auf Fast-Schwarz.)

Wiederverwendbare Klassen in `index.css`: `.eyebrow`, `.kicker`, `.spec`, `.text-gradient`, `.spark-underline`,
`.live-dot`, `.btn`/`.btn-primary`/`.btn-ghost`, `.glass`, `.glow`, `.grain`, `.grid-bg`, `.hairline`,
`.browser*`, `.phone*`, `.legal-prose`, `.legal-todo`.
Bespoke Komponenten-CSS (ebenfalls in `index.css`): MacBook `.device/.lid*/.screen*` (§4), Terminal `.term*` (§4),
Marken-Reveal `.screen-logo-wrap/.screen-dot/.screen-tagline/.screen-em` (§4), iMac+Admin `.imac*/.safari*/.pl*` (§7).
Tailwind v4 macht aus den Tokens automatisch Utilities (`bg-base`, `text-ink`, `text-accent`, `font-display` …).

---

## 4. MacBook „Live-Build" (Hero) — `Macbook.jsx` + `MacTerminal.jsx`

Reiner CSS-3D-MacBook, der beim Laden aufklappt und auf dem Display **die Marke live „baut"**.

**Hardware (CSS):** `.device` Ruhepose `rotateX(8deg)`; `--bezel: clamp(6px,0.76vw,11px)`.
`.lid` geschlossen `rotateX(-100deg)` (Alu-Rückseite `.lid-back` zur Kamera) → offen `.is-open` `rotateX(-3deg)`,
Transition **2,1 s** gewichtetes Scharnier (kein Bounce). Cursor-Parallaxe. Öffnet auf Mount nach **650 ms**.

**Ablauf / State-Maschine (Device-Klassen):**
1. `is-open` → Deckel klappt auf.
2. `<MacTerminal start={open}>` rendert ein **macOS-Terminal** (Ampel-Punkte, Titel „xepter — zsh"):
   tippt zeichenweise Code → Build → Deploy (Syntax-Highlight via `.tok.*`):
   `export const Brand = () => <h1>Xepter</h1>` · `npm run build` → `✓ 412 modules · compiled in 0.82s`
   · `deploy --prod` → `● live · xepter.de`. Tempo ~12–28 ms/Zeichen, **Gesamt ~3,5–4 s**. setTimeout-getrieben.
3. `onDone` → `is-rendered` → Terminal blendet aus, **gestaffelter Reveal**:
   `.screen-logo-wrap` zeigt **„Xepter."** (Logo-X + weiße „epter" via `Wordmark` + Akzent-`.screen-dot`),
   0,6 s später `.screen-tagline` **„Weil der erste *Eindruck* zählt!"** (`Eindruck` = `.text-gradient.screen-em`, größer + Lila).
- **Klick aufs Display** = Replay (`runId`-key remountet `MacTerminal`, `is-rendered`→false).
- **reduced-motion:** kein Terminal, Marke sofort sichtbar.
- Skalierung: `.screen` ist `container-type: inline-size`; Terminal/Marke nutzen `cqw` → passt sich der Gerätebreite an.

---

## 5. Projekt-Galerie + Responsive-Showcase — `Projects.jsx`

- 3 Projekte, alternierende Rows (`flip = index % 2`). Jede Row: **Browser-Frame** (Desktop-Screenshot)
  + **iPhone-Overlay** (Mobile-Screenshot) an der unteren Außen-Ecke → zeigt Responsivität.
- iPhone = reines CSS (`.phone`, `.phone-screen`, `.phone-island` = Dynamic Island, Seitentasten, Glas-Reflex).
- Daten pro Projekt: `{ name, desc, tag, year/live, url, img, imgMobile, accent }`. Bild-Fehler → gebrandete Fallback-Kachel.
- Projekte: **Landshuter Symphonieorchester** (`#8A3FF0`), **DesignbyEms** (`#FBB04C`), **Tankstelle Stettner** (`#a86cf5`).

### Screenshots (so erzeugt)
Per **Microlink** (Free-Tier), lokal gespeichert & mit macOS `sips` optimiert (keine Laufzeit-Abhängigkeit),
Aufnahme mit **`viewport.deviceScaleFactor=2`** (Retina):
- Desktop `1280×800 @2×` → `sips --resampleWidth 1600 … formatOptions 88` → `public/projects/*.jpg` (1600×1000)
- Mobile `390×844 isMobile @2×` → `--resampleWidth 560` → `public/projects/mobile/*.jpg` (560×1212)
- Bei Live-Änderung: Microlink-URL mit **`&force=true`**, neu laden, `sips`, ersetzen.

---

## 6. Logo & Wortmarke — `Wordmark.jsx` + `public/logo.png`

- Original-Logo: `Bilder/logo.jpeg` (violettes „X" + dunkler Navy-Paper-Plane auf hellem Lavendel).
- **Freigestellt** per Python/Pillow (Color-Key gegen Hintergrund `#f2e9fe`, auf Inhalt beschnitten) → `public/logo.png`.
  Der dunkle Navy (`#150132`) wurde dabei **auf Creme/Weiß umgefärbt**, damit der Paper-Plane auf dunklem
  Seitenhintergrund sichtbar bleibt (Logo = Violett + Creme).
- **`Wordmark.jsx`** rendert die Marke „Xepter", ersetzt das **„X" durch `logo.png`** + Text „epter".
  Props: `logoEm` (Höhe rel. Schriftgröße), `dy` (Baseline-Nudge), `gap`, `alt` (default „X"; `""` wo ein
  aria-label die Marke schon nennt). Eingesetzt in **Navbar, Footer, MacBook-Screen** (dort „epter" in Weiß).
- **Favicon:** `public/favicon.png` (Logo auf dunkler, abgerundeter Platte), in `index.html` referenziert.
  `favicon.svg` ist Legacy/unreferenziert.

---

## 7. Leistungen-Seite + CMS-Showcase — `/leistungen`

`LeistungenPage.jsx` → `Leistungen.jsx`: **links** Verkaufstext „Deine Website **pflegst du** selbst." +
Vorteils-Checkliste (Bilder, News, Banner, Termine); **rechts** `CmsShowcase.jsx`.

**`CmsShowcase.jsx`** = reiner **CSS-iMac** (`.imac` / `.imac-head` / `.imac-screen` mit `container-type:inline-size`
/ `.imac-chin` mit Mini-Logo / `.imac-neck` / `.imac-foot`) mit **Safari-Fenster** (`.safari*`) und darin einem
**Payload-Admin (DARK, deutsch)** (`.pl*`): Sidebar (Gruppen „Inhalte" / „Verwaltung") + Konzerte-Listenansicht
mit „Veröffentlicht/Entwurf"-Badges. Alles `cqw`-skaliert → passt sich der iMac-Größe an.
**Generisch gehalten:** Sidebar-Brand „CMS", URL „ihre-website.de/admin".

> **Quelle des CMS-Designs (READ-ONLY!):** `/Users/xepter/Projects/Landshuter_Symphonieorchester` ist
> Patricks echtes CMS = **Payload CMS 3** (Next.js 15, SQLite, deutsches Admin). Collections: Seiten, Konzerte/
> Termine, Neuigkeiten, Mitwirkende, Galerie, Medien + Global „Einstellungen" (Tab „Banner"). **Dort NIE etwas
> ändern/starten** (`.env`/`landshuter.db` tabu) — nur als Referenz auslesen. Der Showcase ist eine getreue
> CSS-Nachbildung, keine Einbindung.

**Status:** statisch (Draft). **Phase 2 geplant:** Cursor klickt „＋ Erstellen" → neuer Eintrag erscheint →
öffentliche Seite aktualisiert sich live.

---

## 8. Routing & Navigation

- **Routen:** `/` (Home) · `/leistungen` · `/ueber-mich` · `/kontakt` · `/impressum` · `/datenschutz`.
- **Home** ist bewusst schlank: **Hero → Projects → ContactCTA**. „Leistungen" und „Über mich" sind **eigene Seiten**.
- **Navbar/Footer `NAV`-Items** sind gemischt:
  - `{ id }` → **Home-Sektion** (Smooth-Scroll-Anchor, via `useGo()`): aktuell nur **Projekte** (`#projekte`).
  - `{ to }` → **eigene Route**: **Leistungen** (`/leistungen`), **Über mich** (`/ueber-mich`).
  - Reihenfolge: **Projekte · Leistungen · Über mich · Kontakt** (Kontakt = CTA-Button). Aktive Route wird hervorgehoben.
- `useGo()` (`lib/nav.js`): auf `/` sanftes Scrollen; von Unterseiten erst `navigate('/', {state:{scrollTo}})`,
  dann scrollt `ScrollManager` (in `App.jsx`).
- **Breiter Hero**: Hero + Navbar `max-w-[1800px]`; Content-Sektionen `max-w-7xl`.
- SPA-Fallback: `nginx.conf` (Prod), `public/_redirects` + `vercel.json` (Static-Hosts) → alle Routen direkt aufrufbar.

---

## 9. Deploy (GitHub + Raspi via Portainer)

- **Repo:** `https://github.com/Xepter1/Xepter.git` (public, Branch `main`). Push lokal mit dediziertem SSH —
  `GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519_webhosting -o IdentitiesOnly=yes' git push origin main`.
- **PROD-Stack:** Portainer-**Git-Stack** → Repo-URL + `docker-compose.yml` → klont, baut (Node-Build → nginx),
  Container auf **`:8088`**. Update-Flow: pushen → in Portainer „Pull and redeploy".
- **LAB-Stack:** Branch **`lab`** = Spielwiese, als separater Stack **`meine_website_lab`** auf **`:8089`**
  (eigene `container_name`/`image` `xepter-portfolio-lab`). ⚠️ Beim Mergen `lab`→`main` die Lab-`docker-compose.yml`
  (Port/Namen) NICHT mitnehmen. (Auf `lab` liegt das verworfene Lila-Theme-Experiment.)
- **SPA-Fallback** in `nginx.conf` (`try_files`). `dist/` ist `.gitignore`d → wird im Build erzeugt.
- **Offen:** Reverse-Proxy (Traefik/nginx-proxy) für eigene Domain statt Port.

---

## 10. Dev-Notizen / Stolperfallen

- **Preview-Tool rendert „hidden"** → (a) On-Load-Framer-Animationen frieren ein; (b) **setTimeout-Timer
  (Terminal-Sequenz) werden gebündelt** → Tipp-Animation rast durch / springt direkt zum Endzustand.
  Für Screenshots: CSS-Override injizieren (`*{opacity:1!important}`, `[style*="translate"]{transform:none}`),
  und für Standbilder des Reveals manuell `is-rendered` an `.device` setzen bzw. `.term` ausblenden.
  **Im echten Browser läuft alles korrekt** (Tempo ~3,5–4 s).
- **Container-Queries:** Terminal (`.term*`) und iMac-Admin (`.imac*/.pl*`) skalieren über `cqw` relativ zum
  jeweiligen Screen-Container (`container-type: inline-size`). Größen daher in `cqw`, nicht `px/rem`.
- **Prozent-Höhen ohne definierte Elternhöhe** vermeiden (führte beim iMac-`chin` dazu, dass das Logo in
  Originalgröße rendert) → feste/`clamp`-Höhen verwenden.
- **Tailwind v4 + neue Dep** → bei „multiple copies of React": `rm -rf node_modules/.vite`, Dev neu starten.
- **Bilder in /public**: gleicher Dateiname = Browser-Cache → Hard-Reload (Cmd+Shift+R).
- Accessibility: Reduced-Motion überall berücksichtigt, Fokus-Ringe, `width/height` auf Bildern (kein CLS).

---

## 11. Offene TODOs & Roadmap

**Vor Launch (Pflicht):**
1. **Rechtstexte füllen** — `.legal-todo`-Platzhalter in `ImpressumPage.jsx` & `DatenschutzPage.jsx`: vollständiger
   **Name**, echte **E-Mail** (statt `hallo@xepter.de`), **Telefon** (optional), **Hosting-Provider**.
   Adresse: `Am Himmelreich 7, 84166 Adlkofen`. (Vorlagen solide, aber kein Anwaltsersatz.)
2. **Kontakt scharf schalten** (`ContactPage.jsx`): echte `SOCIALS`-URLs, Mail-Adresse, `handleSubmit` an
   Endpunkt (Formspree/Resend/eigene Route) — aktuell nur Platzhalter-Erfolg.

**Geplante „Wow"-Ausbauten:**
3. **CMS-Showcase Phase 2**: Live-Edit-Animation (Cursor → „Erstellen" → Eintrag → Seite aktualisiert sich).
4. **Sicherheits-Sektion** mit Apple-artiger **Schloss-Animation** (SSL/DSGVO/Backups/Hosting-DE).
5. **Weitere Leistungs-Showcases** (Geräte-Familie fortführen): **Terminbuchung/Reservierung** (iPhone),
   **Mitglieder-/Login-Bereich**, Online-Shop/Zahlungen, Newsletter, KI-Chatbot, Mehrsprachigkeit.
6. MacBook-Klappmechanismus final polieren (vertagt).
