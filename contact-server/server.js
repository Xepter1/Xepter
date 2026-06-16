/*
 * Xepter — Kontaktformular-Dienst
 * --------------------------------
 * Winziger, selbst gehosteter Endpunkt (kein Drittanbieter). Nimmt das
 * Kontaktformular von xepter.de per POST entgegen, prüft es und schickt die
 * Anfrage per SMTP an dein Postfach. Antwort-Adresse = die des Besuchers, damit
 * du direkt antworten kannst.
 *
 * Bewusst ohne Web-Framework (nur Node + nodemailer) → minimale Angriffsfläche.
 *
 * Konfiguration ausschließlich über Environment-Variablen (im Portainer-Stack
 * gesetzt, NIE im Git):
 *   PORT          Listen-Port im Container            (default 8080)
 *   SMTP_HOST     z. B. mail.your-server.de           (Hetzner-Mail)
 *   SMTP_PORT     465 (SSL) oder 587 (STARTTLS)       (default 465)
 *   SMTP_USER     Postfach-Benutzer, z. B. mail@xepter.de
 *   SMTP_PASS     Postfach-Passwort / App-Passwort
 *   MAIL_FROM     Absender, sollte = SMTP_USER sein   (default = SMTP_USER)
 *   MAIL_TO       Empfänger der Anfragen              (default = SMTP_USER)
 *   ALLOW_ORIGIN  erlaubte Herkunft/Herkünfte (Komma) (default https://xepter.de,https://www.xepter.de)
 */

import http from 'node:http'
import nodemailer from 'nodemailer'

const PORT = Number(process.env.PORT || 8080)
const SMTP_HOST = process.env.SMTP_HOST || ''
const SMTP_PORT = Number(process.env.SMTP_PORT || 465)
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER
const MAIL_TO = process.env.MAIL_TO || SMTP_USER
const ALLOW_ORIGIN = (process.env.ALLOW_ORIGIN || 'https://xepter.de,https://www.xepter.de')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const MAX_BODY = 20 * 1024 // 20 KB reichen für ein Kontaktformular dicke
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Ein wiederverwendbarer SMTP-Transport (Connection-Pool).
// Hinweis: Hetzner Cloud blockiert ausgehend oft Port 465 → 587 (STARTTLS) nutzen.
const SMTP_SECURE = SMTP_PORT === 465 // 465 = implizites TLS, 587 = STARTTLS
const transporter = nodemailer.createTransport({
  host: SMTP_HOST.replace(/\.$/, ''), // evtl. versehentlichen FQDN-Punkt entfernen
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  requireTLS: !SMTP_SECURE, // bei 587 STARTTLS erzwingen (kein Klartext-Login)
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  pool: true,
  maxConnections: 2,
  connectionTimeout: 10000, // nicht ewig hängen bleiben …
  greetingTimeout: 10000,
  socketTimeout: 15000, // … sondern zügig einen 502 zurückgeben
})

// --- simple In-Memory-Rate-Limit pro IP (5 Anfragen / 10 Min) ---
const HITS = new Map()
const WINDOW_MS = 10 * 60 * 1000
const MAX_HITS = 5
function rateLimited(ip) {
  const now = Date.now()
  const list = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  list.push(now)
  HITS.set(ip, list)
  return list.length > MAX_HITS
}

function clientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim()
  return req.socket.remoteAddress || 'unknown'
}

function corsHeaders(origin) {
  const allowed = origin && ALLOW_ORIGIN.includes(origin) ? origin : ALLOW_ORIGIN[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function sendJson(res, status, obj, extra = {}) {
  const body = JSON.stringify(obj)
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...extra })
  res.end(body)
}

function esc(s) {
  return String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
}

// Patricks E-Mail-Signatur (1:1 aus Signatur_fix.command). Bilder werden von
// https://xepter.de/email/ geladen (öffentlich ausgeliefert).
const SIGNATURE_HTML = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#140033;">
  <tr>
    <td valign="middle" style="padding:0 20px 0 0;">
      <img src="https://xepter.de/email/logo.png?v=5" width="156" height="57" alt="Xepter" style="display:block;border:0;outline:none;text-decoration:none;width:156px;height:57px;">
    </td>
    <td style="padding:0;width:2px;background:#7a2bd6;font-size:0;line-height:0;">&nbsp;</td>
    <td valign="middle" style="padding:0 0 0 20px;">
      <div style="font-size:17px;font-weight:bold;line-height:1.25;color:#140033;letter-spacing:-0.2px;">Patrick&nbsp;Fraunhofer</div>
      <div style="font-size:12px;font-weight:bold;line-height:1.4;color:#7a2bd6;letter-spacing:1.5px;text-transform:uppercase;padding-top:1px;">Webdesigner</div>
      <div style="height:9px;line-height:9px;font-size:0;">&nbsp;</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:1px 8px 1px 0;font-size:10px;font-weight:bold;letter-spacing:1px;color:#a98cd6;text-transform:uppercase;">Tel</td>
          <td style="padding:1px 0;font-size:13px;color:#140033;"><a href="tel:+4915144227255" style="color:#140033;text-decoration:none;">0151&nbsp;44227255</a></td>
        </tr>
        <tr>
          <td style="padding:1px 8px 1px 0;font-size:10px;font-weight:bold;letter-spacing:1px;color:#a98cd6;text-transform:uppercase;">Mail</td>
          <td style="padding:1px 0;font-size:13px;"><a href="mailto:mail@xepter.de" style="color:#7a2bd6;text-decoration:none;font-weight:bold;">mail@xepter.de</a></td>
        </tr>
        <tr>
          <td style="padding:1px 8px 1px 0;font-size:10px;font-weight:bold;letter-spacing:1px;color:#a98cd6;text-transform:uppercase;">Web</td>
          <td style="padding:1px 0;font-size:13px;"><a href="https://xepter.de" style="color:#7a2bd6;text-decoration:none;font-weight:bold;">xepter.de</a></td>
        </tr>
      </table>
      <div style="height:11px;line-height:11px;font-size:0;">&nbsp;</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:0 7px 0 0;"><a href="https://www.facebook.com/profile.php?id=61590947094348" style="text-decoration:none;"><img src="https://xepter.de/email/facebook.png?v=5" width="26" height="26" alt="Facebook" style="display:block;border:0;outline:none;text-decoration:none;width:26px;height:26px;"></a></td>
          <td style="padding:0 7px 0 0;"><a href="https://www.instagram.com/xepter.de" style="text-decoration:none;"><img src="https://xepter.de/email/instagram.png?v=5" width="26" height="26" alt="Instagram" style="display:block;border:0;outline:none;text-decoration:none;width:26px;height:26px;"></a></td>
          <td><a href="https://www.linkedin.com/company/129663999" style="text-decoration:none;"><img src="https://xepter.de/email/linkedin.png?v=5" width="26" height="26" alt="LinkedIn" style="display:block;border:0;outline:none;text-decoration:none;width:26px;height:26px;"></a></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding:13px 0 0 0;">
      <div style="border-top:1px solid #e0abff;padding-top:9px;font-size:13px;font-style:italic;color:#7a2bd6;font-weight:bold;letter-spacing:0.2px;">Weil der erste Eindruck z&auml;hlt.</div>
    </td>
  </tr>
</table>`

function buildAutoReplyHtml(name, message) {
  return `<!doctype html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#140033;font-size:15px;line-height:1.6;max-width:580px;margin:0 auto;padding:24px;">
  <p style="margin:0 0 14px;">Hallo ${esc(name)},</p>
  <p style="margin:0 0 14px;">vielen Dank f&uuml;r deine Nachricht &mdash; sie ist bei mir angekommen. Ich melde mich <strong>innerhalb von 24&nbsp;Stunden</strong> pers&ouml;nlich bei dir.</p>
  <p style="margin:0 0 6px;color:#6b6480;font-size:13px;">Das hast du mir geschrieben:</p>
  <blockquote style="margin:0 0 20px;padding:10px 14px;border-left:3px solid #7a2bd6;background:#f6f1fb;color:#3a3350;font-size:14px;white-space:pre-wrap;">${esc(message)}</blockquote>
  <p style="margin:0 0 24px;">Bis gleich,<br>Patrick</p>
  ${SIGNATURE_HTML}
</div>
</body></html>`
}

function buildAutoReplyText(name, message) {
  return `Hallo ${name},

vielen Dank für deine Nachricht — sie ist bei mir angekommen.
Ich melde mich innerhalb von 24 Stunden persönlich bei dir.

Das hast du mir geschrieben:
${message}

Bis gleich,
Patrick

—
Patrick Fraunhofer · Webdesigner
Tel 0151 44227255 · mail@xepter.de · https://xepter.de
Weil der erste Eindruck zählt.`
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const origin = req.headers.origin
  const cors = corsHeaders(origin)

  // Health-Check (für Container-/Uptime-Prüfung)
  if (req.method === 'GET' && url.pathname === '/healthz') {
    return sendJson(res, 200, { ok: true })
  }

  // CORS-Preflight
  if (req.method === 'OPTIONS' && url.pathname === '/api/kontakt') {
    res.writeHead(204, cors)
    return res.end()
  }

  if (req.method !== 'POST' || url.pathname !== '/api/kontakt') {
    return sendJson(res, 404, { ok: false, error: 'not_found' }, cors)
  }

  const ip = clientIp(req)
  if (rateLimited(ip)) {
    return sendJson(res, 429, { ok: false, error: 'rate_limited' }, cors)
  }

  let raw = ''
  let tooBig = false
  req.on('data', (chunk) => {
    raw += chunk
    if (raw.length > MAX_BODY) {
      tooBig = true
      req.destroy()
    }
  })
  req.on('end', async () => {
    if (tooBig) return sendJson(res, 413, { ok: false, error: 'too_large' }, cors)

    let data
    try {
      data = JSON.parse(raw || '{}')
    } catch {
      return sendJson(res, 400, { ok: false, error: 'bad_json' }, cors)
    }

    // Honeypot: echtes Formular lässt "firma" leer. Bot füllt es → still 200,
    // aber NICHTS senden.
    if (data.firma) return sendJson(res, 200, { ok: true }, cors)

    const name = String(data.name || '').trim()
    const email = String(data.email || '').trim()
    const phone = String(data.phone || '').trim()
    const subject = String(data.subject || '').trim()
    const message = String(data.message || '').trim()

    if (!name || !email || !message) {
      return sendJson(res, 422, { ok: false, error: 'missing_fields' }, cors)
    }
    if (!EMAIL_RE.test(email)) {
      return sendJson(res, 422, { ok: false, error: 'bad_email' }, cors)
    }

    const text =
      `Neue Anfrage über xepter.de\n\n` +
      `Name:    ${name}\n` +
      `E-Mail:  ${email}\n` +
      `Telefon: ${phone || '—'}\n` +
      `Betreff: ${subject || '—'}\n\n` +
      `Nachricht:\n${message}\n`

    const html =
      `<h2 style="font-family:sans-serif">Neue Anfrage über xepter.de</h2>` +
      `<p style="font-family:sans-serif"><b>Name:</b> ${esc(name)}<br>` +
      `<b>E-Mail:</b> ${esc(email)}<br>` +
      `<b>Telefon:</b> ${esc(phone || '—')}<br>` +
      `<b>Betreff:</b> ${esc(subject || '—')}</p>` +
      `<p style="font-family:sans-serif;white-space:pre-wrap">${esc(message)}</p>`

    try {
      // 1) Die wichtige Mail: Anfrage an Patrick. Scheitert die → 502.
      await transporter.sendMail({
        from: MAIL_FROM,
        to: MAIL_TO,
        replyTo: `${name} <${email}>`,
        subject: subject ? `[xepter.de] ${subject}` : `[xepter.de] Anfrage von ${name}`,
        text,
        html,
      })

      // 2) Best-Effort: Eingangsbestätigung an den Absender. Ein Fehler hier darf
      //    die erfolgreiche Anfrage an Patrick NICHT zunichtemachen → nur loggen.
      try {
        await transporter.sendMail({
          from: MAIL_FROM,
          to: email,
          replyTo: MAIL_TO,
          subject: 'Deine Anfrage ist angekommen — Xepter',
          text: buildAutoReplyText(name, message),
          html: buildAutoReplyHtml(name, message),
        })
      } catch (err) {
        console.error('[contact] auto-reply failed:', err?.message || err)
      }

      return sendJson(res, 200, { ok: true }, cors)
    } catch (err) {
      console.error('[contact] sendMail failed:', err?.message || err)
      return sendJson(res, 502, { ok: false, error: 'mail_failed' }, cors)
    }
  })
})

server.listen(PORT, () => {
  console.log(`[contact] listening on :${PORT} — allow: ${ALLOW_ORIGIN.join(', ')}`)
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('[contact] ⚠ SMTP_HOST/SMTP_USER/SMTP_PASS nicht gesetzt — Mailversand wird scheitern.')
  }
})
