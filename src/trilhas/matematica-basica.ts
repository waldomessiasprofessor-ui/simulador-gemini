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
    // Capítulo 2 — Radiciação
    // =========================================================================
    {
      slug: "radicacao",
      titulo: "Radiciação",
      licoes: [

        // =====================================================================
        // Lição 1 — Conceito e propriedades dos radicais
        // =====================================================================
        {
          slug: "conceito-propriedades-radicais",
          titulo: "Conceito e propriedades dos radicais",
          resumo: "O que é um radical, como ler e escrever raízes de qualquer índice, e as seis propriedades que tornam os cálculos mais rápidos.",
          duracaoMinutos: 18,

          explicacao: `
Você já sabe que $4^2 = 16$. A radiciação é a operação inversa: dado o resultado ($16$) e o expoente ($2$), qual era a base? A resposta é $\\sqrt{16} = 4$.

### 1. Lendo um radical

O símbolo geral é $\\sqrt[n]{a}$, onde:

- $n$ é o **índice** (qual raiz estamos tirando — quadrada, cúbica, etc.);
- $a$ é o **radicando** (o número dentro do radical).

Quando $n = 2$, omitimos o índice por convenção: $\\sqrt{a}$ é a raiz quadrada de $a$.

$$
\\sqrt[n]{a} = b \\iff b^n = a \\quad (b \\geq 0 \\text{ se } n \\text{ for par})
$$

### 2. Condição de existência (nos reais)

- **Índice par** ($n = 2, 4, 6, \\ldots$): o radicando deve ser **não negativo**. $\\sqrt{-4}$ não existe nos reais.
- **Índice ímpar** ($n = 3, 5, 7, \\ldots$): o radicando pode ser qualquer real. $\\sqrt[3]{-8} = -2$, pois $(-2)^3 = -8$.

### 3. As propriedades dos radicais

Essas seis regras são o coração do assunto. Decore-as e a maioria das questões cai no lugar.

**P1 — Produto:** o radical de um produto é o produto dos radicais (mesmo índice).

$$
\\sqrt[n]{a \\cdot b} = \\sqrt[n]{a} \\cdot \\sqrt[n]{b}
$$

Exemplo: $\\sqrt{4 \\cdot 9} = \\sqrt{4} \\cdot \\sqrt{9} = 2 \\cdot 3 = 6$.

**P2 — Quociente:** o radical de uma fração é a fração dos radicais (mesmo índice).

$$
\\sqrt[n]{\\dfrac{a}{b}} = \\dfrac{\\sqrt[n]{a}}{\\sqrt[n]{b}}, \\quad b \\neq 0
$$

Exemplo: $\\sqrt{\\dfrac{25}{4}} = \\dfrac{\\sqrt{25}}{\\sqrt{4}} = \\dfrac{5}{2}$.

**P3 — Potência dentro do radical:** um expoente dentro do radical pode "sair" dividido pelo índice.

$$
\\sqrt[n]{a^m} = a^{m/n}
$$

Exemplo: $\\sqrt[3]{a^6} = a^{6/3} = a^2$.

**P4 — Radical de radical:** dois radicais aninhados se unem multiplicando os índices.

$$
\\sqrt[m]{\\sqrt[n]{a}} = \\sqrt[m \\cdot n]{a}
$$

Exemplo: $\\sqrt{\\sqrt[3]{a}} = \\sqrt[2 \\cdot 3]{a} = \\sqrt[6]{a}$.

**P5 — Redução de índice:** se o expoente do radicando e o índice do radical têm um fator comum, podemos simplificar.

$$
\\sqrt[m \\cdot k]{a^{n \\cdot k}} = \\sqrt[m]{a^n}
$$

Exemplo: $\\sqrt[6]{a^4} = \\sqrt[6/2]{a^{4/2}} = \\sqrt[3]{a^2}$ (dividindo índice e expoente por 2).

**P6 — Radical de potência igual ao índice:** quando o expoente e o índice coincidem, o resultado é o radicando (para $a \\geq 0$).

$$
\\sqrt[n]{a^n} = a, \\quad a \\geq 0
$$

Exemplo: $\\sqrt[5]{3^5} = 3$.

### 4. Simplificação: tirando fatores de dentro do radical

Para simplificar $\\sqrt{72}$, por exemplo:

1. Fatore o radicando: $72 = 36 \\cdot 2$.
2. Use P1: $\\sqrt{36 \\cdot 2} = \\sqrt{36} \\cdot \\sqrt{2} = 6\\sqrt{2}$.

A ideia é **separar os fatores que são potências perfeitas** do índice e tirá-los para fora.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Simplificando $\\sqrt{72}$",
              problema: "Escreva $\\sqrt{72}$ na forma $a\\sqrt{b}$, com $b$ o menor inteiro positivo possível.",
              resolucao: `
**Passo 1:** Fatoramos 72 em busca de um quadrado perfeito.
$$72 = 4 \\cdot 18 = 4 \\cdot 9 \\cdot 2 = 36 \\cdot 2$$

**Passo 2:** Usamos a propriedade do produto (P1):
$$\\sqrt{72} = \\sqrt{36 \\cdot 2} = \\sqrt{36} \\cdot \\sqrt{2} = 6\\sqrt{2}$$

**Verificação:** $(6\\sqrt{2})^2 = 36 \\cdot 2 = 72$. ✓

**Resposta:** $\\sqrt{72} = 6\\sqrt{2}$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Simplificando $\\sqrt[3]{108}$",
              problema: "Escreva $\\sqrt[3]{108}$ na forma $a\\sqrt[3]{b}$, com $b$ o menor inteiro possível.",
              resolucao: `
**Passo 1:** Fatoramos 108 em busca de um cubo perfeito.
$$108 = 27 \\cdot 4$$

$27 = 3^3$ é um cubo perfeito. Perfeito.

**Passo 2:** Aplicamos P1:
$$\\sqrt[3]{108} = \\sqrt[3]{27 \\cdot 4} = \\sqrt[3]{27} \\cdot \\sqrt[3]{4} = 3\\sqrt[3]{4}$$

**Resposta:** $\\sqrt[3]{108} = 3\\sqrt[3]{4}$.
`.trim(),
            },
          ],

          exercicios: [
            // ── 1) Raiz quadrada exata ────────────────────────────────────────
            {
              id: "rad-q1",
              enunciado: "Qual o valor de $\\sqrt{144}$?",
              alternativas: [
                { letra: "A", texto: "$10$" },
                { letra: "B", texto: "$11$" },
                { letra: "C", texto: "$12$" },
                { letra: "D", texto: "$14$" },
                { letra: "E", texto: "$16$" },
              ],
              gabarito: "C",
              explicacao: "$\\sqrt{144} = 12$, pois $12^2 = 144$. Quadrados perfeitos para decorar: $1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144\\ldots$",
            },

            // ── 2) Raiz cúbica exata ──────────────────────────────────────────
            {
              id: "rad-q2",
              enunciado: "Qual o valor de $\\sqrt[3]{125}$?",
              alternativas: [
                { letra: "A", texto: "$3$" },
                { letra: "B", texto: "$4$" },
                { letra: "C", texto: "$5$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$25$" },
              ],
              gabarito: "C",
              explicacao: "$\\sqrt[3]{125} = 5$ porque $5^3 = 125$. Cubos perfeitos iniciais: $1, 8, 27, 64, 125, 216, 343\\ldots$",
            },

            // ── 3) Simplificação básica ───────────────────────────────────────
            {
              id: "rad-q3",
              enunciado: "Qual a forma simplificada de $\\sqrt{50}$?",
              alternativas: [
                { letra: "A", texto: "$5\\sqrt{2}$" },
                { letra: "B", texto: "$2\\sqrt{5}$" },
                { letra: "C", texto: "$10\\sqrt{5}$" },
                { letra: "D", texto: "$5\\sqrt{10}$" },
                { letra: "E", texto: "$25\\sqrt{2}$" },
              ],
              gabarito: "A",
              explicacao: "$50 = 25 \\cdot 2$, logo $\\sqrt{50} = \\sqrt{25} \\cdot \\sqrt{2} = 5\\sqrt{2}$. O fator quadrado perfeito a separar é 25.",
            },

            // ── 4) Potência ao quadrado e radical se cancelam ─────────────────
            {
              id: "rad-q4",
              enunciado: "Qual o valor de $(\\sqrt{13})^2$?",
              alternativas: [
                { letra: "A", texto: "$\\sqrt{26}$" },
                { letra: "B", texto: "$6{,}5$" },
                { letra: "C", texto: "$169$" },
                { letra: "D", texto: "$13$" },
                { letra: "E", texto: "$\\sqrt{169}$" },
              ],
              gabarito: "D",
              explicacao: "Pela P6: $(\\sqrt{a})^2 = \\sqrt{a^2} = a$ para $a \\geq 0$. Portanto $(\\sqrt{13})^2 = 13$. O radical e o quadrado se cancelam.",
            },

            // ── 5) Redução de índice ──────────────────────────────────────────
            {
              id: "rad-q5",
              enunciado: "Simplifique $\\sqrt[6]{a^3}$, com $a > 0$.",
              alternativas: [
                { letra: "A", texto: "$a^3$" },
                { letra: "B", texto: "$a^{1/3}$" },
                { letra: "C", texto: "$\\sqrt{a}$" },
                { letra: "D", texto: "$\\sqrt[3]{a}$" },
                { letra: "E", texto: "$a^2$" },
              ],
              gabarito: "C",
              explicacao: "Pela P5 (redução de índice): $\\sqrt[6]{a^3} = \\sqrt[6/3]{a^{3/3}} = \\sqrt[2]{a^1} = \\sqrt{a}$. Dividimos índice (6) e expoente (3) por 3.",
            },

            // ── 6) Radical de radical ─────────────────────────────────────────
            {
              id: "rad-q6",
              enunciado: "Qual o valor de $\\sqrt{\\sqrt[4]{a^8}}$, com $a > 0$?",
              alternativas: [
                { letra: "A", texto: "$a^4$" },
                { letra: "B", texto: "$a^2$" },
                { letra: "C", texto: "$a$" },
                { letra: "D", texto: "$\\sqrt{a}$" },
                { letra: "E", texto: "$\\sqrt[8]{a}$" },
              ],
              gabarito: "C",
              explicacao: "Primeiro, resolva o radical interno: $\\sqrt[4]{a^8} = a^{8/4} = a^2$. Depois, $\\sqrt{a^2} = a$ (com $a > 0$). Ou direto pela P4: $\\sqrt{\\sqrt[4]{a^8}} = \\sqrt[2 \\cdot 4]{a^8} = \\sqrt[8]{a^8} = a$.",
            },

            // ── 7) Simplificação nível médio ──────────────────────────────────
            {
              id: "rad-q7",
              enunciado: "Qual a forma simplificada de $\\sqrt{75}$?",
              alternativas: [
                { letra: "A", texto: "$3\\sqrt{5}$" },
                { letra: "B", texto: "$5\\sqrt{3}$" },
                { letra: "C", texto: "$15\\sqrt{3}$" },
                { letra: "D", texto: "$5\\sqrt{15}$" },
                { letra: "E", texto: "$25\\sqrt{3}$" },
              ],
              gabarito: "B",
              explicacao: "$75 = 25 \\cdot 3$, então $\\sqrt{75} = \\sqrt{25} \\cdot \\sqrt{3} = 5\\sqrt{3}$.",
            },

            // ── 8) Raiz cúbica de negativo ────────────────────────────────────
            {
              id: "rad-q8",
              enunciado: "Qual o valor de $\\sqrt[3]{-27}$?",
              alternativas: [
                { letra: "A", texto: "$3$" },
                { letra: "B", texto: "$-9$" },
                { letra: "C", texto: "Não existe nos reais" },
                { letra: "D", texto: "$-3$" },
                { letra: "E", texto: "$9$" },
              ],
              gabarito: "D",
              explicacao: "Índice ímpar (3) permite radicando negativo. $\\sqrt[3]{-27} = -3$, pois $(-3)^3 = -27$. Se o índice fosse par (como $\\sqrt{-27}$), aí sim não existiria nos reais.",
            },

            // ── 9) Radical com variáveis ──────────────────────────────────────
            {
              id: "rad-q9",
              enunciado: "Simplifique $\\sqrt{a^4 b^6}$, com $a, b > 0$.",
              alternativas: [
                { letra: "A", texto: "$a^2 b^3$" },
                { letra: "B", texto: "$a^2 b^2$" },
                { letra: "C", texto: "$a^4 b^6$" },
                { letra: "D", texto: "$ab^2$" },
                { letra: "E", texto: "$a^2 b^6$" },
              ],
              gabarito: "A",
              explicacao: "$\\sqrt{a^4 b^6} = \\sqrt{a^4} \\cdot \\sqrt{b^6} = a^{4/2} \\cdot b^{6/2} = a^2 b^3$. A raiz quadrada divide os expoentes por 2.",
            },

            // ── 10) Redução de índice com número ──────────────────────────────
            {
              id: "rad-q10",
              enunciado: "Qual das expressões abaixo é igual a $\\sqrt[4]{9}$?",
              alternativas: [
                { letra: "A", texto: "$3$" },
                { letra: "B", texto: "$\\sqrt{3}$" },
                { letra: "C", texto: "$\\sqrt[4]{3}$" },
                { letra: "D", texto: "$9^4$" },
                { letra: "E", texto: "$\\sqrt[8]{3}$" },
              ],
              gabarito: "B",
              explicacao: "$\\sqrt[4]{9} = \\sqrt[4]{3^2} = 3^{2/4} = 3^{1/2} = \\sqrt{3}$. Usamos P3: $\\sqrt[n]{a^m} = a^{m/n}$ e depois reduzimos a fração $\\frac{2}{4} = \\frac{1}{2}$.",
            },
          ],
        },

        // =====================================================================
        // Lição 2 — Operações com radicais
        // =====================================================================
        {
          slug: "operacoes-com-radicais",
          titulo: "Operações com radicais",
          resumo: "Soma, subtração, multiplicação, divisão e racionalização de denominadores — tudo com exemplos do jeito que cai no ENEM.",
          duracaoMinutos: 22,

          explicacao: `
Com as propriedades na cabeça, as operações ficam mais naturais. Veja cada caso.

### 1. Adição e subtração — radicais semelhantes

Radicais **só podem ser somados ou subtraídos quando são semelhantes**, ou seja, quando têm o mesmo índice **e** o mesmo radicando.

$$
m\\sqrt[n]{a} \\pm k\\sqrt[n]{a} = (m \\pm k)\\sqrt[n]{a}
$$

O truque: **simplifique primeiro**. Muitas vezes radicais que parecem diferentes viram semelhantes após simplificar.

Exemplo: $\\sqrt{8} + \\sqrt{18} = 2\\sqrt{2} + 3\\sqrt{2} = 5\\sqrt{2}$.

### 2. Multiplicação

**Mesmo índice:** multiplique os radicandos.

$$
\\sqrt[n]{a} \\cdot \\sqrt[n]{b} = \\sqrt[n]{a \\cdot b}
$$

**Índices diferentes:** reduza ao mesmo índice primeiro, usando a P4/P5.

Exemplo: $\\sqrt{2} \\cdot \\sqrt[3]{4}$ → converta $\\sqrt{2} = \\sqrt[6]{2^3} = \\sqrt[6]{8}$ e $\\sqrt[3]{4} = \\sqrt[6]{4^2} = \\sqrt[6]{16}$, daí multiplique: $\\sqrt[6]{128}$.

### 3. Divisão

**Mesmo índice:** divida os radicandos.

$$
\\frac{\\sqrt[n]{a}}{\\sqrt[n]{b}} = \\sqrt[n]{\\frac{a}{b}}, \\quad b \\neq 0
$$

Exemplo: $\\dfrac{\\sqrt{50}}{\\sqrt{2}} = \\sqrt{\\dfrac{50}{2}} = \\sqrt{25} = 5$.

### 4. Racionalização do denominador

Ter um radical no denominador "trava" o cálculo. Racionalizamos multiplicando por uma fração equivalente a 1 que elimina o radical.

**Caso 1 — Denominador monômio ($\\sqrt{a}$):**

$$
\\frac{b}{\\sqrt{a}} = \\frac{b}{\\sqrt{a}} \\cdot \\frac{\\sqrt{a}}{\\sqrt{a}} = \\frac{b\\sqrt{a}}{a}
$$

Exemplo: $\\dfrac{3}{\\sqrt{5}} = \\dfrac{3\\sqrt{5}}{5}$.

**Caso 2 — Denominador binômio ($\\sqrt{a} \\pm \\sqrt{b}$):**

Usamos o **conjugado**: multiplicamos por $\\dfrac{\\sqrt{a} \\mp \\sqrt{b}}{\\sqrt{a} \\mp \\sqrt{b}}$.

O produto dos conjugados é uma diferença de quadrados:
$$
(\\sqrt{a} + \\sqrt{b})(\\sqrt{a} - \\sqrt{b}) = a - b
$$

Isso elimina todos os radicais do denominador.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Soma com simplificação prévia",
              problema: "Calcule $3\\sqrt{2} + \\sqrt{8} - \\sqrt{18}$.",
              resolucao: `
**Passo 1:** Simplifique cada radical.

- $\\sqrt{8} = \\sqrt{4 \\cdot 2} = 2\\sqrt{2}$
- $\\sqrt{18} = \\sqrt{9 \\cdot 2} = 3\\sqrt{2}$

**Passo 2:** Agora todos têm o mesmo radicando ($\\sqrt{2}$). Some os coeficientes:

$$3\\sqrt{2} + 2\\sqrt{2} - 3\\sqrt{2} = (3 + 2 - 3)\\sqrt{2} = 2\\sqrt{2}$$

**Resposta:** $2\\sqrt{2}$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Racionalização com denominador binômio",
              problema: "Racionalize $\\dfrac{4}{\\sqrt{3} + 1}$.",
              resolucao: `
**Passo 1:** O conjugado de $\\sqrt{3} + 1$ é $\\sqrt{3} - 1$.

**Passo 2:** Multiplique numerador e denominador pelo conjugado:

$$
\\frac{4}{\\sqrt{3}+1} \\cdot \\frac{\\sqrt{3}-1}{\\sqrt{3}-1} = \\frac{4(\\sqrt{3}-1)}{(\\sqrt{3})^2 - 1^2} = \\frac{4(\\sqrt{3}-1)}{3-1} = \\frac{4(\\sqrt{3}-1)}{2}
$$

**Passo 3:** Simplifique:

$$
\\frac{4(\\sqrt{3}-1)}{2} = 2(\\sqrt{3}-1) = 2\\sqrt{3} - 2
$$

**Resposta:** $2\\sqrt{3} - 2$.
`.trim(),
            },
          ],

          exercicios: [
            // ── 1) Soma de semelhantes ────────────────────────────────────────
            {
              id: "rad-op-q1",
              enunciado: "Calcule $\\sqrt{3} + \\sqrt{12}$.",
              alternativas: [
                { letra: "A", texto: "$\\sqrt{15}$" },
                { letra: "B", texto: "$2\\sqrt{3}$" },
                { letra: "C", texto: "$3\\sqrt{3}$" },
                { letra: "D", texto: "$4\\sqrt{3}$" },
                { letra: "E", texto: "$\\sqrt{15} + 1$" },
              ],
              gabarito: "C",
              explicacao: "Simplifique primeiro: $\\sqrt{12} = \\sqrt{4 \\cdot 3} = 2\\sqrt{3}$. Agora some: $\\sqrt{3} + 2\\sqrt{3} = 3\\sqrt{3}$. O erro clássico é somar os radicandos: $\\sqrt{3+12} = \\sqrt{15}$ — isso é errado.",
            },

            // ── 2) Subtração com simplificação ────────────────────────────────
            {
              id: "rad-op-q2",
              enunciado: "Calcule $\\sqrt{8} - \\sqrt{2}$.",
              alternativas: [
                { letra: "A", texto: "$\\sqrt{6}$" },
                { letra: "B", texto: "$\\sqrt{2}$" },
                { letra: "C", texto: "$2\\sqrt{2}$" },
                { letra: "D", texto: "$0$" },
                { letra: "E", texto: "$3\\sqrt{2}$" },
              ],
              gabarito: "B",
              explicacao: "$\\sqrt{8} = 2\\sqrt{2}$, então $2\\sqrt{2} - \\sqrt{2} = (2-1)\\sqrt{2} = \\sqrt{2}$.",
            },

            // ── 3) Multiplicação (mesmo índice) ───────────────────────────────
            {
              id: "rad-op-q3",
              enunciado: "Qual o valor de $\\sqrt{3} \\cdot \\sqrt{27}$?",
              alternativas: [
                { letra: "A", texto: "$3$" },
                { letra: "B", texto: "$9$" },
                { letra: "C", texto: "$3\\sqrt{3}$" },
                { letra: "D", texto: "$\\sqrt{81}$" },
                { letra: "E", texto: "$81$" },
              ],
              gabarito: "B",
              explicacao: "$\\sqrt{3} \\cdot \\sqrt{27} = \\sqrt{3 \\cdot 27} = \\sqrt{81} = 9$. A alternativa D está matematicamente correta também, mas A e B são formas mais simples — e B é o valor numérico reduzido.",
            },

            // ── 4) Divisão de radicais ────────────────────────────────────────
            {
              id: "rad-op-q4",
              enunciado: "Simplifique $\\dfrac{\\sqrt{18}}{\\sqrt{2}}$.",
              alternativas: [
                { letra: "A", texto: "$\\sqrt{9}$" },
                { letra: "B", texto: "$9$" },
                { letra: "C", texto: "$3$" },
                { letra: "D", texto: "$3\\sqrt{2}$" },
                { letra: "E", texto: "$\\sqrt{16}$" },
              ],
              gabarito: "C",
              explicacao: "$\\dfrac{\\sqrt{18}}{\\sqrt{2}} = \\sqrt{\\dfrac{18}{2}} = \\sqrt{9} = 3$. Ou: $\\sqrt{18} = 3\\sqrt{2}$, logo $\\dfrac{3\\sqrt{2}}{\\sqrt{2}} = 3$.",
            },

            // ── 5) Racionalização monômia ─────────────────────────────────────
            {
              id: "rad-op-q5",
              enunciado: "Racionalize o denominador de $\\dfrac{2}{\\sqrt{5}}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{2}{5}$" },
                { letra: "B", texto: "$\\dfrac{\\sqrt{10}}{5}$" },
                { letra: "C", texto: "$\\dfrac{2\\sqrt{5}}{5}$" },
                { letra: "D", texto: "$\\dfrac{2\\sqrt{5}}{25}$" },
                { letra: "E", texto: "$2\\sqrt{5}$" },
              ],
              gabarito: "C",
              explicacao: "Multiplique por $\\dfrac{\\sqrt{5}}{\\sqrt{5}}$: $\\dfrac{2}{\\sqrt{5}} \\cdot \\dfrac{\\sqrt{5}}{\\sqrt{5}} = \\dfrac{2\\sqrt{5}}{5}$. O denominador vira $\\sqrt{5} \\cdot \\sqrt{5} = 5$.",
            },

            // ── 6) Soma de três radicais ──────────────────────────────────────
            {
              id: "rad-op-q6",
              enunciado: "Calcule $2\\sqrt{3} + 3\\sqrt{3} - \\sqrt{3}$.",
              alternativas: [
                { letra: "A", texto: "$4\\sqrt{3}$" },
                { letra: "B", texto: "$4\\sqrt{9}$" },
                { letra: "C", texto: "$5\\sqrt{3}$" },
                { letra: "D", texto: "$6\\sqrt{3}$" },
                { letra: "E", texto: "$4\\sqrt{6}$" },
              ],
              gabarito: "A",
              explicacao: "São radicais semelhantes (mesmo $\\sqrt{3}$), então operamos os coeficientes: $(2 + 3 - 1)\\sqrt{3} = 4\\sqrt{3}$.",
            },

            // ── 7) Multiplicação com coeficiente ──────────────────────────────
            {
              id: "rad-op-q7",
              enunciado: "Qual o valor de $\\sqrt{2} \\cdot \\sqrt{8}$?",
              alternativas: [
                { letra: "A", texto: "$2\\sqrt{4}$" },
                { letra: "B", texto: "$4$" },
                { letra: "C", texto: "$\\sqrt{10}$" },
                { letra: "D", texto: "$2$" },
                { letra: "E", texto: "$16$" },
              ],
              gabarito: "B",
              explicacao: "$\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{2 \\cdot 8} = \\sqrt{16} = 4$.",
            },

            // ── 8) Soma nível médio ───────────────────────────────────────────
            {
              id: "rad-op-q8",
              enunciado: "Calcule $\\sqrt{12} + \\sqrt{27} + \\sqrt{75}$.",
              alternativas: [
                { letra: "A", texto: "$\\sqrt{114}$" },
                { letra: "B", texto: "$10\\sqrt{3}$" },
                { letra: "C", texto: "$12\\sqrt{3}$" },
                { letra: "D", texto: "$9\\sqrt{3}$" },
                { letra: "E", texto: "$14\\sqrt{3}$" },
              ],
              gabarito: "B",
              explicacao: "Simplifique cada um: $\\sqrt{12}=2\\sqrt{3}$, $\\sqrt{27}=3\\sqrt{3}$, $\\sqrt{75}=5\\sqrt{3}$. Somando: $(2+3+5)\\sqrt{3}=10\\sqrt{3}$.",
            },

            // ── 9) Racionalização binômia ─────────────────────────────────────
            {
              id: "rad-op-q9",
              enunciado: "Racionalize $\\dfrac{3}{\\sqrt{7} - \\sqrt{3}}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{3(\\sqrt{7}-\\sqrt{3})}{4}$" },
                { letra: "B", texto: "$\\dfrac{3(\\sqrt{7}+\\sqrt{3})}{10}$" },
                { letra: "C", texto: "$\\dfrac{3(\\sqrt{7}+\\sqrt{3})}{4}$" },
                { letra: "D", texto: "$\\dfrac{\\sqrt{7}+\\sqrt{3}}{4}$" },
                { letra: "E", texto: "$\\dfrac{3(\\sqrt{7}-\\sqrt{3})}{10}$" },
              ],
              gabarito: "C",
              explicacao: "Conjugado de $(\\sqrt{7}-\\sqrt{3})$ é $(\\sqrt{7}+\\sqrt{3})$. Multiplicando: $\\dfrac{3}{\\sqrt{7}-\\sqrt{3}} \\cdot \\dfrac{\\sqrt{7}+\\sqrt{3}}{\\sqrt{7}+\\sqrt{3}} = \\dfrac{3(\\sqrt{7}+\\sqrt{3})}{7-3} = \\dfrac{3(\\sqrt{7}+\\sqrt{3})}{4}$.",
            },

            // ── 10) Problema contextualizado ──────────────────────────────────
            {
              id: "rad-op-q10",
              enunciado: "O lado de um quadrado tem medida $\\sqrt{5} + \\sqrt{20}$ cm. Qual é o perímetro desse quadrado?",
              alternativas: [
                { letra: "A", texto: "$4\\sqrt{5}$ cm" },
                { letra: "B", texto: "$3\\sqrt{5}$ cm" },
                { letra: "C", texto: "$12\\sqrt{5}$ cm" },
                { letra: "D", texto: "$\\sqrt{100}$ cm" },
                { letra: "E", texto: "$8\\sqrt{5}$ cm" },
              ],
              gabarito: "C",
              explicacao: "Primeiro simplifique o lado: $\\sqrt{20} = 2\\sqrt{5}$, então o lado $= \\sqrt{5} + 2\\sqrt{5} = 3\\sqrt{5}$. O perímetro de um quadrado é $4 \\times \\text{lado} = 4 \\cdot 3\\sqrt{5} = 12\\sqrt{5}$ cm.",
            },
          ],
        },
      ],
    },
  ],
};
