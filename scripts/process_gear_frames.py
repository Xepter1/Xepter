#!/usr/bin/env python3
"""
Explosions-Video (schwarzer Hintergrund) -> Frame-Sequenz fuer den Scroll-Scrub (/leistungen).

Eingabe:  ein Video mit SCHWARZEM Hintergrund (ideal #000, ohne Wasserzeichen, 4K).
Ausgabe:  public/<preset>/d/<i>.webp (Desktop) und public/<preset>/m/<i>.webp (Mobile),
          jeweils mit Alpha (RGBA).

Warum so:
  Keying gegen Schwarz ist trivial, der Alpha-Wert kommt direkt aus der Helligkeit.
  Schwarz hat Luma 0 -> Alpha 0 -> transparent; das helle Objekt ist deckend. So liegt
  das Objekt als echte Freisteller-Sequenz ueber der dunklen Seite, der Glow scheint
  durch die transparenten Bereiche. Kein `mix-blend-mode` noetig (der wurde im Browser
  vom animierten Wrapper isoliert und liess das schwarze Frame als Kasten stehen).

Mehrere Motive -> PRESETS (unten). Aufruf:
    python3 scripts/process_gear_frames.py <preset>      # z.B. gear | burger
Output-Ordner = Preset-Name (public/<preset>/{d,m}). Nach dem Lauf druckt das Skript
FRAME_COUNT / FRAME_W / FRAME_H -> in den GearScene-Aufruf eintragen, falls geaendert.

🔑 Wichtigste Stellschraube je Video = die Alpha-Schwelle (Hintergrund vs. Objekt):
  - reines Schwarz als BG + evtl. dunkle Objektteile  -> TIEF (z.B. 4..12), CONTENT 10.
  - heller / Vignette-BG (altes Getriebe)            -> HOCH (z.B. 56..86).
  Kurz Luma von Rand-BG vs. dunkelsten Objektteilen messen, Schwelle dazwischen legen.
"""
import os
import sys
import cv2
import numpy as np

PRESETS = {
    # Output-Ordner public/gear/  ·  Motiv: Kamera-Objektiv (Ordnername historisch)
    'gear': {
        'video': 'Bilder/Video_Kamera.mp4',
        'alpha': (4.0, 12.0),          # reines Schwarz -> tiefe Schwelle
        'content_level': 10,
        'watermark': (1350, 1140, 1440, 1440),   # KlingAI, unten rechts (1440x1440)
        'desktop_w': 1500,
        'mobile_w': 560,
    },
    # Output-Ordner public/burger/  ·  Motiv: explodierender Burger (Hochformat 3:4)
    'burger': {
        'video': 'Bilder/Video_Burger.mp4',
        'alpha': (4.0, 12.0),          # reines Schwarz -> tiefe Schwelle
        'content_level': 10,
        # ganzer Bodenstreifen unter der Bun-Unterkante (~y3070): entfernt Wasserzeichen
        # UND einen schwachen Lichthof (Luma 10-39), der sonst als Schmier opak bliebe
        'watermark': (3090, 0, 3332, 2488),
        'desktop_w': 1040,             # Hochformat, hoehenbegrenzt in halber Spalte (~530px CSS)
        'mobile_w': 480,
    },
}

Q_DESKTOP, Q_MOBILE = 82, 78
MARGIN_FRAC = 0.02        # Rand um die Objekt-BBox (Anteil der laengsten Kante)


def black_watermark(fr, wm):
    if wm is not None:
        y0, x0, y1, x1 = wm
        fr[y0:y1, x0:x1] = 0
    return fr


def detect_crop(video, wm, content_level):
    """Durchlauf 1: laufendes Luma-Maximum ueber alle Frames -> BBox der Objekt-
    Ausdehnung (inkl. der am weitesten geflogenen Teile) + Rand."""
    cap = cv2.VideoCapture(video)
    maxluma = None
    n = 0
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        fr = black_watermark(fr.astype(np.float32), wm)
        l = fr.mean(axis=2)
        maxluma = l if maxluma is None else np.maximum(maxluma, l)
        n += 1
    cap.release()
    if maxluma is None:
        raise SystemExit(f'Keine Frames in {video}')
    H, W = maxluma.shape
    ys, xs = np.where(maxluma > content_level)
    m = round(MARGIN_FRAC * max(H, W))
    return n, (max(0, int(ys.min()) - m), max(0, int(xs.min()) - m),
              min(H, int(ys.max()) + 1 + m), min(W, int(xs.max()) + 1 + m)), (W, H)


def main():
    name = sys.argv[1] if len(sys.argv) > 1 else 'gear'
    if name not in PRESETS:
        raise SystemExit(f'Unbekanntes Preset "{name}". Verfuegbar: {", ".join(PRESETS)}')
    p = PRESETS[name]
    out_d, out_m = f'public/{name}/d', f'public/{name}/m'
    os.makedirs(out_d, exist_ok=True)
    os.makedirs(out_m, exist_ok=True)
    lo, hi = p['alpha']
    wm = p['watermark']
    desktop_w, mobile_w = p['desktop_w'], p['mobile_w']

    n, (cy0, cx0, cy1, cx1), (W, H) = detect_crop(p['video'], wm, p['content_level'])
    print(f'[{name}] {n} Frames · Quelle {W}x{H} · Crop y{cy0}..{cy1} x{cx0}..{cx1}')

    cap = cv2.VideoCapture(p['video'])
    tot_d = tot_m = 0
    i = 0
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        fr = black_watermark(fr.astype(np.float32), wm)

        luma = fr.mean(axis=2)
        a = np.clip((luma - lo) / (hi - lo), 0.0, 1.0)
        a = a * a * (3.0 - 2.0 * a)            # smoothstep
        bgr = np.clip(fr, 0, 255).astype(np.uint8)
        alpha = (a * 255).astype(np.uint8)
        bgr[alpha == 0] = 0                     # transparente Flaeche flach -> kleinere Datei
        out = np.dstack([bgr, alpha])

        crop = out[cy0:cy1, cx0:cx1]
        ch, cw = crop.shape[:2]
        des = cv2.resize(crop, (desktop_w, round(ch * desktop_w / cw)), interpolation=cv2.INTER_AREA)
        mob = cv2.resize(crop, (mobile_w, round(ch * mobile_w / cw)), interpolation=cv2.INTER_AREA)
        cv2.imwrite(f'{out_d}/{i}.webp', des, [cv2.IMWRITE_WEBP_QUALITY, Q_DESKTOP])
        cv2.imwrite(f'{out_m}/{i}.webp', mob, [cv2.IMWRITE_WEBP_QUALITY, Q_MOBILE])
        tot_d += os.path.getsize(f'{out_d}/{i}.webp')
        tot_m += os.path.getsize(f'{out_m}/{i}.webp')
        i += 1
    cap.release()

    fw = desktop_w
    fh = round((cy1 - cy0) * desktop_w / (cx1 - cx0))
    print(f'[{name}] desktop {fw}x{fh} | {tot_d / 1e6:.2f} MB  ·  mobile {mobile_w} | {tot_m / 1e6:.2f} MB')
    print(f'--- in GearScene-Aufruf eintragen: dir="{name}" frameCount={{{i}}} frameW={{{fw}}} frameH={{{fh}}}')


if __name__ == '__main__':
    main()
