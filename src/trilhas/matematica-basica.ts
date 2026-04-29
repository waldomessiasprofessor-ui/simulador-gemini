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

    // =========================================================================
    // Capítulo 3 — Radiciação
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

### 3. As seis propriedades dos radicais

**P1 — Produto:** o radical de um produto é o produto dos radicais.

$$
\\sqrt[n]{a \\cdot b} = \\sqrt[n]{a} \\cdot \\sqrt[n]{b}
$$

Exemplo: $\\sqrt{4 \\cdot 9} = \\sqrt{4} \\cdot \\sqrt{9} = 2 \\cdot 3 = 6$.

**P2 — Quociente:** o radical de uma fração é a fração dos radicais.

$$
\\sqrt[n]{\\dfrac{a}{b}} = \\dfrac{\\sqrt[n]{a}}{\\sqrt[n]{b}}, \\quad b \\neq 0
$$

Exemplo: $\\sqrt{\\dfrac{25}{4}} = \\dfrac{5}{2}$.

**P3 — Potência dentro do radical:** o expoente "sai" dividido pelo índice.

$$
\\sqrt[n]{a^m} = a^{m/n}
$$

Exemplo: $\\sqrt[3]{a^6} = a^{6/3} = a^2$.

**P4 — Radical de radical:** dois radicais aninhados se unem multiplicando os índices.

$$
\\sqrt[m]{\\sqrt[n]{a}} = \\sqrt[m \\cdot n]{a}
$$

Exemplo: $\\sqrt{\\sqrt[3]{a}} = \\sqrt[6]{a}$.

**P5 — Redução de índice:** se índice e expoente têm fator comum, simplifique.

$$
\\sqrt[m \\cdot k]{a^{n \\cdot k}} = \\sqrt[m]{a^n}
$$

Exemplo: $\\sqrt[6]{a^4} = \\sqrt[3]{a^2}$ (dividindo tudo por 2).

**P6 — Radical de potência igual ao índice:** quando expoente e índice coincidem, o resultado é o radicando.

$$
\\sqrt[n]{a^n} = a, \\quad a \\geq 0
$$

Exemplo: $\\sqrt[5]{3^5} = 3$.

### 4. Simplificação: tirando fatores para fora

Para simplificar $\\sqrt{72}$: escreva $72 = 36 \\cdot 2$, então
$$\\sqrt{72} = \\sqrt{36} \\cdot \\sqrt{2} = 6\\sqrt{2}.$$

A ideia é **separar os fatores que são potências perfeitas** do índice e tirá-los para fora.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Simplificando $\\sqrt{72}$",
              problema: "Escreva $\\sqrt{72}$ na forma $a\\sqrt{b}$, com $b$ o menor inteiro positivo possível.",
              resolucao: `
**Passo 1:** Fatoramos 72 em busca de um quadrado perfeito.
$$72 = 36 \\cdot 2$$

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
$$108 = 27 \\cdot 4 = 3^3 \\cdot 4$$

**Passo 2:** Aplicamos P1:
$$\\sqrt[3]{108} = \\sqrt[3]{27 \\cdot 4} = \\sqrt[3]{27} \\cdot \\sqrt[3]{4} = 3\\sqrt[3]{4}$$

**Resposta:** $\\sqrt[3]{108} = 3\\sqrt[3]{4}$.
`.trim(),
            },
          ],

          exercicios: [
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
              explicacao: "$\\sqrt{144} = 12$, pois $12^2 = 144$. Quadrados perfeitos para lembrar: $1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144\\ldots$",
            },
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
              explicacao: "$\\sqrt[3]{125} = 5$ porque $5^3 = 125$. Cubos perfeitos: $1, 8, 27, 64, 125, 216\\ldots$",
            },
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
              explicacao: "$50 = 25 \\cdot 2$, logo $\\sqrt{50} = \\sqrt{25} \\cdot \\sqrt{2} = 5\\sqrt{2}$.",
            },
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
              explicacao: "Pela P6: $(\\sqrt{a})^2 = a$ para $a \\geq 0$. Portanto $(\\sqrt{13})^2 = 13$. O radical e o quadrado se cancelam.",
            },
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
              explicacao: "Pela P5: $\\sqrt[6]{a^3} = \\sqrt[2]{a^1} = \\sqrt{a}$ (dividindo índice e expoente por 3).",
            },
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
              explicacao: "Pela P4: $\\sqrt{\\sqrt[4]{a^8}} = \\sqrt[2 \\cdot 4]{a^8} = \\sqrt[8]{a^8} = a$.",
            },
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
              explicacao: "Índice ímpar (3) permite radicando negativo. $\\sqrt[3]{-27} = -3$, pois $(-3)^3 = -27$. Se o índice fosse par, não existiria nos reais.",
            },
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
              explicacao: "$\\sqrt{a^4 b^6} = a^{4/2} \\cdot b^{6/2} = a^2 b^3$. A raiz quadrada divide os expoentes por 2.",
            },
            {
              id: "rad-q10",
              enunciado: "Qual expressão é igual a $\\sqrt[4]{9}$?",
              alternativas: [
                { letra: "A", texto: "$3$" },
                { letra: "B", texto: "$\\sqrt{3}$" },
                { letra: "C", texto: "$\\sqrt[4]{3}$" },
                { letra: "D", texto: "$9^4$" },
                { letra: "E", texto: "$\\sqrt[8]{3}$" },
              ],
              gabarito: "B",
              explicacao: "$\\sqrt[4]{9} = \\sqrt[4]{3^2} = 3^{2/4} = 3^{1/2} = \\sqrt{3}$.",
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

Radicais **só podem ser somados ou subtraídos quando são semelhantes**: mesmo índice **e** mesmo radicando.

$$
m\\sqrt[n]{a} \\pm k\\sqrt[n]{a} = (m \\pm k)\\sqrt[n]{a}
$$

O truque essencial: **simplifique primeiro**. Muitas vezes radicais que parecem diferentes viram semelhantes após simplificar.

Exemplo: $\\sqrt{8} + \\sqrt{18} = 2\\sqrt{2} + 3\\sqrt{2} = 5\\sqrt{2}$.

### 2. Multiplicação

**Mesmo índice:** multiplique os radicandos diretamente.

$$
\\sqrt[n]{a} \\cdot \\sqrt[n]{b} = \\sqrt[n]{a \\cdot b}
$$

Exemplo: $\\sqrt{3} \\cdot \\sqrt{12} = \\sqrt{36} = 6$.

### 3. Divisão

**Mesmo índice:** divida os radicandos.

$$
\\frac{\\sqrt[n]{a}}{\\sqrt[n]{b}} = \\sqrt[n]{\\frac{a}{b}}, \\quad b \\neq 0
$$

Exemplo: $\\dfrac{\\sqrt{50}}{\\sqrt{2}} = \\sqrt{25} = 5$.

### 4. Racionalização do denominador

Ter um radical no denominador "trava" o cálculo. Eliminamos multiplicando por uma fração equivalente a 1.

**Caso 1 — Denominador monômio ($\\sqrt{a}$):**

$$
\\frac{b}{\\sqrt{a}} \\cdot \\frac{\\sqrt{a}}{\\sqrt{a}} = \\frac{b\\sqrt{a}}{a}
$$

Exemplo: $\\dfrac{3}{\\sqrt{5}} = \\dfrac{3\\sqrt{5}}{5}$.

**Caso 2 — Denominador binômio ($\\sqrt{a} \\pm \\sqrt{b}$):**

Multiplicamos pelo **conjugado**. A diferença de quadrados elimina os radicais do denominador:

$$
(\\sqrt{a} + \\sqrt{b})(\\sqrt{a} - \\sqrt{b}) = a - b
$$

Exemplo: $\\dfrac{4}{\\sqrt{3}+1} \\cdot \\dfrac{\\sqrt{3}-1}{\\sqrt{3}-1} = \\dfrac{4(\\sqrt{3}-1)}{2} = 2\\sqrt{3}-2$.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Soma com simplificação prévia",
              problema: "Calcule $3\\sqrt{2} + \\sqrt{8} - \\sqrt{18}$.",
              resolucao: `
**Passo 1:** Simplifique cada radical antes de somar.

- $\\sqrt{8} = \\sqrt{4 \\cdot 2} = 2\\sqrt{2}$
- $\\sqrt{18} = \\sqrt{9 \\cdot 2} = 3\\sqrt{2}$

**Passo 2:** Todos têm $\\sqrt{2}$ — some os coeficientes:

$$3\\sqrt{2} + 2\\sqrt{2} - 3\\sqrt{2} = (3 + 2 - 3)\\sqrt{2} = 2\\sqrt{2}$$

**Resposta:** $2\\sqrt{2}$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Racionalização com denominador binômio",
              problema: "Racionalize $\\dfrac{4}{\\sqrt{3} + 1}$.",
              resolucao: `
**Passo 1:** Conjugado de $(\\sqrt{3} + 1)$ é $(\\sqrt{3} - 1)$.

**Passo 2:** Multiplique numerador e denominador:

$$
\\frac{4}{\\sqrt{3}+1} \\cdot \\frac{\\sqrt{3}-1}{\\sqrt{3}-1} = \\frac{4(\\sqrt{3}-1)}{(\\sqrt{3})^2 - 1^2} = \\frac{4(\\sqrt{3}-1)}{3-1} = \\frac{4(\\sqrt{3}-1)}{2}
$$

**Passo 3:** Simplifique:

$$= 2(\\sqrt{3}-1) = 2\\sqrt{3} - 2$$

**Resposta:** $2\\sqrt{3} - 2$.
`.trim(),
            },
          ],

          exercicios: [
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
              explicacao: "Simplifique primeiro: $\\sqrt{12} = 2\\sqrt{3}$. Somando: $\\sqrt{3} + 2\\sqrt{3} = 3\\sqrt{3}$. Erro clássico: somar os radicandos ($\\sqrt{15}$) — isso é errado.",
            },
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
            {
              id: "rad-op-q3",
              enunciado: "Qual o valor de $\\sqrt{3} \\cdot \\sqrt{27}$?",
              alternativas: [
                { letra: "A", texto: "$3$" },
                { letra: "B", texto: "$9$" },
                { letra: "C", texto: "$3\\sqrt{3}$" },
                { letra: "D", texto: "$27$" },
                { letra: "E", texto: "$81$" },
              ],
              gabarito: "B",
              explicacao: "$\\sqrt{3} \\cdot \\sqrt{27} = \\sqrt{3 \\cdot 27} = \\sqrt{81} = 9$.",
            },
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
              explicacao: "$\\dfrac{\\sqrt{18}}{\\sqrt{2}} = \\sqrt{\\dfrac{18}{2}} = \\sqrt{9} = 3$.",
            },
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
              explicacao: "$\\dfrac{2}{\\sqrt{5}} \\cdot \\dfrac{\\sqrt{5}}{\\sqrt{5}} = \\dfrac{2\\sqrt{5}}{5}$.",
            },
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
              explicacao: "Radicais semelhantes: $(2 + 3 - 1)\\sqrt{3} = 4\\sqrt{3}$.",
            },
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
              explicacao: "$\\sqrt{12}=2\\sqrt{3}$, $\\sqrt{27}=3\\sqrt{3}$, $\\sqrt{75}=5\\sqrt{3}$. Somando: $(2+3+5)\\sqrt{3}=10\\sqrt{3}$.",
            },
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
              explicacao: "Conjugado de $(\\sqrt{7}-\\sqrt{3})$ é $(\\sqrt{7}+\\sqrt{3})$. Denominador: $7-3=4$. Resultado: $\\dfrac{3(\\sqrt{7}+\\sqrt{3})}{4}$.",
            },
            {
              id: "rad-op-q10",
              enunciado: "O lado de um quadrado mede $\\sqrt{5} + \\sqrt{20}$ cm. Qual é o perímetro?",
              alternativas: [
                { letra: "A", texto: "$4\\sqrt{5}$ cm" },
                { letra: "B", texto: "$3\\sqrt{5}$ cm" },
                { letra: "C", texto: "$12\\sqrt{5}$ cm" },
                { letra: "D", texto: "$\\sqrt{100}$ cm" },
                { letra: "E", texto: "$8\\sqrt{5}$ cm" },
              ],
              gabarito: "C",
              explicacao: "Simplifique: $\\sqrt{20} = 2\\sqrt{5}$, então lado $= \\sqrt{5} + 2\\sqrt{5} = 3\\sqrt{5}$. Perímetro $= 4 \\times 3\\sqrt{5} = 12\\sqrt{5}$ cm.",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // Capítulo 4 — Expressões Numéricas
    // =========================================================================
    {
      slug: "expressoes-numericas",
      titulo: "Expressões Numéricas",
      licoes: [

        // =====================================================================
        // Lição 1 — Ordem das operações
        // =====================================================================
        {
          slug: "ordem-das-operacoes",
          titulo: "Ordem das operações",
          resumo:
            "A hierarquia que define qual operação fazer primeiro: parênteses, potências e raízes, multiplicação e divisão, adição e subtração.",
          duracaoMinutos: 20,

          explicacao: `
Uma **expressão numérica** é uma combinação de números e operações. Quando há mais de uma operação, existe uma **hierarquia** que determina a ordem de cálculo — ignorá-la é o erro mais frequente em prova.

### A hierarquia das operações

**1º — Parênteses (e colchetes, chaves):**
Sempre calcule o que está dentro dos parênteses **primeiro**. Se houver parênteses aninhados, comece pelo mais interno.

$$
5 \\times (2 + 3) = 5 \\times 5 = 25 \\quad (\\text{não } 5 \\times 2 + 3 = 13!)
$$

**2º — Potências e raízes:**
Depois dos parênteses, calcule potências e raízes.

$$
3 + 2^3 = 3 + 8 = 11 \\quad (\\text{não } 5^3 = 125!)
$$

**3º — Multiplicação e divisão:**
Mesma prioridade — resolva da **esquerda para a direita**.

$$
12 \\div 3 \\times 2 = 4 \\times 2 = 8 \\quad (\\text{não } 12 \\div 6 = 2!)
$$

**4º — Adição e subtração:**
Por último, da esquerda para a direita.

$$
10 - 3 + 4 = 7 + 4 = 11 \\quad (\\text{não } 10 - 7 = 3!)
$$

### Dica prática

Ao ver uma expressão longa, **numere mentalmente** as operações na ordem correta antes de calcular qualquer coisa. Pular a hierarquia é a maior fonte de erros em expressões.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Parênteses e potência",
              problema: "Calcule $4 + 3 \\times (5 - 2)^2$.",
              resolucao: `
**Passo 1:** Parênteses: $5 - 2 = 3$.

**Passo 2:** Potência: $3^2 = 9$.

**Passo 3:** Multiplicação: $3 \\times 9 = 27$.

**Passo 4:** Adição: $4 + 27 = 31$.

**Resposta:** $31$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Raiz quadrada na expressão",
              problema: "Calcule $\\sqrt{3^2 + 4^2} + 2 \\times 3$.",
              resolucao: `
**Passo 1:** Potências dentro da raiz: $3^2 = 9$ e $4^2 = 16$.

**Passo 2:** Adição dentro da raiz: $9 + 16 = 25$.

**Passo 3:** Raiz: $\\sqrt{25} = 5$.

**Passo 4:** Multiplicação: $2 \\times 3 = 6$.

**Passo 5:** Adição final: $5 + 6 = 11$.

**Resposta:** $11$.
`.trim(),
            },
          ],

          exercicios: [
            // ── Q1 — Média ──────────────────────────────────────────────────
            {
              id: "exp-q1",
              enunciado: "Qual o valor de $5 + 2 \\times 4$?",
              alternativas: [
                { letra: "A", texto: "$28$" },
                { letra: "B", texto: "$13$" },
                { letra: "C", texto: "$16$" },
                { letra: "D", texto: "$25$" },
                { letra: "E", texto: "$11$" },
              ],
              gabarito: "B",
              explicacao:
                "A multiplicação tem prioridade sobre a adição: $2 \\times 4 = 8$, depois $5 + 8 = 13$. O erro clássico (A) é somar primeiro: $(5+2) \\times 4 = 28$ — mas sem parênteses explícitos isso não é válido.",
            },

            // ── Q2 — Média ──────────────────────────────────────────────────
            {
              id: "exp-q2",
              enunciado: "Qual o valor de $(3 + 2) \\times 4$?",
              alternativas: [
                { letra: "A", texto: "$14$" },
                { letra: "B", texto: "$11$" },
                { letra: "C", texto: "$20$" },
                { letra: "D", texto: "$24$" },
                { letra: "E", texto: "$9$" },
              ],
              gabarito: "C",
              explicacao:
                "Os parênteses têm prioridade: $3 + 2 = 5$. Depois a multiplicação: $5 \\times 4 = 20$. Sem parênteses, seria $3 + (2 \\times 4) = 11$ — os parênteses aqui mudam completamente o resultado.",
            },

            // ── Q3 — Média ──────────────────────────────────────────────────
            {
              id: "exp-q3",
              enunciado: "Qual o valor de $\\sqrt{2^2 + 12}$?",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$\\sqrt{16}$" },
                { letra: "C", texto: "$8$" },
                { letra: "D", texto: "$4$" },
                { letra: "E", texto: "$16$" },
              ],
              gabarito: "D",
              explicacao:
                "Primeiro a potência: $2^2 = 4$. Depois a soma dentro da raiz: $4 + 12 = 16$. Por fim a raiz: $\\sqrt{16} = 4$. (A alternativa B tem o mesmo valor numérico, mas a resposta pedida é $4$.)",
            },

            // ── Q4 — Média ──────────────────────────────────────────────────
            {
              id: "exp-q4",
              enunciado: "Calcule $\\displaystyle \\frac{1}{2} + \\frac{1}{3}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{5}{6}$" },
                { letra: "B", texto: "$\\dfrac{2}{5}$" },
                { letra: "C", texto: "$\\dfrac{1}{6}$" },
                { letra: "D", texto: "$\\dfrac{2}{3}$" },
                { letra: "E", texto: "$\\dfrac{1}{3}$" },
              ],
              gabarito: "A",
              explicacao:
                "$\\text{MMC}(2,3) = 6$. Convertemos: $\\frac{1}{2} = \\frac{3}{6}$ e $\\frac{1}{3} = \\frac{2}{6}$. Somando: $\\frac{3+2}{6} = \\frac{5}{6}$. O erro (B) é somar numeradores e denominadores separadamente — proibido em frações.",
            },

            // ── Q5 — Média ──────────────────────────────────────────────────
            {
              id: "exp-q5",
              enunciado: "Qual o valor de $12 \\div 3 + 2^2$?",
              alternativas: [
                { letra: "A", texto: "$5$" },
                { letra: "B", texto: "$12$" },
                { letra: "C", texto: "$8$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$16$" },
              ],
              gabarito: "C",
              explicacao:
                "Potência primeiro: $2^2 = 4$. Divisão: $12 \\div 3 = 4$. Adição: $4 + 4 = 8$. Divisão e potência têm prioridade sobre a adição — devem ser resolvidas antes.",
            },

            // ── Q6 — Difícil ─────────────────────────────────────────────────
            {
              id: "exp-q6",
              enunciado:
                "Qual o valor de $\\dfrac{(6 - 3)^2 \\times (8 \\div 4)}{2}$?",
              alternativas: [
                { letra: "A", texto: "$18$" },
                { letra: "B", texto: "$4$" },
                { letra: "C", texto: "$3$" },
                { letra: "D", texto: "$36$" },
                { letra: "E", texto: "$9$" },
              ],
              gabarito: "E",
              explicacao:
                "**Passo 1:** Parênteses: $6 - 3 = 3$ e $8 \\div 4 = 2$. **Passo 2:** Potência: $3^2 = 9$. **Passo 3:** Numerador: $9 \\times 2 = 18$. **Passo 4:** Divisão final: $18 \\div 2 = 9$.",
            },

            // ── Q7 — Difícil ─────────────────────────────────────────────────
            {
              id: "exp-q7",
              enunciado: "Qual o valor de $4^{-1} + 2^{-1}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{2}$" },
                { letra: "B", texto: "$\\dfrac{3}{4}$" },
                { letra: "C", texto: "$\\dfrac{5}{4}$" },
                { letra: "D", texto: "$\\dfrac{1}{8}$" },
                { letra: "E", texto: "$\\dfrac{3}{8}$" },
              ],
              gabarito: "B",
              explicacao:
                "Expoente negativo: $4^{-1} = \\frac{1}{4}$ e $2^{-1} = \\frac{1}{2}$. Somando com $\\text{MMC}(4,2)=4$: $\\frac{1}{4} + \\frac{2}{4} = \\frac{3}{4}$.",
            },

            // ── Q8 — Difícil ─────────────────────────────────────────────────
            {
              id: "exp-q8",
              enunciado: "Calcule $\\sqrt{16} \\times 3 + 2$.",
              alternativas: [
                { letra: "A", texto: "$50$" },
                { letra: "B", texto: "$12$" },
                { letra: "C", texto: "$16$" },
                { letra: "D", texto: "$14$" },
                { letra: "E", texto: "$8$" },
              ],
              gabarito: "D",
              explicacao:
                "Raiz primeiro: $\\sqrt{16} = 4$. Multiplicação (tem prioridade sobre a adição): $4 \\times 3 = 12$. Adição: $12 + 2 = 14$. O erro (A) seria calcular $\\sqrt{16 \\times 3 + 2}$ — mas a raiz cobre somente o 16.",
            },

            // ── Q9 — Difícil ─────────────────────────────────────────────────
            {
              id: "exp-q9",
              enunciado: "Qual o valor de $\\sqrt[3]{27} - 1$?",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$3$" },
                { letra: "C", texto: "$6$" },
                { letra: "D", texto: "$9$" },
                { letra: "E", texto: "$26$" },
              ],
              gabarito: "A",
              explicacao:
                "$\\sqrt[3]{27} = 3$, pois $3^3 = 27$. Subtraindo: $3 - 1 = 2$. Cubos perfeitos para lembrar: $1^3=1$, $2^3=8$, $3^3=27$, $4^3=64$, $5^3=125$.",
            },

            // ── Q10 — Difícil ────────────────────────────────────────────────
            {
              id: "exp-q10",
              enunciado: "Qual o valor de $2 \\times (3 + \\sqrt{9})$?",
              alternativas: [
                { letra: "A", texto: "$18$" },
                { letra: "B", texto: "$9$" },
                { letra: "C", texto: "$12$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$24$" },
              ],
              gabarito: "C",
              explicacao:
                "**Passo 1:** Dentro dos parênteses, raiz: $\\sqrt{9} = 3$. Soma: $3 + 3 = 6$. **Passo 2:** Multiplicação: $2 \\times 6 = 12$.",
            },
          ],
        },

        // =====================================================================
        // Lição 2 — Expressões com raízes e potências
        // =====================================================================
        {
          slug: "expressoes-com-raizes-e-potencias",
          titulo: "Expressões com raízes e potências",
          resumo:
            "Expressões que combinam raízes, potências, frações e todas as operações — o nível que cai nas questões mais difíceis do ENEM e dos vestibulares.",
          duracaoMinutos: 25,

          explicacao: `
Neste nível, as expressões combinam **vários recursos ao mesmo tempo**: raízes, potências, frações e expoentes especiais. A estratégia é sempre a mesma — **desmontar camada por camada**, seguindo a hierarquia.

### Estratégia para expressões complexas

1. **Identifique as camadas:** parênteses e radicais escondem sub-expressões que devem ser resolvidas primeiro.
2. **Substitua pelo valor:** assim que resolver uma parte, escreva o número no lugar.
3. **Não pule passos:** em expressões complexas, um erro no meio invalida tudo.

### Armadilhas comuns

**Armadilha 1 — Expoente negativo com fração:**

$$\\left(\\frac{1}{2}\\right)^{-3} = \\left(\\frac{2}{1}\\right)^3 = 2^3 = 8 \\quad (\\text{não } -\\tfrac{1}{8}!)$$

**Armadilha 2 — Potência de radical:**

$$\\left(\\sqrt{a}\\right)^n = a^{n/2} \\quad \\Rightarrow \\quad \\left(\\sqrt{3}\\right)^6 = 3^3 = 27$$

**Armadilha 3 — Expoente fracionário:**

$$a^{m/n} = \\left(\\sqrt[n]{a}\\right)^m \\quad \\text{— resolva a raiz antes da potência!}$$
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Potência de radical",
              problema: "Calcule $\\left(\\sqrt{3}\\right)^4 + 2^3 - \\sqrt[3]{8}$.",
              resolucao: `
**Passo 1:** $\\left(\\sqrt{3}\\right)^4 = \\left(3^{1/2}\\right)^4 = 3^2 = 9$.

**Passo 2:** $2^3 = 8$.

**Passo 3:** $\\sqrt[3]{8} = 2$.

**Passo 4:** $9 + 8 - 2 = 15$.

**Resposta:** $15$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Fração com expoente negativo",
              problema:
                "Calcule $\\dfrac{3^2 + \\sqrt{16}}{\\left(\\frac{1}{2}\\right)^{-1}}$.",
              resolucao: `
**Passo 1:** Numerador — $3^2 = 9$ e $\\sqrt{16} = 4$. Soma: $9 + 4 = 13$.

**Passo 2:** Denominador — $\\left(\\frac{1}{2}\\right)^{-1} = \\frac{2}{1} = 2$.

**Passo 3:** Divisão: $\\frac{13}{2}$.

**Resposta:** $\\dfrac{13}{2}$.
`.trim(),
            },
          ],

          exercicios: [
            // ── Q11 — Complexo ───────────────────────────────────────────────
            {
              id: "exp-q11",
              enunciado: "Qual o valor de $(2^3 + 2) \\times \\sqrt{9}$?",
              alternativas: [
                { letra: "A", texto: "$24$" },
                { letra: "B", texto: "$30$" },
                { letra: "C", texto: "$40$" },
                { letra: "D", texto: "$18$" },
                { letra: "E", texto: "$15$" },
              ],
              gabarito: "B",
              explicacao:
                "**Passo 1:** Parênteses — potência: $2^3 = 8$; soma: $8 + 2 = 10$. **Passo 2:** Raiz: $\\sqrt{9} = 3$. **Passo 3:** Multiplicação: $10 \\times 3 = 30$.",
            },

            // ── Q12 — Complexo ───────────────────────────────────────────────
            {
              id: "exp-q12",
              enunciado: "Qual o valor de $\\sqrt[4]{625}$?",
              alternativas: [
                { letra: "A", texto: "$25$" },
                { letra: "B", texto: "$125$" },
                { letra: "C", texto: "$\\sqrt{5}$" },
                { letra: "D", texto: "$5$" },
                { letra: "E", texto: "$4$" },
              ],
              gabarito: "D",
              explicacao:
                "Como $5^4 = 625$, temos $\\sqrt[4]{625} = \\sqrt[4]{5^4} = 5$. Quartas potências perfeitas para lembrar: $2^4=16$, $3^4=81$, $4^4=256$, $5^4=625$.",
            },

            // ── Q13 — Complexo ───────────────────────────────────────────────
            {
              id: "exp-q13",
              enunciado: "Calcule $\\left(\\dfrac{3}{2}\\right)^2$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{9}{4}$" },
                { letra: "B", texto: "$\\dfrac{3}{2}$" },
                { letra: "C", texto: "$\\dfrac{3}{4}$" },
                { letra: "D", texto: "$\\dfrac{9}{2}$" },
                { letra: "E", texto: "$\\dfrac{4}{9}$" },
              ],
              gabarito: "A",
              explicacao:
                "A potência de uma fração distribui para numerador e denominador: $\\left(\\frac{3}{2}\\right)^2 = \\frac{3^2}{2^2} = \\frac{9}{4}$. O erro (D) é elevar apenas o numerador.",
            },

            // ── Q14 — Complexo ───────────────────────────────────────────────
            {
              id: "exp-q14",
              enunciado:
                "Calcule $\\displaystyle \\frac{5}{6} + \\frac{7}{9}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{12}{15}$" },
                { letra: "B", texto: "$\\dfrac{5}{3}$" },
                { letra: "C", texto: "$\\dfrac{29}{18}$" },
                { letra: "D", texto: "$\\dfrac{11}{15}$" },
                { letra: "E", texto: "$\\dfrac{43}{18}$" },
              ],
              gabarito: "C",
              explicacao:
                "$\\text{MMC}(6,9) = 18$. Convertemos: $\\frac{5}{6} = \\frac{15}{18}$ e $\\frac{7}{9} = \\frac{14}{18}$. Somando: $\\frac{15+14}{18} = \\frac{29}{18}$.",
            },

            // ── Q15 — Complexo ───────────────────────────────────────────────
            {
              id: "exp-q15",
              enunciado: "Qual o valor de $\\left(\\dfrac{1}{2}\\right)^{-3}$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{8}$" },
                { letra: "B", texto: "$-8$" },
                { letra: "C", texto: "$\\dfrac{1}{2}$" },
                { letra: "D", texto: "$3$" },
                { letra: "E", texto: "$8$" },
              ],
              gabarito: "E",
              explicacao:
                "Expoente negativo inverte a fração e torna o expoente positivo: $\\left(\\frac{1}{2}\\right)^{-3} = \\left(\\frac{2}{1}\\right)^3 = 2^3 = 8$. O erro (A) seria ignorar o sinal negativo do expoente.",
            },

            // ── Q16 — Complexo ───────────────────────────────────────────────
            {
              id: "exp-q16",
              enunciado: "Calcule $\\dfrac{2^3 + 5}{2^2}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{3}{2}$" },
                { letra: "B", texto: "$\\dfrac{13}{4}$" },
                { letra: "C", texto: "$3$" },
                { letra: "D", texto: "$\\dfrac{13}{8}$" },
                { letra: "E", texto: "$2$" },
              ],
              gabarito: "B",
              explicacao:
                "**Numerador:** $2^3 + 5 = 8 + 5 = 13$. **Denominador:** $2^2 = 4$. **Fração:** $\\frac{13}{4}$. Como $\\text{mdc}(13,4)=1$, já está na forma irredutível.",
            },

            // ── Q17 — Complexo ───────────────────────────────────────────────
            {
              id: "exp-q17",
              enunciado:
                "Calcule $\\dfrac{9}{4} \\div \\dfrac{3}{2}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{27}{8}$" },
                { letra: "B", texto: "$\\dfrac{2}{3}$" },
                { letra: "C", texto: "$\\dfrac{9}{8}$" },
                { letra: "D", texto: "$\\dfrac{3}{2}$" },
                { letra: "E", texto: "$\\dfrac{4}{3}$" },
              ],
              gabarito: "D",
              explicacao:
                "Divisão: manter a primeira, inverter a segunda e multiplicar. $\\frac{9}{4} \\div \\frac{3}{2} = \\frac{9}{4} \\times \\frac{2}{3} = \\frac{18}{12} = \\frac{3}{2}$.",
            },

            // ── Q18 — Complexo ───────────────────────────────────────────────
            {
              id: "exp-q18",
              enunciado: "Qual o valor de $\\left(\\sqrt{3}\\right)^6$?",
              alternativas: [
                { letra: "A", texto: "$27$" },
                { letra: "B", texto: "$9$" },
                { letra: "C", texto: "$6\\sqrt{3}$" },
                { letra: "D", texto: "$3\\sqrt{3}$" },
                { letra: "E", texto: "$3$" },
              ],
              gabarito: "A",
              explicacao:
                "$\\left(\\sqrt{3}\\right)^6 = \\left(3^{1/2}\\right)^6 = 3^{(1/2) \\times 6} = 3^3 = 27$. A potência de potência multiplica os expoentes: $\\frac{1}{2} \\times 6 = 3$.",
            },

            // ── Q19 — Complexo ───────────────────────────────────────────────
            {
              id: "exp-q19",
              enunciado:
                "Calcule $\\left(3^2 + 4^2\\right)^{1/2} \\times \\sqrt{25}$.",
              alternativas: [
                { letra: "A", texto: "$5$" },
                { letra: "B", texto: "$100$" },
                { letra: "C", texto: "$25$" },
                { letra: "D", texto: "$50$" },
                { letra: "E", texto: "$\\sqrt{5}$" },
              ],
              gabarito: "C",
              explicacao:
                "**Passo 1:** $3^2 = 9$, $4^2 = 16$; soma: $25$. **Passo 2:** $(25)^{1/2} = 5$ (o famoso triângulo 3-4-5). **Passo 3:** $\\sqrt{25} = 5$. **Passo 4:** $5 \\times 5 = 25$.",
            },

            // ── Q20 — Complexo ───────────────────────────────────────────────
            {
              id: "exp-q20",
              enunciado:
                "Qual o valor de $\\dfrac{6}{5} \\times (1 + \\sqrt{9})$?",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{6}{5}$" },
                { letra: "B", texto: "$\\dfrac{18}{5}$" },
                { letra: "C", texto: "$4$" },
                { letra: "D", texto: "$\\dfrac{12}{5}$" },
                { letra: "E", texto: "$\\dfrac{24}{5}$" },
              ],
              gabarito: "E",
              explicacao:
                "**Passo 1:** Parênteses — raiz: $\\sqrt{9} = 3$; soma: $1 + 3 = 4$. **Passo 2:** Multiplicação: $\\frac{6}{5} \\times 4 = \\frac{24}{5}$.",
            },
          ],
        },
      ],
    },
  ],
};
