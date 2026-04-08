/**
 * seed-fisica.mjs
 * ---------------
 * Insere fórmulas de Física no banco de dados.
 * Uso: node seed-fisica.mjs
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mysql://root:xZfMdSLItedawnicMsBBZdlyitYamXyv@gondola.proxy.rlwy.net:40821/railway";

const pool = mysql.createPool({ uri: DATABASE_URL, connectionLimit: 1 });
const conn = await pool.getConnection();

const FISICA = [
  // ── Cinemática ────────────────────────────────────────────────────────────
  { secao: "Física — Cinemática", cor: "#1565C0", ordem: 1,
    titulo: "Velocidade média",
    formula: "$$v_m = \\frac{\\Delta s}{\\Delta t} = \\frac{s_f - s_i}{t_f - t_i}$$",
    descricao: "Razão entre o deslocamento $\\Delta s$ e o intervalo de tempo $\\Delta t$. Unidade: m/s." },

  { secao: "Física — Cinemática", cor: "#1565C0", ordem: 2,
    titulo: "Aceleração média",
    formula: "$$a_m = \\frac{\\Delta v}{\\Delta t} = \\frac{v_f - v_i}{\\Delta t}$$",
    descricao: "Variação da velocidade por unidade de tempo. Unidade: m/s²." },

  { secao: "Física — Cinemática", cor: "#1565C0", ordem: 3,
    titulo: "MRU — equação horária",
    formula: "$$s = s_0 + v \\cdot t$$",
    descricao: "Movimento Retilíneo Uniforme: velocidade constante, aceleração nula." },

  { secao: "Física — Cinemática", cor: "#1565C0", ordem: 4,
    titulo: "MRUV — equação horária da posição",
    formula: "$$s = s_0 + v_0 t + \\frac{a t^2}{2}$$",
    descricao: "Movimento Retilíneo Uniformemente Variado: posição em função do tempo." },

  { secao: "Física — Cinemática", cor: "#1565C0", ordem: 5,
    titulo: "MRUV — equação horária da velocidade",
    formula: "$$v = v_0 + a \\cdot t$$",
    descricao: "A velocidade cresce (ou decresce) linearmente com o tempo quando a aceleração é constante." },

  { secao: "Física — Cinemática", cor: "#1565C0", ordem: 6,
    titulo: "Equação de Torricelli",
    formula: "$$v^2 = v_0^2 + 2a \\Delta s$$",
    descricao: "Relaciona velocidade, aceleração e deslocamento sem envolver o tempo. Fundamental em problemas de frenagem." },

  { secao: "Física — Cinemática", cor: "#1565C0", ordem: 7,
    titulo: "Lançamento vertical — altura máxima",
    formula: "$$H = \\frac{v_0^2}{2g}$$",
    descricao: "Altura máxima atingida por um objeto lançado verticalmente para cima com velocidade inicial $v_0$. $g \\approx 10$ m/s²." },

  { secao: "Física — Cinemática", cor: "#1565C0", ordem: 8,
    titulo: "Queda livre — velocidade e distância",
    formula: "$$v = g \\cdot t \\qquad h = \\frac{g t^2}{2}$$",
    descricao: "Queda livre a partir do repouso: velocidade cresce com $g$ e a altura percorrida é proporcional a $t^2$." },

  { secao: "Física — Cinemática", cor: "#1565C0", ordem: 9,
    titulo: "Velocidade angular",
    formula: "$$\\omega = \\frac{\\Delta \\theta}{\\Delta t} \\qquad v = \\omega r$$",
    descricao: "Movimento circular: $\\omega$ é a velocidade angular (rad/s), $r$ o raio e $v$ a velocidade linear tangencial." },

  { secao: "Física — Cinemática", cor: "#1565C0", ordem: 10,
    titulo: "Aceleração centrípeta",
    formula: "$$a_c = \\frac{v^2}{r} = \\omega^2 r$$",
    descricao: "Aceleração dirigida ao centro no movimento circular. Responsável pela mudança de direção da velocidade." },

  // ── Dinâmica ──────────────────────────────────────────────────────────────
  { secao: "Física — Dinâmica", cor: "#0277BD", ordem: 1,
    titulo: "2ª Lei de Newton",
    formula: "$$\\vec{F}_{\\text{res}} = m \\cdot \\vec{a}$$",
    descricao: "A força resultante é igual à massa vezes a aceleração. Base de toda a Dinâmica." },

  { secao: "Física — Dinâmica", cor: "#0277BD", ordem: 2,
    titulo: "Força Peso",
    formula: "$$P = m \\cdot g$$",
    descricao: "Força gravitacional exercida sobre um corpo de massa $m$. Na Terra, $g \\approx 9{,}8 \\approx 10$ m/s²." },

  { secao: "Física — Dinâmica", cor: "#0277BD", ordem: 3,
    titulo: "Força de atrito",
    formula: "$$f = \\mu \\cdot N$$",
    descricao: "Onde $\\mu$ é o coeficiente de atrito (estático ou cinético) e $N$ é a força normal. Opõe-se ao movimento." },

  { secao: "Física — Dinâmica", cor: "#0277BD", ordem: 4,
    titulo: "Força gravitacional universal",
    formula: "$$F = G \\cdot \\frac{m_1 m_2}{d^2}$$",
    descricao: "Lei da Gravitação Universal de Newton. $G = 6{,}67 \\times 10^{-11}$ N·m²/kg². A força decresce com o quadrado da distância." },

  { secao: "Física — Dinâmica", cor: "#0277BD", ordem: 5,
    titulo: "Força elástica — Lei de Hooke",
    formula: "$$F = k \\cdot x$$",
    descricao: "Força exercida por uma mola de constante elástica $k$ ao ser deformada de $x$. Vale na região elástica." },

  { secao: "Física — Dinâmica", cor: "#0277BD", ordem: 6,
    titulo: "Quantidade de movimento (Impulso)",
    formula: "$$\\vec{p} = m \\cdot \\vec{v} \\qquad \\vec{I} = \\vec{F} \\cdot \\Delta t = \\Delta \\vec{p}$$",
    descricao: "O impulso de uma força é igual à variação do momento linear. Fundamental em colisões." },

  { secao: "Física — Dinâmica", cor: "#0277BD", ordem: 7,
    titulo: "Conservação do momento linear",
    formula: "$$m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2'$$",
    descricao: "Em sistemas isolados (sem forças externas), o momento total se conserva. Base para colisões." },

  // ── Energia e Trabalho ────────────────────────────────────────────────────
  { secao: "Física — Energia e Trabalho", cor: "#00695C", ordem: 1,
    titulo: "Trabalho de uma força constante",
    formula: "$$\\tau = F \\cdot d \\cdot \\cos\\theta$$",
    descricao: "Trabalho realizado por uma força $F$ num deslocamento $d$, formando ângulo $\\theta$ com o deslocamento." },

  { secao: "Física — Energia e Trabalho", cor: "#00695C", ordem: 2,
    titulo: "Energia cinética",
    formula: "$$E_c = \\frac{mv^2}{2}$$",
    descricao: "Energia associada ao movimento de um corpo de massa $m$ e velocidade $v$." },

  { secao: "Física — Energia e Trabalho", cor: "#00695C", ordem: 3,
    titulo: "Energia potencial gravitacional",
    formula: "$$E_p = m \\cdot g \\cdot h$$",
    descricao: "Energia armazenada pela posição de um corpo a altura $h$ em relação a um referencial." },

  { secao: "Física — Energia e Trabalho", cor: "#00695C", ordem: 4,
    titulo: "Energia potencial elástica",
    formula: "$$E_{pe} = \\frac{k x^2}{2}$$",
    descricao: "Energia armazenada em uma mola de constante $k$ comprimida ou esticada de $x$." },

  { secao: "Física — Energia e Trabalho", cor: "#00695C", ordem: 5,
    titulo: "Conservação de energia mecânica",
    formula: "$$E_c + E_p = \\text{constante} \\quad (\\text{sem atrito})$$",
    descricao: "Na ausência de forças dissipativas, a soma da energia cinética e potencial é constante." },

  { secao: "Física — Energia e Trabalho", cor: "#00695C", ordem: 6,
    titulo: "Potência",
    formula: "$$P = \\frac{\\tau}{\\Delta t} = F \\cdot v$$",
    descricao: "Potência é a taxa de realização de trabalho. Unidade: Watt (W). $P = F \\cdot v$ vale para força paralela ao movimento." },

  { secao: "Física — Energia e Trabalho", cor: "#00695C", ordem: 7,
    titulo: "Rendimento",
    formula: "$$\\eta = \\frac{P_{\\text{útil}}}{P_{\\text{total}}} \\times 100\\%$$",
    descricao: "Razão entre a potência (ou energia) útil e a total fornecida. Sempre $\\eta \\leq 100\\%$." },

  // ── Termologia ────────────────────────────────────────────────────────────
  { secao: "Física — Termologia", cor: "#E65100", ordem: 1,
    titulo: "Conversão de temperatura",
    formula: "$$\\frac{C}{5} = \\frac{F - 32}{9} = \\frac{K - 273}{5}$$",
    descricao: "Converte entre Celsius (C), Fahrenheit (F) e Kelvin (K)." },

  { secao: "Física — Termologia", cor: "#E65100", ordem: 2,
    titulo: "Dilatação linear",
    formula: "$$\\Delta L = L_0 \\cdot \\alpha \\cdot \\Delta T$$",
    descricao: "Variação de comprimento de um sólido com a temperatura. $\\alpha$: coeficiente de dilatação linear (1/°C)." },

  { secao: "Física — Termologia", cor: "#E65100", ordem: 3,
    titulo: "Dilatação volumétrica",
    formula: "$$\\Delta V = V_0 \\cdot \\gamma \\cdot \\Delta T \\qquad \\gamma = 3\\alpha$$",
    descricao: "Variação de volume com a temperatura. Para sólidos isotrópicos, $\\gamma \\approx 3\\alpha$." },

  { secao: "Física — Termologia", cor: "#E65100", ordem: 4,
    titulo: "Calor sensível",
    formula: "$$Q = m \\cdot c \\cdot \\Delta T$$",
    descricao: "Calor necessário para variar a temperatura de uma substância. $c$: calor específico (J/kg·°C)." },

  { secao: "Física — Termologia", cor: "#E65100", ordem: 5,
    titulo: "Calor latente",
    formula: "$$Q = m \\cdot L$$",
    descricao: "Calor envolvido em mudanças de fase (fusão, vaporização) sem variação de temperatura. $L$: calor latente (J/kg)." },

  { secao: "Física — Termologia", cor: "#E65100", ordem: 6,
    titulo: "Equação geral dos gases ideais",
    formula: "$$\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}$$",
    descricao: "Relaciona pressão, volume e temperatura (em Kelvin) de um gás ideal em dois estados distintos." },

  { secao: "Física — Termologia", cor: "#E65100", ordem: 7,
    titulo: "Transformações do gás ideal",
    formula: "$$\\text{Isotérmica: } PV = \\text{cte} \\quad \\text{Isobárica: } \\frac{V}{T} = \\text{cte} \\quad \\text{Isocórica: } \\frac{P}{T} = \\text{cte}$$",
    descricao: "Leis de Boyle (isotérmica), Charles (isobárica) e Gay-Lussac (isocórica) para gases ideais." },

  { secao: "Física — Termologia", cor: "#E65100", ordem: 8,
    titulo: "Eficiência de máquina térmica (Carnot)",
    formula: "$$\\eta = 1 - \\frac{T_f}{T_q} = \\frac{\\tau}{Q_q}$$",
    descricao: "Rendimento máximo teórico de uma máquina térmica entre as temperaturas $T_q$ (quente) e $T_f$ (fria), em Kelvin." },

  // ── Eletricidade ──────────────────────────────────────────────────────────
  { secao: "Física — Eletricidade", cor: "#6A1B9A", ordem: 1,
    titulo: "Lei de Coulomb",
    formula: "$$F = k \\cdot \\frac{|q_1 \\cdot q_2|}{d^2} \\qquad k = 9 \\times 10^9 \\text{ N·m}^2/\\text{C}^2$$",
    descricao: "Força entre duas cargas pontuais. Proporcional ao produto das cargas e inversamente proporcional ao quadrado da distância." },

  { secao: "Física — Eletricidade", cor: "#6A1B9A", ordem: 2,
    titulo: "Campo elétrico",
    formula: "$$E = \\frac{F}{q} = k \\cdot \\frac{Q}{d^2}$$",
    descricao: "Campo elétrico criado por uma carga $Q$ a distância $d$. Unidade: N/C ou V/m." },

  { secao: "Física — Eletricidade", cor: "#6A1B9A", ordem: 3,
    titulo: "Potencial elétrico",
    formula: "$$V = k \\cdot \\frac{Q}{d} \\qquad U = q \\cdot V$$",
    descricao: "Potencial $V$ (em Volts) e energia potencial elétrica $U$ de uma carga $q$ no campo de $Q$." },

  { secao: "Física — Eletricidade", cor: "#6A1B9A", ordem: 4,
    titulo: "Lei de Ohm",
    formula: "$$U = R \\cdot i$$",
    descricao: "A tensão ($U$) em um resistor é proporcional à corrente ($i$). $R$: resistência em Ohms (Ω)." },

  { secao: "Física — Eletricidade", cor: "#6A1B9A", ordem: 5,
    titulo: "Resistência elétrica",
    formula: "$$R = \\rho \\cdot \\frac{L}{A}$$",
    descricao: "Resistência em função da resistividade $\\rho$, comprimento $L$ e seção transversal $A$ do condutor." },

  { secao: "Física — Eletricidade", cor: "#6A1B9A", ordem: 6,
    titulo: "Associação de resistores",
    formula: "$$R_{\\text{série}} = R_1 + R_2 \\qquad \\frac{1}{R_{\\text{paralelo}}} = \\frac{1}{R_1} + \\frac{1}{R_2}$$",
    descricao: "Em série as resistências somam; em paralelo somam os inversos." },

  { secao: "Física — Eletricidade", cor: "#6A1B9A", ordem: 7,
    titulo: "Potência elétrica",
    formula: "$$P = U \\cdot i = R \\cdot i^2 = \\frac{U^2}{R}$$",
    descricao: "Três formas equivalentes para a potência dissipada (ou fornecida) em um elemento de circuito." },

  { secao: "Física — Eletricidade", cor: "#6A1B9A", ordem: 8,
    titulo: "Energia elétrica e custo",
    formula: "$$E = P \\cdot \\Delta t \\quad (\\text{kWh}) \\qquad \\text{Custo} = E \\times \\text{tarifa}$$",
    descricao: "Energia consumida (kWh) = potência (kW) × tempo (h). Multiplica pelo preço do kWh para obter o custo." },

  { secao: "Física — Eletricidade", cor: "#6A1B9A", ordem: 9,
    titulo: "Capacitância",
    formula: "$$C = \\frac{Q}{V} \\qquad E_C = \\frac{C V^2}{2}$$",
    descricao: "Capacitância $C$ (Farad) de um capacitor e a energia armazenada $E_C$." },

  // ── Óptica e Ondulatória ──────────────────────────────────────────────────
  { secao: "Física — Óptica e Ondulatória", cor: "#00838F", ordem: 1,
    titulo: "Equação de Gauss (espelhos e lentes)",
    formula: "$$\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{p'}$$",
    descricao: "Relação entre distância focal $f$, distância objeto $p$ e distância imagem $p'$. Válida para espelhos e lentes delgadas." },

  { secao: "Física — Óptica e Ondulatória", cor: "#00838F", ordem: 2,
    titulo: "Ampliação linear transversal",
    formula: "$$M = \\frac{i}{o} = -\\frac{p'}{p}$$",
    descricao: "$|M| > 1$: imagem ampliada. $|M| < 1$: reduzida. Sinal negativo: imagem real/invertida." },

  { secao: "Física — Óptica e Ondulatória", cor: "#00838F", ordem: 3,
    titulo: "Lei de Snell-Descartes",
    formula: "$$n_1 \\cdot \\sen \\theta_1 = n_2 \\cdot \\sen \\theta_2$$",
    descricao: "Refração da luz na interface de dois meios com índices de refração $n_1$ e $n_2$." },

  { secao: "Física — Óptica e Ondulatória", cor: "#00838F", ordem: 4,
    titulo: "Índice de refração",
    formula: "$$n = \\frac{c}{v} \\qquad c = 3 \\times 10^8 \\text{ m/s}$$",
    descricao: "Razão entre a velocidade da luz no vácuo $c$ e a velocidade $v$ no meio. $n \\geq 1$." },

  { secao: "Física — Óptica e Ondulatória", cor: "#00838F", ordem: 5,
    titulo: "Relação fundamental das ondas",
    formula: "$$v = \\lambda \\cdot f$$",
    descricao: "Velocidade de propagação $v$, comprimento de onda $\\lambda$ e frequência $f$. Universal para qualquer onda." },

  { secao: "Física — Óptica e Ondulatória", cor: "#00838F", ordem: 6,
    titulo: "Efeito Doppler",
    formula: "$$f' = f \\cdot \\frac{v \\pm v_o}{v \\mp v_s}$$",
    descricao: "Frequência percebida $f'$ quando há movimento relativo entre fonte e observador. $+$ quando se aproximam, $-$ quando se afastam." },

  // ── Hidrostática ──────────────────────────────────────────────────────────
  { secao: "Física — Hidrostática", cor: "#01579B", ordem: 1,
    titulo: "Pressão",
    formula: "$$P = \\frac{F}{A}$$",
    descricao: "Pressão é a força perpendicular por unidade de área. Unidade: Pascal (Pa = N/m²)." },

  { secao: "Física — Hidrostática", cor: "#01579B", ordem: 2,
    titulo: "Pressão hidrostática",
    formula: "$$P = P_0 + \\rho g h$$",
    descricao: "Pressão a profundidade $h$ num líquido de densidade $\\rho$. $P_0$: pressão na superfície (atmosférica)." },

  { secao: "Física — Hidrostática", cor: "#01579B", ordem: 3,
    titulo: "Princípio de Arquimedes (empuxo)",
    formula: "$$E = \\rho_{\\text{fluido}} \\cdot g \\cdot V_{\\text{submerso}}$$",
    descricao: "O empuxo é igual ao peso do fluido deslocado pelo corpo. Determina se o objeto flutua ou afunda." },

  { secao: "Física — Hidrostática", cor: "#01579B", ordem: 4,
    titulo: "Equação da continuidade",
    formula: "$$A_1 v_1 = A_2 v_2$$",
    descricao: "Em fluidos incompressíveis: o produto área × velocidade é constante ao longo do tubo (vazão constante)." },

  { secao: "Física — Hidrostática", cor: "#01579B", ordem: 5,
    titulo: "Equação de Bernoulli",
    formula: "$$P + \\frac{\\rho v^2}{2} + \\rho g h = \\text{constante}$$",
    descricao: "Conservação de energia em fluidos ideais em escoamento. Relaciona pressão, velocidade e altura." },
];

try {
  let inserted = 0;
  for (const f of FISICA) {
    await conn.execute(
      `INSERT INTO formulas (secao, cor, ordem, titulo, formula, descricao, active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [f.secao, f.cor, f.ordem, f.titulo, f.formula, f.descricao]
    );
    inserted++;
  }
  console.log(`✅ ${inserted} fórmulas de Física inseridas com sucesso!`);
} finally {
  conn.release();
  await pool.end();
}
