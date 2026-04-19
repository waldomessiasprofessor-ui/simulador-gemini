import type { Trilha } from "./types";

// =============================================================================
// Trilha: Matemática Básica
// =============================================================================

export const matematicaBasica: Trilha = {
  slug: "matematica-basica",
  area: "Matemática Básica",
  titulo: "Trilha de Matemática Básica",
  descricao:
    "Os fundamentos que aparecem em toda prova. Começando por operações com frações — a base para álgebra, funções e probabilidade.",

  capitulos: [
    {
      slug: "operacoes-com-fracoes",
      titulo: "Operações com frações",
      licoes: [
        {
          slug: "adicao-subtracao-fracoes",
          titulo: "Adição e subtração de frações",
          resumo: "Somar e subtrair frações com mesmo denominador e com denominadores diferentes (usando MMC).",
          duracaoMinutos: 15,

          // =======================================================================
          // Explicação (LaTeX)
          // =======================================================================
          explicacao: `
Somar (ou subtrair) frações é como juntar pedaços de uma pizza — mas só faz sentido se os pedaços tiverem o **mesmo tamanho**. O "tamanho do pedaço" é o **denominador**.

### 1. Quando os denominadores são iguais

É o caso simples. Basta **somar (ou subtrair) os numeradores** e manter o denominador:

$$
\\frac{a}{n} + \\frac{b}{n} = \\frac{a+b}{n}
$$

Exemplo rápido: $\\frac{2}{7} + \\frac{3}{7} = \\frac{5}{7}$.

### 2. Quando os denominadores são diferentes

Primeiro você precisa deixar os dois denominadores **iguais**. Para isso, usa-se o **MMC (mínimo múltiplo comum)** entre eles.

**Passo a passo:**

1. Calcule o MMC dos denominadores.
2. Converta cada fração numa fração equivalente com esse MMC no denominador.
3. Agora que os denominadores são iguais, some (ou subtraia) os numeradores.
4. Se der pra simplificar, simplifique.

Em fórmula geral:

$$
\\frac{a}{m} + \\frac{b}{n} = \\frac{a \\cdot (\\text{MMC}/m) + b \\cdot (\\text{MMC}/n)}{\\text{MMC}}
$$

### 3. Atenção ao erro mais comum

Nunca, **jamais**, some os denominadores. Isto aqui está **errado**:

$$
\\frac{1}{2} + \\frac{1}{3} \\neq \\frac{2}{5} \\quad (\\text{errado!})
$$

O correto é usar o MMC (veremos no Exemplo 2 a seguir).
`.trim(),

          // =======================================================================
          // Exemplos resolvidos
          // =======================================================================
          exemplos: [
            {
              titulo: "Exemplo 1 — denominadores iguais",
              problema: "Calcule $\\displaystyle \\frac{3}{8} + \\frac{2}{8}$.",
              resolucao: `
Como os denominadores são iguais (ambos $8$), basta somar os numeradores:

$$
\\frac{3}{8} + \\frac{2}{8} = \\frac{3+2}{8} = \\frac{5}{8}
$$

A fração $\\frac{5}{8}$ já está na forma mais simples, pois $5$ e $8$ não têm divisor comum diferente de $1$.

**Resposta:** $\\frac{5}{8}$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — denominadores diferentes",
              problema: "Calcule $\\displaystyle \\frac{1}{3} + \\frac{1}{6}$.",
              resolucao: `
Os denominadores são $3$ e $6$. Primeiro, calculamos o $\\text{MMC}(3, 6) = 6$.

Agora, convertemos cada fração para ter denominador $6$:

$$
\\frac{1}{3} = \\frac{1 \\cdot 2}{3 \\cdot 2} = \\frac{2}{6}, \\qquad \\frac{1}{6} = \\frac{1}{6}
$$

Somando:

$$
\\frac{2}{6} + \\frac{1}{6} = \\frac{3}{6}
$$

Simplificando (dividindo numerador e denominador por $3$):

$$
\\frac{3}{6} = \\frac{1}{2}
$$

**Resposta:** $\\frac{1}{2}$.
`.trim(),
            },
          ],

          // =======================================================================
          // Exercícios (progressão simples → avançado)
          // =======================================================================
          exercicios: [
            // ── 1) Soma com denom igual — nível 1 ────────────────────────────────
            {
              id: "q1",
              enunciado: "Qual o valor de $\\displaystyle \\frac{1}{5} + \\frac{2}{5}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{3}{10}$" },
                { letra: "B", texto: "$\\dfrac{3}{5}$" },
                { letra: "C", texto: "$\\dfrac{2}{5}$" },
                { letra: "D", texto: "$\\dfrac{3}{25}$" },
                { letra: "E", texto: "$\\dfrac{1}{5}$" },
              ],
              gabarito: "B",
              explicacao:
                "Denominadores iguais: soma os numeradores e mantém o denominador. $\\frac{1}{5}+\\frac{2}{5}=\\frac{1+2}{5}=\\frac{3}{5}$. O erro clássico (alternativa A) é somar também os denominadores — isso **não se faz**.",
            },

            // ── 2) Soma com denom igual — nível 1 ────────────────────────────────
            {
              id: "q2",
              enunciado: "Qual o valor de $\\displaystyle \\frac{3}{7} + \\frac{2}{7}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{5}{14}$" },
                { letra: "B", texto: "$\\dfrac{6}{7}$" },
                { letra: "C", texto: "$\\dfrac{5}{7}$" },
                { letra: "D", texto: "$\\dfrac{1}{7}$" },
                { letra: "E", texto: "$\\dfrac{5}{49}$" },
              ],
              gabarito: "C",
              explicacao:
                "$\\frac{3}{7}+\\frac{2}{7}=\\frac{3+2}{7}=\\frac{5}{7}$. A fração $\\frac{5}{7}$ já está simplificada ($\\text{mdc}(5,7)=1$).",
            },

            // ── 3) Subtração com denom igual ─────────────────────────────────────
            {
              id: "q3",
              enunciado: "Calcule $\\displaystyle \\frac{4}{11} - \\frac{1}{11}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{5}{11}$" },
                { letra: "B", texto: "$\\dfrac{3}{22}$" },
                { letra: "C", texto: "$\\dfrac{3}{11}$" },
                { letra: "D", texto: "$\\dfrac{4}{11}$" },
                { letra: "E", texto: "$\\dfrac{3}{0}$" },
              ],
              gabarito: "C",
              explicacao:
                "Na subtração com denominadores iguais: subtrai os numeradores, mantém o denominador. $\\frac{4}{11}-\\frac{1}{11}=\\frac{4-1}{11}=\\frac{3}{11}$. Não se mexe com o denominador.",
            },

            // ── 4) MMC fácil (2 e 4) ─────────────────────────────────────────────
            {
              id: "q4",
              enunciado: "Qual o valor de $\\displaystyle \\frac{1}{2} + \\frac{1}{4}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{2}{6}$" },
                { letra: "B", texto: "$\\dfrac{3}{4}$" },
                { letra: "C", texto: "$\\dfrac{2}{8}$" },
                { letra: "D", texto: "$\\dfrac{1}{6}$" },
                { letra: "E", texto: "$\\dfrac{3}{8}$" },
              ],
              gabarito: "B",
              explicacao:
                "$\\text{MMC}(2,4)=4$. Convertemos: $\\frac{1}{2}=\\frac{2}{4}$. Somando: $\\frac{2}{4}+\\frac{1}{4}=\\frac{3}{4}$.",
            },

            // ── 5) MMC (3 e 6) + simplificação ──────────────────────────────────
            {
              id: "q5",
              enunciado: "Qual o valor de $\\displaystyle \\frac{2}{3} + \\frac{1}{6}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{3}{9}$" },
                { letra: "B", texto: "$\\dfrac{3}{6}$" },
                { letra: "C", texto: "$\\dfrac{5}{6}$" },
                { letra: "D", texto: "$\\dfrac{2}{9}$" },
                { letra: "E", texto: "$\\dfrac{1}{2}$" },
              ],
              gabarito: "C",
              explicacao:
                "$\\text{MMC}(3,6)=6$. Convertemos $\\frac{2}{3}=\\frac{4}{6}$. Somando: $\\frac{4}{6}+\\frac{1}{6}=\\frac{5}{6}$. A fração $\\frac{5}{6}$ já está simplificada.",
            },

            // ── 6) Subtração com MMC ─────────────────────────────────────────────
            {
              id: "q6",
              enunciado: "Calcule $\\displaystyle \\frac{3}{4} - \\frac{1}{2}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{4}$" },
                { letra: "B", texto: "$\\dfrac{2}{2}$" },
                { letra: "C", texto: "$\\dfrac{2}{4}$" },
                { letra: "D", texto: "$\\dfrac{2}{6}$" },
                { letra: "E", texto: "$\\dfrac{3}{6}$" },
              ],
              gabarito: "A",
              explicacao:
                "$\\text{MMC}(4,2)=4$. Convertemos $\\frac{1}{2}=\\frac{2}{4}$. Subtraindo: $\\frac{3}{4}-\\frac{2}{4}=\\frac{1}{4}$.",
            },

            // ── 7) MMC = 12 ──────────────────────────────────────────────────────
            {
              id: "q7",
              enunciado: "Qual o valor de $\\displaystyle \\frac{1}{3} + \\frac{1}{4}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{2}{7}$" },
                { letra: "B", texto: "$\\dfrac{7}{12}$" },
                { letra: "C", texto: "$\\dfrac{2}{12}$" },
                { letra: "D", texto: "$\\dfrac{1}{7}$" },
                { letra: "E", texto: "$\\dfrac{5}{12}$" },
              ],
              gabarito: "B",
              explicacao:
                "$\\text{MMC}(3,4)=12$. Convertemos: $\\frac{1}{3}=\\frac{4}{12}$ e $\\frac{1}{4}=\\frac{3}{12}$. Somando: $\\frac{4}{12}+\\frac{3}{12}=\\frac{7}{12}$.",
            },

            // ── 8) MMC = 12 com subtração ────────────────────────────────────────
            {
              id: "q8",
              enunciado: "Calcule $\\displaystyle \\frac{5}{6} - \\frac{1}{4}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{4}{2}$" },
                { letra: "B", texto: "$\\dfrac{7}{12}$" },
                { letra: "C", texto: "$\\dfrac{1}{2}$" },
                { letra: "D", texto: "$\\dfrac{4}{24}$" },
                { letra: "E", texto: "$\\dfrac{5}{24}$" },
              ],
              gabarito: "B",
              explicacao:
                "$\\text{MMC}(6,4)=12$. Convertemos: $\\frac{5}{6}=\\frac{10}{12}$ e $\\frac{1}{4}=\\frac{3}{12}$. Subtraindo: $\\frac{10}{12}-\\frac{3}{12}=\\frac{7}{12}$.",
            },

            // ── 9) Número inteiro + fração ───────────────────────────────────────
            {
              id: "q9",
              enunciado: "Qual o valor de $\\displaystyle 2 + \\frac{1}{3}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{3}{3}$" },
                { letra: "B", texto: "$\\dfrac{2}{3}$" },
                { letra: "C", texto: "$\\dfrac{7}{3}$" },
                { letra: "D", texto: "$\\dfrac{3}{6}$" },
                { letra: "E", texto: "$\\dfrac{6}{1}$" },
              ],
              gabarito: "C",
              explicacao:
                "Transformamos $2$ em fração com denominador $3$: $2 = \\frac{6}{3}$. Somando: $\\frac{6}{3}+\\frac{1}{3}=\\frac{7}{3}$.",
            },

            // ── 10) Três frações combinadas ──────────────────────────────────────
            {
              id: "q10",
              enunciado:
                "Calcule $\\displaystyle \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{9}$" },
                { letra: "B", texto: "$\\dfrac{3}{12}$" },
                { letra: "C", texto: "$\\dfrac{2}{5}$" },
                { letra: "D", texto: "$\\dfrac{7}{12}$" },
                { letra: "E", texto: "$\\dfrac{1}{24}$" },
              ],
              gabarito: "D",
              explicacao:
                "$\\text{MMC}(2,3,4)=12$. Convertemos: $\\frac{1}{2}=\\frac{6}{12}$, $\\frac{1}{3}=\\frac{4}{12}$, $\\frac{1}{4}=\\frac{3}{12}$. Resultado: $\\frac{6}{12}+\\frac{4}{12}-\\frac{3}{12}=\\frac{7}{12}$.",
            },
          ],
        },
      ],
    },
  ],
};
