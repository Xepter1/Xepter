import GearScene from '../components/GearScene'
import Leistungen from '../components/Leistungen'

export default function LeistungenPage() {
  return (
    <main className="relative min-h-screen">
      {/* 1. Burger — Bild rechts, Text links. Baut sich beim Runterscrollen ZUSAMMEN
            (Video startet explodiert -> kein reverse). Standbild = fertiger Burger. */}
      <GearScene
        dir="burger"
        frameCount={97}
        frameW={1040}
        frameH={1377}
        side="right"
        still={96}
        eyebrow="Motion"
        headline={['Sie wollen', 'aufwendige', 'Animationen?']}
        body="Scrollen Sie langsam weiter und sehen Sie, wie sich der Burger Stück für Stück zusammensetzt. Genau so hebe ich Ihre Restaurant-Website auf das nächste Level. Appetitlich, flüssig und ganz ohne Plugins."
      />

      {/* 2. Kamera-Objektiv — Bild links, Text rechts. Zerlegt sich beim Runterscrollen. */}
      <GearScene
        dir="gear"
        frameCount={97}
        frameW={1500}
        frameH={902}
        side="left"
        eyebrow="Produkte"
        headline={['Ihre Produkte,', 'wie nie zuvor', 'gesehen.']}
        body="Scrollen Sie weiter, das Objektiv zerlegt sich bis ins letzte Bauteil. So präsentiere ich Ihre Produkte, gestochen scharf und in einer Tiefe, die im Gedächtnis bleibt. Direkt im Browser, ganz ohne Plugins."
      />

      {/* 3. CMS-Showcase zum Schluss */}
      <Leistungen />
    </main>
  )
}
