import LegalLayout from '../components/LegalLayout'

/*
 * TODO (Xepter) vor dem Launch:
 * - <mark class="legal-todo"> Platzhalter ersetzen: Name, E-Mail, Hosting-Provider.
 * - Wenn du später Analyse/Tracking, Schriften von Drittservern (aktuell lokal
 *   eingebunden!), Maps, Fonts-CDN o. Ä. nutzt: hier ergänzen.
 * - Solide DSGVO-Vorlage — im Zweifel mit einem Generator (e-recht24 / Datenschutz-
 *   Generator) gegenchecken.
 */
export default function DatenschutzPage() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="Datenschutz"
      intro="Der Schutz deiner persönlichen Daten ist mir wichtig. Hier erfährst du, welche Daten beim Besuch dieser Website verarbeitet werden — und welche Rechte du hast."
    >
      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist:
        <br />
        <mark className="legal-todo">[Vollständiger Vor- und Nachname]</mark>
        <br />
        Am Himmelreich 7, 84166 Adlkofen
        <br />
        E-Mail:{' '}
        <a href="mailto:hallo@xepter.de">
          <mark className="legal-todo">hallo@xepter.de</mark>
        </a>
      </p>

      <h2>2. Zugriffsdaten &amp; Server-Logfiles</h2>
      <p>
        Beim Aufruf dieser Website werden durch den Hosting-Anbieter automatisch
        Informationen erfasst, die dein Browser übermittelt und technisch
        erforderlich sind, um die Seite anzuzeigen (sog. Server-Logfiles). Dazu
        gehören in der Regel: Browsertyp und -version, verwendetes Betriebssystem,
        Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage
        und die IP-Adresse.
      </p>
      <p>
        Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und dienen
        ausschließlich dem sicheren, stabilen Betrieb der Website. Rechtsgrundlage
        ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem fehlerfreien
        und sicheren Betrieb).
      </p>

      <h2>3. Hosting</h2>
      <p>
        Diese Website wird bei{' '}
        <mark className="legal-todo">[Hosting-Provider, z. B. Vercel / Netlify]</mark>{' '}
        gehostet. Der Anbieter verarbeitet die unter Ziffer 2 genannten Daten in
        unserem Auftrag zur Bereitstellung der Website. Mit dem Anbieter besteht ein
        Vertrag zur Auftragsverarbeitung (AVV) gemäß Art. 28 DSGVO. Rechtsgrundlage
        ist Art. 6 Abs. 1 lit. f DSGVO.
      </p>

      <h2>4. Kontaktaufnahme</h2>
      <p>
        Wenn du uns über das Kontaktformular oder per E-Mail kontaktierst, werden
        deine Angaben (z. B. Name, E-Mail-Adresse, Nachricht) zur Bearbeitung deiner
        Anfrage gespeichert. Rechtsgrundlage ist — je nach Anliegen — Art. 6 Abs. 1
        lit. b DSGVO (vorvertragliche Maßnahmen / Vertrag) bzw. Art. 6 Abs. 1 lit. f
        DSGVO (berechtigtes Interesse an der Beantwortung). Diese Daten werden
        gelöscht, sobald sie zur Erreichung des Zwecks nicht mehr erforderlich sind
        und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
      </p>

      <h2>5. Cookies &amp; Tracking</h2>
      <p>
        Diese Website verwendet keine Tracking-Cookies und keine Analyse- oder
        Marketing-Tools. Schriften und Skripte werden direkt von dieser Website
        ausgeliefert. Es findet keine Profilbildung statt.
      </p>

      <h2>6. Deine Rechte</h2>
      <p>Dir stehen nach der DSGVO insbesondere folgende Rechte zu:</p>
      <ul>
        <li>Auskunft über die verarbeiteten Daten (Art. 15 DSGVO)</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
        <li>Löschung (Art. 17 DSGVO)</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
        <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
      </ul>
      <p>
        Zudem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu
        beschweren (Art. 77 DSGVO). Zuständig ist u. a. das Bayerische Landesamt für
        Datenschutzaufsicht (BayLDA),{' '}
        <a
          href="https://www.lda.bayern.de/"
          target="_blank"
          rel="noopener noreferrer"
        >
          lda.bayern.de
        </a>
        .
      </p>

      <h2>7. SSL-/TLS-Verschlüsselung</h2>
      <p>
        Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
        vertraulicher Inhalte eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte
        Verbindung erkennst du am „https://" in der Adresszeile deines Browsers.
      </p>

      <h2>8. Aktualität</h2>
      <p>
        Stand: Juni 2026. Wir behalten uns vor, diese Datenschutzerklärung
        anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen
        entspricht oder um Änderungen unserer Leistungen umzusetzen.
      </p>
    </LegalLayout>
  )
}
