# Xepter — Portfolio · Architektur & Stand

> Persönliche Portfolio-Website von **Xepter** (Freelance Webentwickler,
> Wirtschaftsingenieur-Student). Leitsatz: **„Der erste Eindruck entscheidet."**
> Premium, dunkel, ruhig — mit gezielten „Wow"-Momenten.
> Stand: Juni 2026 · fast launch-ready.

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
index.html                 # Font-Links, Meta, Theme-Color
vite.config.js             # react + tailwindcss Plugins, server.host
vercel.json                # SPA-Rewrite (alle Routen → index.html)
Dockerfile                 # Multi-Stage: Node-Build → nginx-Serve (s. §9)
nginx.conf                 # nginx-Config mit SPA-Fallback (try_files → index.html)
docker-compose.yml         # Portainer-Git-Stack: build . → Port 8088:80
.dockerignore              # schlanker Build-Context
public/
  favicon.svg
  _redirects               # SPA-Fallback (Netlify/Cloudflare)
  projects/                # Desktop-Screenshots 1280×800 .jpg (Browser-Frame)
    mobile/                # Mobile-Screenshots 240×520 .jpg (im iPhone)
src/
  main.jsx
  index.css                # >>> Design-Tokens + ALLE bespoke CSS (s. §3) <<<
  App.jsx                  # Router + MotionConfig + ScrollManager + ScrollProgress
  lib/
    anim.js                # Motion-Varianten: fadeUp, fadeIn, stagger, inView, EASE
    nav.js                 # useGo() — Smart-Scroll / Cross-Page-Navigation
  components/
    Navbar.jsx             # Fixed Nav, Glass-on-Scroll, Mobile-Menü, EIN „Kontakt"-CTA
    Hero.jsx               # Headline + CTAs + <Macbook/> (breites max-w-[1800px] Layout)
    Macbook.jsx            # Reiner CSS-3D-MacBook (s. §4)
    Projects.jsx           # Galerie: Browser-Frame + iPhone-Overlay (s. §5)
    About.jsx              # „Über mich" + echte Bio + Portrait-Karte (public/xepter-portrait.jpg) + Stats
    Services.jsx           # 4 Leistungs-Cards
    ContactCTA.jsx         # Abschluss-CTA auf der Startseite → /kontakt
    Footer.jsx             # Wordmark, Nav, Legal-Links, Back-to-top
    Icons.jsx              # Inline-SVG-Icons (Stroke 1.6)
    LegalLayout.jsx        # Gemeinsames Layout für Impressum/Datenschutz
  pages/
    Home.jsx               # Hero → Projects → About → Services → ContactCTA
    ContactPage.jsx        # /kontakt — eigene Seite, Formular + Socials
    ImpressumPage.jsx      # /impressum
    DatenschutzPage.jsx    # /datenschutz
```

---

## 3. Design-System (`src/index.css`, Block `@theme`)

**Surfaces:** `--color-base #07080c` · `--color-panel #0c0e14` · `--color-card #111420` · `--color-card-2 #161a28`
**Ink:** `--color-ink #f3f6fb` · `--color-ink-dim #aab2c2` · `--color-ink-faint #6b7384`
**Lines:** `--color-line rgba(255,255,255,.08)` · `--color-line-2 rgba(255,255,255,.14)`
**Akzent (elektrisches Violett):** `--color-accent #bf5af2` · `--color-accent-2 #8b3df0` · `--color-accent-soft`
**Fonts:** `--font-display` (Clash Display) · `--font-sans` (Satoshi) · `--font-mono` (JetBrains Mono)
**Easing:** `--ease-out-expo cubic-bezier(.16,1,.3,1)`

Wiederverwendbare Klassen in `index.css`: `.eyebrow`, `.text-gradient`, `.btn`/`.btn-primary`/`.btn-ghost`,
`.glass`, `.glow`, `.grain`, `.grid-bg`, `.hairline`, `.browser*`, `.phone*`, `.legal-prose`, `.legal-todo`.
Tailwind v4 macht aus den Tokens automatisch Utilities (`bg-base`, `text-ink`, `border-line`, `font-display`, `text-accent` …).

---

## 4. MacBook (Hero) — `Macbook.jsx` + CSS `.device/.lid/.lid-shell/.lid-back/.screen/.base`

Reiner CSS-3D-MacBook, der beim Laden aufklappt und „Xepter" aufs Display bootet.

- `.device` Ruhepose `rotateX(8deg)` (frontal, kein Y-Tilt). `--bezel: clamp(6px,0.76vw,11px)` → Rahmen
  skaliert proportional (auf Mobile schmal wie Desktop).
- `.lid` **geschlossen** `rotateX(-100deg)` (flach, Alu-Rückseite zur Kamera) → **offen** `.is-open` `rotateX(-3deg)`.
  Transition **2,1 s `cubic-bezier(0.62,0.01,0.3,1)`** (gewichtetes Scharnier, kein Bounce). `transform-origin: 50% 100%`.
- `.lid-shell` = Vorderseite (Display) mit `backface-visibility:hidden`; `.lid-back` = Alu-Rückseite
  (`rotateY(180deg)`), nur sichtbar wenn geschlossen → sieht aus wie ein echter zugeklappter MacBook.
- Öffnet auf Mount nach **650 ms** (`setOpen`). Cursor-Parallaxe schwingt um die Basis. Reduced-Motion = sofort offen.
- Brand-Reveal verzögert (1,45 s), bootet erst wenn der Deckel weit offen ist.
- **Offen (TODO/vertagt):** Klappmechanismus soll noch finalen Feinschliff bekommen.

---

## 5. Projekt-Galerie + Responsive-Showcase — `Projects.jsx`

- 3 Projekte, alternierende Rows (`flip = index % 2`). Jede Row: **Browser-Frame** (Desktop-Screenshot)
  + **iPhone-Overlay** (Mobile-Screenshot) an der unteren Außen-Ecke → zeigt die Responsivität.
- iPhone = reines CSS (`.phone`, `.phone-screen`, `.phone-island` = Dynamic Island, Seitentasten, Glas-Reflex).
  Wechselt die Seite je Row (`.phone-overlay--right/--left`).
- Daten pro Projekt: `{ name, desc, tag, url, img, imgMobile, accent }`.
  Bild-Fehler → gebrandete Fallback-Kachel.
- Projekte: **Landshuter Symphonieorchester**, **DesignbyEms**, **Tankstelle Stettner**.

### Screenshots (so wurden sie erzeugt)
Per **Microlink** (Free-Tier) aufgenommen, lokal gespeichert & mit macOS `sips` optimiert → **keine Laufzeit-Abhängigkeit**.
Aufnahme mit **`viewport.deviceScaleFactor=2`** (Retina) für gestochen scharfe Bilder, danach auf Anzeige-Größe herunterskaliert:
- Desktop: `viewport 1280×800 @2×` (→ 2560×1600 PNG), `sips --resampleWidth 1600 -s format jpeg -s formatOptions 88` → `public/projects/*.jpg` (1600×1000)
- Mobile: `viewport 390×844 isMobile @2×` (→ 780×1688 PNG), `sips --resampleWidth 560 ... formatOptions 88` → `public/projects/mobile/*.jpg` (560×1212)
- Bei Änderung der Live-Seite: Microlink-URL mit **`&force=true`** (busted Cache), neu laden, `sips`, ersetzen.
  (Microlink-API: `https://api.microlink.io/?url=…&screenshot=true&meta=false&force=true&viewport.width=…&viewport.deviceScaleFactor=2`.)

---

## 6. Routing & Layout

- Routen: `/` (Home) · `/kontakt` · `/impressum` · `/datenschutz`.
- Sektions-Links nutzen `useGo()` (`lib/nav.js`): auf `/` sanftes Scrollen, von Unterseiten erst
  `navigate('/', { state:{scrollTo} })`, dann scrollt `ScrollManager` (in `App.jsx`).
- **Kontakt vereinheitlicht**: nur EIN Eintrag (CTA-Button), das Formular liegt auf der eigenen Seite `/kontakt`
  (nicht mehr unten auf der Startseite).
- **Breiter Hero**: Hero + Navbar nutzen `max-w-[1800px]` (Text links / MacBook rechts am Rand, `justify-self-end`).
  Content-Sektionen darunter bleiben bewusst schmaler (`max-w-7xl`) für Lesbarkeit.
- SPA-Fallback für Static-Hosts: `public/_redirects` + `vercel.json`.

---

## 7. Offene TODOs (vor Launch)

1. **Rechts-Platzhalter füllen** — alle cyan via `.legal-todo` markiert in `ImpressumPage.jsx` & `DatenschutzPage.jsx`:
   vollständiger **Name** (Pflicht), echte **E-Mail** (statt `hallo@xepter.de`), **Telefon** (optional),
   **Hosting-Provider** (Datenschutz §3). Adresse: `Am Himmelreich 7, 84166 Adlkofen` (PLZ aus „874166" korrigiert).
2. **Kontakt scharf schalten** (`ContactPage.jsx`): `SOCIALS` mit echten URLs, Mail-Adresse, und `handleSubmit`
   an einen Endpunkt hängen (Formspree / Resend / eigene Route) — aktuell nur Platzhalter-Erfolg.
3. **MacBook-Klappmechanismus** final polieren (vertagt).
4. Optional: Mobile-MacBook geschlossen/Klapp-Look final checken.

Hinweis Recht: Vorlagen sind solide & aktuell (DDG, §36 VSBG, BayLDA, kein toter ODR-Link), aber **kein
Anwaltsersatz** — im Zweifel mit einem Generator (e-recht24) gegenchecken.

---

## 9. Deploy (GitHub + Raspi via Portainer)

- **Repo:** `https://github.com/Xepter1/Xepter.git` (public, Branch `main`). Push lokal mit dediziertem SSH —
  `GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519_webhosting -o IdentitiesOnly=yes' git push origin main`.
- **Raspi-Testumgebung:** Portainer-**Git-Stack** → Repo-URL + `docker-compose.yml` als Compose-Pfad → Deploy.
  Portainer klont, baut das Image (Node-Build → nginx) und startet den Container. Erreichbar unter `:8088`.
- **SPA-Fallback** liegt in `nginx.conf` (`try_files $uri $uri/ /index.html`) → `/kontakt`, `/impressum`,
  `/datenschutz` funktionieren auch bei direktem Aufruf/Reload. `dist/` ist `.gitignore`d → wird im Build erzeugt.
- Update-Flow: pushen → in Portainer Stack „Pull and redeploy". Port in `docker-compose.yml` (`8088:80`) anpassbar.
- **Offen:** Reverse-Proxy-Anbindung (Traefik/nginx-proxy) für eigene Domain statt Port — Labels noch nicht gesetzt.

---

## 8. Dev-Notizen / Stolperfallen

- **Preview-Tool rendert die Seite „hidden"** → On-Load-Framer-Motion-Animationen frieren ein und gescrollte
  Bereiche repainten nicht. Für Screenshots: CSS-Override injizieren
  (`[style*="opacity: 0"]{opacity:1!important}`, `.lid{transform:…!important}` etc.) + ganze Seite via hohem
  Viewport bei Scroll 0 in den initial gepainteten Bereich holen. **Im echten Browser läuft alles normal.**
- **Tailwind v4 + neue Dep** → bei „Invalid hook call / multiple copies of React": `rm -rf node_modules/.vite`
  und Dev-Server neu starten (Optimizer-Cache).
- **Bilder im /public**: gleicher Dateiname = Browser-Cache. Nach Ersetzen **Hard-Reload (Cmd+Shift+R)**.
- Accessibility: Reduced-Motion überall berücksichtigt, Fokus-Ringe, `width/height` auf Bildern (kein CLS).
