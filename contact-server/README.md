# Kontaktformular-Dienst (`form.xepter.de`)

> Selbst gehosteter Backend-Dienst, der das Kontaktformular von **xepter.de**
> entgegennimmt und per SMTP an `mail@xepter.de` mailt — **kein Drittanbieter**
> (kein Formspree/Calendly), passend zur „alles selbst gehostet"-Datenschutz-Story.
> Gebaut & live gegangen am **2026-06-16**.

---

## Was es macht

1. Das Formular auf `/kontakt` (React, [`src/pages/ContactPage.jsx`](../src/pages/ContactPage.jsx))
   schickt die Felder per `fetch` (JSON) an **`https://form.xepter.de/api/kontakt`**.
2. Der Dienst (`contact-server/`) validiert, prüft Honeypot + Rate-Limit und sendet:
   - **(1) die Anfrage an Patrick** (`mail@xepter.de`, `Reply-To` = Besucher),
   - **(2) eine automatische Eingangsbestätigung an den Besucher** (best-effort,
     inkl. Signatur — siehe unten).
3. Das Formular zeigt Erfolg / Fehler. Bei Fehler: sichtbarer Fallback auf `mail@xepter.de`.

**Warum kein `mailto:` mehr?** Das alte Formular öffnete nur das Mailprogramm des
Besuchers. Wer Webmail (Gmail im Browser) nutzt oder kein Mailprogramm eingerichtet
hat, bei dem versickerte die Anfrage lautlos — und das alte UI meldete trotzdem
„gesendet". Der eigene Dienst nimmt **jede** Anfrage zuverlässig entgegen.

---

## Architektur (passt ins Hetzner-Multi-Tenant-Setup)

```
Browser (xepter.de)
   │  POST https://form.xepter.de/api/kontakt
   ▼
CADDY (caddy-docker-proxy, label-basiert)   ── form.xepter.de → :8080
   ▼
xepter-contact (dieser Dienst, Node, Port 8080, im Netz `caddy`)
   │  SMTP (STARTTLS, Port 587)
   ▼
mail.your-server.de  →  mail@xepter.de (Hetzner-Postfach)
```

- **Läuft im selben Portainer-Git-Stack `xepter`** wie die Website (Service `form` in
  [`compose.hetzner.yml`](../compose.hetzner.yml)). Deploy = der gewohnte
  „Pull and redeploy" am `xepter`-Stack. Die **3 Kundenseiten** (ade,
  designbyems, symphonieorchester) sind **eigene Stacks** und werden nie berührt.
- **Eigene Subdomain** `form.xepter.de` (DNS-A-Record → `46.225.209.78`, Hetzner-DNS).
  Caddy holt das HTTPS-Zertifikat automatisch über das `caddy: form.xepter.de`-Label.
- **Kein Framework** — nur Node + `nodemailer`. Minimale Angriffsfläche.

---

## Konfiguration (Environment im Portainer-Stack `xepter`)

> ⚠️ **Niemals ins Git.** Diese Werte werden in Portainer am Stack als
> „Environment variables" gesetzt; `compose.hetzner.yml` referenziert sie mit
> sicheren Defaults (`:-`), sodass der Stack auch ohne sie hochfährt.

| Variable | Wert | Hinweis |
|---|---|---|
| `SMTP_HOST` | `mail.your-server.de` | Hetzner-Mailserver |
| `SMTP_PORT` | **`587`** | **NICHT 465!** siehe Stolperfalle unten |
| `SMTP_USER` | `mail@xepter.de` | Postfach-Benutzer |
| `SMTP_PASS` | *(Postfach-Passwort)* | nur in Portainer |
| `MAIL_FROM` | `mail@xepter.de` | Absender |
| `MAIL_TO`   | `mail@xepter.de` | Empfänger der Anfragen |
| `ALLOW_ORIGIN` | `https://xepter.de,https://www.xepter.de` | CORS (Default im Code) |

Endpunkt im Frontend überschreibbar via `VITE_CONTACT_ENDPOINT` (Default
`https://form.xepter.de/api/kontakt`).

---

## ⚠️ Stolperfallen (heute live gelernt)

1. **Port 465 ist auf dem Hetzner-Server ausgehend blockiert** (`ETIMEDOUT`),
   **587 (STARTTLS) geht.** Der Code setzt `secure` nur bei Port 465; bei 587 wird
   `requireTLS` erzwungen. → **Immer `SMTP_PORT=587`.** (Test:
   `docker exec xepter-contact node -e '…net.connect…'`.)
2. **DNS-Negativ-Cache:** Nach dem Anlegen von `form.xepter.de` lösen Geräte/Resolver,
   die die Subdomain *vorher* schon angefragt hatten, sie bis zur **Negativ-TTL der
   Zone (SOA-Minimum = 3600 s = 1 h)** noch als „existiert nicht" auf → Formular wirft
   beim Tester einen Fehler, obwohl der Dienst läuft. **Frische Besucher sind nicht
   betroffen.** Test über Mobilfunk / `1.1.1.1` / DNS-Flush.
3. **Auto-Reply an Fake-Adressen bouncet** (z. B. `frss@djd.de` → `550 5.4.1`). Der
   Bounce landet bei `mail@xepter.de` → Patrick merkt Tippfehler-Adressen und hat
   trotzdem die Originalanfrage. Erwartetes Verhalten, kein Bug.

---

## Spam-Schutz & Robustheit

- **Honeypot**: verstecktes Feld `firma`; ist es gefüllt → still `200`, **nichts senden**.
- **Rate-Limit**: 5 Anfragen / 10 min pro IP (In-Memory, `X-Forwarded-For` von Caddy).
- **Body-Limit** 20 KB, E-Mail-Format-Check, Pflichtfelder Name/E-Mail/Nachricht.
- **SMTP-Timeouts** (connection/greeting/socket) → bei Mailproblemen zügiger `502`
  statt 30-s-Hänger.
- **Auto-Reply ist best-effort**: ein Fehler dabei wird nur geloggt und gefährdet die
  Hauptmail an Patrick nicht.

---

## Eingangsbestätigung & Signatur

Die automatische Bestätigung („deine Anfrage ist angekommen, Antwort < 24 h") enthält
**Patricks E-Mail-Signatur** (Logo, *Patrick Fraunhofer · Webdesigner*, Tel/Mail/Web,
Social-Icons, „Weil der erste Eindruck zählt."). Die Signatur-HTML ist **1:1 aus**
`~/Library/Mobile Documents/com~apple~CloudDocs/Xepter/05_Marketing/Signatur/Signatur_fix.command`
übernommen (als `SIGNATURE_HTML` in `server.js`). Die Bilder werden von
**`https://xepter.de/email/*.png`** geladen (öffentlich aus `public/email/`).
→ Bei Signatur-Änderung beide Stellen pflegen.

---

## 📨 Offen / nächster Schritt: Zustellbarkeit (DKIM/DMARC)

Damit die **Bestätigung an externe Kunden** (Gmail/Outlook) sicher im **Posteingang**
statt im Spam landet, sollten für `xepter.de` noch eingerichtet werden:
- **DKIM** (im Hetzner-Mail-Panel aktivieren → den genannten TXT-Record in die
  Hetzner-DNS-Zone eintragen). Stand 2026-06-16: **keiner** mit Selektoren
  `dkim/default/mail` gefunden.
- **DMARC** (`_dmarc.xepter.de` TXT, z. B. `v=DMARC1; p=none; rua=mailto:mail@xepter.de`).
  Stand 2026-06-16: **fehlt**.
- **SPF** existiert (`v=spf1 +a +mx ?all`) — das `?all` ggf. auf `~all` schärfen.

Das verbessert auch Patricks normale Mails aus Apple Mail.

---

## Deploy & Verifikation

**Code-Weg:** Änderung an `contact-server/` oder `compose.hetzner.yml` → nach `main`
pushen → am `xepter`-Stack in Portainer **„Pull and redeploy"**. (Heute wurde das
Feature **zweistufig** ausgerollt: erst Backend isoliert + per `curl` getestet, dann
das Formular-Frontend umgestellt — Historie siehe Git-Log `feat(kontakt): …`.)

**Schnelltests (vom Server oder mit `--resolve` lokal):**
```bash
# Health
curl -s https://form.xepter.de/healthz                      # -> {"ok":true}

# echte Test-Anfrage (löst Mail an mail@xepter.de + Auto-Reply aus)
curl -s -X POST https://form.xepter.de/api/kontakt \
  -H 'Content-Type: application/json' -H 'Origin: https://xepter.de' \
  -d '{"name":"Test","email":"DEINE@gmail.com","message":"Hallo"}'   # -> {"ok":true}

# Logs
docker logs xepter-contact --tail 30
```
> Hinweis: Erfolgreiche Sends werden **nicht** geloggt (nur Fehler). „Keine Logzeile"
> heißt also: entweder ok, oder die Anfrage kam nie an (DNS, s. Stolperfalle 2).

---

## Dateien

| Datei | Zweck |
|---|---|
| `contact-server/server.js` | der Dienst (HTTP + nodemailer + Signatur + Auto-Reply) |
| `contact-server/Dockerfile` | Node-20-alpine, lauscht 8080 |
| `contact-server/package.json` | einzige Dependency: `nodemailer` |
| `compose.hetzner.yml` → Service `form` | Container + Caddy-Label `form.xepter.de` |
| `src/pages/ContactPage.jsx` | Frontend-Formular (fetch statt mailto) |

Server-Gesamtkontext (Hetzner, Caddy, Portainer, DNS): siehe das
**Hosting-Handbuch** (Obsidian, „Hetzner VPS"), Go-Live #3.
