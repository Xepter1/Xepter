#!/usr/bin/env python3
"""
Gear-Video -> freigestellte Frame-Sequenz fuer die Scroll-Animation (/leistungen).

Eingabe:  Bilder/Video.mp4 (960x960, weisser Studio-Hintergrund, KlingAI-Watermark)
Ausgabe:  public/gear/d/<i>.webp (Desktop, 879x769) und public/gear/m/<i>.webp (480 breit),
          jeweils mit Alpha.

Schritte pro Frame:
 1. Watermark-Zone mit Hintergrundweiss fuellen (Zone ist in allen Frames objektfrei).
 2. Aeusserer Hintergrund per Flood-Fill vom Rand (FIXED_RANGE tol 12 — bewusst
    konservativ: ein ueberbelichteter Alu-Halter geht stellenweise nahtlos ins
    Hintergrundweiss ueber und darf nicht angefressen werden).
 3. Bodenschatten entfernen: Kandidaten (hell, entsaettigt, glatt) -> nur Komponenten
    mit weicher Silhouette (Kontur-Gradient-Median < 48) unten im Bild, plus
    Luma-Taper-Band fuer die Auslaeufer.
 4. Eingeschlossene Hintergrund-Taschen (Ringloecher etc.): ultra-weisse Kerne im
    Inneren, floating-range Flood (kriecht durch weiche Verlaeufe, stoppt an
    Metallkanten) mit STRENGEN Gates (Region muss fast rein weiss sein), damit
    niemals Metall gefressen wird.
 5. Weiches Alpha; an ueberbelichteten Silhouettenkanten breiterer Feather
    (liest sich als Glow statt als harter Schnitt). Unblend von Weiss.
"""
import os
import cv2
import numpy as np

VIDEO = 'Bilder/Video.mp4'
OUT_D = 'public/gear/d'
OUT_M = 'public/gear/m'
W = H = 960
CROP = (54, 90, 932, 858)        # x0, y0, x1, y1 (Union-BBox + Rand)
MOBILE_W = 480
Q_DESKTOP, Q_MOBILE = 80, 75
CHAIN_HORIZON = 40               # Frames Vorausschau fuer die temporale Kette
SEEDS = [(5, 5), (W - 6, 5), (5, H - 6), (W - 6, H - 6),
         (W // 2, 5), (W // 2, H - 6), (5, H // 2), (W - 6, H // 2)]


def outer_bg(fr, tol=12):
    m = np.zeros((H + 2, W + 2), np.uint8)
    tmp = fr.copy()
    for sx, sy in SEEDS:
        cv2.floodFill(tmp, m, (sx, sy), 255, loDiff=(tol,) * 3, upDiff=(tol,) * 3,
                      flags=cv2.FLOODFILL_FIXED_RANGE | cv2.FLOODFILL_MASK_ONLY | (255 << 8))
    return m[1:-1, 1:-1] > 0


def core_flood_pockets(fr, bg, gray, sat):
    """Nur Regionen keyen, die praktisch reines Hintergrundweiss sind
    (Ringloecher, offene Spalte). Strenge Gates schuetzen ueberbelichtetes
    Metall: die Region muss hell UND eng verteilt sein."""
    core = ((~bg) & (gray >= 246) & (sat <= 10)).astype(np.uint8)
    nc, lab, stats, _ = cv2.connectedComponentsWithStats(core, connectivity=8)
    pocket = np.zeros((H, W), np.uint8)
    for c in range(1, nc):
        if stats[c, cv2.CC_STAT_AREA] < 12:
            continue
        ys, xs = np.where(lab == c)
        k = int(np.argmax(gray[ys, xs]))
        seed = (int(xs[k]), int(ys[k]))
        if pocket[seed[1], seed[0]]:
            continue
        m2 = np.zeros((H + 2, W + 2), np.uint8)
        cv2.floodFill(fr.copy(), m2, seed, 255, loDiff=(5,) * 3, upDiff=(5,) * 3,
                      flags=cv2.FLOODFILL_MASK_ONLY | (255 << 8))
        R = (m2[1:-1, 1:-1] > 0) & (~bg)
        area = int(R.sum())
        if area == 0 or area > 20000:
            continue
        vals = gray[R]
        if vals.mean() < 232 or np.percentile(vals, 5) < 200:
            continue
        pocket[R] = 1
    return pocket


def main():
    os.makedirs(OUT_D, exist_ok=True)
    os.makedirs(OUT_M, exist_ok=True)

    cap = cv2.VideoCapture(VIDEO)
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    raw = []
    for _ in range(n):
        ok, fr = cap.read()
        if not ok:
            break
        fr = fr.copy()
        fr[880:960, 700:960] = (250, 250, 250)   # Watermark
        raw.append(fr)
    cap.release()
    n = len(raw)
    print(f'{n} Frames gelesen')

    tot_d = tot_m = 0
    white_report = []
    for i in range(n):
        fr = raw[i]
        gray = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY).astype(np.float32)
        sat = cv2.cvtColor(fr, cv2.COLOR_BGR2HSV)[:, :, 1].astype(np.float32)
        bg = outer_bg(fr)
        fg = (~bg).astype(np.uint8)
        fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))

        gx = cv2.Sobel(gray, cv2.CV_32F, 1, 0, 3)
        gy = cv2.Sobel(gray, cv2.CV_32F, 0, 1, 3)
        grad_raw = cv2.magnitude(gx, gy)
        grad = cv2.GaussianBlur(grad_raw, (9, 9), 0)

        # --- Bodenschatten ---
        cand = ((fg > 0) & (gray > 150) & (sat < 32) & (grad < 70)).astype(np.uint8)
        cand = cv2.morphologyEx(cand, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        bg_dil = cv2.dilate(bg.astype(np.uint8), np.ones((7, 7), np.uint8))
        nc, lab, stats, cents = cv2.connectedComponentsWithStats(cand, connectivity=8)
        shadow = np.zeros_like(cand)
        for c in range(1, nc):
            if stats[c, cv2.CC_STAT_AREA] < 120:
                continue
            if cents[c][1] < 0.5 * H:
                continue
            sel = (lab == c).astype(np.uint8)
            if not (bg_dil[sel > 0] > 0).any():
                continue
            ring = sel - cv2.erode(sel, np.ones((3, 3), np.uint8))
            eg = grad_raw[ring > 0]
            if len(eg) and np.median(eg) < 48:
                shadow[sel > 0] = 1
        shadow_f = cv2.GaussianBlur(
            cv2.dilate(shadow, np.ones((7, 7), np.uint8)).astype(np.float32), (13, 13), 0)

        a = fg.astype(np.float32) * (1.0 - shadow_f)
        band = cv2.dilate(shadow, np.ones((61, 61), np.uint8)).astype(np.float32)
        band = cv2.GaussianBlur(band, (31, 31), 0)
        taper = np.clip((242.0 - gray) / 80.0, 0, 1)
        a = a * (1.0 - band) + a * taper * band

        # --- eingeschlossene Taschen (nur reines Hintergrundweiss) ---
        pocket = core_flood_pockets(fr, bg, gray, sat)
        pband = cv2.dilate(pocket, np.ones((9, 9), np.uint8)).astype(np.float32)
        pband = cv2.GaussianBlur(pband, (7, 7), 0)
        pa = np.clip((246.0 - gray) / 26.0, 0, 1)
        a = a * (1.0 - pband) + a * pa * pband

        # --- Finish ---
        a = np.clip(a, 0, 1)
        a = cv2.GaussianBlur(a, (5, 5), 0)
        # Ueberbelichtete Silhouettenkanten weich ausbluehen lassen: dort, wo die
        # Objektkante fast weiss ist, breiter feathern (Glow statt harter Schnitt)
        edge = cv2.morphologyEx(fg, cv2.MORPH_GRADIENT, np.ones((5, 5), np.uint8))
        hot_edge = ((edge > 0) & (gray >= 244)).astype(np.uint8)
        hot_zone = cv2.GaussianBlur(
            cv2.dilate(hot_edge, np.ones((9, 9), np.uint8)).astype(np.float32), (13, 13), 0)
        a_soft = cv2.GaussianBlur(a, (17, 17), 0)
        a = a * (1.0 - hot_zone) + a_soft * hot_zone
        af = a[:, :, None]
        img = fr.astype(np.float32)
        unb = np.where(af > 0.02, (img - (1 - af) * 255.0) / np.maximum(af, 0.02), 0)
        rgba = np.dstack([np.clip(unb, 0, 255).astype(np.uint8), (a * 255).astype(np.uint8)])

        x0, y0, x1, y1 = CROP
        crop = rgba[y0:y1 + 1, x0:x1 + 1]
        cv2.imwrite(f'{OUT_D}/{i}.webp', crop, [cv2.IMWRITE_WEBP_QUALITY, Q_DESKTOP])
        ch, cw = crop.shape[:2]
        mob = cv2.resize(crop, (MOBILE_W, int(ch * MOBILE_W / cw)), interpolation=cv2.INTER_AREA)
        cv2.imwrite(f'{OUT_M}/{i}.webp', mob, [cv2.IMWRITE_WEBP_QUALITY, Q_MOBILE])
        tot_d += os.path.getsize(f'{OUT_D}/{i}.webp')
        tot_m += os.path.getsize(f'{OUT_M}/{i}.webp')
        g = cv2.cvtColor(crop[:, :, :3], cv2.COLOR_BGR2GRAY)
        white_report.append(int(((g > 238) & (crop[:, :, 3] > 220)).sum()))

    print(f'desktop: {tot_d / 1e6:.2f} MB | mobile: {tot_m / 1e6:.2f} MB')
    worst = int(np.argmax(white_report))
    print(f'fast-weisse opake Pixel: max {white_report[worst]} (frame {worst}), '
          f'mittel {sum(white_report) // len(white_report)}')


if __name__ == '__main__':
    main()
