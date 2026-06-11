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
  gear/                    # GearScene-Frames Objektiv (s. §7b): d/<i>.webp + m/<i>.webp
  burger/                  # GearScene-Frames Burger (2. Sektion, Bild links, reverse)
scripts/
  process_gear_frames.py   # Video → freigestellte RGBA-Frame-Sequenz für GearScene (s. §7b)
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
    GearScene.jsx          # Wiederverwendbare Scroll-Frame-Explosion (Props): Canvas-Scrub aus WebP-Frames (s. §7b)
    About.jsx              # „Über mich": echte Bio + Portrait-Karte (nur Portrait, keine Stats)
    ContactCTA.jsx         # Abschluss-CTA auf der Startseite → /kontakt
    Footer.jsx             # Wordmark, Nav (Anchor|Route), Legal-Links, Back-to-top
    Icons.jsx              # Inline-SVG-Icons (Stroke 1.6)
    SectionMark.jsx        # Editorial Section-Kicker + Headline + Spark-Underline (Framer)
    LegalLayout.jsx        # Gemeinsames Layout für Impressum/Datenschutz
  pages/
    Home.jsx               # Hero → Projects → ContactCTA  (Leistungen & Über mich sind eigene Seiten!)
    LeistungenPage.jsx     # /leistungen — GearScene (Objektiv) → Leistungen → GearScene (Burger, links)
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

`LeistungenPage.jsx` rendert **zwei** Sektionen untereinander: zuerst den **Scroll-Frame-Hero
`<GearScene/>`** (s. §7b), darunter die CMS-Sektion `<Leistungen/>`.

`Leistungen.jsx`: **links** Verkaufstext „Deine Website **pflegst du** selbst." +
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

## 7b. Scroll-Frame-Animation „Explosion" (GearScene) — Hero von `/leistungen`

Apple-artiger Scroll-Scrub: ein Objekt **zerlegt sich beim Runterscrollen** in seine Einzelteile und
**setzt sich beim Hochscrollen** wieder zusammen. Faustregel fürs Motiv: **5–10 saubere Teile**.
Die Komponente ist **wiederverwendbar (Props)** und wird auf `/leistungen` **zweimal** eingesetzt,
Reihenfolge: **Burger → Objektiv → CMS** (`Leistungen.jsx`):
1. **Burger** (`dir="burger"`, Hochformat 1040×1377, **Bild rechts** `side="right"`). Das Video startet
   explodiert (Frame 0), läuft also **vorwärts → baut sich beim Runterscrollen ZUSAMMEN** (kein `reverse`).
   `still={96}` = fertiger Burger fürs Reduced-Motion-Standbild. Copy = „aufwendige Animationen" +
   Restaurant-Nutzen. (Motive davor: Kopfhörer, Getriebe.)
2. **Kamera-Objektiv** (`dir="gear"`, Querformat 1500×902, **Bild links** `side="left"`). Zerlegt sich
   beim Runterscrollen. Copy = Produkt-Präsentation.

GearScene-Props: `dir` (Asset-Ordner unter /public), `frameCount/frameW/frameH` (aus Skript-Output),
`side` ('right'|'left'), `reverse` (bool, Scroll-Richtung umkehren), `still` (Frame fürs Reduced-Motion-
Standbild, Default 0), `eyebrow`, `headline` (Array von Zeilen), `body`. Defaults = Objektiv.

**Mobil (<lg) anderes Layout** als Desktop (sonst lief die Headline in die Navbar und das Hochformat-
Motiv wurde unten abgeschnitten): der **Canvas füllt den ganzen Sticky-Viewport** (`absolute inset-0`,
Objekt contain-zentriert → immer voll sichtbar), die **Copy liegt als Overlay oben** (`absolute top-0`,
`pt-24` für Navbar-Abstand, dunkler Scrim) und **blendet beim Scrollen aus**
(`copyOpacity = useTransform(scrollYProgress,[0,0.22],[1,0])`, nur mobil via `isMobile`-State). Zusätzlich
**dunkelt eine Schicht das Objekt in der ersten Phase ab** (`dimOpacity [0,0.3]→[0.55,0]`, `lg:hidden`),
damit der Text abhebt; beim Scrollen hellt der volle Burger auf. Ab `lg` schalten `lg:static`/`lg:grid`
zurück auf den Zweispalter. Dynamische Canvas-Größe via Inline-`aspectRatio`.

**Performance / Last (wichtig bei 2 Sequenzen auf einer Seite):**
- **Lazy-Load pro Sektion** (IntersectionObserver, `rootMargin 120%`): die 2. Sektion lädt erst beim
  Heranscrollen, nicht beim Seitenaufruf.
- **Mobil nur jeder 2. Frame dekodiert** (`step=2` in loadAll) → halber RAM (dekodierte Bitmaps sind
  teuer; nearest-loaded Fallback zeichnet ungerade Indizes). Desktop alle Frames.
- **Canvas-DPR bei 2 gedeckelt** (3x-Handys sparen Fill-Rate). Schärfe kommt aus der Quell-Frame-Breite
  (Preset `mobile_w`: Objektiv 720, Burger 640; Desktop 1500/1040).
- **Prefetch:** `Home.jsx` wärmt im Leerlauf (`requestIdleCallback`) jeden 3. Burger-Frame der passenden
  Auflösung vor → Wechsel auf `/leistungen` startet sofort. Die Seite/Text laden ohnehin instant; Frames
  kommen progressiv nach (nie ein leeres Feld) → kein „Kunde sieht nichts"-Risiko. ⚠️ Dynamische Größe über **Inline-`aspectRatio`**, NICHT `aspect-[…]`-Tailwind (das würde
der JIT bei dynamischen Werten nicht erzeugen). Querformat-Motive wirken in der halben Spalte kleiner.

### Komponente `GearScene.jsx`
> Name ist historisch (war mal das Getriebe), Pfad/Ordner `gear` bewusst **nicht umbenannt**.

- Sektion ist **`height: 400vh`**, darin ein `sticky top-0`-Viewport (`h-[100svh]`). Das Bild bleibt
  stehen, während die 400vh durchgescrollt werden. **Diese Höhe = die Scroll-Strecke der Explosion**
  (höher = ruhiger/langsamer, niedriger = schneller).
- `useScroll({ target, offset: ['start start','end end'] })` liefert `scrollYProgress` 0→1.
  **Bewusst OHNE `useSpring`.** Rohes scrollYProgress ist 1:1 am Finger. (Eine Feder gab „Gewicht",
  hing bei schnellem Scrollen aber nach und las sich als **Ruckeln/Hänger**. Direkt = flüssig.)
- Pro Tick: `idx = round(progress * (FRAME_COUNT-1))`, gezeichnet auf ein `<canvas>` per `drawImage`.

**Das „flüssige" Geheimnis (3 Tricks):**
1. **Vor-dekodierte `ImageBitmap`s** statt `<img>`. `createImageBitmap(blob)` einmal beim Laden →
   `drawImage` ist danach ein billiger GPU-Blit, **kein WebP-Re-Decode pro Scroll-Tick** (das war die
   Hauptquelle für Jank).
2. **rAF-Coalescing**: pro Display-Frame max. **ein** `draw` (`scheduleDraw`), egal wie viele Scroll-
   Events feuern.
3. **Progressives Laden**: erst jeder 3. Frame (nach ~1/3 der Bytes scrubbar), dann der Rest. Fehlt ein
   Frame, wird der **nächstgelegene geladene** gezeichnet → nie ein Blank.

**⚠️ Echtes Alpha, KEIN `mix-blend-mode`.** Zuerst probiert: opake Frames auf Schwarz +
`mix-blend-mode: screen`. Im echten Browser wird der Blend aber vom **animierten Framer-Wrapper**
(opacity/transform erzeugen einen isolierten Stacking-Context) **isoliert**, dann bleibt das schwarze
Frame als **Kasten** stehen (im Preview fällt das nicht auf, im Browser sofort). **Lösung:** Frames sind
**RGBA mit echter Transparenz** und compositen direkt über die dunkle Seite. Kein Blend-Mode, bombenfest.

- **Parallax**: die linke Copy driftet via `useTransform(scrollYProgress,[0,1],[0,-64])` leicht nach oben.
- **reduced-motion**: kein Scrub, ein statisches Frame (`/gear/d/0.webp`) + Text.
- Maße als Konstanten oben in der Datei: **`FRAME_COUNT`, `FRAME_W`, `FRAME_H`** (+ `aspect-[FRAME_W/FRAME_H]`
  am `<canvas>`). **Bei neuem Video aktualisieren** — das Skript druckt die Werte.

### Frame-Pipeline `scripts/process_gear_frames.py` (OpenCV)
- **PRESETS-Dict** im Skript (ein Eintrag je Motiv) hält pro Video: `video`, `alpha`, `content_level`,
  `watermark`, `desktop_w`, `mobile_w`. Aufruf: **`python3 scripts/process_gear_frames.py <preset>`**
  (z. B. `gear` oder `burger`). **Output-Ordner = Preset-Name** → `public/<preset>/{d,m}/<i>.webp`.
  **Quellvideos liegen in `Bilder/` (gitignored)** — nur die WebPs sind getrackt.
- Schritte pro Frame: Wasserzeichen schwärzen → **Alpha aus der Helligkeit** (`smoothstep(ALPHA_LO..ALPHA_HI)`
  über die Luma) → **Auto-Crop** (Luma-BBox über alle Frames + Rand, fängt auch weit geflogene Teile) →
  auf `DESKTOP_W=1500` / `MOBILE_W=560` skalieren → RGBA-WebP. Zwei **Streaming**-Durchläufe (4K passt
  sonst nicht in den RAM).
- 🔑 **Die EINE wichtige Entscheidung pro Video — die Alpha-Schwelle (Hintergrund vs. Objekt):**
  - **Reines Schwarz als BG + evtl. dunkle Objektteile** (Kopfhörer mit schwarzen Polstern/Bügel):
    Schwelle **TIEF** → `ALPHA_LO=4, ALPHA_HI=12`, `CONTENT_LEVEL=10`. Sonst fallen die schwarzen Teile
    mit dem Hintergrund weg.
  - **Heller / Vignette-BG** (das alte Getriebe, Studio-Weiß/Grau bis Luma ~61): Schwelle **HOCH** →
    `ALPHA_LO=56, ALPHA_HI=86`. Sonst bleibt ein leuchtender Kasten stehen.
  - Vorgehen: kurz die Luma von Rand-BG vs. dunkelsten Objektteilen messen, Schwelle dazwischen legen.
- `WATERMARK = (y0,x0,y1,x1)` im Quell-Pixelraster (statisch, wird geschwärzt) **oder `None`** bei sauberem Export.
- **Auflösung:** 4K-Quelle ideal, weil das Herunterrechnen auf 1500px **supersampled = sehr sauber**.
  On-Screen-Decke ~1400–1600px, **true 4K NICHT ausliefern** (nur als Downsample-Quelle). Dunkle Motive
  (viel Schwarz) komprimieren klein: Kopfhörer 1500px ≈ **11 MB** Desktop / **3 MB** Mobil.

### Ein neues Video einbauen — Checkliste
1. Video in `Bilder/` legen. Beim Rendern (z. B. Kling): **reines Schwarz**, möglichst **ohne
   Wasserzeichen**, **4K**, kräftige Explosion aber **alle Teile im Bild lassen** (Luft drumherum).
2. **PRESET** im Skript anlegen (Key = Ausgabe-Ordner): `video`, `alpha` (Schwelle, s. o.),
   `content_level`, `watermark` (Box oder None), `desktop_w/mobile_w`. Hintergrund-Typ bestimmt die Schwelle.
3. `python3 scripts/process_gear_frames.py <preset>` → druckt `dir / frameCount / frameW / frameH` (4K ≈ 1 min).
4. Eine **`<GearScene .../>`-Instanz** in `LeistungenPage.jsx` mit diesen Props einsetzen (`dir`,
   `frameCount`, `frameW`, `frameH`, `side`, ggf. `reverse`, `eyebrow`, `headline`, `body`).
5. Im **echten Browser** scrollen prüfen (Preview kann nicht scrollen, s. §10) → committen → Portainer redeploy (§9).

Tipp: **`reverse`** setzen, wenn das Video „falsch herum" ist (assembled bei Frame 0). Bottom-Glow/Lichthof
im Quellvideo (kein reines Schwarz unten) per `watermark`-Box als ganzen Bodenstreifen wegschwärzen.

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
- **Scroll-getriebene Inhalte (GearScene, §7b) lassen sich im Preview NICHT abspielen** — das Preview
  rendert „hidden", der Scroll friert ein und das `<canvas>` bekommt keine Layout-Größe (bleibt 1×1).
  Verifikation stattdessen: das **Compositing** prüfen, indem man einen Frame als `<img>` über `#07080c`
  injiziert und screenshottet; den **Scrub-Flow** muss der User im echten Browser bestätigen.
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
