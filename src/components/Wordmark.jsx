/**
 * Brand wordmark — substitutes the "X" of "Xepter" with the real logo mark.
 * The logo (violet + cream paper-plane) is a freestanding "X" glyph; the
 * remaining letters keep the surrounding span's font styling.
 *
 * Props:
 *  - className: classes for the text wrapper (font, size, color of "epter")
 *  - logoEm: logo height relative to font-size (default 0.82em ≈ cap height)
 *  - dy:     fine vertical nudge so the mark sits on the baseline
 *  - alt:    img alt (default "X" so screen readers still read "Xepter";
 *            pass "" where an aria-label already provides the brand name)
 */
export default function Wordmark({
  className = '',
  logoEm = 0.82,
  dy = '0.07em',
  gap = '0.04em',
  alt = 'X',
}) {
  return (
    <span className={className} style={{ whiteSpace: 'nowrap' }}>
      <img
        src="/logo.png"
        alt={alt}
        style={{
          height: `${logoEm}em`,
          width: 'auto',
          display: 'inline-block',
          verticalAlign: 'baseline',
          transform: `translateY(${dy})`,
          marginRight: gap,
        }}
      />
      epter
    </span>
  )
}
