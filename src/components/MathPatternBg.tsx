/**
 * MathPatternBg
 * Fundo decorativo com símbolos matemáticos em SVG (padrão repetido).
 * Renderizado como fixed overlay atrás de todo o conteúdo — z-index: 0.
 *
 * Fixes aplicados na v2:
 * - Hachura das esferas: endpoints calculados matematicamente (sem clipPath,
 *   que vazava nos tiles repetidos)
 * - "²ᴿ/₃ √3": substituído por SVG nativo com fraction bar
 * - strokeDasharray="0" removido (valor inválido)
 * - Espaçamento da barra de fração sin/cos ajustado
 */

interface Props {
  /** Opacidade global do padrão. Padrão: 0.07 */
  opacity?: number;
}

// ── Hachura diagonal mathematicamente precisa ────────────────────────────────
// Para uma linha y = x + c interseccionando o círculo x²+y² = r²:
//   x = (-c ± √(2r²-c²)) / 2
// Retorna [x1,y1,x2,y2] ou null se a linha não intercepta o círculo.
function diag(r: number, c: number): [number, number, number, number] | null {
  const disc = 2 * r * r - c * c;
  if (disc < 0) return null;
  const sq = Math.sqrt(disc);
  const x1 = (-c - sq) / 2;
  const x2 = (-c + sq) / 2;
  return [
    Math.round(x1 * 10) / 10,
    Math.round((x1 + c) * 10) / 10,
    Math.round(x2 * 10) / 10,
    Math.round((x2 + c) * 10) / 10,
  ];
}

// Gera todas as linhas de hachura diagonal para um círculo de raio r
function sphereHatch(r: number, step = 14) {
  const lines: [number, number, number, number][] = [];
  const limit = Math.floor(r * Math.sqrt(2) * 0.95);
  for (let c = -limit; c <= limit; c += step) {
    const seg = diag(r, c);
    if (seg) lines.push(seg);
  }
  return lines;
}

export default function MathPatternBg({ opacity = 0.07 }: Props) {
  const s = "#666";
  const ff = "'Times New Roman', Georgia, serif";

  // Hachuras pré-computadas (sem clipPath)
  const hatch52 = sphereHatch(52, 15);
  const hatch38 = sphereHatch(38, 13);

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
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          {/* ── Padrão 480×520 ─────────────────────────────────────────── */}
          <pattern
            id="mathBg"
            x="0" y="0"
            width="480" height="520"
            patternUnits="userSpaceOnUse"
          >
            {/* ── TRIÂNGULO 1 (canto sup-esq, inclinado) ──────────────── */}
            <g transform="translate(28,18) rotate(-22)">
              <polygon points="0,0 0,82 62,82"
                fill="none" stroke={s} strokeWidth="2" strokeLinejoin="round"/>
              <path d="M0,82 L0,73 L9,73 L9,82" fill="none" stroke={s} strokeWidth="1.4"/>
              <text x="-18" y="44" fontSize="13" fill={s} fontFamily={ff} fontStyle="italic">a</text>
              <text x="28" y="96" fontSize="13" fill={s} fontFamily={ff} fontStyle="italic">b</text>
              <text x="20" y="36" fontSize="13" fill={s} fontFamily={ff} fontStyle="italic">c</text>
            </g>

            {/* ── FÓRMULA "E = mx" (topo centro) ──────────────────────── */}
            <text transform="translate(196,36)" fontSize="24"
              fill={s} fontFamily={ff} fontStyle="italic">
              E = mx
            </text>

            {/* ── TRIÂNGULO 2 (topo dir, pequeno, rotacionado) ─────────── */}
            <g transform="translate(408,6) rotate(18)">
              <polygon points="0,0 0,55 42,55"
                fill="none" stroke={s} strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M0,55 L0,47 L8,47 L8,55" fill="none" stroke={s} strokeWidth="1.2"/>
              <text x="-15" y="29" fontSize="10" fill={s} fontFamily={ff} fontStyle="italic">a</text>
              <text x="20" y="68" fontSize="10" fill={s} fontFamily={ff} fontStyle="italic">b</text>
              <text x="15" y="24" fontSize="10" fill={s} fontFamily={ff} fontStyle="italic">c</text>
            </g>

            {/* ── TRANSFERIDOR 1 (esq, linha 2) ────────────────────────── */}
            <g transform="translate(138,118)">
              {/* Arco sem o Z (evita linha dupla sobre a base) */}
              <path d="M -68,0 A 68,68 0 0 1 68,0" fill="none" stroke={s} strokeWidth="2"/>
              <line x1="-68" y1="0" x2="68" y2="0" stroke={s} strokeWidth="2"/>
              {/* Marcas maiores a cada 30° */}
              {[0,30,60,90,120,150,180].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const cx = 68 * Math.cos(Math.PI - rad);
                const cy = -68 * Math.sin(Math.PI - rad);
                return (
                  <line key={`big-${deg}`}
                    x1={cx} y1={cy} x2={cx * 0.84} y2={cy * 0.84}
                    stroke={s} strokeWidth="1.5"/>
                );
              })}
              {/* Marcas menores a cada 15° */}
              {[15,45,75,105,135,165].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const cx = 68 * Math.cos(Math.PI - rad);
                const cy = -68 * Math.sin(Math.PI - rad);
                return (
                  <line key={`sm-${deg}`}
                    x1={cx} y1={cy} x2={cx * 0.91} y2={cy * 0.91}
                    stroke={s} strokeWidth="1"/>
                );
              })}
              <line x1="0" y1="-68" x2="0" y2="0" stroke={s} strokeWidth="1.2"/>
            </g>

            {/* ── CONE 1 (centro sup) ──────────────────────────────────── */}
            <g transform="translate(322,55)">
              <ellipse cx="0" cy="90" rx="42" ry="12"
                fill="none" stroke={s} strokeWidth="1.8"/>
              <line x1="-42" y1="90" x2="0" y2="0" stroke={s} strokeWidth="1.8"/>
              <line x1="42" y1="90" x2="0" y2="0" stroke={s} strokeWidth="1.8"/>
              <line x1="0" y1="0" x2="0" y2="90"
                stroke={s} strokeWidth="1.2" strokeDasharray="5,3"/>
              <text x="-7" y="-8" fontSize="11" fill={s} fontFamily={ff} fontStyle="italic">a</text>
              <text x="8" y="50" fontSize="11" fill={s} fontFamily={ff} fontStyle="italic">c</text>
              <text x="-20" y="107" fontSize="11" fill={s} fontFamily={ff} fontStyle="italic">b</text>
            </g>

            {/* ── ≤ (dir, linha 1) ─────────────────────────────────────── */}
            <text transform="translate(448,108)" fontSize="32" fill={s} fontFamily={ff}>≤</text>

            {/* ── FÓRMULA "2R/3 √3" como fraction SVG ─────────────────── */}
            <g transform="translate(8,188)">
              <text x="0" y="0" fontSize="14" fill={s} fontFamily={ff} fontStyle="italic">2R</text>
              <line x1="-1" y1="4" x2="21" y2="4" stroke={s} strokeWidth="1.4"/>
              <text x="6" y="19" fontSize="14" fill={s} fontFamily={ff} fontStyle="italic">3</text>
              <text x="26" y="8" fontSize="17" fill={s} fontFamily={ff}>√3</text>
            </g>

            {/* ── FÓRMULA "ax²+c = 0" ──────────────────────────────────── */}
            <text transform="translate(80,248)" fontSize="19"
              fill={s} fontFamily={ff} fontStyle="italic">
              ax²+c = 0
            </text>

            {/* ── ESFERA 1 (centro, r=52) — hachura sem clipPath ────────── */}
            <g transform="translate(268,185)">
              <circle cx="0" cy="0" r="52" fill="none" stroke={s} strokeWidth="1.8"/>
              {hatch52.map(([x1,y1,x2,y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={s} strokeWidth="1.1"/>
              ))}
              <ellipse cx="0" cy="0" rx="52" ry="18"
                fill="none" stroke={s} strokeWidth="1.2"/>
            </g>

            {/* ── sin/cos (grande, dir) ─────────────────────────────────── */}
            <g transform="translate(395,158)">
              <text x="0" y="0" fontSize="22" fill={s} fontFamily={ff} fontStyle="italic">sin</text>
              {/* Linha da fração com respiro abaixo do texto */}
              <line x1="-2" y1="9" x2="60" y2="9" stroke={s} strokeWidth="1.8"/>
              <text x="0" y="32" fontSize="22" fill={s} fontFamily={ff} fontStyle="italic">cos</text>
            </g>

            {/* ── "%" (topo, espaçador visual) ─────────────────────────── */}
            <text transform="translate(195,80)" fontSize="24" fill={s} fontFamily={ff}>%</text>

            {/* ── π grande (esq, linha 3) ──────────────────────────────── */}
            <text transform="translate(12,308)" fontSize="36" fill={s} fontFamily={ff}>π</text>

            {/* ── PARALELEPÍPEDO 3D (centro-esq, linha 3) ──────────────── */}
            <g transform="translate(80,278)" stroke={s} fill="none">
              <rect x="0" y="22" width="62" height="42" strokeWidth="1.8"/>
              <path d="M0,22 L22,0 L84,0 L62,22 Z" strokeWidth="1.8"/>
              <path d="M62,22 L84,0 L84,42 L62,64 Z" strokeWidth="1.8"/>
              {/* Arestas ocultas tracejadas */}
              <line x1="0" y1="64" x2="22" y2="42" strokeWidth="1" strokeDasharray="4,3"/>
              <line x1="22" y1="42" x2="84" y2="42" strokeWidth="1" strokeDasharray="4,3"/>
              <line x1="22" y1="0" x2="22" y2="42" strokeWidth="1" strokeDasharray="4,3"/>
            </g>

            {/* ── sin/cos = tan (centro, linha 3) ──────────────────────── */}
            <g transform="translate(195,272)">
              <text x="0" y="0" fontSize="19" fill={s} fontFamily={ff} fontStyle="italic">sin</text>
              <line x1="-2" y1="7" x2="50" y2="7" stroke={s} strokeWidth="1.6"/>
              <text x="0" y="27" fontSize="19" fill={s} fontFamily={ff} fontStyle="italic">cos</text>
              {/* "= tan" alinhado verticalmente ao centro da fração */}
              <text x="56" y="16" fontSize="19" fill={s} fontFamily={ff} fontStyle="italic">= tan</text>
            </g>

            {/* ── ≥ (centro-dir) ───────────────────────────────────────── */}
            <text transform="translate(360,315)" fontSize="26" fill={s} fontFamily={ff}>≥</text>

            {/* ── CONE 2 (dir, linha 3, inclinado) ─────────────────────── */}
            <g transform="translate(415,258) rotate(8)">
              <ellipse cx="0" cy="75" rx="34" ry="10"
                fill="none" stroke={s} strokeWidth="1.6"/>
              <line x1="-34" y1="75" x2="0" y2="0" stroke={s} strokeWidth="1.6"/>
              <line x1="34" y1="75" x2="0" y2="0" stroke={s} strokeWidth="1.6"/>
              <line x1="0" y1="0" x2="0" y2="75"
                stroke={s} strokeWidth="1.1" strokeDasharray="4,3"/>
              <text x="-6" y="-6" fontSize="10" fill={s} fontFamily={ff} fontStyle="italic">a</text>
              <text x="8" y="40" fontSize="10" fill={s} fontFamily={ff} fontStyle="italic">c</text>
              <text x="-16" y="90" fontSize="10" fill={s} fontFamily={ff} fontStyle="italic">b</text>
            </g>

            {/* ── TRIÂNGULO 3 (esq, linha 4, inclinado) ────────────────── */}
            <g transform="translate(20,390) rotate(-10)">
              <polygon points="0,0 0,90 68,90"
                fill="none" stroke={s} strokeWidth="2" strokeLinejoin="round"/>
              <path d="M0,90 L0,81 L9,81 L9,90" fill="none" stroke={s} strokeWidth="1.4"/>
              <text x="-18" y="47" fontSize="13" fill={s} fontFamily={ff} fontStyle="italic">a</text>
              <text x="30" y="106" fontSize="13" fill={s} fontFamily={ff} fontStyle="italic">b</text>
              <text x="24" y="40" fontSize="13" fill={s} fontFamily={ff} fontStyle="italic">c</text>
            </g>

            {/* ── "E = mx²" (centro, linha 4) ──────────────────────────── */}
            <text transform="translate(178,400)" fontSize="22"
              fill={s} fontFamily={ff} fontStyle="italic">
              E = mx²
            </text>

            {/* ── ESFERA 2 (dir, r=38) — hachura sem clipPath ──────────── */}
            <g transform="translate(364,418)">
              <circle cx="0" cy="0" r="38" fill="none" stroke={s} strokeWidth="1.6"/>
              {hatch38.map(([x1,y1,x2,y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={s} strokeWidth="1"/>
              ))}
              <ellipse cx="0" cy="0" rx="38" ry="13"
                fill="none" stroke={s} strokeWidth="1.1"/>
            </g>

            {/* ── TRANSFERIDOR 2 (dir, linha 4, menor, rotacionado) ─────── */}
            <g transform="translate(450,462) rotate(15)">
              <path d="M -50,0 A 50,50 0 0 1 50,0" fill="none" stroke={s} strokeWidth="1.6"/>
              <line x1="-50" y1="0" x2="50" y2="0" stroke={s} strokeWidth="1.6"/>
              {[0,45,90,135,180].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const cx = 50 * Math.cos(Math.PI - rad);
                const cy = -50 * Math.sin(Math.PI - rad);
                return (
                  <line key={`t2b-${deg}`}
                    x1={cx} y1={cy} x2={cx * 0.83} y2={cy * 0.83}
                    stroke={s} strokeWidth="1.3"/>
                );
              })}
              {[22.5,67.5,112.5,157.5].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const cx = 50 * Math.cos(Math.PI - rad);
                const cy = -50 * Math.sin(Math.PI - rad);
                return (
                  <line key={`t2s-${deg}`}
                    x1={cx} y1={cy} x2={cx * 0.9} y2={cy * 0.9}
                    stroke={s} strokeWidth="0.9"/>
                );
              })}
            </g>

            {/* ── "ax²+c=0" repetidos (rodapé do tile) ─────────────────── */}
            <text transform="translate(80,492)" fontSize="17"
              fill={s} fontFamily={ff} fontStyle="italic">ax²+c = 0</text>
            <text transform="translate(305,492)" fontSize="17"
              fill={s} fontFamily={ff} fontStyle="italic">ax²+c = 0</text>

            {/* ── Pontos decorativos ────────────────────────────────────── */}
            {([
              [170,56],[345,56],[462,56],
              [10,243],[450,243],
              [8,353],[162,353],[470,353],
              [285,455],[455,512],
            ] as [number,number][]).map(([x,y], i) => (
              <circle key={i} cx={x} cy={y} r="3.5" fill={s}/>
            ))}
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#mathBg)"/>
      </svg>
    </div>
  );
}
