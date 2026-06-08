import LegalLayout from '../components/LegalLayout'

/*
 * TODO (Xepter) vor dem Launch:
 * - <mark class="legal-todo"> Platzhalter ersetzen: vollständiger Name, E-Mail,
 *   ggf. Telefon. Adresse/PLZ prüfen (84166 Adlkofen angenommen).
 * - Diese Vorlage deckt den Standardfall einer Einzelperson/Freelancer ab.
 *   Bei Gewerbe/USt-IdNr/Kleinunternehmer ggf. ergänzen. Im Zweifel kurz mit
 *   einem Impressum-Generator (z. B. e-recht24) gegenchecken.
 */
export default function ImpressumPage() {
  return (
    <LegalLayout eyebrow="Rechtliches" title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        <mark className="legal-todo">[Vollständiger Vor- und Nachname]</mark>
        <br />
        Am Himmelreich 7
        <br />
        84166 Adlkofen
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail:{' '}
        <a href="mailto:hallo@xepter.de">
          <mark className="legal-todo">hallo@xepter.de</mark>
        </a>
        <br />
        <span className="text-ink-faint">
          (Telefonnummer optional —{' '}
          <mark className="legal-todo">[Telefon]</mark> ergänzen oder Zeile
          entfernen)
        </span>
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        <mark className="legal-todo">[Vollständiger Vor- und Nachname]</mark>,
        Anschrift wie oben.
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf
        diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis
        10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte
        oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
        forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen
        zur Entfernung oder Sperrung der Nutzung von Informationen nach den
        allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung
        ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
        Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
        Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
        wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
        keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
        jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten
        Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
        überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
        erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
        jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
        Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
        entfernen.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
        unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
        Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
        Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors
        bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten,
        nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite
        nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter
        beachtet. Solltest du trotzdem auf eine Urheberrechtsverletzung aufmerksam
        werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
        Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor
        einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).
      </p>
    </LegalLayout>
  )
}
