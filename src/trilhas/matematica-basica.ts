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

        // =====================================================================
        // Lição 2 — Multiplicação e divisão de frações
        // =====================================================================
        {
          slug: "multiplicacao-divisao-fracoes",
          titulo: "Multiplicação e divisão de frações",
          resumo:
            "Como multiplicar frações (direto), simplificar em cruz e dividir invertendo a segunda fração.",
          duracaoMinutos: 15,

          explicacao: `
Diferente da soma, na **multiplicação e divisão** de frações você **não precisa de MMC**. As regras são muito mais diretas.

### 1. Multiplicação

Para multiplicar duas frações, **multiplica numerador com numerador** e **denominador com denominador**:

$$
\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}
$$

Exemplo rápido: $\\frac{2}{3} \\cdot \\frac{4}{5} = \\frac{2 \\cdot 4}{3 \\cdot 5} = \\frac{8}{15}$.

**Dica:** antes de multiplicar, se houver fator comum entre um numerador e um denominador (mesmo em frações diferentes), dá pra **simplificar em cruz** — assim você chega direto na resposta já reduzida.

$$
\\frac{3}{\\color{red}{4}} \\cdot \\frac{\\color{red}{8}}{9} = \\frac{3}{1} \\cdot \\frac{2}{9} \\cdot \\frac{1}{?}
$$
(Veremos isso no Exemplo 2.)

### 2. Divisão

Para dividir uma fração por outra, **mantém a primeira, inverte a segunda e multiplica**:

$$
\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c} = \\frac{a \\cdot d}{b \\cdot c}
$$

Isso funciona porque dividir é "quantas vezes a segunda cabe na primeira", e multiplicar pelo inverso resolve isso em um passo.

### 3. Número inteiro e fração

Sempre que aparecer um número inteiro, trate ele como **fração sobre 1**:

$$
5 = \\frac{5}{1}, \\qquad 5 \\cdot \\frac{2}{7} = \\frac{5}{1} \\cdot \\frac{2}{7} = \\frac{10}{7}
$$

### 4. Erro comum

Nunca misture as regras da soma com as da multiplicação. Para **multiplicar**, você **NÃO** precisa de denominador comum. É direto.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — multiplicação direta",
              problema:
                "Calcule $\\displaystyle \\frac{2}{3} \\cdot \\frac{4}{5}$.",
              resolucao: `
Multiplica numerador com numerador e denominador com denominador:

$$
\\frac{2}{3} \\cdot \\frac{4}{5} = \\frac{2 \\cdot 4}{3 \\cdot 5} = \\frac{8}{15}
$$

A fração $\\frac{8}{15}$ já está simplificada, pois $\\text{mdc}(8,15)=1$.

**Resposta:** $\\frac{8}{15}$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — divisão com simplificação cruzada",
              problema:
                "Calcule $\\displaystyle \\frac{4}{9} \\div \\frac{8}{3}$.",
              resolucao: `
Dividir é manter a primeira, inverter a segunda e multiplicar:

$$
\\frac{4}{9} \\div \\frac{8}{3} = \\frac{4}{9} \\cdot \\frac{3}{8}
$$

Antes de multiplicar, simplificamos em cruz: $\\text{mdc}(4,8)=4$, então $\\frac{4}{8}=\\frac{1}{2}$; e $\\text{mdc}(3,9)=3$, então $\\frac{3}{9}=\\frac{1}{3}$.

$$
\\frac{4}{9} \\cdot \\frac{3}{8} = \\frac{1}{3} \\cdot \\frac{1}{2} = \\frac{1}{6}
$$

**Resposta:** $\\frac{1}{6}$.
`.trim(),
            },
          ],

          exercicios: [
            // ── 1) Multiplicação simples ────────────────────────────────────────
            {
              id: "q1",
              enunciado:
                "Qual o valor de $\\displaystyle \\frac{2}{3} \\cdot \\frac{4}{5}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{6}{8}$" },
                { letra: "B", texto: "$\\dfrac{8}{15}$" },
                { letra: "C", texto: "$\\dfrac{2}{5}$" },
                { letra: "D", texto: "$\\dfrac{6}{15}$" },
                { letra: "E", texto: "$\\dfrac{8}{8}$" },
              ],
              gabarito: "B",
              explicacao:
                "Na multiplicação de frações: numerador vezes numerador, denominador vezes denominador. $\\frac{2}{3}\\cdot\\frac{4}{5}=\\frac{2\\cdot 4}{3\\cdot 5}=\\frac{8}{15}$. Não se usa MMC aqui — isso é coisa da soma.",
            },

            // ── 2) Multiplicação por inteiro ────────────────────────────────────
            {
              id: "q2",
              enunciado:
                "Qual o valor de $\\displaystyle 5 \\cdot \\frac{2}{7}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{10}{35}$" },
                { letra: "B", texto: "$\\dfrac{7}{7}$" },
                { letra: "C", texto: "$\\dfrac{10}{7}$" },
                { letra: "D", texto: "$\\dfrac{2}{35}$" },
                { letra: "E", texto: "$\\dfrac{5}{7}$" },
              ],
              gabarito: "C",
              explicacao:
                "Um inteiro pode ser escrito como fração sobre 1: $5=\\frac{5}{1}$. Então $5\\cdot\\frac{2}{7}=\\frac{5}{1}\\cdot\\frac{2}{7}=\\frac{10}{7}$. Só o numerador é multiplicado pelo inteiro.",
            },

            // ── 3) Multiplicação com simplificação cruzada ──────────────────────
            {
              id: "q3",
              enunciado:
                "Qual o valor de $\\displaystyle \\frac{3}{4} \\cdot \\frac{8}{9}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{24}{36}$" },
                { letra: "B", texto: "$\\dfrac{11}{13}$" },
                { letra: "C", texto: "$\\dfrac{2}{3}$" },
                { letra: "D", texto: "$\\dfrac{1}{3}$" },
                { letra: "E", texto: "$\\dfrac{3}{4}$" },
              ],
              gabarito: "C",
              explicacao:
                "Simplificando em cruz antes: $\\frac{3}{9}=\\frac{1}{3}$ e $\\frac{8}{4}=\\frac{2}{1}$. Fica $\\frac{1}{1}\\cdot\\frac{2}{3}=\\frac{2}{3}$. Se fizer direto: $\\frac{3\\cdot 8}{4\\cdot 9}=\\frac{24}{36}=\\frac{2}{3}$ (dividindo por 12).",
            },

            // ── 4) Três frações ──────────────────────────────────────────────────
            {
              id: "q4",
              enunciado:
                "Calcule $\\displaystyle \\frac{1}{2} \\cdot \\frac{2}{3} \\cdot \\frac{3}{4}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{6}{9}$" },
                { letra: "B", texto: "$\\dfrac{1}{4}$" },
                { letra: "C", texto: "$\\dfrac{6}{24}$" },
                { letra: "D", texto: "$\\dfrac{1}{9}$" },
                { letra: "E", texto: "$\\dfrac{3}{4}$" },
              ],
              gabarito: "B",
              explicacao:
                "Multiplicando tudo de uma vez: $\\frac{1\\cdot 2\\cdot 3}{2\\cdot 3\\cdot 4}=\\frac{6}{24}=\\frac{1}{4}$. Ou simplificando em cruz: o 2 cancela com o 2, o 3 cancela com o 3, sobra $\\frac{1}{4}$.",
            },

            // ── 5) Divisão simples ───────────────────────────────────────────────
            {
              id: "q5",
              enunciado:
                "Qual o valor de $\\displaystyle \\frac{3}{4} \\div \\frac{2}{5}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{6}{20}$" },
                { letra: "B", texto: "$\\dfrac{5}{6}$" },
                { letra: "C", texto: "$\\dfrac{6}{9}$" },
                { letra: "D", texto: "$\\dfrac{15}{8}$" },
                { letra: "E", texto: "$\\dfrac{8}{15}$" },
              ],
              gabarito: "D",
              explicacao:
                "Manter a primeira, inverter a segunda, multiplicar: $\\frac{3}{4}\\div\\frac{2}{5}=\\frac{3}{4}\\cdot\\frac{5}{2}=\\frac{3\\cdot 5}{4\\cdot 2}=\\frac{15}{8}$.",
            },

            // ── 6) Divisão com simplificação ────────────────────────────────────
            {
              id: "q6",
              enunciado:
                "Qual o valor de $\\displaystyle \\frac{4}{9} \\div \\frac{8}{3}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{32}{27}$" },
                { letra: "B", texto: "$\\dfrac{12}{72}$" },
                { letra: "C", texto: "$\\dfrac{1}{6}$" },
                { letra: "D", texto: "$\\dfrac{3}{2}$" },
                { letra: "E", texto: "$\\dfrac{4}{3}$" },
              ],
              gabarito: "C",
              explicacao:
                "$\\frac{4}{9}\\div\\frac{8}{3}=\\frac{4}{9}\\cdot\\frac{3}{8}$. Simplificando em cruz: $\\frac{4}{8}=\\frac{1}{2}$ e $\\frac{3}{9}=\\frac{1}{3}$. Logo, $\\frac{1}{3}\\cdot\\frac{1}{2}=\\frac{1}{6}$.",
            },

            // ── 7) Divisão por inteiro ──────────────────────────────────────────
            {
              id: "q7",
              enunciado:
                "Qual o valor de $\\displaystyle \\frac{6}{7} \\div 3$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{18}{7}$" },
                { letra: "B", texto: "$\\dfrac{2}{7}$" },
                { letra: "C", texto: "$\\dfrac{6}{21}$" },
                { letra: "D", texto: "$\\dfrac{2}{3}$" },
                { letra: "E", texto: "$\\dfrac{6}{4}$" },
              ],
              gabarito: "B",
              explicacao:
                "Escreva $3=\\frac{3}{1}$. Aí $\\frac{6}{7}\\div\\frac{3}{1}=\\frac{6}{7}\\cdot\\frac{1}{3}=\\frac{6}{21}=\\frac{2}{7}$ (dividindo numerador e denominador por 3).",
            },

            // ── 8) Inteiro dividido por fração ──────────────────────────────────
            {
              id: "q8",
              enunciado:
                "Quanto vale $\\displaystyle 4 \\div \\frac{1}{2}$?",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$\\dfrac{1}{8}$" },
                { letra: "C", texto: "$\\dfrac{4}{2}$" },
                { letra: "D", texto: "$8$" },
                { letra: "E", texto: "$\\dfrac{2}{4}$" },
              ],
              gabarito: "D",
              explicacao:
                "$4\\div\\frac{1}{2}=\\frac{4}{1}\\cdot\\frac{2}{1}=\\frac{8}{1}=8$. Intuitivamente: 'quantas metades cabem em 4?' Resposta: 8.",
            },

            // ── 9) Mista (multiplicação e divisão) ──────────────────────────────
            {
              id: "q9",
              enunciado:
                "Calcule $\\displaystyle \\left( \\frac{1}{2} \\cdot \\frac{3}{4} \\right) \\div \\frac{1}{8}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{3}{64}$" },
                { letra: "B", texto: "$3$" },
                { letra: "C", texto: "$\\dfrac{1}{3}$" },
                { letra: "D", texto: "$\\dfrac{3}{8}$" },
                { letra: "E", texto: "$\\dfrac{8}{3}$" },
              ],
              gabarito: "B",
              explicacao:
                "Primeiro o parêntese: $\\frac{1}{2}\\cdot\\frac{3}{4}=\\frac{3}{8}$. Depois, $\\frac{3}{8}\\div\\frac{1}{8}=\\frac{3}{8}\\cdot\\frac{8}{1}=\\frac{24}{8}=3$.",
            },

            // ── 10) Problema contextualizado ────────────────────────────────────
            {
              id: "q10",
              enunciado:
                "Uma caixa tem $24$ bombons. Paulo comeu $\\tfrac{2}{3}$ da caixa e dividiu o restante igualmente entre $2$ amigos. Quantos bombons cada amigo recebeu?",
              alternativas: [
                { letra: "A", texto: "$16$" },
                { letra: "B", texto: "$8$" },
                { letra: "C", texto: "$4$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$3$" },
              ],
              gabarito: "C",
              explicacao:
                "Paulo comeu $\\frac{2}{3}\\cdot 24=16$ bombons. Restaram $24-16=8$. Dividindo entre 2 amigos: $8\\div 2=4$ bombons cada.",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // Capítulo 2 — Potenciação
    // =========================================================================
    {
      slug: "potenciacao",
      titulo: "Potenciação",
      licoes: [

        // =====================================================================
        // Lição 1 — Definição e propriedades básicas
        // =====================================================================
        {
          slug: "potenciacao-definicao-propriedades",
          titulo: "Definição e propriedades básicas",
          resumo:
            "O que é uma potência e as quatro propriedades fundamentais: produto, quociente, potência de potência e potência de produto.",
          duracaoMinutos: 20,

          explicacao: `
A **potência** é uma forma compacta de escrever uma multiplicação repetida.

$$
a^n = \\underbrace{a \\cdot a \\cdot a \\cdots a}_{n \\text{ vezes}}
$$

Aqui $a$ é a **base** e $n$ é o **expoente**. Exemplo: $2^5 = 2 \\cdot 2 \\cdot 2 \\cdot 2 \\cdot 2 = 32$.

---

### Propriedade 1 — Produto de mesma base

Quando as bases são iguais, **soma os expoentes**:

$$
a^m \\cdot a^n = a^{m+n}
$$

Exemplo: $3^2 \\cdot 3^4 = 3^{2+4} = 3^6 = 729$.

---

### Propriedade 2 — Quociente de mesma base

Quando as bases são iguais, **subtrai os expoentes**:

$$
\\frac{a^m}{a^n} = a^{m-n} \\quad (a \\neq 0)
$$

Exemplo: $\\dfrac{5^7}{5^3} = 5^{7-3} = 5^4 = 625$.

---

### Propriedade 3 — Potência de potência

**Multiplica os expoentes**:

$$
(a^m)^n = a^{m \\cdot n}
$$

Exemplo: $(2^3)^4 = 2^{3 \\cdot 4} = 2^{12}$.

---

### Propriedade 4 — Potência de um produto (ou quociente)

**Distribui o expoente** para cada fator:

$$
(a \\cdot b)^n = a^n \\cdot b^n \\qquad \\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}
$$

Exemplo: $(2 \\cdot 3)^4 = 2^4 \\cdot 3^4 = 16 \\cdot 81 = 1296$.

---

### Atenção ao erro mais comum

Não confunda a Propriedade 1 com multiplicação de expoentes:

$$
a^m \\cdot a^n = a^{m+n} \\quad \\text{(soma!)} \\qquad (a^m)^n = a^{m \\cdot n} \\quad \\text{(multiplica!)}
$$
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Produto de mesma base",
              problema: "Simplifique $2^3 \\cdot 2^5$.",
              resolucao: `
As bases são iguais ($2$), então somamos os expoentes:

$$
2^3 \\cdot 2^5 = 2^{3+5} = 2^8 = 256
$$
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Potência de potência",
              problema: "Calcule $(3^2)^3$.",
              resolucao: `
Potência de potência: multiplicamos os expoentes.

$$
(3^2)^3 = 3^{2 \\cdot 3} = 3^6 = 729
$$
`.trim(),
            },
          ],

          exercicios: [
            // ── q1 — fácil: valor de potência simples ─────────────────────────
            {
              id: "pot-q1",
              enunciado: "Qual o valor de $2^4$?",
              alternativas: [
                { letra: "A", texto: "$6$" },
                { letra: "B", texto: "$8$" },
                { letra: "C", texto: "$12$" },
                { letra: "D", texto: "$16$" },
                { letra: "E", texto: "$24$" },
              ],
              gabarito: "D",
              explicacao:
                "$2^4 = 2 \\cdot 2 \\cdot 2 \\cdot 2 = 16$. Potência é multiplicação repetida da base por ela mesma.",
            },

            // ── q2 — fácil: base 10 ───────────────────────────────────────────
            {
              id: "pot-q2",
              enunciado: "Quanto vale $10^3$?",
              alternativas: [
                { letra: "A", texto: "$30$" },
                { letra: "B", texto: "$100$" },
                { letra: "C", texto: "$1000$" },
                { letra: "D", texto: "$300$" },
                { letra: "E", texto: "$10000$" },
              ],
              gabarito: "C",
              explicacao:
                "$10^3 = 10 \\cdot 10 \\cdot 10 = 1000$. Para potências de 10, basta contar os zeros: $10^n$ tem $n$ zeros.",
            },

            // ── q3 — fácil: base negativa ─────────────────────────────────────
            {
              id: "pot-q3",
              enunciado: "Qual o valor de $(-2)^3$?",
              alternativas: [
                { letra: "A", texto: "$8$" },
                { letra: "B", texto: "$-6$" },
                { letra: "C", texto: "$6$" },
                { letra: "D", texto: "$-8$" },
                { letra: "E", texto: "$-2$" },
              ],
              gabarito: "D",
              explicacao:
                "$(-2)^3 = (-2) \\cdot (-2) \\cdot (-2) = 4 \\cdot (-2) = -8$. Expoente ímpar com base negativa sempre dá resultado negativo.",
            },

            // ── q4 — fácil: produto de mesma base ────────────────────────────
            {
              id: "pot-q4",
              enunciado: "Simplifique $3^2 \\cdot 3^3$.",
              alternativas: [
                { letra: "A", texto: "$3^6$" },
                { letra: "B", texto: "$9^5$" },
                { letra: "C", texto: "$3^5$" },
                { letra: "D", texto: "$3^1$" },
                { letra: "E", texto: "$6^5$" },
              ],
              gabarito: "C",
              explicacao:
                "Produto de mesma base: soma os expoentes. $3^2 \\cdot 3^3 = 3^{2+3} = 3^5$.",
            },

            // ── q5 — fácil: quociente de mesma base ──────────────────────────
            {
              id: "pot-q5",
              enunciado: "Simplifique $\\dfrac{5^6}{5^2}$.",
              alternativas: [
                { letra: "A", texto: "$5^3$" },
                { letra: "B", texto: "$5^8$" },
                { letra: "C", texto: "$1^4$" },
                { letra: "D", texto: "$5^4$" },
                { letra: "E", texto: "$5^{12}$" },
              ],
              gabarito: "D",
              explicacao:
                "Quociente de mesma base: subtrai os expoentes. $\\frac{5^6}{5^2} = 5^{6-2} = 5^4$.",
            },

            // ── q6 — médio: potência de potência ──────────────────────────────
            {
              id: "pot-q6",
              enunciado: "Qual o resultado de $(4^2)^3$?",
              alternativas: [
                { letra: "A", texto: "$4^5$" },
                { letra: "B", texto: "$4^8$" },
                { letra: "C", texto: "$4^6$" },
                { letra: "D", texto: "$4^9$" },
                { letra: "E", texto: "$16^3$" },
              ],
              gabarito: "C",
              explicacao:
                "Potência de potência: multiplica os expoentes. $(4^2)^3 = 4^{2 \\cdot 3} = 4^6$.",
            },

            // ── q7 — médio: potência de produto ───────────────────────────────
            {
              id: "pot-q7",
              enunciado: "Expanda $(2 \\cdot 5)^3$ usando a propriedade da potência de produto.",
              alternativas: [
                { letra: "A", texto: "$2^3 + 5^3$" },
                { letra: "B", texto: "$2 \\cdot 5^3$" },
                { letra: "C", texto: "$10^3$" },
                { letra: "D", texto: "$2^3 \\cdot 5^3$" },
                { letra: "E", texto: "$6^3$" },
              ],
              gabarito: "D",
              explicacao:
                "$(a \\cdot b)^n = a^n \\cdot b^n$. Portanto $(2 \\cdot 5)^3 = 2^3 \\cdot 5^3 = 8 \\cdot 125 = 1000$. Note que $10^3 = 1000$ também — as alternativas C e D dão o mesmo valor numérico, mas a alternativa D é a forma expandida pedida pela propriedade.",
            },

            // ── q8 — médio: combina produto e quociente ───────────────────────
            {
              id: "pot-q8",
              enunciado: "Simplifique $\\dfrac{2^8 \\cdot 2^2}{2^5}$.",
              alternativas: [
                { letra: "A", texto: "$2^{15}$" },
                { letra: "B", texto: "$2^{5}$" },
                { letra: "C", texto: "$2^{4}$" },
                { letra: "D", texto: "$2^{1}$" },
                { letra: "E", texto: "$2^{3}$" },
              ],
              gabarito: "B",
              explicacao:
                "Primeiro soma os expoentes do numerador: $2^8 \\cdot 2^2 = 2^{10}$. Depois subtrai o do denominador: $\\frac{2^{10}}{2^5} = 2^{10-5} = 2^5$.",
            },

            // ── q9 — difícil: potência de quociente ───────────────────────────
            {
              id: "pot-q9",
              enunciado: "Qual o valor de $\\left(\\dfrac{3}{2}\\right)^4$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{12}{8}$" },
                { letra: "B", texto: "$\\dfrac{81}{16}$" },
                { letra: "C", texto: "$\\dfrac{9}{8}$" },
                { letra: "D", texto: "$\\dfrac{81}{8}$" },
                { letra: "E", texto: "$\\dfrac{12}{16}$" },
              ],
              gabarito: "B",
              explicacao:
                "$\\left(\\frac{3}{2}\\right)^4 = \\frac{3^4}{2^4} = \\frac{81}{16}$. A propriedade distribui o expoente para o numerador e para o denominador.",
            },

            // ── q10 — difícil: expressão combinada ────────────────────────────
            {
              id: "pot-q10",
              enunciado:
                "Simplifique $\\dfrac{(2^3)^2 \\cdot 2^4}{2^{10}}$.",
              alternativas: [
                { letra: "A", texto: "$2^6$" },
                { letra: "B", texto: "$2^0$" },
                { letra: "C", texto: "$2^3$" },
                { letra: "D", texto: "$2^{-2}$" },
                { letra: "E", texto: "$2^2$" },
              ],
              gabarito: "B",
              explicacao:
                "$(2^3)^2 = 2^6$. Numerador: $2^6 \\cdot 2^4 = 2^{10}$. Quociente: $\\frac{2^{10}}{2^{10}} = 2^0 = 1$. Qualquer base não-nula elevada a zero é $1$.",
            },
          ],
        },

        // =====================================================================
        // Lição 2 — Expoente zero, negativo e fracionário
        // =====================================================================
        {
          slug: "potenciacao-expoente-especial",
          titulo: "Expoente zero, negativo e fracionário",
          resumo:
            "Por que qualquer número elevado a zero vale 1, como interpretar expoentes negativos e o que significa um expoente fracionário.",
          duracaoMinutos: 20,

          explicacao: `
### Expoente zero

Usando a propriedade do quociente: $\\dfrac{a^n}{a^n} = a^{n-n} = a^0$. Mas $\\dfrac{a^n}{a^n} = 1$. Portanto:

$$
a^0 = 1 \\quad (a \\neq 0)
$$

Exemplos: $7^0 = 1$, $(-5)^0 = 1$, $\\left(\\frac{2}{3}\\right)^0 = 1$.

---

### Expoente negativo

Pelo mesmo raciocínio do quociente: $\\dfrac{a^0}{a^n} = a^{0-n} = a^{-n}$. Como $a^0 = 1$:

$$
a^{-n} = \\frac{1}{a^n} \\quad (a \\neq 0)
$$

Exemplos: $2^{-3} = \\dfrac{1}{2^3} = \\dfrac{1}{8}$. \\quad $5^{-1} = \\dfrac{1}{5}$.

Para **inverter** uma fração com expoente negativo:

$$
\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}
$$

---

### Expoente fracionário (radical)

A ligação entre potência e raiz é:

$$
a^{1/n} = \\sqrt[n]{a} \\qquad a^{m/n} = \\sqrt[n]{a^m} = \\left(\\sqrt[n]{a}\\right)^m
$$

Exemplos: $8^{1/3} = \\sqrt[3]{8} = 2$. \\quad $4^{3/2} = (\\sqrt{4})^3 = 2^3 = 8$.

---

### Resumo das propriedades

| Propriedade | Fórmula |
|---|---|
| Produto | $a^m \\cdot a^n = a^{m+n}$ |
| Quociente | $a^m / a^n = a^{m-n}$ |
| Potência de potência | $(a^m)^n = a^{mn}$ |
| Potência de produto | $(ab)^n = a^n b^n$ |
| Expoente zero | $a^0 = 1$ |
| Expoente negativo | $a^{-n} = 1/a^n$ |
| Expoente fracionário | $a^{m/n} = \\sqrt[n]{a^m}$ |
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Expoente negativo",
              problema: "Calcule $\\left(\\dfrac{2}{3}\\right)^{-2}$.",
              resolucao: `
Expoente negativo inverte a fração e troca o sinal do expoente:

$$
\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^{2} = \\frac{3^2}{2^2} = \\frac{9}{4}
$$
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Expoente fracionário",
              problema: "Calcule $27^{2/3}$.",
              resolucao: `
Expoente fracionário $m/n$ significa tirar a raiz $n$-ésima e elevar a $m$:

$$
27^{2/3} = \\left(\\sqrt[3]{27}\\right)^2 = 3^2 = 9
$$
`.trim(),
            },
          ],

          exercicios: [
            // ── q1 — fácil: expoente zero ──────────────────────────────────────
            {
              id: "pot2-q1",
              enunciado: "Qual o valor de $99^0$?",
              alternativas: [
                { letra: "A", texto: "$99$" },
                { letra: "B", texto: "$0$" },
                { letra: "C", texto: "$1$" },
                { letra: "D", texto: "$-1$" },
                { letra: "E", texto: "$9$" },
              ],
              gabarito: "C",
              explicacao:
                "Qualquer número não-nulo elevado a zero é igual a $1$. Portanto $99^0 = 1$.",
            },

            // ── q2 — fácil: expoente negativo simples ─────────────────────────
            {
              id: "pot2-q2",
              enunciado: "Qual o valor de $2^{-3}$?",
              alternativas: [
                { letra: "A", texto: "$-8$" },
                { letra: "B", texto: "$\\dfrac{1}{6}$" },
                { letra: "C", texto: "$8$" },
                { letra: "D", texto: "$\\dfrac{1}{8}$" },
                { letra: "E", texto: "$-6$" },
              ],
              gabarito: "D",
              explicacao:
                "$2^{-3} = \\dfrac{1}{2^3} = \\dfrac{1}{8}$. Expoente negativo significa o inverso (recíproco) da potência positiva.",
            },

            // ── q3 — fácil: raiz quadrada como expoente ───────────────────────
            {
              id: "pot2-q3",
              enunciado: "Qual o valor de $25^{1/2}$?",
              alternativas: [
                { letra: "A", texto: "$12{,}5$" },
                { letra: "B", texto: "$625$" },
                { letra: "C", texto: "$5$" },
                { letra: "D", texto: "$50$" },
                { letra: "E", texto: "$\\dfrac{1}{5}$" },
              ],
              gabarito: "C",
              explicacao:
                "$25^{1/2} = \\sqrt{25} = 5$. O expoente $\\frac{1}{2}$ é o mesmo que tirar a raiz quadrada.",
            },

            // ── q4 — fácil: base negativa expoente par ────────────────────────
            {
              id: "pot2-q4",
              enunciado: "Quanto vale $(-3)^4$?",
              alternativas: [
                { letra: "A", texto: "$-81$" },
                { letra: "B", texto: "$12$" },
                { letra: "C", texto: "$81$" },
                { letra: "D", texto: "$-12$" },
                { letra: "E", texto: "$-27$" },
              ],
              gabarito: "C",
              explicacao:
                "$(-3)^4 = (-3)(-3)(-3)(-3) = 9 \\cdot 9 = 81$. Expoente **par** com base negativa sempre resulta em positivo.",
            },

            // ── q5 — médio: expoente negativo com fração ──────────────────────
            {
              id: "pot2-q5",
              enunciado: "Simplifique $\\left(\\dfrac{3}{4}\\right)^{-1}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{3}{4}$" },
                { letra: "B", texto: "$-\\dfrac{3}{4}$" },
                { letra: "C", texto: "$\\dfrac{4}{3}$" },
                { letra: "D", texto: "$\\dfrac{1}{12}$" },
                { letra: "E", texto: "$-\\dfrac{4}{3}$" },
              ],
              gabarito: "C",
              explicacao:
                "Expoente $-1$ inverte a fração: $\\left(\\frac{3}{4}\\right)^{-1} = \\frac{4}{3}$.",
            },

            // ── q6 — médio: expoente fracionário ──────────────────────────────
            {
              id: "pot2-q6",
              enunciado: "Qual o valor de $8^{1/3}$?",
              alternativas: [
                { letra: "A", texto: "$4$" },
                { letra: "B", texto: "$24$" },
                { letra: "C", texto: "$\\dfrac{8}{3}$" },
                { letra: "D", texto: "$512$" },
                { letra: "E", texto: "$2$" },
              ],
              gabarito: "E",
              explicacao:
                "$8^{1/3} = \\sqrt[3]{8} = 2$, pois $2^3 = 8$.",
            },

            // ── q7 — médio: combinando zero e negativo ────────────────────────
            {
              id: "pot2-q7",
              enunciado: "Calcule $3^0 + 3^{-1} + 3^{-2}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{11}{9}$" },
                { letra: "B", texto: "$\\dfrac{13}{9}$" },
                { letra: "C", texto: "$\\dfrac{12}{9}$" },
                { letra: "D", texto: "$\\dfrac{10}{9}$" },
                { letra: "E", texto: "$3$" },
              ],
              gabarito: "B",
              explicacao:
                "$3^0 = 1$, $3^{-1} = \\frac{1}{3}$, $3^{-2} = \\frac{1}{9}$. Somando: $1 + \\frac{1}{3} + \\frac{1}{9} = \\frac{9}{9} + \\frac{3}{9} + \\frac{1}{9} = \\frac{13}{9}$.",
            },

            // ── q8 — médio: expoente fracionário m/n ─────────────────────────
            {
              id: "pot2-q8",
              enunciado: "Qual o valor de $4^{3/2}$?",
              alternativas: [
                { letra: "A", texto: "$6$" },
                { letra: "B", texto: "$12$" },
                { letra: "C", texto: "$8$" },
                { letra: "D", texto: "$16$" },
                { letra: "E", texto: "$64$" },
              ],
              gabarito: "C",
              explicacao:
                "$4^{3/2} = (\\sqrt{4})^3 = 2^3 = 8$. O denominador do expoente indica a raiz, o numerador indica a potência.",
            },

            // ── q9 — difícil: expressão com negativos ─────────────────────────
            {
              id: "pot2-q9",
              enunciado:
                "Simplifique $\\dfrac{2^{-3} \\cdot 4^2}{8^{-1}}$.",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$16$" },
                { letra: "C", texto: "$4$" },
                { letra: "D", texto: "$8$" },
                { letra: "E", texto: "$1$" },
              ],
              gabarito: "B",
              explicacao:
                "Converta tudo para base 2: $4^2 = (2^2)^2 = 2^4$ e $8^{-1} = (2^3)^{-1} = 2^{-3}$. Numerador: $2^{-3} \\cdot 2^4 = 2^1$. Divisão: $\\dfrac{2^1}{2^{-3}} = 2^{1-(-3)} = 2^{1+3} = 2^4 = 16$.",
            },

            // ── q10 — difícil: aplicação contextualizada ─────────────────────
            {
              id: "pot2-q10",
              enunciado:
                "Uma bactéria se divide ao meio a cada hora. Se começamos com $2^{10}$ bactérias, quantas haverá após $3$ horas, sabendo que a cada hora o número é multiplicado por $2$?",
              alternativas: [
                { letra: "A", texto: "$2^{13}$" },
                { letra: "B", texto: "$2^{30}$" },
                { letra: "C", texto: "$2^7$" },
                { letra: "D", texto: "$2^{10} + 3$" },
                { letra: "E", texto: "$6 \\cdot 2^{10}$" },
              ],
              gabarito: "A",
              explicacao:
                "Após 3 horas multiplicamos por $2$ três vezes: $2^{10} \\cdot 2^3 = 2^{10+3} = 2^{13}$. Propriedade do produto de mesma base em contexto real.",
            },
          ],
        },
      ],
    },
  ],
};
