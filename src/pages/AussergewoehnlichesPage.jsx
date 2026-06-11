import GearScene from '../components/GearScene'

export default function AussergewoehnlichesPage() {
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
        body="Scrollen Sie langsam weiter und sehen Sie, wie sich der Burger Stück für Stück zusammensetzt. Genau so hebe ich Ihre Restaurant-Website auf das nächste Level, appetitlich und einladend."
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
        body="Scrollen Sie weiter und sehen Sie, wie sich das Objektiv in seine Bauteile zerlegt. So präsentiere ich Ihre Produkte, gestochen scharf und mit einer Tiefe, die im Gedächtnis bleibt."
      />
    </main>
  )
}
