#!/usr/bin/env python3
"""
Explosions-Video (schwarzer Hintergrund) -> Frame-Sequenz fuer den Scroll-Scrub (/leistungen).

Eingabe:  ein Video mit SCHWARZEM Hintergrund (ideal #000, ohne Wasserzeichen, 4K).
Ausgabe:  public/gear/d/<i>.webp (Desktop) und public/gear/m/<i>.webp (Mobile),
          jeweils mit Alpha (RGBA).

Warum so:
  Keying gegen Schwarz ist trivial, der Alpha-Wert kommt direkt aus der Helligkeit.
  Schwarz hat Luma 0 -> Alpha 0 -> transparent; das helle Metall ist deckend. So liegt
  das Objekt als echte Freisteller-Sequenz ueber der dunklen Seite, der Glow scheint
  durch die transparenten Bereiche. Kein `mix-blend-mode` noetig (der wurde im Browser
  vom animierten Wrapper isoliert und liess das schwarze Frame als Kasten stehen).

Anpassungsfaehig:
  - beliebige Aufloesung / Frame-Zahl (zwei Streaming-Durchlaeufe, 4K passt sonst nicht
    in den Speicher).
  - Zuschnitt wird AUTOMATISCH aus der Objekt-Ausdehnung ueber alle Frames erkannt
    (am staerksten zerlegten Punkt fliegen Teile weit, der Crop fasst alles + Rand).
  - Wasserzeichen optional (WATERMARK = None, falls der Export sauber ist).

Nach dem Lauf druckt das Skript FRAME_COUNT / FRAME_W / FRAME_H -> in
src/components/GearScene.jsx eintragen, falls sie sich geaendert haben.

Aufruf:  python3 scripts/process_gear_frames.py [pfad/zum/video.mp4]
"""
import os
import sys
import cv2
import numpy as np

VIDEO = sys.argv[1] if len(sys.argv) > 1 else 'Bilder/video_black.mp4'
OUT_D = 'public/gear/d'
OUT_M = 'public/gear/m'

DESKTOP_W = 1500          # retina-scharf; aus 4K-Quelle heruntergerechnet = sehr sauber
MOBILE_W = 560
Q_DESKTOP, Q_MOBILE = 82, 78
# Luma-Ramp fuer das Alpha: <LO transparent, >HI deckend. WICHTIG an die Quelle anpassen:
#  - reiner schwarzer BG + dunkle Objektteile (Kopfhoerer): tief ansetzen (4..12), sonst
#    fallen schwarze Polster/Buegel mit dem BG weg.
#  - heller Studio-BG / Vignette (altes Getriebe): hoch ansetzen (56..86).
ALPHA_LO, ALPHA_HI = 4.0, 12.0
CONTENT_LEVEL = 10        # Luma-Schwelle, ab der ein Pixel als Objekt zaehlt (fuer Crop);
                          # bei dunklen Objekten tief halten, sonst wird das Objekt beschnitten
MARGIN_FRAC = 0.02        # zusaetzlicher Rand um die Objekt-BBox (Anteil der laengsten Kante)

# Statisches Wasserzeichen als Pixel-Box (y0, x0, y1, x1) ODER None.
# Bei sauberem Export auf None lassen. Sonst die Box im Quell-Pixelraster eintragen.
WATERMARK = (1350, 1140, 1440, 1440)   # KlingAI 3.0, unten rechts (1440x1440 Objektiv-Quelle)


def black_watermark(fr):
    if WATERMARK is not None:
        y0, x0, y1, x1 = WATERMARK
        fr[y0:y1, x0:x1] = 0
    return fr


def detect_crop(video):
    """Durchlauf 1: laufendes Luma-Maximum ueber alle Frames -> BBox der Objekt-
    Ausdehnung (inkl. der am weitesten geflogenen Teile) + Rand."""
    cap = cv2.VideoCapture(video)
    maxluma = None
    n = 0
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        fr = black_watermark(fr.astype(np.float32))
        l = fr.mean(axis=2)
        maxluma = l if maxluma is None else np.maximum(maxluma, l)
        n += 1
    cap.release()
    if maxluma is None:
        raise SystemExit(f'Keine Frames in {video}')
    H, W = maxluma.shape
    ys, xs = np.where(maxluma > CONTENT_LEVEL)
    m = round(MARGIN_FRAC * max(H, W))
    y0 = max(0, int(ys.min()) - m)
    x0 = max(0, int(xs.min()) - m)
    y1 = min(H, int(ys.max()) + 1 + m)
    x1 = min(W, int(xs.max()) + 1 + m)
    return n, (y0, x0, y1, x1), (W, H)


def main():
    os.makedirs(OUT_D, exist_ok=True)
    os.makedirs(OUT_M, exist_ok=True)

    n, (cy0, cx0, cy1, cx1), (W, H) = detect_crop(VIDEO)
    print(f'{n} Frames · Quelle {W}x{H} · Crop y{cy0}..{cy1} x{cx0}..{cx1}')

    cap = cv2.VideoCapture(VIDEO)
    tot_d = tot_m = 0
    i = 0
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        fr = black_watermark(fr.astype(np.float32))

        # Alpha aus der Luma: Hintergrund transparent, Metall deckend
        luma = fr.mean(axis=2)
        a = np.clip((luma - ALPHA_LO) / (ALPHA_HI - ALPHA_LO), 0.0, 1.0)
        a = a * a * (3.0 - 2.0 * a)            # smoothstep
        bgr = np.clip(fr, 0, 255).astype(np.uint8)
        alpha = (a * 255).astype(np.uint8)
        bgr[alpha == 0] = 0                     # transparente Flaeche flach -> kleinere Datei
        out = np.dstack([bgr, alpha])          # BGRA

        crop = out[cy0:cy1, cx0:cx1]
        ch, cw = crop.shape[:2]
        des = cv2.resize(crop, (DESKTOP_W, round(ch * DESKTOP_W / cw)),
                         interpolation=cv2.INTER_AREA)
        mob = cv2.resize(crop, (MOBILE_W, round(ch * MOBILE_W / cw)),
                         interpolation=cv2.INTER_AREA)
        cv2.imwrite(f'{OUT_D}/{i}.webp', des, [cv2.IMWRITE_WEBP_QUALITY, Q_DESKTOP])
        cv2.imwrite(f'{OUT_M}/{i}.webp', mob, [cv2.IMWRITE_WEBP_QUALITY, Q_MOBILE])
        tot_d += os.path.getsize(f'{OUT_D}/{i}.webp')
        tot_m += os.path.getsize(f'{OUT_M}/{i}.webp')
        i += 1
    cap.release()

    fw = DESKTOP_W
    fh = round((cy1 - cy0) * DESKTOP_W / (cx1 - cx0))
    print(f'desktop {fw}x{fh} | {tot_d / 1e6:.2f} MB  ·  '
          f'mobile {MOBILE_W} | {tot_m / 1e6:.2f} MB')
    print('--- in src/components/GearScene.jsx eintragen, falls geaendert: ---')
    print(f'const FRAME_COUNT = {i}')
    print(f'const FRAME_W = {fw}')
    print(f'const FRAME_H = {fh}')


if __name__ == '__main__':
    main()
