# Xepter — Portfolio

> Der erste Eindruck entscheidet.

Premium-Portfolio-Website. Tiefes Schwarz, elektrisches Cyan-Blau, ein aufklappender
CSS-3D-MacBook im Hero, der die Marke **Xepter** auf dem Display enthüllt.

## Stack

- **React 18** + **Vite 6**
- **Tailwind CSS v4** (CSS-first `@theme` Tokens in `src/index.css`)
- **Framer Motion** (Scroll-Reveals, Hero-Sequenz, `reducedMotion="user"`)
- Fonts: **Clash Display** + **Satoshi** (Fontshare) · **JetBrains Mono** (Google)

## Loslegen

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Produktions-Build nach /dist
npm run preview  # Build lokal testen
```

## Aufbau

```
src/
  App.jsx                 # Komposition + Scroll-Progress + Grain
  index.css               # Design-Tokens, Buttons, MacBook-3D, Glows, Grain
  lib/anim.js             # Motion-Varianten (fadeUp, stagger …)
  lib/nav.js              # useGo() — Smart-Scroll/Routing für Sektions-Links
  pages/
    Home.jsx              # Startseite: Hero → Projekte → Über → Leistungen → CTA
    ContactPage.jsx       # Eigene Seite /kontakt (Formular + Socials)
  components/
    Navbar.jsx            # Fixed Nav, Glass-on-Scroll, Mobile-Menü
    Hero.jsx              # Headline + CTAs
    Macbook.jsx           # Reiner CSS-3D-MacBook, klappt auf Load auf (¾-Ansicht)
    Projects.jsx          # Galerie (alternierende Showcase-Reihen)
    About.jsx             # Über mich + Stats + Monogramm
    Services.jsx          # Leistungen (4 Cards)
    ContactCTA.jsx        # Abschluss-CTA auf der Startseite → /kontakt
    Footer.jsx
    Icons.jsx             # Inline-SVG-Icons (1.6 Stroke)
public/projects/          # Projekt-Screenshots (lokal, optimiert)
```

## Routing

- `/` → Startseite · `/kontakt` → eigene Kontaktseite (React Router).
- Sektions-Links scrollen auf der Startseite sanft; von der Kontaktseite aus
  wird erst nach Hause navigiert, dann gescrollt (`ScrollManager` in `App.jsx`).
- SPA-Fallback für statische Hosts liegt bei: `public/_redirects` (Netlify/
  Cloudflare) und `vercel.json` (Vercel) — damit `/kontakt` auch bei direktem
  Aufruf `index.html` ausliefert.

## Anpassen

**Akzentfarbe / Farben** → `src/index.css`, Block `@theme`
(`--color-accent`, `--color-accent-2`, Surfaces, Ink).

**Projekte** → `src/components/Projects.jsx`, Array `PROJECTS`.
Jedes Projekt hat zwei Screenshots:
- Desktop: `public/projects/*.jpg` (1280×800) — im Browser-Frame
- Mobile: `public/projects/mobile/*.jpg` (240×520) — im CSS-iPhone (Dynamic
  Island), das über der Browser-Ecke schwebt und die Responsivität zeigt.
Einfach die Dateien ersetzen. Fällt ein Bild aus, greift automatisch eine
gebrandete Fallback-Kachel.

**Über mich / Leistungen** → Texte direkt in `About.jsx` / `Services.jsx`.

**Kontakt — noch zu erledigen** (`src/pages/ContactPage.jsx`):
- `SOCIALS` mit echten Links füllen (GitHub, LinkedIn, Instagram).
- `hallo@xepter.de` durch die echte E-Mail-Adresse ersetzen.
- Formular an einen Endpunkt hängen (Formspree, Resend, eigene API-Route)
  und `handleSubmit` ersetzen. Aktuell zeigt es nur einen Platzhalter-Erfolg.

## Hinweise

- Die Hero-Sequenz (MacBook-Aufklappen, Headline-Reveal) läuft beim Laden.
  Bei aktivierter Systemeinstellung *„Bewegung reduzieren"* erscheint alles
  sofort ohne Animation.
- Bilder sind als optimierte JPEGs (~90–175 KB) eingebunden; `width`/`height`
  gesetzt, um Layout-Shift (CLS) zu vermeiden.

## Deploy

Statischer Build — läuft auf Vercel, Netlify, Cloudflare Pages o. Ä.
`npm run build`, dann `/dist` deployen.
