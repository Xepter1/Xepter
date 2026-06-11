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
        headline={['Willst du', 'aufwendige', 'Animationen?']}
        body="Scroll weiter und sieh, wie sich der Burger Stück für Stück zusammensetzt. So heben wir deine Restaurant-Website auf das nächste Level."
      />

      {/* 2. Kamera-Objektiv — Bild links, Text rechts. Zerlegt sich beim Runterscrollen. */}
      <GearScene
        dir="gear"
        frameCount={97}
        frameW={1500}
        frameH={902}
        side="left"
        eyebrow={null}
        headline={['Sieh dein Produkt,', 'wie nie zuvor', 'gesehen.']}
        body="Scroll weiter und sieh, wie sich das Objektiv in seine Bauteile zerlegt. So präsentieren wir deine Produkte, gestochen scharf und mit einer Tiefe, die im Gedächtnis bleibt."
      />
    </main>
  )
}
