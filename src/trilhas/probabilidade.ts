import type { Trilha } from "./types";

// =============================================================================
// Trilha: Probabilidade e Estatística
// =============================================================================
// Sequência didática: cada exercício usa os elementos do anterior + um conceito
// novo, construindo o conhecimento de forma cumulativa.
// =============================================================================

export const probabilidade: Trilha = {
  slug: "probabilidade",
  area: "Probabilidade e Estatística",
  titulo: "Trilha de Probabilidade",
  descricao:
    "Do conceito de espaço amostral até probabilidade condicional — cada exercício constrói sobre o anterior.",

  capitulos: [
    {
      slug: "nocoes-iniciais",
      titulo: "Noções Iniciais de Probabilidade",
      licoes: [
        {
          slug: "fundamentos-probabilidade",
          titulo: "Fundamentos de Probabilidade",
          resumo:
            "Espaço amostral, evento, regra clássica, complemento, multiplicação e probabilidade sem reposição.",
          duracaoMinutos: 30,

          // ===================================================================
          // Explicação teórica
          // ===================================================================
          explicacao: `
A **probabilidade** mede o quão provável é que um evento ocorra. A definição clássica é:

$$P(A) = \\frac{\\text{número de casos favoráveis}}{\\text{número de casos possíveis}}$$

### Espaço amostral
O **espaço amostral** $\\Omega$ é o conjunto de **todos** os resultados possíveis de um experimento.

Exemplo — lançar um dado de 6 faces:
$$\\Omega = \\{1,\\, 2,\\, 3,\\, 4,\\, 5,\\, 6\\}$$

Um **evento** é qualquer subconjunto de $\\Omega$. O evento "sair par" é $A = \\{2, 4, 6\\}$.

### Regra do complemento
O evento complementar $A^c$ representa "A não ocorrer":
$$P(A^c) = 1 - P(A)$$

### Regra da multiplicação (eventos independentes)
Para dois experimentos independentes A e B:
$$P(A \\text{ e } B) = P(A) \\cdot P(B)$$

### Probabilidade sem reposição
Quando os elementos são retirados **sem repor**, o espaço amostral diminui a cada retirada:
$$P(1^a \\text{ vermelha}) = \\frac{r}{n}, \\quad P(2^a \\text{ vermelha} \\mid 1^a \\text{ vermelha}) = \\frac{r-1}{n-1}$$
          `.trim(),

          // ===================================================================
          // Exemplos resolvidos
          // ===================================================================
          exemplos: [
            {
              titulo: "Exemplo 1 — Evento simples",
              problema:
                "Um dado de 6 faces é lançado. Qual é a probabilidade de sair o número 4?",
              resolucao: `
O espaço amostral é $\\Omega = \\{1, 2, 3, 4, 5, 6\\}$, com $|\\Omega| = 6$ resultados possíveis.

O evento "sair 4" tem apenas 1 caso favorável.

$$P(\\text{sair 4}) = \\frac{1}{6}$$
              `.trim(),
            },
            {
              titulo: "Exemplo 2 — Multiplicação para experimentos independentes",
              problema:
                "Uma moeda é lançada duas vezes. Qual é a probabilidade de sair cara nas duas?",
              resolucao: `
Cada lançamento é independente: $P(\\text{cara}) = \\tfrac{1}{2}$.

Pela regra da multiplicação:
$$P(\\text{cara e cara}) = \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{1}{4}$$
              `.trim(),
            },
          ],

          // ===================================================================
          // Exercícios — sequência cumulativa
          // Cada exercício acrescenta exatamente um elemento novo ao anterior.
          // ===================================================================
          exercicios: [
            // ─── Ex 1: Evento simples, dado ──────────────────────────────────
            {
              id: "prob-01",
              enunciado:
                "Um dado de 6 faces numerado de 1 a 6 é lançado uma vez. Qual é a probabilidade de sair o número 3?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{3}$" },
                { letra: "B", texto: "$\\dfrac{1}{6}$" },
                { letra: "C", texto: "$\\dfrac{1}{2}$" },
                { letra: "D", texto: "$\\dfrac{2}{6}$" },
                { letra: "E", texto: "$\\dfrac{3}{6}$" },
              ],
              gabarito: "B",
              explicacao:
                "O espaço amostral tem 6 resultados: $\\{1,2,3,4,5,6\\}$. Apenas o resultado $3$ é favorável. Portanto $P = \\tfrac{1}{6}$.",
            },

            // ─── Ex 2: Múltiplos favoráveis, mesmo dado ───────────────────────
            {
              id: "prob-02",
              enunciado:
                "Usando o mesmo dado do exercício anterior, qual é a probabilidade de sair um número **par**?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{6}$" },
                { letra: "B", texto: "$\\dfrac{1}{3}$" },
                { letra: "C", texto: "$\\dfrac{1}{2}$" },
                { letra: "D", texto: "$\\dfrac{2}{3}$" },
                { letra: "E", texto: "$\\dfrac{5}{6}$" },
              ],
              gabarito: "C",
              explicacao:
                "Os números pares no dado são $\\{2, 4, 6\\}$: 3 casos favoráveis. $P(\\text{par}) = \\tfrac{3}{6} = \\tfrac{1}{2}$.",
            },

            // ─── Ex 3: Complemento ────────────────────────────────────────────
            {
              id: "prob-03",
              enunciado:
                "Ainda com o mesmo dado, qual é a probabilidade de **não** sair o número 6? (Novo conceito: complemento $P(A^c) = 1 - P(A)$)",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{6}$" },
                { letra: "B", texto: "$\\dfrac{2}{6}$" },
                { letra: "C", texto: "$\\dfrac{4}{6}$" },
                { letra: "D", texto: "$\\dfrac{5}{6}$" },
                { letra: "E", texto: "$\\dfrac{6}{6}$" },
              ],
              gabarito: "D",
              explicacao:
                "$P(\\text{sair 6}) = \\tfrac{1}{6}$, portanto $P(\\text{não sair 6}) = 1 - \\tfrac{1}{6} = \\tfrac{5}{6}$.",
            },

            // ─── Ex 4: União de eventos mutuamente exclusivos ─────────────────
            {
              id: "prob-04",
              enunciado:
                "No mesmo dado, qual é a probabilidade de sair o número **2 ou o número 5**? (Novo conceito: $P(A \\cup B) = P(A) + P(B)$ para eventos mutuamente exclusivos)",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{6}$" },
                { letra: "B", texto: "$\\dfrac{1}{3}$" },
                { letra: "C", texto: "$\\dfrac{1}{2}$" },
                { letra: "D", texto: "$\\dfrac{2}{3}$" },
                { letra: "E", texto: "$\\dfrac{5}{6}$" },
              ],
              gabarito: "B",
              explicacao:
                "Sair 2 e sair 5 são eventos mutuamente exclusivos (não podem ocorrer ao mesmo tempo). $P(2 \\cup 5) = \\tfrac{1}{6} + \\tfrac{1}{6} = \\tfrac{2}{6} = \\tfrac{1}{3}$.",
            },

            // ─── Ex 5: Dois experimentos independentes — dado + moeda ─────────
            {
              id: "prob-05",
              enunciado:
                "Um dado e uma moeda são lançados simultaneamente. Qual é a probabilidade de sair **cara** na moeda **e** um número **par** no dado? (Novo conceito: regra da multiplicação para experimentos independentes)",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{6}$" },
                { letra: "B", texto: "$\\dfrac{1}{4}$" },
                { letra: "C", texto: "$\\dfrac{1}{3}$" },
                { letra: "D", texto: "$\\dfrac{1}{2}$" },
                { letra: "E", texto: "$\\dfrac{3}{4}$" },
              ],
              gabarito: "B",
              explicacao:
                "$P(\\text{cara}) = \\tfrac{1}{2}$ e $P(\\text{par no dado}) = \\tfrac{1}{2}$. Como são independentes: $P = \\tfrac{1}{2} \\cdot \\tfrac{1}{2} = \\tfrac{1}{4}$.",
            },

            // ─── Ex 6: Urna — evento simples ─────────────────────────────────
            {
              id: "prob-06",
              enunciado:
                "Uma urna contém **3 bolas vermelhas** e **2 bolas azuis**. Retira-se uma bola ao acaso. Qual é a probabilidade de ser vermelha?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{5}$" },
                { letra: "B", texto: "$\\dfrac{2}{5}$" },
                { letra: "C", texto: "$\\dfrac{3}{5}$" },
                { letra: "D", texto: "$\\dfrac{4}{5}$" },
                { letra: "E", texto: "$\\dfrac{1}{3}$" },
              ],
              gabarito: "C",
              explicacao:
                "Total de bolas: $3 + 2 = 5$. Casos favoráveis (vermelha): 3. $P(\\text{vermelha}) = \\tfrac{3}{5}$.",
            },

            // ─── Ex 7: Urna — duas retiradas COM reposição ───────────────────
            {
              id: "prob-07",
              enunciado:
                "Da mesma urna (3 vermelhas, 2 azuis), retiram-se **2 bolas com reposição** (a primeira é devolvida antes de retirar a segunda). Qual é a probabilidade de ambas serem vermelhas?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{5}$" },
                { letra: "B", texto: "$\\dfrac{3}{10}$" },
                { letra: "C", texto: "$\\dfrac{6}{25}$" },
                { letra: "D", texto: "$\\dfrac{9}{25}$" },
                { letra: "E", texto: "$\\dfrac{3}{5}$" },
              ],
              gabarito: "D",
              explicacao:
                "Com reposição, cada retirada é independente: $P(\\text{vermelha}) = \\tfrac{3}{5}$ nas duas. Pela regra da multiplicação: $P = \\tfrac{3}{5} \\cdot \\tfrac{3}{5} = \\tfrac{9}{25}$.",
            },

            // ─── Ex 8: Urna — duas retiradas SEM reposição ───────────────────
            {
              id: "prob-08",
              enunciado:
                "Agora, da mesma urna (3 vermelhas, 2 azuis), retiram-se **2 bolas sem reposição**. Qual é a probabilidade de as duas serem vermelhas? (Novo conceito: o espaço amostral diminui a cada retirada)",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{10}$" },
                { letra: "B", texto: "$\\dfrac{3}{20}$" },
                { letra: "C", texto: "$\\dfrac{6}{25}$" },
                { letra: "D", texto: "$\\dfrac{3}{10}$" },
                { letra: "E", texto: "$\\dfrac{9}{25}$" },
              ],
              gabarito: "D",
              explicacao: `Na 1ª retirada: $P(V_1) = \\tfrac{3}{5}$.
Na 2ª retirada (sem repor): sobram 4 bolas, das quais 2 são vermelhas — $P(V_2 \\mid V_1) = \\tfrac{2}{4} = \\tfrac{1}{2}$.

$$P(V_1 \\text{ e } V_2) = \\frac{3}{5} \\cdot \\frac{1}{2} = \\frac{3}{10}$$`,
            },
          ],
        },
      ],
    },
  ],
};
