// =============================================================================
// Tipos das Trilhas de Desenvolvimento
// =============================================================================
// Estrutura hierárquica:
//   Área (ex: Matemática Básica)
//     └─ Capítulo (ex: Operações com frações)
//         └─ Lição (ex: Adição e subtração de frações)
//             ├─ explicação em LaTeX
//             ├─ 2 exemplos resolvidos
//             └─ 10 exercícios progressivos
// =============================================================================

/** Uma alternativa de uma questão da trilha. */
export interface Alternativa {
  letra: "A" | "B" | "C" | "D" | "E";
  /** Texto da alternativa — suporta LaTeX ($...$ ou $$...$$). */
  texto: string;
}

/** Um exercício individual da lição. */
export interface Exercicio {
  id: string;
  /** Enunciado em LaTeX. */
  enunciado: string;
  alternativas: Alternativa[];
  gabarito: "A" | "B" | "C" | "D" | "E";
  /** Explicação pedagógica do porquê — mostrada após responder. */
  explicacao: string;
}

/** Um exemplo resolvido passo-a-passo. */
export interface Exemplo {
  titulo: string;
  /** Enunciado do exemplo em LaTeX. */
  problema: string;
  /** Resolução passo-a-passo em LaTeX. */
  resolucao: string;
}

/** Uma lição — unidade atômica de aprendizagem. */
export interface Licao {
  slug: string;
  titulo: string;
  /** Resumo curto mostrado no card da lição. */
  resumo: string;
  /** Tempo estimado em minutos. */
  duracaoMinutos: number;
  /** Texto introdutório em LaTeX (a "explicação" pedagógica). */
  explicacao: string;
  exemplos: Exemplo[];
  exercicios: Exercicio[];
}

/** Um capítulo — agrupa lições relacionadas. */
export interface Capitulo {
  slug: string;
  titulo: string;
  licoes: Licao[];
}

/** Uma trilha — mapeada a uma área de conhecimento do Dashboard. */
export interface Trilha {
  slug: string;
  /** Nome da área exatamente como aparece em questions.conteudo_principal
   *  (usado para casar com "Pontos a melhorar" no Dashboard). */
  area: string;
  titulo: string;
  /** Descrição curta mostrada no topo da tela da trilha. */
  descricao: string;
  capitulos: Capitulo[];
}
