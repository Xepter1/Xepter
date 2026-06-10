/**
 * Brand wordmark — substitutes the "X" of "Xepter" with the real logo mark.
 * The logo (lilac X + dark-violet paper-plane) is a freestanding "X" glyph; the
 * remaining letters keep the surrounding span's font styling.
 *
 * Props:
 *  - className: classes for the text wrapper (font, size, color of "epter")
 *  - logoEm: logo height relative to font-size (default 0.82em ≈ cap height)
 *  - dy:     fine vertical nudge so the mark sits on the baseline
 *  - alt:    img alt (default "X" so screen readers still read "Xepter";
 *            pass "" where an aria-label already provides the brand name)
 *  - spark:  when true, the X ignites warm orange on hover of an ancestor
 *            `.group` (used by the navbar logo). The overlay is the logo
 *            re-coloured via mask, so every violet shape lights up at once.
 */
export default function Wordmark({
  className = '',
  logoEm = 0.82,
  dy = '0.07em',
  gap = '0.04em',
  alt = 'X',
  spark = false,
}) {
  return (
    <span className={className} style={{ whiteSpace: 'nowrap' }}>
      <span
        className="logo-mark"
        style={{
          height: `${logoEm}em`,
          transform: `translateY(${dy})`,
          marginRight: gap,
        }}
      >
        <img src="/logo.png" alt={alt} className="logo-mark-img" />
        {spark && <span className="logo-mark-spark" aria-hidden="true" />}
      </span>
      epter
    </span>
  )
}
