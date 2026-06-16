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
      await transporter.sendMail({
        from: MAIL_FROM,
        to: MAIL_TO,
        replyTo: `${name} <${email}>`,
        subject: subject ? `[xepter.de] ${subject}` : `[xepter.de] Anfrage von ${name}`,
        text,
        html,
      })
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
