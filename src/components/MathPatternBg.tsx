/**
 * MathPatternBg
 * Fundo decorativo com símbolos matemáticos em SVG (padrão repetido).
 * Renderizado como fixed overlay atrás de todo o conteúdo — z-index: 0.
 */

interface Props {
  /** Opacidade global do padrão. Padrão: 0.07 */
  opacity?: number;
}

export default function MathPatternBg({ opacity = 0.07 }: Props) {
  const s = "#666"; // cor dos traços (cinza médio — adapta a light e dark mode)

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        opacity,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* ── Padrão 480×520 — tile que se repete ───────────────────── */}
          <pattern
            id="mathBg"
            x="0"
            y="0"
            width="480"
            height="520"
            patternUnits="userSpaceOnUse"
          >
            {/* ── TRIÂNGULO 1 (canto sup-esq, inclinado) ─────────────── */}
            <g transform="translate(28,18) rotate(-22)">
              <polygon
                points="0,0 0,82 62,82"
                fill="none" stroke={s} strokeWidth="2" strokeLinejoin="round"
              />
              <path d="M0,82 L0,73 L9,73 L9,82" fill="none" stroke={s} strokeWidth="1.4"/>
              {/* Dashed hypotenuse highlight */}
              <text x="-18" y="42" fontSize="13" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">a</text>
              <text x="28" y="97" fontSize="13" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">b</text>
              <text x="22" y="36" fontSize="13" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">c</text>
            </g>

            {/* ── FÓRMULA "E = mx" (topo centro) ─────────────────────── */}
            <text
              transform="translate(195,38)"
              fontSize="24"
              fill={s}
              fontFamily="'Times New Roman',serif"
              fontStyle="italic"
              letterSpacing="-0.5"
            >
              E = mx
            </text>

            {/* ── TRIÂNGULO 2 (topo dir, pequeno, outra rotação) ─────── */}
            <g transform="translate(410,8) rotate(18)">
              <polygon
                points="0,0 0,55 42,55"
                fill="none" stroke={s} strokeWidth="1.8" strokeLinejoin="round"
              />
              <path d="M0,55 L0,47 L8,47 L8,55" fill="none" stroke={s} strokeWidth="1.2"/>
              <text x="-16" y="28" fontSize="10" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">a</text>
              <text x="20" y="68" fontSize="10" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">b</text>
              <text x="16" y="24" fontSize="10" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">c</text>
            </g>

            {/* ── TRANSFERIDOR (esquerda, linha 2) ───────────────────── */}
            <g transform="translate(138,118)">
              {/* Arco e base */}
              <path d="M -68,0 A 68,68 0 0 1 68,0 Z" fill="none" stroke={s} strokeWidth="2"/>
              <line x1="-68" y1="0" x2="68" y2="0" stroke={s} strokeWidth="2"/>
              {/* Marcas maiores a cada 30° */}
              {[0,30,60,90,120,150,180].map((deg) => {
                const r = (deg * Math.PI) / 180;
                const cx = 68 * Math.cos(Math.PI - r);
                const cy = -68 * Math.sin(Math.PI - r);
                const ir = 0.84;
                return (
                  <line
                    key={deg}
                    x1={cx} y1={cy}
                    x2={cx * ir} y2={cy * ir}
                    stroke={s} strokeWidth="1.5"
                  />
                );
              })}
              {/* Marcas menores a cada 15° */}
              {[15,45,75,105,135,165].map((deg) => {
                const r = (deg * Math.PI) / 180;
                const cx = 68 * Math.cos(Math.PI - r);
                const cy = -68 * Math.sin(Math.PI - r);
                const ir = 0.91;
                return (
                  <line
                    key={deg}
                    x1={cx} y1={cy}
                    x2={cx * ir} y2={cy * ir}
                    stroke={s} strokeWidth="1"
                  />
                );
              })}
              {/* Linha central (90°) */}
              <line x1="0" y1="-68" x2="0" y2="0" stroke={s} strokeWidth="1.2"/>
            </g>

            {/* ── CONE 1 (centro sup, vertical) ──────────────────────── */}
            <g transform="translate(322,60)">
              <ellipse cx="0" cy="90" rx="42" ry="12" fill="none" stroke={s} strokeWidth="1.8"/>
              <line x1="-42" y1="90" x2="0" y2="0" stroke={s} strokeWidth="1.8"/>
              <line x1="42" y1="90" x2="0" y2="0" stroke={s} strokeWidth="1.8"/>
              <line x1="0" y1="0" x2="0" y2="90" stroke={s} strokeWidth="1.2" strokeDasharray="5,3"/>
              <text x="-7" y="-8" fontSize="11" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">a</text>
              <text x="8" y="50" fontSize="11" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">c</text>
              <text x="-20" y="107" fontSize="11" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">b</text>
            </g>

            {/* ── SÍMBOLO ≤ (dir, linha 1) ────────────────────────────── */}
            <text
              transform="translate(450,110)"
              fontSize="32"
              fill={s}
              fontFamily="'Times New Roman',serif"
            >
              ≤
            </text>

            {/* ── FÓRMULA "2R/3 √3" (esq, linha 2-3) ────────────────── */}
            <text
              transform="translate(8,208)"
              fontSize="17"
              fill={s}
              fontFamily="'Times New Roman',serif"
              fontStyle="italic"
            >
              ²ᴿ/₃ √3
            </text>

            {/* ── FÓRMULA "ax²+c=0" (centro-esq) ────────────────────── */}
            <text
              transform="translate(80,248)"
              fontSize="19"
              fill={s}
              fontFamily="'Times New Roman',serif"
              fontStyle="italic"
            >
              ax²+c = 0
            </text>

            {/* ── ESFERA COM HACHURA (centro) ─────────────────────────── */}
            <g transform="translate(268,185)">
              <circle cx="0" cy="0" r="52" fill="none" stroke={s} strokeWidth="1.8"/>
              {/* Linhas de hachura diagonais */}
              {[-65,-45,-25,-5,15,35,55].map((offset) => (
                <line
                  key={offset}
                  x1={offset - 30} y1={-52}
                  x2={offset + 30} y2={52}
                  stroke={s} strokeWidth="1.1"
                  strokeDasharray="0"
                  clipPath="url(#sphereClip1)"
                />
              ))}
              {/* Elipse do equador */}
              <ellipse cx="0" cy="0" rx="52" ry="18" fill="none" stroke={s} strokeWidth="1.2"/>
            </g>
            <clipPath id="sphereClip1">
              <circle cx="268" cy="185" r="51"/>
            </clipPath>

            {/* ── "sin/cos" grande (dir) ──────────────────────────────── */}
            <g transform="translate(395,165)">
              <text fontSize="22" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic" y="0">sin</text>
              <line x1="-2" y1="6" x2="58" y2="6" stroke={s} strokeWidth="1.8"/>
              <text fontSize="22" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic" y="30">cos</text>
            </g>

            {/* ── π grande (esq, linha 3) ─────────────────────────────── */}
            <text
              transform="translate(12,305)"
              fontSize="36"
              fill={s}
              fontFamily="'Times New Roman',serif"
            >
              π
            </text>

            {/* ── CAIXA 3D / PARALELEPÍPEDO (centro-esq, linha 3) ─────── */}
            <g transform="translate(80,280)" stroke={s} fill="none">
              {/* Face frontal */}
              <rect x="0" y="22" width="62" height="42" strokeWidth="1.8"/>
              {/* Face superior */}
              <path d="M0,22 L22,0 L84,0 L62,22 Z" strokeWidth="1.8"/>
              {/* Face lateral direita */}
              <path d="M62,22 L84,0 L84,42 L62,64 Z" strokeWidth="1.8"/>
              {/* Arestas ocultas tracejadas */}
              <line x1="0" y1="64" x2="22" y2="42" strokeWidth="1" strokeDasharray="4,3"/>
              <line x1="22" y1="42" x2="84" y2="42" strokeWidth="1" strokeDasharray="4,3"/>
              <line x1="22" y1="0" x2="22" y2="42" strokeWidth="1" strokeDasharray="4,3"/>
            </g>

            {/* ── "sin/cos = tan" (centro, linha 3) ──────────────────── */}
            <g transform="translate(195,280)">
              <text fontSize="19" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic" y="0">sin</text>
              <line x1="-2" y1="5" x2="52" y2="5" stroke={s} strokeWidth="1.6"/>
              <text fontSize="19" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic" y="27">cos</text>
              <text fontSize="19" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic" x="60" y="13">= tan</text>
            </g>

            {/* ── CONE 2 (dir, linha 3, menor, inclinado) ─────────────── */}
            <g transform="translate(360,270) rotate(8)">
              <ellipse cx="0" cy="75" rx="34" ry="10" fill="none" stroke={s} strokeWidth="1.6"/>
              <line x1="-34" y1="75" x2="0" y2="0" stroke={s} strokeWidth="1.6"/>
              <line x1="34" y1="75" x2="0" y2="0" stroke={s} strokeWidth="1.6"/>
              <line x1="0" y1="0" x2="0" y2="75" stroke={s} strokeWidth="1.1" strokeDasharray="4,3"/>
              <text x="-7" y="-6" fontSize="10" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">a</text>
              <text x="7" y="40" fontSize="10" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">c</text>
              <text x="-16" y="90" fontSize="10" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">b</text>
            </g>

            {/* ── TRIÂNGULO 3 (esq, linha 4, grande, inclinado) ────────── */}
            <g transform="translate(20,390) rotate(-10)">
              <polygon
                points="0,0 0,90 68,90"
                fill="none" stroke={s} strokeWidth="2" strokeLinejoin="round"
              />
              <path d="M0,90 L0,81 L9,81 L9,90" fill="none" stroke={s} strokeWidth="1.4"/>
              <text x="-18" y="46" fontSize="13" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">a</text>
              <text x="30" y="106" fontSize="13" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">b</text>
              <text x="24" y="40" fontSize="13" fill={s} fontFamily="'Times New Roman',serif" fontStyle="italic">c</text>
            </g>

            {/* ── "E = mx²" (centro, linha 4) ─────────────────────────── */}
            <text
              transform="translate(180,398)"
              fontSize="22"
              fill={s}
              fontFamily="'Times New Roman',serif"
              fontStyle="italic"
            >
              E = mx²
            </text>

            {/* ── ESFERA 2 (dir, linha 4, menor) ──────────────────────── */}
            <g transform="translate(370,415)">
              <circle cx="0" cy="0" r="38" fill="none" stroke={s} strokeWidth="1.6"/>
              {[-50,-30,-10,10,30,50].map((offset) => (
                <line
                  key={offset}
                  x1={offset - 22} y1={-38}
                  x2={offset + 22} y2={38}
                  stroke={s} strokeWidth="1"
                  clipPath="url(#sphereClip2)"
                />
              ))}
              <ellipse cx="0" cy="0" rx="38" ry="13" fill="none" stroke={s} strokeWidth="1.1"/>
            </g>
            <clipPath id="sphereClip2">
              <circle cx="370" cy="415" r="37"/>
            </clipPath>

            {/* ── TRANSFERIDOR 2 (dir, linha 4, menor, rotacionado) ────── */}
            <g transform="translate(448,460) rotate(15)">
              <path d="M -50,0 A 50,50 0 0 1 50,0 Z" fill="none" stroke={s} strokeWidth="1.6"/>
              <line x1="-50" y1="0" x2="50" y2="0" stroke={s} strokeWidth="1.6"/>
              {[0,45,90,135,180].map((deg) => {
                const r = (deg * Math.PI) / 180;
                const cx = 50 * Math.cos(Math.PI - r);
                const cy = -50 * Math.sin(Math.PI - r);
                return (
                  <line key={deg} x1={cx} y1={cy} x2={cx * 0.83} y2={cy * 0.83}
                    stroke={s} strokeWidth="1.3"/>
                );
              })}
              {[22.5,67.5,112.5,157.5].map((deg) => {
                const r = (deg * Math.PI) / 180;
                const cx = 50 * Math.cos(Math.PI - r);
                const cy = -50 * Math.sin(Math.PI - r);
                return (
                  <line key={deg} x1={cx} y1={cy} x2={cx * 0.9} y2={cy * 0.9}
                    stroke={s} strokeWidth="0.9"/>
                );
              })}
            </g>

            {/* ── "ax²+c=0" repetido (baixo centro-esq) ───────────────── */}
            <text
              transform="translate(80,490)"
              fontSize="17"
              fill={s}
              fontFamily="'Times New Roman',serif"
              fontStyle="italic"
            >
              ax²+c = 0
            </text>

            {/* ── "ax²+c=0" repetido (baixo dir) ──────────────────────── */}
            <text
              transform="translate(305,490)"
              fontSize="17"
              fill={s}
              fontFamily="'Times New Roman',serif"
              fontStyle="italic"
            >
              ax²+c = 0
            </text>

            {/* ── "%" (espaçador visual) ───────────────────────────────── */}
            <text
              transform="translate(195,82)"
              fontSize="24"
              fill={s}
              fontFamily="'Times New Roman',serif"
            >
              %
            </text>

            {/* ── "≥" (centro-dir) ─────────────────────────────────────── */}
            <text
              transform="translate(195,320)"
              fontSize="26"
              fill={s}
              fontFamily="'Times New Roman',serif"
            >
              ≥
            </text>

            {/* ── Pontos decorativos ───────────────────────────────────── */}
            {[
              [170,58],[345,58],[462,58],
              [10,245],[450,245],
              [8,355],[162,355],[470,355],
              [285,455],[455,512],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3.5" fill={s}/>
            ))}
          </pattern>
        </defs>

        {/* Preenche toda a tela com o padrão */}
        <rect width="100%" height="100%" fill="url(#mathBg)"/>
      </svg>
    </div>
  );
}
