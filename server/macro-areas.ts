// ============================================================================
// Áreas macro para o radar de desempenho.
// Em vez de 34 tópicos granulares (conteudo_principal + tags), o radar agrupa
// cada questão em UMA das 8 áreas abaixo. Isso deixa o gráfico legível e evita
// o problema de "tópicos com 1 questão só → 100% falso".
// ============================================================================

export const MACRO_AREAS = [
  "Matemática Básica",
  "Álgebra",
  "Funções",
  "Geometria Plana",
  "Geometria Espacial",
  "Trigonometria",
  "Probabilidade e Estatística",
  "Análise Combinatória",
] as const;

export type MacroArea = (typeof MACRO_AREAS)[number];

// Mapa explícito — cobre nomes "oficiais" usados em conteudo_principal e tags.
// O lookup é feito sobre a string normalizada (trim). Prefira manter as chaves
// com a grafia como aparecem no banco.
const TOPIC_TO_AREA: Record<string, MacroArea> = {
  // ─── Matemática Básica ────────────────────────────────────────────────────
  "Aritmética": "Matemática Básica",
  "Operações com frações": "Matemática Básica",
  "Operações com Frações": "Matemática Básica",
  "Frações": "Matemática Básica",
  "Porcentagem": "Matemática Básica",
  "Razão e proporção": "Matemática Básica",
  "Razão e Proporção": "Matemática Básica",
  "Razão, proporção e regra de três": "Matemática Básica",
  "Regra de três": "Matemática Básica",
  "Regra de Três": "Matemática Básica",
  "Proporções": "Matemática Básica",
  "Divisão em partes proporcionais": "Matemática Básica",
  "Divisão em Partes Proporcionais": "Matemática Básica",
  "Juros simples": "Matemática Básica",
  "Juros compostos": "Matemática Básica",
  "Juros": "Matemática Básica",
  "Matemática financeira": "Matemática Básica",
  "Matemática Financeira": "Matemática Básica",
  "Conjuntos numéricos": "Matemática Básica",
  "Conjuntos Numéricos": "Matemática Básica",
  "Conjuntos": "Matemática Básica",
  "Grandezas e medidas": "Matemática Básica",
  "Grandezas e Medidas": "Matemática Básica",
  "Sistema de medidas": "Matemática Básica",
  "Notação científica": "Matemática Básica",
  "Potências e raízes": "Matemática Básica",
  "Operações": "Matemática Básica",

  // ─── Álgebra ──────────────────────────────────────────────────────────────
  "Álgebra": "Álgebra",
  "Equações do 1º grau": "Álgebra",
  "Equações do 2º grau": "Álgebra",
  "Equações polinomiais": "Álgebra",
  "Equações exponenciais": "Álgebra",
  "Equações logarítmicas": "Álgebra",
  "Equações": "Álgebra",
  "Inequações": "Álgebra",
  "Sistemas lineares": "Álgebra",
  "Sistemas de equações": "Álgebra",
  "Matrizes": "Álgebra",
  "Determinantes": "Álgebra",
  "Matrizes e determinantes": "Álgebra",
  "Números complexos": "Álgebra",
  "Logaritmo": "Álgebra",
  "Logaritmos": "Álgebra",
  "Progressão aritmética": "Álgebra",
  "Progressão Aritmética": "Álgebra",
  "Progressão geométrica": "Álgebra",
  "Progressão Geométrica": "Álgebra",
  "Progressões": "Álgebra",
  "PA": "Álgebra",
  "PG": "Álgebra",
  "Polinômios": "Álgebra",

  // ─── Funções ──────────────────────────────────────────────────────────────
  "Funções": "Funções",
  "Função afim": "Funções",
  "Função Afim": "Funções",
  "Função linear": "Funções",
  "Função do 1º grau": "Funções",
  "Função do 1° grau": "Funções",
  "Função quadrática": "Funções",
  "Função Quadrática": "Funções",
  "Função do 2º grau": "Funções",
  "Função do 2° grau": "Funções",
  "Função exponencial": "Funções",
  "Função Exponencial": "Funções",
  "Função logarítmica": "Funções",
  "Função Logarítmica": "Funções",
  "Função modular": "Funções",
  "Função Modular": "Funções",
  "Função composta": "Funções",
  "Função Composta": "Funções",
  "Função inversa": "Funções",
  "Função Inversa": "Funções",
  "Domínio e imagem": "Funções",
  "Gráficos de funções": "Funções",

  // ─── Geometria Plana (inclui Analítica) ───────────────────────────────────
  "Geometria Plana": "Geometria Plana",
  "Áreas": "Geometria Plana",
  "Áreas de figuras planas": "Geometria Plana",
  "Perímetro": "Geometria Plana",
  "Perímetros": "Geometria Plana",
  "Teorema de Pitágoras": "Geometria Plana",
  "Teorema de Tales": "Geometria Plana",
  "Semelhança": "Geometria Plana",
  "Semelhança de triângulos": "Geometria Plana",
  "Congruência": "Geometria Plana",
  "Polígonos": "Geometria Plana",
  "Polígonos regulares": "Geometria Plana",
  "Triângulos": "Geometria Plana",
  "Quadriláteros": "Geometria Plana",
  "Círculo": "Geometria Plana",
  "Circunferência": "Geometria Plana",
  "Relações métricas": "Geometria Plana",
  // Analítica — por pedido do Prof. Waldo entra em Plana
  "Geometria Analítica": "Geometria Plana",
  "Geo. Analítica": "Geometria Plana",
  "Geometria analítica": "Geometria Plana",
  "Distância entre pontos": "Geometria Plana",
  "Equação da reta": "Geometria Plana",
  "Retas": "Geometria Plana",
  "Cônicas": "Geometria Plana",
  "Elipse": "Geometria Plana",
  "Hipérbole": "Geometria Plana",
  "Parábola": "Geometria Plana",

  // ─── Geometria Espacial ───────────────────────────────────────────────────
  "Geometria Espacial": "Geometria Espacial",
  "Prismas": "Geometria Espacial",
  "Prisma": "Geometria Espacial",
  "Paralelepípedo": "Geometria Espacial",
  "Cubo": "Geometria Espacial",
  "Cilindros": "Geometria Espacial",
  "Cilindro": "Geometria Espacial",
  "Cones": "Geometria Espacial",
  "Cone": "Geometria Espacial",
  "Pirâmides": "Geometria Espacial",
  "Pirâmide": "Geometria Espacial",
  "Esferas": "Geometria Espacial",
  "Esfera": "Geometria Espacial",
  "Poliedros": "Geometria Espacial",
  "Volumes": "Geometria Espacial",
  "Sólidos": "Geometria Espacial",
  "Sólidos de revolução": "Geometria Espacial",

  // ─── Trigonometria ────────────────────────────────────────────────────────
  "Trigonometria": "Trigonometria",
  "Trigonometria no triângulo retângulo": "Trigonometria",
  "Razões trigonométricas": "Trigonometria",
  "Círculo trigonométrico": "Trigonometria",
  "Identidades trigonométricas": "Trigonometria",
  "Lei dos senos": "Trigonometria",
  "Lei dos cossenos": "Trigonometria",
  "Funções trigonométricas": "Trigonometria",

  // ─── Probabilidade e Estatística ──────────────────────────────────────────
  "Probabilidade": "Probabilidade e Estatística",
  "Probabilidade e estatística": "Probabilidade e Estatística",
  "Probabilidade e Estatística": "Probabilidade e Estatística",
  "Probabilidade condicional": "Probabilidade e Estatística",
  "Distribuição binomial": "Probabilidade e Estatística",
  "Estatística": "Probabilidade e Estatística",
  "Média": "Probabilidade e Estatística",
  "Mediana": "Probabilidade e Estatística",
  "Moda": "Probabilidade e Estatística",
  "Medidas de tendência central": "Probabilidade e Estatística",
  "Medidas de Tendência Central": "Probabilidade e Estatística",
  "Desvio padrão": "Probabilidade e Estatística",
  "Variância": "Probabilidade e Estatística",
  "Gráficos e tabelas": "Probabilidade e Estatística",

  // ─── Análise Combinatória ─────────────────────────────────────────────────
  "Análise Combinatória": "Análise Combinatória",
  "Análise combinatória": "Análise Combinatória",
  "Princípio Fundamental da Contagem": "Análise Combinatória",
  "Princípio fundamental da contagem": "Análise Combinatória",
  "PFC": "Análise Combinatória",
  "Arranjo": "Análise Combinatória",
  "Arranjos": "Análise Combinatória",
  "Combinação": "Análise Combinatória",
  "Combinações": "Análise Combinatória",
  "Permutação": "Análise Combinatória",
  "Permutações": "Análise Combinatória",
  "Fatorial": "Análise Combinatória",
};

// Fallback por palavra-chave para tópicos novos/variações de grafia. Aplica-se
// quando o mapa explícito não tem match.
function keywordFallback(raw: string): MacroArea | null {
  const t = raw.toLowerCase();

  // Funções — prioridade sobre álgebra (Função Logarítmica ≠ Logaritmo)
  if (/\bfun[çc][aã]o\b/.test(t)) return "Funções";

  // Trigonometria
  if (/trigonom|\bseno\b|\bcosseno\b|\btangente\b|\bcotangente\b/.test(t)) return "Trigonometria";

  // Geometria Espacial
  if (/prism|cilind|\bcone\b|pir[aâ]mid|esfera|poliedro|s[oó]lido|volume|tronco/.test(t)) return "Geometria Espacial";

  // Geometria Plana (inclui analítica)
  if (/anal[íi]tica|\brat[aa]\b|\bretas\b|c[oô]nica|elipse|hip[eé]rbole|par[aá]bola/.test(t)) return "Geometria Plana";
  if (/tri[aâ]ngulo|quadril[aá]t|c[ií]rculo|circunfer[eê]ncia|pol[ií]gono|pit[aá]goras|tales|semelhan[çc]a|congru[eê]ncia|[aá]reas?|per[íi]metro/.test(t)) return "Geometria Plana";

  // Probabilidade e Estatística
  if (/probabilidade|estat[íi]stica|m[eé]dia|mediana|moda|desvio|vari[aâ]ncia/.test(t)) return "Probabilidade e Estatística";

  // Análise Combinatória
  if (/combinat[oó]r|combina[çc][aã]o|arranjo|permuta[çc][aã]o|fatorial|contagem|pfc/.test(t)) return "Análise Combinatória";

  // Álgebra (depois de Funções — senão "função logarítmica" cairia aqui)
  if (/logaritm|progress[aã]o\b|\bpa\b|\bpg\b|matriz|determinante|sistema|polin[oô]m|equa[çc][aã]o|inequa[çc][aã]o|complexo/.test(t)) return "Álgebra";

  // Matemática Básica
  if (/fra[çc][aã]o|porcentagem|propor[çc][aã]o|raz[aã]o|regra de tr[eê]s|juros|financeira|aritm[eé]tica|grandeza|\bmedida/.test(t)) return "Matemática Básica";

  return null;
}

// Retorna todos os conteudo_principal que pertencem a uma área macro.
// Usado pelo startFreeTraining para filtrar questões por área.
export function getTopicsForArea(area: MacroArea): string[] {
  return [...new Set(
    Object.entries(TOPIC_TO_AREA)
      .filter(([, a]) => a === area)
      .map(([topic]) => topic),
  )];
}

// Determina a UMA área macro a creditar a uma questão. Prioridade:
// 1. conteudo_principal (mapa explícito → fallback)
// 2. tags, na ordem (mapa explícito → fallback)
// Retorna null só se nada bateu — a questão é ignorada no radar.
export function resolveArea(
  conteudo: string | null | undefined,
  tags: unknown,
): MacroArea | null {
  if (conteudo) {
    const k = conteudo.trim();
    if (k) {
      const explicit = TOPIC_TO_AREA[k];
      if (explicit) return explicit;
      const fb = keywordFallback(k);
      if (fb) return fb;
    }
  }
  if (Array.isArray(tags)) {
    // 1ª passada: match exato
    for (const t of tags) {
      if (typeof t !== "string") continue;
      const k = t.trim();
      if (!k) continue;
      const explicit = TOPIC_TO_AREA[k];
      if (explicit) return explicit;
    }
    // 2ª passada: fallback por keyword
    for (const t of tags) {
      if (typeof t !== "string") continue;
      const fb = keywordFallback(t.trim());
      if (fb) return fb;
    }
  }
  return null;
}
