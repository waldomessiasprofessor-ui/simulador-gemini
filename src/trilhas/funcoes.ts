import type { Trilha } from "./types";

// =============================================================================
// Trilha: Funções
// =============================================================================

export const funcoes: Trilha = {
  slug: "funcoes",
  area: "Funções",
  titulo: "Trilha de Funções",
  descricao:
    "O conceito mais importante do ENEM e dos vestibulares. Comece pelos fundamentos: o que é uma função, como identificar domínio, imagem e contradomínio, e como calcular o valor numérico de qualquer lei.",

  capitulos: [
    // =========================================================================
    // Capítulo 1 — Conceitos iniciais de funções
    // =========================================================================
    {
      slug: "conceitos-iniciais",
      titulo: "Conceitos iniciais de funções",
      licoes: [

        // =====================================================================
        // Lição 1 — O que é uma função?
        // =====================================================================
        {
          slug: "o-que-e-funcao",
          titulo: "O que é uma função?",
          resumo:
            "Entenda quando uma relação entre dois conjuntos é (ou não é) uma função — a regra do \"cada entrada tem exatamente uma saída\".",
          duracaoMinutos: 15,

          explicacao: `
Uma **função** é uma regra que associa cada elemento de um conjunto A a **exatamente um** elemento de um conjunto B.

### Vocabulário essencial

| Termo | Símbolo | Significado |
|---|---|---|
| Domínio | $D$ ou $A$ | O conjunto de "entradas" da função |
| Contradomínio | $CD$ ou $B$ | O conjunto de "saídas possíveis" |
| Imagem | $\\text{Im}$ | As saídas que realmente são atingidas |
| Lei de formação | $f(x) = \\ldots$ | A regra que transforma $x$ em $f(x)$ |

Escrevemos $f: A \\to B$ e lemos "f de A em B".

### A regra de ouro

Uma relação é uma **função** se e somente se:

> **Todo** elemento do domínio possui **exatamente uma** imagem.

Isso implica duas condições:
1. Nenhum elemento do domínio fica sem imagem (**totalidade**).
2. Nenhum elemento do domínio tem **duas ou mais** imagens diferentes (**unicidade**).

### Como verificar com diagrama de flechas

Num diagrama, cada ponto do conjunto A lança uma seta em direção ao conjunto B.

- ✅ **É função** → cada ponto de A tem **exatamente uma** seta saindo dele.
- ❌ **Não é função** → algum ponto de A tem **zero setas** (relação incompleta) ou **duas ou mais setas** (relação ambígua).

> **Atenção:** não importa quantas setas chegam a um mesmo ponto de B — vários $x$ podem ter a mesma imagem. O que não pode é um $x$ ter dois $y$ diferentes.

### Exemplos cotidianos

- $f(\\text{aluno}) = \\text{nota na prova}$: função, pois cada aluno tem uma nota.
- $g(\\text{CPF}) = \\text{nome}$: função, pois cada CPF pertence a uma pessoa.
- $h(\\text{cidade}) = \\text{estado}$: função, pois cada cidade está em um estado.
- Relação "irmão de": **não é função**, pois uma pessoa pode ter zero ou vários irmãos.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Identificar função por diagrama",
              problema:
                "Dados os conjuntos $A = \\{1, 2, 3\\}$ e $B = \\{a, b, c\\}$, analise as relações abaixo e diga qual delas é função de $A$ em $B$.\n\n**Relação I:** $1 \\to a,\\; 2 \\to b,\\; 3 \\to c$\n\n**Relação II:** $1 \\to a,\\; 1 \\to b,\\; 2 \\to c,\\; 3 \\to c$\n\n**Relação III:** $1 \\to b,\\; 3 \\to a$",
              resolucao: `
Analisamos cada relação pela regra de ouro:

**Relação I:** Cada elemento de $A$ ($1$, $2$ e $3$) tem exatamente uma seta. ✅ **É função.**

**Relação II:** O elemento $1$ possui **duas** setas ($1 \\to a$ e $1 \\to b$). Isso viola a unicidade. ❌ **Não é função.**

**Relação III:** O elemento $2$ não possui nenhuma seta. Isso viola a totalidade. ❌ **Não é função.**

**Conclusão:** somente a **Relação I** é uma função de $A$ em $B$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Verificar função por tabela",
              problema:
                "A tabela abaixo relaciona valores de $x$ e $y$. Verifique se ela representa uma função e justifique.\n\n| $x$ | $1$ | $2$ | $3$ | $2$ |\n|---|---|---|---|---|\n| $y$ | $4$ | $5$ | $6$ | $7$ |",
              resolucao: `
Para ser função, cada valor de $x$ deve aparecer com **exatamente um** valor de $y$.

Observamos que o valor $x = 2$ aparece duas vezes na tabela:
- Na 2ª coluna: $x=2 \\to y=5$
- Na 4ª coluna: $x=2 \\to y=7$

Como um mesmo $x$ (no caso $x=2$) corresponde a dois valores diferentes de $y$, a **unicidade é violada**.

**Conclusão:** a tabela **não representa** uma função.

> **Dica:** ao analisar uma tabela, procure sempre por $x$ repetidos com $y$ diferentes — esse é o único caso que elimina a função.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "fc1q1",
              enunciado:
                "Uma relação $f: A \\to B$ associa $1 \\to p$, $2 \\to q$ e $3 \\to r$. Essa relação é uma função?",
              alternativas: [
                { letra: "A", texto: "Sim, pois cada elemento de $A$ tem exatamente uma imagem em $B$." },
                { letra: "B", texto: "Não, pois os elementos de $B$ são letras, não números." },
                { letra: "C", texto: "Não, pois os conjuntos $A$ e $B$ precisam ter o mesmo tipo de elemento." },
                { letra: "D", texto: "Sim, mas somente se $p$, $q$ e $r$ forem todos diferentes." },
                { letra: "E", texto: "Não é possível determinar sem conhecer os conjuntos completos." },
              ],
              gabarito: "A",
              explicacao:
                "A regra de ouro é: cada elemento do domínio tem **exatamente uma** imagem. Aqui, $1 \\to p$, $2 \\to q$ e $3 \\to r$ — cada um dos três elementos de $A$ tem precisamente uma seta. Logo, é função. Os tipos dos elementos (números ou letras) não importam.",
            },
            {
              id: "fc1q2",
              enunciado:
                "Uma relação associa $1 \\to a$, $2 \\to a$ e $3 \\to a$. Essa relação é uma função?",
              alternativas: [
                { letra: "A", texto: "Não, pois dois elementos distintos do domínio têm a mesma imagem." },
                { letra: "B", texto: "Não, pois toda função precisa ter imagens distintas." },
                { letra: "C", texto: "Sim, pois cada elemento do domínio tem exatamente uma imagem." },
                { letra: "D", texto: "Só seria função se os elementos do domínio fossem distintos." },
                { letra: "E", texto: "Depende do contradomínio." },
              ],
              gabarito: "C",
              explicacao:
                "É sim uma função! A condição é que cada $x$ tenha **exatamente uma** imagem — não que as imagens sejam diferentes entre si. Vários $x$ podem apontar para o mesmo $y$. Esse tipo de função (em que todos os elementos do domínio vão para a mesma imagem) é chamado de **função constante**.",
            },
            {
              id: "fc1q3",
              enunciado:
                "Uma relação $f: A \\to B$, com $A = \\{1, 2, 3\\}$, é definida por $1 \\to a$, $1 \\to b$ e $2 \\to c$. Ela é uma função?",
              alternativas: [
                { letra: "A", texto: "Sim, pois todos os elementos de $A$ possuem imagem." },
                { letra: "B", texto: "Não, pois o elemento $3$ não possui imagem." },
                { letra: "C", texto: "Sim, pois $a$, $b$ e $c$ são todos diferentes." },
                { letra: "D", texto: "Não, pois o elemento $1$ possui duas imagens distintas." },
                { letra: "E", texto: "Não, pois o elemento $2$ possui apenas uma imagem." },
              ],
              gabarito: "D",
              explicacao:
                "Dois problemas: o elemento $1$ tem **duas imagens** ($a$ e $b$), o que viola a unicidade; e o elemento $3$ não tem imagem alguma, o que viola a totalidade. Qualquer um desses problemas já seria suficiente para descaracterizar a função.",
            },
            {
              id: "fc1q4",
              enunciado:
                "A tabela relaciona $x$ e $y$:\n\n| $x$ | $0$ | $1$ | $2$ | $3$ |\n|---|---|---|---|---|\n| $y$ | $1$ | $3$ | $5$ | $7$ |\n\nEssa tabela representa uma função de $\\{0,1,2,3\\}$ em $\\mathbb{Z}$?",
              alternativas: [
                { letra: "A", texto: "Não, pois os valores de $y$ são todos ímpares." },
                { letra: "B", texto: "Não, pois não é uma relação linear." },
                { letra: "C", texto: "Sim, pois cada valor de $x$ aparece uma única vez com um único valor de $y$." },
                { letra: "D", texto: "Sim, mas apenas se $y = 2x + 1$ para todo $x$." },
                { letra: "E", texto: "Não é possível determinar a partir de uma tabela." },
              ],
              gabarito: "C",
              explicacao:
                "Na tabela, cada valor de $x$ ($0$, $1$, $2$ e $3$) aparece exatamente uma vez, com um único $y$ associado. Isso satisfaz a definição de função. O fato de a lei ser $y = 2x+1$ (função afim) é uma observação extra, mas não é necessária para confirmar que é função.",
            },
            {
              id: "fc1q5",
              enunciado:
                "Qual das situações abaixo **NÃO** representa uma função?",
              alternativas: [
                { letra: "A", texto: "A cada número real $x$, associa-se o seu quadrado $x^2$." },
                { letra: "B", texto: "A cada aluno de uma turma, associa-se a sua data de nascimento." },
                { letra: "C", texto: "A cada número real positivo $x$, associa-se o valor $\\sqrt{x}$." },
                { letra: "D", texto: "A cada número real $x \\neq 0$, associa-se $\\pm\\sqrt{x^2}$, podendo ser $+|x|$ ou $-|x|$." },
                { letra: "E", texto: "A cada mês do ano, associa-se a quantidade de dias desse mês." },
              ],
              gabarito: "D",
              explicacao:
                "Na alternativa D, cada $x \\neq 0$ recebe **duas** imagens possíveis: $+|x|$ e $-|x|$. Isso viola a unicidade. Nas demais: A ($x \\to x^2$), B (cada aluno tem uma única data), C ($x \\to \\sqrt{x}$ tem valor único para $x > 0$) e E (cada mês tem uma única quantidade de dias) — todas são funções.",
            },
            {
              id: "fc1q6",
              enunciado:
                "Uma tabela apresenta $x = 2$ com $y = 5$ e, mais abaixo, novamente $x = 2$ com $y = 5$. Essa relação é uma função?",
              alternativas: [
                { letra: "A", texto: "Não, pois $x = 2$ aparece duas vezes." },
                { letra: "B", texto: "Sim, pois mesmo aparecendo duas vezes, $x = 2$ tem sempre o mesmo valor de $y$." },
                { letra: "C", texto: "Não, pois uma tabela não pode ter entradas repetidas." },
                { letra: "D", texto: "Depende se o domínio é finito ou infinito." },
                { letra: "E", texto: "Não é possível determinar sem ver toda a tabela." },
              ],
              gabarito: "B",
              explicacao:
                "Embora $x = 2$ apareça duas vezes, as duas ocorrências apontam para **o mesmo** $y = 5$. A unicidade exige que $x$ não tenha **dois y diferentes** — ter o mesmo par repetido não cria conflito. Portanto, essa relação ainda pode ser uma função (desde que o restante da tabela também satisfaça a condição).",
            },
            {
              id: "fc1q7",
              enunciado:
                "Qual das leis abaixo define uma função $f: \\mathbb{R} \\to \\mathbb{R}$?",
              alternativas: [
                { letra: "A", texto: "$f(x) = \\pm x$" },
                { letra: "B", texto: "$f(x) = \\sqrt{x}$ para todo $x \\in \\mathbb{R}$" },
                { letra: "C", texto: "$f(x) = x^2 - 3x + 1$" },
                { letra: "D", texto: "$f(x) = \\dfrac{1}{x}$ para todo $x \\in \\mathbb{R}$" },
                { letra: "E", texto: "$f(x) = \\sqrt{-x^2}$ para $x \\neq 0$" },
              ],
              gabarito: "C",
              explicacao:
                "A lei $f(x) = x^2 - 3x + 1$ é um polinômio definido para **todo** $x \\in \\mathbb{R}$ com exatamente um valor de saída — perfeita. Os demais: A dá dois valores; B exige $x \\geq 0$; D não está definida em $x=0$; E resulta em número imaginário para $x \\neq 0$.",
            },
            {
              id: "fc1q8",
              enunciado:
                "Dado o conjunto $A = \\{-1, 0, 1\\}$, a relação $f(x) = |x|$ (módulo de $x$) é uma função de $A$ em $\\{0, 1\\}$?",
              alternativas: [
                { letra: "A", texto: "Não, pois $f(-1) = f(1) = 1$ e funções precisam ter imagens distintas." },
                { letra: "B", texto: "Sim, pois cada elemento de $A$ tem exatamente um valor de $|x|$." },
                { letra: "C", texto: "Não, pois $|x|$ não é uma expressão algébrica simples." },
                { letra: "D", texto: "Sim, mas apenas se restringirmos a $A = \\{0, 1\\}$." },
                { letra: "E", texto: "Não, pois $f(-1)$ e $f(1)$ têm o mesmo valor." },
              ],
              gabarito: "B",
              explicacao:
                "$f(-1)=1$, $f(0)=0$, $f(1)=1$. Cada elemento de $A$ tem **exatamente uma** imagem — a condição é satisfeita. O fato de $-1$ e $1$ terem a mesma imagem não é problema: funções admitem isso (chamamos de função não-injetora). Logo, $f$ é sim uma função.",
            },
            {
              id: "fc1q9",
              enunciado:
                "Um estudante afirma: *\"A relação que associa cada número inteiro ao seu dobro é uma função, mas a relação que associa cada número real ao seu inverso multiplicativo não é\"*. Ele está:",
              alternativas: [
                { letra: "A", texto: "Correto em ambas as afirmações." },
                { letra: "B", texto: "Correto na primeira e errado na segunda: $f(x)=\\frac{1}{x}$ é função em $\\mathbb{R}^*$." },
                { letra: "C", texto: "Errado na primeira: dobro de inteiro não é sempre inteiro." },
                { letra: "D", texto: "Correto na segunda: $\\frac{1}{x}$ é função em $\\mathbb{R}$." },
                { letra: "E", texto: "Errado em ambas as afirmações." },
              ],
              gabarito: "B",
              explicacao:
                "$f(x) = 2x$ é função de $\\mathbb{Z}$ em $\\mathbb{Z}$: cada inteiro tem exatamente um dobro. A segunda relação $g(x) = \\frac{1}{x}$ é função quando o domínio é $\\mathbb{R}^* = \\mathbb{R} \\setminus \\{0\\}$ (real não-nulo), pois aí cada $x$ tem exatamente uma imagem. O estudante errou ao dizer que ela **não é** função — ela é, desde que excluamos o zero do domínio.",
            },
            {
              id: "fc1q10",
              enunciado:
                "A equação $x^2 + y^2 = 25$ define $y$ como função de $x$ no domínio $\\mathbb{R}$?",
              alternativas: [
                { letra: "A", texto: "Sim, pois é a equação de uma circunferência bem definida." },
                { letra: "B", texto: "Sim, pois para cada $x$ existe exatamente um $y$ satisfazendo a equação." },
                { letra: "C", texto: "Não, pois para $x = 0$ obteríamos $y = \\pm 5$, violando a unicidade." },
                { letra: "D", texto: "Não, pois $x^2 + y^2 = 25$ não tem solução real." },
                { letra: "E", texto: "Depende: é função apenas para $x > 0$." },
              ],
              gabarito: "C",
              explicacao:
                "Isolando $y$: $y = \\pm\\sqrt{25 - x^2}$. Para $x = 0$ temos $y = +5$ **ou** $y = -5$ — dois valores distintos para um mesmo $x$. A unicidade é violada, então $y$ **não é função** de $x$ nessa equação. Para ser função, precisaríamos restringir a $y \\geq 0$ (semicircunferência superior) ou $y \\leq 0$ (inferior).",
            },
          ],
        },

        // =====================================================================
        // Lição 2 — Domínio, contradomínio e imagem
        // =====================================================================
        {
          slug: "dominio-contradominio-imagem",
          titulo: "Domínio, contradomínio e imagem",
          resumo:
            "Aprenda a identificar e calcular o domínio máximo (restrições algébricas), o contradomínio e a imagem real de uma função.",
          duracaoMinutos: 18,

          explicacao: `
Os três conjuntos fundamentais de qualquer função $f: A \\to B$ são:

### Domínio ($D_f$ ou $A$)

O conjunto de **todos os valores de $x$ que podem ser usados** como entrada.

Quando a função vem de um contexto real (sem domínio explícito), calculamos o **domínio máximo** — o maior subconjunto de $\\mathbb{R}$ em que a lei está definida. As principais restrições são:

| Situação | Restrição |
|---|---|
| Denominador | $\\text{denominador} \\neq 0$ |
| Raiz de índice par | expressão dentro da raiz $\\geq 0$ |
| Logaritmo | argumento $> 0$, base $> 0$ e base $\\neq 1$ |

### Contradomínio ($CD$ ou $B$)

O conjunto de **chegada declarado**. Qualquer saída possível da função precisa estar dentro do contradomínio, mas nem todo elemento do contradomínio precisa ser efetivamente atingido.

### Imagem ($\\text{Im}_f$)

O conjunto de **todos os valores que $f(x)$ realmente assume** quando $x$ percorre o domínio. Em geral, $\\text{Im}_f \\subseteq CD$.

$$
\\text{Im}_f = \\{ f(x) \\mid x \\in D_f \\}
$$

### Resumo visual

$$
x \\in D_f \\xrightarrow{\\;f\\;} f(x) \\in \\text{Im}_f \\subseteq CD
$$

### Exemplo rápido

Para $f(x) = x^2$ com $D_f = \\mathbb{R}$ e $CD = \\mathbb{R}$:
- **Domínio:** $\\mathbb{R}$ (sem restrições).
- **Contradomínio:** $\\mathbb{R}$.
- **Imagem:** $[0, +\\infty)$, pois $x^2 \\geq 0$ para todo real — os negativos nunca aparecem como saída.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Domínio máximo com denominador",
              problema:
                "Determine o domínio máximo da função $f(x) = \\dfrac{3x + 1}{x^2 - 4}$.",
              resolucao: `
O único problema ocorre quando o denominador é zero, pois a divisão por zero é indefinida.

Igualamos o denominador a zero:

$$
x^2 - 4 = 0 \\implies x^2 = 4 \\implies x = \\pm 2
$$

Portanto, $x = 2$ e $x = -2$ devem ser **excluídos** do domínio.

$$
D_f = \\mathbb{R} \\setminus \\{-2,\\, 2\\}
$$

Ou equivalentemente: $D_f = (-\\infty, -2) \\cup (-2, 2) \\cup (2, +\\infty)$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Domínio com raiz quadrada",
              problema:
                "Determine o domínio máximo de $g(x) = \\sqrt{2x - 6}$.",
              resolucao: `
A raiz quadrada só está definida para argumentos **não negativos** (em $\\mathbb{R}$):

$$
2x - 6 \\geq 0
$$

Resolvemos a inequação:

$$
2x \\geq 6 \\implies x \\geq 3
$$

Portanto:

$$
D_g = [3, +\\infty)
$$

Verificação: $g(3) = \\sqrt{0} = 0$ ✅ e $g(7) = \\sqrt{8} = 2\\sqrt{2}$ ✅.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "fc2q1",
              enunciado:
                "Para a função $f: \\{1, 2, 3\\} \\to \\{2, 4, 6\\}$ dada por $f(x) = 2x$, qual é a **imagem** de $f$?",
              alternativas: [
                { letra: "A", texto: "$\\{1, 2, 3\\}$" },
                { letra: "B", texto: "$\\{2, 4, 6\\}$" },
                { letra: "C", texto: "$\\{1, 2, 3, 4, 6\\}$" },
                { letra: "D", texto: "$\\mathbb{R}$" },
                { letra: "E", texto: "$\\{0, 2, 4, 6\\}$" },
              ],
              gabarito: "B",
              explicacao:
                "Calculamos $f(1)=2$, $f(2)=4$, $f(3)=6$. A imagem é o conjunto de todos os valores efetivamente atingidos: $\\text{Im}_f = \\{2, 4, 6\\}$. Neste caso, a imagem coincide com o contradomínio (dizemos que $f$ é **sobrejetora**).",
            },
            {
              id: "fc2q2",
              enunciado:
                "Para $f: \\{-2,-1,0,1,2\\} \\to \\mathbb{Z}$ com $f(x) = x^2$, qual é a imagem de $f$?",
              alternativas: [
                { letra: "A", texto: "$\\{-4,-1,0,1,4\\}$" },
                { letra: "B", texto: "$\\{0,1,4\\}$" },
                { letra: "C", texto: "$\\{0,1,2,4\\}$" },
                { letra: "D", texto: "$\\{-2,-1,0,1,2\\}$" },
                { letra: "E", texto: "$\\{1,4\\}$" },
              ],
              gabarito: "B",
              explicacao:
                "$f(-2)=4$, $f(-1)=1$, $f(0)=0$, $f(1)=1$, $f(2)=4$. Os valores distintos obtidos são $0$, $1$ e $4$. Logo $\\text{Im}_f = \\{0,1,4\\}$. Note que $-1$ e $1$ produzem a mesma imagem ($1$), assim como $-2$ e $2$ (imagem $4$).",
            },
            {
              id: "fc2q3",
              enunciado:
                "Qual é o domínio máximo de $f(x) = \\dfrac{5}{x - 3}$?",
              alternativas: [
                { letra: "A", texto: "$\\mathbb{R}$" },
                { letra: "B", texto: "$\\mathbb{R} \\setminus \\{5\\}$" },
                { letra: "C", texto: "$\\mathbb{R} \\setminus \\{3\\}$" },
                { letra: "D", texto: "$[3, +\\infty)$" },
                { letra: "E", texto: "$(0, +\\infty)$" },
              ],
              gabarito: "C",
              explicacao:
                "O denominador $x - 3$ não pode ser zero, logo $x \\neq 3$. O domínio máximo é $\\mathbb{R} \\setminus \\{3\\}$. O numerador $5$ (constante) não gera nenhuma restrição.",
            },
            {
              id: "fc2q4",
              enunciado:
                "Qual é o domínio máximo de $g(x) = \\sqrt{x + 4}$?",
              alternativas: [
                { letra: "A", texto: "$\\mathbb{R}$" },
                { letra: "B", texto: "$[-4, +\\infty)$" },
                { letra: "C", texto: "$(4, +\\infty)$" },
                { letra: "D", texto: "$(-4, +\\infty)$" },
                { letra: "E", texto: "$[4, +\\infty)$" },
              ],
              gabarito: "B",
              explicacao:
                "A raiz quadrada exige argumento $\\geq 0$: $x + 4 \\geq 0 \\implies x \\geq -4$. Logo o domínio é $[-4, +\\infty)$. Note que $x = -4$ é incluído (produz $\\sqrt{0} = 0$), por isso o colchete fechado.",
            },
            {
              id: "fc2q5",
              enunciado:
                "Qual é o domínio máximo de $h(x) = \\dfrac{\\sqrt{x}}{x - 1}$?",
              alternativas: [
                { letra: "A", texto: "$[0, +\\infty)$" },
                { letra: "B", texto: "$(0, 1) \\cup (1, +\\infty)$" },
                { letra: "C", texto: "$[0, 1) \\cup (1, +\\infty)$" },
                { letra: "D", texto: "$\\mathbb{R} \\setminus \\{1\\}$" },
                { letra: "E", texto: "$(1, +\\infty)$" },
              ],
              gabarito: "C",
              explicacao:
                "Duas restrições simultâneas: (1) raiz exige $x \\geq 0$; (2) denominador exige $x \\neq 1$. Combinando: $x \\geq 0$ e $x \\neq 1$, ou seja, $[0, 1) \\cup (1, +\\infty)$. O zero está incluído pois $\\sqrt{0}/(-1) = 0$ é definido.",
            },
            {
              id: "fc2q6",
              enunciado:
                "Para $f(x) = x + 2$ com domínio $\\{1, 2, 3\\}$ e contradomínio $\\mathbb{N}$, qual afirmação é **verdadeira**?",
              alternativas: [
                { letra: "A", texto: "A imagem é igual ao contradomínio." },
                { letra: "B", texto: "A imagem é $\\{3, 4, 5\\}$ e é subconjunto do contradomínio." },
                { letra: "C", texto: "A imagem é $\\{1, 2, 3\\}$." },
                { letra: "D", texto: "A imagem é $\\mathbb{N}$." },
                { letra: "E", texto: "Não existe imagem pois $f$ não é sobrejetora." },
              ],
              gabarito: "B",
              explicacao:
                "$f(1)=3$, $f(2)=4$, $f(3)=5$. A imagem é $\\{3,4,5\\}$, que é um subconjunto de $\\mathbb{N}$ (o contradomínio). A imagem nunca precisa ser igual ao contradomínio — basta estar contida nele. A função é **não sobrejetora** pois há naturais (como $1$, $2$) que não são atingidos.",
            },
            {
              id: "fc2q7",
              enunciado:
                "Uma função $f$ tem domínio $D_f = \\mathbb{R}$ e imagem $\\text{Im}_f = \\{7\\}$. Que tipo de função é essa?",
              alternativas: [
                { letra: "A", texto: "Função identidade." },
                { letra: "B", texto: "Função afim com inclinação positiva." },
                { letra: "C", texto: "Função constante." },
                { letra: "D", texto: "Função quadrática." },
                { letra: "E", texto: "Não existe função com essas características." },
              ],
              gabarito: "C",
              explicacao:
                "Uma imagem de um único elemento significa que a função sempre retorna o mesmo valor independente da entrada. Isso é a definição de **função constante**: $f(x) = 7$ para todo $x \\in \\mathbb{R}$.",
            },
            {
              id: "fc2q8",
              enunciado:
                "Considere $f(x) = x^2$ com $D_f = \\mathbb{R}$. Qual das opções é uma afirmação **incorreta** sobre $f$?",
              alternativas: [
                { letra: "A", texto: "O contradomínio pode ser $\\mathbb{R}$." },
                { letra: "B", texto: "A imagem de $f$ é $[0, +\\infty)$." },
                { letra: "C", texto: "O valor $-1$ pertence à imagem de $f$." },
                { letra: "D", texto: "O valor $0$ pertence à imagem de $f$, pois $f(0) = 0$." },
                { letra: "E", texto: "A imagem está contida no contradomínio." },
              ],
              gabarito: "C",
              explicacao:
                "$f(x) = x^2 \\geq 0$ para todo $x \\in \\mathbb{R}$, portanto a imagem é $[0,+\\infty)$ — nenhum valor negativo é atingido. Logo, $-1 \\notin \\text{Im}_f$. A alternativa C é a afirmação incorreta.",
            },
            {
              id: "fc2q9",
              enunciado:
                "O domínio máximo de $f(x) = \\dfrac{1}{x^2 - 5x + 6}$ é:",
              alternativas: [
                { letra: "A", texto: "$\\mathbb{R} \\setminus \\{2\\}$" },
                { letra: "B", texto: "$\\mathbb{R} \\setminus \\{3\\}$" },
                { letra: "C", texto: "$\\mathbb{R} \\setminus \\{2, 3\\}$" },
                { letra: "D", texto: "$\\mathbb{R} \\setminus \\{-2, -3\\}$" },
                { letra: "E", texto: "$\\mathbb{R}$" },
              ],
              gabarito: "C",
              explicacao:
                "Fatoramos o denominador: $x^2 - 5x + 6 = (x-2)(x-3)$. O denominador se anula quando $x=2$ ou $x=3$. Logo $D_f = \\mathbb{R} \\setminus \\{2, 3\\}$.",
            },
            {
              id: "fc2q10",
              enunciado:
                "Para a função $f(x) = \\sqrt{9 - x^2}$ com $D_f$ máximo, qual é a **imagem** de $f$?",
              alternativas: [
                { letra: "A", texto: "$\\mathbb{R}$" },
                { letra: "B", texto: "$[-3, 3]$" },
                { letra: "C", texto: "$[0, 3]$" },
                { letra: "D", texto: "$(0, 3)$" },
                { letra: "E", texto: "$[0, 9]$" },
              ],
              gabarito: "C",
              explicacao:
                "O domínio exige $9 - x^2 \\geq 0 \\Rightarrow x \\in [-3,3]$. Quando $x = \\pm 3$: $f(\\pm 3) = \\sqrt{0} = 0$ (mínimo). Quando $x = 0$: $f(0) = \\sqrt{9} = 3$ (máximo). A raiz quadrada é sempre $\\geq 0$, então $f(x) \\in [0, 3]$. A imagem é $[0, 3]$.",
            },
          ],
        },

        // =====================================================================
        // Lição 3 — Valor numérico de uma função
        // =====================================================================
        {
          slug: "valor-numerico",
          titulo: "Valor numérico de uma função",
          resumo:
            "Calcule $f(a)$ substituindo $x = a$ na lei da função — e resolva $f(x) = k$ encontrando os $x$ que produzem um dado resultado.",
          duracaoMinutos: 18,

          explicacao: `
### Calculando $f(a)$

O **valor numérico** em $x = a$ é obtido substituindo cada $x$ da lei pelo valor $a$. O resultado é um número.

**Exemplo:** Se $f(x) = 3x^2 - x + 2$, então:

$$
f(4) = 3 \\cdot 4^2 - 4 + 2 = 3 \\cdot 16 - 4 + 2 = 46
$$

### Cuidado com argumentos compostos

Se o argumento não for apenas $x$, mas uma expressão como $a+1$ ou $2t-1$, substitua **tudo** de uma vez — coloque a expressão inteira entre parênteses em cada $x$ da lei.

**Exemplo:** Com $f(x) = x + 3$ e argumento $2t - 1$:

$$
f(2t - 1) = (2t - 1) + 3 = 2t + 2
$$

### Resolvendo $f(x) = k$

A pergunta inversa é: "para qual $x$ a função vale $k$?" Basta **igualar a lei a $k$** e resolver a equação resultante.

**Exemplo:** $f(x) = 2x - 3$, queremos $f(x) = 7$:

$$
2x - 3 = 7 \\implies 2x = 10 \\implies x = 5
$$

### Igualdade de funções

Se $f(a) = f(b)$ e $f$ for injetora (cada $y$ vem de no máximo um $x$), então $a = b$. Se $f$ não for injetora — como $f(x)=x^2$ — pode haver $a \\neq b$ com $f(a)=f(b)$.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Valor numérico e equação",
              problema:
                "Dada $f(x) = 2x^2 - 3x + 1$, calcule $f(3)$ e encontre o(s) valor(es) de $x$ tal que $f(x) = 6$.",
              resolucao: `
**Parte 1 — Calcular $f(3)$:**

Substituímos $x = 3$:

$$
f(3) = 2(3)^2 - 3(3) + 1 = 2 \\cdot 9 - 9 + 1 = 18 - 9 + 1 = 10
$$

**Parte 2 — Resolver $f(x) = 6$:**

$$
2x^2 - 3x + 1 = 6
$$

$$
2x^2 - 3x - 5 = 0
$$

Usamos Bhaskara com $a=2$, $b=-3$, $c=-5$:

$$
\\Delta = (-3)^2 - 4 \\cdot 2 \\cdot (-5) = 9 + 40 = 49
$$

$$
x = \\frac{3 \\pm 7}{4} \\implies x_1 = \\frac{10}{4} = \\frac{5}{2}, \\quad x_2 = \\frac{-4}{4} = -1
$$

**Resposta:** $f(3) = 10$; os valores são $x = \\dfrac{5}{2}$ e $x = -1$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Argumento composto",
              problema:
                "Dada $f(x) = x^2 + 1$, calcule $f(x + 2)$ e $f(x + 2) - f(x)$.",
              resolucao: `
**Calculando $f(x + 2)$:**

Substituímos $x \\leftarrow (x+2)$ na lei $f(x) = x^2 + 1$:

$$
f(x+2) = (x+2)^2 + 1 = x^2 + 4x + 4 + 1 = x^2 + 4x + 5
$$

**Calculando $f(x+2) - f(x)$:**

$$
f(x+2) - f(x) = (x^2 + 4x + 5) - (x^2 + 1) = 4x + 4
$$

**Resposta:** $f(x+2) = x^2 + 4x + 5$; $\\quad f(x+2) - f(x) = 4x + 4$.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "fc3q1",
              enunciado:
                "Para $f(x) = 3x + 5$, qual é o valor de $f(4)$?",
              alternativas: [
                { letra: "A", texto: "$12$" },
                { letra: "B", texto: "$17$" },
                { letra: "C", texto: "$15$" },
                { letra: "D", texto: "$20$" },
                { letra: "E", texto: "$9$" },
              ],
              gabarito: "B",
              explicacao:
                "Substituímos $x = 4$: $f(4) = 3 \\cdot 4 + 5 = 12 + 5 = 17$.",
            },
            {
              id: "fc3q2",
              enunciado:
                "Para $g(x) = x^2 - 2x$, qual é o valor de $g(-3)$?",
              alternativas: [
                { letra: "A", texto: "$3$" },
                { letra: "B", texto: "$-3$" },
                { letra: "C", texto: "$15$" },
                { letra: "D", texto: "$-15$" },
                { letra: "E", texto: "$9$" },
              ],
              gabarito: "C",
              explicacao:
                "$g(-3) = (-3)^2 - 2(-3) = 9 + 6 = 15$. Atenção: $(-3)^2 = +9$, não $-9$. E $-2 \\cdot (-3) = +6$.",
            },
            {
              id: "fc3q3",
              enunciado:
                "Dada $f(x) = 5x - 8$, para qual valor de $x$ temos $f(x) = 12$?",
              alternativas: [
                { letra: "A", texto: "$x = 2$" },
                { letra: "B", texto: "$x = 4$" },
                { letra: "C", texto: "$x = 20$" },
                { letra: "D", texto: "$x = 1$" },
                { letra: "E", texto: "$x = -4$" },
              ],
              gabarito: "B",
              explicacao:
                "Igualamos a lei a $12$: $5x - 8 = 12 \\implies 5x = 20 \\implies x = 4$. Verificação: $f(4) = 20 - 8 = 12$ ✅.",
            },
            {
              id: "fc3q4",
              enunciado:
                "Se $h(x) = \\dfrac{x + 3}{2}$, qual é o valor de $h(7)$?",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$3$" },
                { letra: "C", texto: "$5$" },
                { letra: "D", texto: "$7$" },
                { letra: "E", texto: "$10$" },
              ],
              gabarito: "C",
              explicacao:
                "$h(7) = \\dfrac{7 + 3}{2} = \\dfrac{10}{2} = 5$.",
            },
            {
              id: "fc3q5",
              enunciado:
                "Dada $f(x) = x^2 + x - 2$, quais são os valores de $x$ que satisfazem $f(x) = 0$?",
              alternativas: [
                { letra: "A", texto: "$x = 1$ e $x = 2$" },
                { letra: "B", texto: "$x = -2$ e $x = 1$" },
                { letra: "C", texto: "$x = 2$ e $x = -1$" },
                { letra: "D", texto: "$x = 0$ e $x = 2$" },
                { letra: "E", texto: "$x = -1$ e $x = -2$" },
              ],
              gabarito: "B",
              explicacao:
                "Resolvemos $x^2 + x - 2 = 0$. Fatorando: $(x+2)(x-1) = 0$, logo $x = -2$ ou $x = 1$. Verificação: $f(-2) = 4 - 2 - 2 = 0$ ✅ e $f(1) = 1 + 1 - 2 = 0$ ✅.",
            },
            {
              id: "fc3q6",
              enunciado:
                "Para $f(x) = 2x - 1$, qual é o valor de $f(a + 1)$?",
              alternativas: [
                { letra: "A", texto: "$2a - 1$" },
                { letra: "B", texto: "$2a$" },
                { letra: "C", texto: "$2a + 1$" },
                { letra: "D", texto: "$2a + 2$" },
                { letra: "E", texto: "$2a - 2$" },
              ],
              gabarito: "C",
              explicacao:
                "Substituímos $x \\leftarrow (a+1)$: $f(a+1) = 2(a+1) - 1 = 2a + 2 - 1 = 2a + 1$.",
            },
            {
              id: "fc3q7",
              enunciado:
                "A função $f: \\mathbb{R} \\to \\mathbb{R}$ é definida por $f(x) = |x - 3|$. Qual é o valor de $f(1) + f(5)$?",
              alternativas: [
                { letra: "A", texto: "$4$" },
                { letra: "B", texto: "$0$" },
                { letra: "C", texto: "$6$" },
                { letra: "D", texto: "$2$" },
                { letra: "E", texto: "$8$" },
              ],
              gabarito: "A",
              explicacao:
                "$f(1) = |1-3| = |-2| = 2$ e $f(5) = |5-3| = |2| = 2$. Logo $f(1) + f(5) = 2 + 2 = 4$.",
            },
            {
              id: "fc3q8",
              enunciado:
                "Se $f(x) = x^2 + 2$, qual é o valor de $f(x+1) - f(x)$?",
              alternativas: [
                { letra: "A", texto: "$1$" },
                { letra: "B", texto: "$2x$" },
                { letra: "C", texto: "$2x + 1$" },
                { letra: "D", texto: "$2x + 3$" },
                { letra: "E", texto: "$x^2 + 2x + 3$" },
              ],
              gabarito: "C",
              explicacao:
                "$f(x+1) = (x+1)^2 + 2 = x^2 + 2x + 1 + 2 = x^2 + 2x + 3$. Portanto: $f(x+1) - f(x) = (x^2 + 2x + 3) - (x^2 + 2) = 2x + 1$.",
            },
            {
              id: "fc3q9",
              enunciado:
                "Dada $f(x) = \\dfrac{1}{x - 2}$, se $f(k) = \\dfrac{1}{3}$, qual é o valor de $k$?",
              alternativas: [
                { letra: "A", texto: "$k = 3$" },
                { letra: "B", texto: "$k = 5$" },
                { letra: "C", texto: "$k = -1$" },
                { letra: "D", texto: "$k = \\dfrac{1}{5}$" },
                { letra: "E", texto: "$k = -3$" },
              ],
              gabarito: "B",
              explicacao:
                "Temos $\\dfrac{1}{k-2} = \\dfrac{1}{3}$. Como ambos os numeradores são $1$, os denominadores devem ser iguais: $k - 2 = 3 \\implies k = 5$.",
            },
            {
              id: "fc3q10",
              enunciado:
                "Uma função $f$ satisfaz $f(x + 1) = f(x) + 3$ para todo $x$ inteiro, e $f(1) = 2$. Qual é o valor de $f(5)$?",
              alternativas: [
                { letra: "A", texto: "$10$" },
                { letra: "B", texto: "$12$" },
                { letra: "C", texto: "$14$" },
                { letra: "D", texto: "$15$" },
                { letra: "E", texto: "$17$" },
              ],
              gabarito: "C",
              explicacao:
                "Usamos a relação de recorrência a partir de $f(1) = 2$: $f(2) = f(1)+3 = 5$; $f(3) = f(2)+3 = 8$; $f(4) = f(3)+3 = 11$; $f(5) = f(4)+3 = 14$. Note que cada passo soma $3$, logo $f(n) = 2 + 3(n-1)$. Para $n=5$: $f(5) = 2 + 12 = 14$.",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // Capítulo 2 — Função do primeiro grau
    // =========================================================================
    {
      slug: "funcao-primeiro-grau",
      titulo: "Função do primeiro grau",
      licoes: [

        // =====================================================================
        // Lição 1 — Função afim e função linear: definição e diferença
        // =====================================================================
        {
          slug: "funcao-afim-e-linear",
          titulo: "Função afim e função linear",
          resumo:
            "Entenda a lei $f(x) = ax + b$, quando ela é afim e quando é linear — a diferença que mais cai em prova.",
          duracaoMinutos: 15,

          explicacao: `
### Função afim

Uma função $f: \\mathbb{R} \\to \\mathbb{R}$ é chamada de **função afim** (ou função do 1° grau) quando sua lei tem a forma:

$$
f(x) = ax + b, \\quad a \\neq 0, \\quad a, b \\in \\mathbb{R}
$$

- $a$ é o **coeficiente angular** (ou taxa de variação).
- $b$ é o **coeficiente linear** (o valor de $f$ quando $x = 0$).
- A condição $a \\neq 0$ garante que é de 1° grau — se $a = 0$, seria uma função constante.

**Exemplos de funções afim:**

$$
f(x) = 3x + 2, \\quad g(x) = -x + 5, \\quad h(x) = \\tfrac{1}{2}x - 7
$$

### Função linear

A **função linear** é um **caso particular** da função afim em que $b = 0$:

$$
f(x) = ax, \\quad a \\neq 0
$$

O gráfico da função linear **sempre passa pela origem** $(0, 0)$, pois $f(0) = a \\cdot 0 = 0$.

**Exemplos de funções lineares:**

$$
f(x) = 4x, \\quad g(x) = -2x, \\quad h(x) = \\tfrac{3}{5}x
$$

### O que diferencia uma da outra?

| Característica | Função afim | Função linear |
|---|---|---|
| Lei geral | $f(x) = ax + b$ | $f(x) = ax$ |
| Valor de $b$ | qualquer real | obrigatoriamente $b = 0$ |
| Passa pela origem? | somente se $b = 0$ | sempre |
| Caso particular? | não (é a forma geral) | sim, da função afim |

> **Resumo:** toda função linear é afim, mas nem toda função afim é linear.

### Por que a distinção importa?

Em provas, questões pedem: *"qual das funções abaixo é linear?"* A resposta exige verificar se $b = 0$. Além disso, funções lineares modelam grandezas **diretamente proporcionais** ($y = kx$), enquanto funções afim modelam relações com um **valor de partida** diferente de zero.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Identificar afim, linear ou nenhuma",
              problema:
                "Classifique cada função abaixo como **afim** (e não linear), **linear** ou **nenhuma das duas**:\n\n(a) $f(x) = 7x - 3$ \\quad (b) $g(x) = -5x$ \\quad (c) $h(x) = x^2 + 1$ \\quad (d) $p(x) = 4$",
              resolucao: `
**(a) $f(x) = 7x - 3$:** tem a forma $ax + b$ com $a = 7 \\neq 0$ e $b = -3 \\neq 0$. É **afim** (e não linear, pois $b \\neq 0$).

**(b) $g(x) = -5x$:** tem a forma $ax$ com $a = -5 \\neq 0$ e $b = 0$. É **linear** (e portanto também afim).

**(c) $h(x) = x^2 + 1$:** o expoente de $x$ é $2$, não $1$. **Não é nem afim nem linear** — é função quadrática.

**(d) $p(x) = 4$:** tem $a = 0$ e $b = 4$. Embora escreva-se $p(x) = 0 \\cdot x + 4$, a condição $a \\neq 0$ não é satisfeita. **Não é afim** — é função constante.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Determinar coeficientes e verificar linearidade",
              problema:
                "A função $f(x) = (m-2)x + (m^2 - 9)$ é linear. Determine o valor de $m$.",
              resolucao: `
Para ser **linear**, dois requisitos devem ser satisfeitos simultaneamente:
1. $a \\neq 0$ (precisa ser de 1° grau): $m - 2 \\neq 0 \\implies m \\neq 2$.
2. $b = 0$ (coeficiente linear nulo): $m^2 - 9 = 0$.

Resolvendo a condição 2:

$$
m^2 = 9 \\implies m = 3 \\text{ ou } m = -3
$$

Verificamos a condição 1 para cada candidato:
- $m = 3$: $a = 3 - 2 = 1 \\neq 0$ ✅
- $m = -3$: $a = -3 - 2 = -5 \\neq 0$ ✅

Ambos são válidos. **$m = 3$ ou $m = -3$.**
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "fp1q1",
              enunciado: "Qual das funções abaixo é uma **função linear**?",
              alternativas: [
                { letra: "A", texto: "$f(x) = 2x + 1$" },
                { letra: "B", texto: "$f(x) = x^2$" },
                { letra: "C", texto: "$f(x) = -3x$" },
                { letra: "D", texto: "$f(x) = 5$" },
                { letra: "E", texto: "$f(x) = x + 0{,}1$" },
              ],
              gabarito: "C",
              explicacao:
                "Função linear: $f(x) = ax$ com $a \\neq 0$ e $b = 0$. Alternativa C: $f(x) = -3x$ tem $a = -3$ e $b = 0$ ✅. A é afim (b ≠ 0); B é quadrática; D é constante; E é afim ($b = 0{,}1 \\neq 0$).",
            },
            {
              id: "fp1q2",
              enunciado:
                "Qual das afirmações sobre função afim e função linear é **falsa**?",
              alternativas: [
                { letra: "A", texto: "Toda função linear é uma função afim." },
                { letra: "B", texto: "Toda função afim é uma função linear." },
                { letra: "C", texto: "A função linear passa pela origem do plano cartesiano." },
                { letra: "D", texto: "A função afim tem lei $f(x) = ax + b$ com $a \\neq 0$." },
                { letra: "E", texto: "A função linear tem $b = 0$ na lei $f(x) = ax + b$." },
              ],
              gabarito: "B",
              explicacao:
                "A afirmação falsa é B. A função afim tem $b$ qualquer (pode ser $b \\neq 0$), portanto **nem toda função afim é linear**. A linear é um caso particular da afim com $b = 0$. As demais afirmações são todas verdadeiras.",
            },
            {
              id: "fp1q3",
              enunciado:
                "Identifique os coeficientes $a$ (angular) e $b$ (linear) da função $f(x) = -4x + 7$.",
              alternativas: [
                { letra: "A", texto: "$a = 4$ e $b = 7$" },
                { letra: "B", texto: "$a = -4$ e $b = 0$" },
                { letra: "C", texto: "$a = 7$ e $b = -4$" },
                { letra: "D", texto: "$a = -4$ e $b = 7$" },
                { letra: "E", texto: "$a = 4$ e $b = -7$" },
              ],
              gabarito: "D",
              explicacao:
                "Comparando $f(x) = -4x + 7$ com $f(x) = ax + b$: o coeficiente de $x$ é $a = -4$ e o termo independente é $b = 7$.",
            },
            {
              id: "fp1q4",
              enunciado:
                "A função $f(x) = (k+1)x - 3$ é afim para:",
              alternativas: [
                { letra: "A", texto: "qualquer valor de $k$." },
                { letra: "B", texto: "$k = 1$." },
                { letra: "C", texto: "$k \\neq -1$." },
                { letra: "D", texto: "$k = -1$." },
                { letra: "E", texto: "$k = 3$." },
              ],
              gabarito: "C",
              explicacao:
                "Para ser afim, precisamos $a = k + 1 \\neq 0$, ou seja, $k \\neq -1$. Se $k = -1$, o coeficiente angular seria zero e a função viraria constante ($f(x) = -3$), deixando de ser afim.",
            },
            {
              id: "fp1q5",
              enunciado:
                "A função $f(x) = (2m - 4)x + m - 1$ é **linear**. Qual é o valor de $m$?",
              alternativas: [
                { letra: "A", texto: "$m = 1$" },
                { letra: "B", texto: "$m = 2$" },
                { letra: "C", texto: "$m = -1$" },
                { letra: "D", texto: "$m = 4$" },
                { letra: "E", texto: "Não existe valor de $m$." },
              ],
              gabarito: "A",
              explicacao:
                "Para ser linear: (1) $a \\neq 0$ e (2) $b = 0$. Condição 2: $m - 1 = 0 \\implies m = 1$. Verificação condição 1: $a = 2(1) - 4 = -2 \\neq 0$ ✅. Logo $m = 1$.",
            },
            {
              id: "fp1q6",
              enunciado:
                "Qual função modela uma grandeza **diretamente proporcional** a $x$?",
              alternativas: [
                { letra: "A", texto: "$f(x) = 3x + 10$" },
                { letra: "B", texto: "$f(x) = -x + 0$" },
                { letra: "C", texto: "$f(x) = \\dfrac{1}{2}x$" },
                { letra: "D", texto: "$f(x) = x^2$" },
                { letra: "E", texto: "$f(x) = 10$" },
              ],
              gabarito: "C",
              explicacao:
                "Grandezas diretamente proporcionais seguem a lei $y = kx$ (sem termo independente), o que é exatamente a definição de **função linear**. A alternativa C é $f(x) = \\frac{1}{2}x$, com $a = \\frac{1}{2}$ e $b = 0$. A alternativa B também teria $b = 0$, mas a escrita $-x + 0$ esconde que é a mesma coisa que $-x$ — ambas B e C são lineares, mas C está na forma mais canônica.",
            },
            {
              id: "fp1q7",
              enunciado:
                "Uma função afim satisfaz $f(0) = 5$ e $f(1) = 8$. Qual é a lei dessa função?",
              alternativas: [
                { letra: "A", texto: "$f(x) = 5x + 3$" },
                { letra: "B", texto: "$f(x) = 3x + 5$" },
                { letra: "C", texto: "$f(x) = 8x$" },
                { letra: "D", texto: "$f(x) = 8x + 5$" },
                { letra: "E", texto: "$f(x) = 3x - 5$" },
              ],
              gabarito: "B",
              explicacao:
                "$f(0) = b = 5$. $f(1) = a + b = 8 \\implies a = 8 - 5 = 3$. Logo $f(x) = 3x + 5$. Verificação: $f(0)=5$ ✅ e $f(1)=8$ ✅.",
            },
            {
              id: "fp1q8",
              enunciado:
                "Qual é o valor de $f(0)$ para qualquer função **linear** $f(x) = ax$?",
              alternativas: [
                { letra: "A", texto: "$a$" },
                { letra: "B", texto: "$1$" },
                { letra: "C", texto: "Depende de $a$." },
                { letra: "D", texto: "$0$" },
                { letra: "E", texto: "Não existe." },
              ],
              gabarito: "D",
              explicacao:
                "$f(0) = a \\cdot 0 = 0$ independentemente do valor de $a$. Isso confirma que toda função linear passa pela origem $(0, 0)$ — uma propriedade fundamental.",
            },
            {
              id: "fp1q9",
              enunciado:
                "Uma empresa cobra R\\$\\,3{,}00 por km rodado mais uma taxa fixa de R\\$\\,8{,}00. A função que modela o custo $C$ em reais em função da distância $d$ em km é:",
              alternativas: [
                { letra: "A", texto: "$C(d) = 8d$" },
                { letra: "B", texto: "$C(d) = 3d$" },
                { letra: "C", texto: "$C(d) = 3d + 8$" },
                { letra: "D", texto: "$C(d) = 8d + 3$" },
                { letra: "E", texto: "$C(d) = 3 + 8$" },
              ],
              gabarito: "C",
              explicacao:
                "A taxa variável é $3d$ (R\\$3 por km) e a taxa fixa é $+8$. Logo $C(d) = 3d + 8$, uma função **afim** com $a = 3$ e $b = 8$. Não é linear pois $b = 8 \\neq 0$.",
            },
            {
              id: "fp1q10",
              enunciado:
                "Qual dos pares $(a, b)$ faz com que $f(x) = ax + b$ seja uma função **afim mas não linear** com $f(2) = 1$?",
              alternativas: [
                { letra: "A", texto: "$(1, -1)$" },
                { letra: "B", texto: "$(2, 0)$" },
                { letra: "C", texto: "$(0, 1)$" },
                { letra: "D", texto: "$(1, 0)$" },
                { letra: "E", texto: "$(3, 0)$" },
              ],
              gabarito: "A",
              explicacao:
                "Para ser afim mas não linear: $a \\neq 0$ e $b \\neq 0$. Testamos $f(2) = 1$: com $(a,b)=(1,-1)$: $f(2)=2-1=1$ ✅, $a=1\\neq0$ ✅ e $b=-1\\neq0$ ✅. Os demais pares falham: B e D/E têm $b=0$ (lineares); C tem $a=0$ (constante).",
            },
          ],
        },

        // =====================================================================
        // Lição 2 — Coeficientes e gráfico da função afim
        // =====================================================================
        {
          slug: "coeficientes-e-grafico",
          titulo: "Coeficientes e gráfico",
          resumo:
            "Interprete $a$ (inclinação da reta) e $b$ (onde a reta corta o eixo $y$) e aprenda a esboçar o gráfico rapidamente.",
          duracaoMinutos: 18,

          explicacao: `
### O gráfico de $f(x) = ax + b$ é uma reta

Para traçar qualquer reta, bastam **dois pontos**. Os mais práticos são:

- **Ponto no eixo $y$:** $x = 0 \\implies f(0) = b$ — o ponto é $(0,\\, b)$.
- **Zero da função (eixo $x$):** $f(x) = 0 \\implies x = -b/a$ — o ponto é $(-b/a,\\, 0)$.

### Coeficiente angular $a$

O coeficiente $a$ mede a **inclinação** da reta e a **taxa de variação** da função:

$$
a = \\frac{\\Delta y}{\\Delta x} = \\frac{f(x_2) - f(x_1)}{x_2 - x_1}
$$

| Sinal de $a$ | Comportamento da função | Reta |
|---|---|---|
| $a > 0$ | crescente | sobe da esquerda para a direita |
| $a < 0$ | decrescente | desce da esquerda para a direita |

Quanto maior $|a|$, mais **íngreme** é a reta.

### Coeficiente linear $b$

O coeficiente $b$ diz onde a reta **intercepta o eixo $y$**:

$$
f(0) = a \\cdot 0 + b = b
$$

- $b > 0$: reta cruza o eixo $y$ acima da origem.
- $b < 0$: reta cruza o eixo $y$ abaixo da origem.
- $b = 0$: reta passa pela origem (função linear).

### Variação da função

Para uma função afim, um aumento de $\\Delta x$ na variável independente produz sempre o mesmo aumento $\\Delta y = a \\cdot \\Delta x$. Isso vale para qualquer par de pontos — é a **linearidade da taxa de variação**.

$$
\\Delta y = a \\cdot \\Delta x
$$
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Esboçar o gráfico e identificar inclinação",
              problema:
                "Para $f(x) = 2x - 4$, determine os pontos de interseção com os eixos e diga se a função é crescente ou decrescente.",
              resolucao: `
**Interseção com o eixo $y$** (coeficiente linear): $f(0) = 2(0) - 4 = -4$. Ponto: $(0, -4)$.

**Zero da função** (interseção com o eixo $x$): $2x - 4 = 0 \\implies x = 2$. Ponto: $(2, 0)$.

**Traçamos** a reta pelos pontos $(0, -4)$ e $(2, 0)$.

**Crescimento:** $a = 2 > 0 \\implies$ função **crescente**.

**Interpretação:** Para cada unidade que $x$ aumenta, $f(x)$ aumenta $2$ unidades ($\\Delta y = 2 \\cdot \\Delta x$).
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Determinar a função a partir de dois pontos",
              problema:
                "Determine a função afim $f(x) = ax + b$ que passa pelos pontos $(-1,\\, 3)$ e $(2,\\, -3)$.",
              resolucao: `
Usando a fórmula do coeficiente angular:

$$
a = \\frac{f(2) - f(-1)}{2 - (-1)} = \\frac{-3 - 3}{3} = \\frac{-6}{3} = -2
$$

Agora, usando um dos pontos para encontrar $b$. Com $(2, -3)$:

$$
f(2) = -3 \\implies -2 \\cdot 2 + b = -3 \\implies -4 + b = -3 \\implies b = 1
$$

**Resposta:** $f(x) = -2x + 1$.

**Verificação:** $f(-1) = -2(-1)+1 = 3$ ✅ e $f(2) = -4+1 = -3$ ✅.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "fp2q1",
              enunciado:
                "A função $f(x) = -3x + 6$ é crescente ou decrescente? Qual é o ponto onde ela corta o eixo $y$?",
              alternativas: [
                { letra: "A", texto: "Crescente; corta em $(0, 6)$." },
                { letra: "B", texto: "Decrescente; corta em $(0, -3)$." },
                { letra: "C", texto: "Decrescente; corta em $(0, 6)$." },
                { letra: "D", texto: "Crescente; corta em $(0, -6)$." },
                { letra: "E", texto: "Decrescente; corta em $(6, 0)$." },
              ],
              gabarito: "C",
              explicacao:
                "$a = -3 < 0 \\implies$ decrescente. $f(0) = 6 \\implies$ corta o eixo $y$ em $(0, 6)$.",
            },
            {
              id: "fp2q2",
              enunciado:
                "Qual é o zero (raiz) da função $f(x) = 4x - 8$?",
              alternativas: [
                { letra: "A", texto: "$x = -2$" },
                { letra: "B", texto: "$x = 8$" },
                { letra: "C", texto: "$x = 4$" },
                { letra: "D", texto: "$x = 2$" },
                { letra: "E", texto: "$x = -8$" },
              ],
              gabarito: "D",
              explicacao:
                "$4x - 8 = 0 \\implies 4x = 8 \\implies x = 2$. O zero da função é o ponto onde o gráfico cruza o eixo $x$: ponto $(2, 0)$.",
            },
            {
              id: "fp2q3",
              enunciado:
                "Para $f(x) = ax + b$ com $a > 0$ e $b < 0$, o gráfico:",
              alternativas: [
                { letra: "A", texto: "É crescente e corta o eixo $y$ acima da origem." },
                { letra: "B", texto: "É decrescente e corta o eixo $y$ abaixo da origem." },
                { letra: "C", texto: "É crescente e passa pela origem." },
                { letra: "D", texto: "É crescente e corta o eixo $y$ abaixo da origem." },
                { letra: "E", texto: "É decrescente e corta o eixo $y$ acima da origem." },
              ],
              gabarito: "D",
              explicacao:
                "$a > 0 \\implies$ reta crescente. $b < 0 \\implies$ reta corta o eixo $y$ em $(0, b)$, que está abaixo da origem. Alternativa D.",
            },
            {
              id: "fp2q4",
              enunciado:
                "Uma função afim tem $f(0) = -2$ e $f(3) = 7$. Qual é o coeficiente angular?",
              alternativas: [
                { letra: "A", texto: "$a = 2$" },
                { letra: "B", texto: "$a = 3$" },
                { letra: "C", texto: "$a = 7$" },
                { letra: "D", texto: "$a = -2$" },
                { letra: "E", texto: "$a = 9$" },
              ],
              gabarito: "B",
              explicacao:
                "$a = \\dfrac{f(3) - f(0)}{3 - 0} = \\dfrac{7 - (-2)}{3} = \\dfrac{9}{3} = 3$.",
            },
            {
              id: "fp2q5",
              enunciado:
                "Se $f(x) = ax + b$ passa pelos pontos $(0, 4)$ e $(2, 0)$, qual é a lei de $f$?",
              alternativas: [
                { letra: "A", texto: "$f(x) = 2x + 4$" },
                { letra: "B", texto: "$f(x) = -2x + 4$" },
                { letra: "C", texto: "$f(x) = 4x - 2$" },
                { letra: "D", texto: "$f(x) = -4x + 2$" },
                { letra: "E", texto: "$f(x) = 2x - 4$" },
              ],
              gabarito: "B",
              explicacao:
                "De $(0, 4)$: $b = 4$. $a = \\dfrac{0 - 4}{2 - 0} = \\dfrac{-4}{2} = -2$. Logo $f(x) = -2x + 4$.",
            },
            {
              id: "fp2q6",
              enunciado:
                "Para $f(x) = 5x - 10$, qual é o valor de $\\Delta y$ quando $x$ aumenta de $3$ para $6$?",
              alternativas: [
                { letra: "A", texto: "$\\Delta y = 3$" },
                { letra: "B", texto: "$\\Delta y = 5$" },
                { letra: "C", texto: "$\\Delta y = 15$" },
                { letra: "D", texto: "$\\Delta y = 10$" },
                { letra: "E", texto: "$\\Delta y = 30$" },
              ],
              gabarito: "C",
              explicacao:
                "$\\Delta x = 6 - 3 = 3$. Como $a = 5$: $\\Delta y = a \\cdot \\Delta x = 5 \\cdot 3 = 15$. Conferindo: $f(6) = 20$ e $f(3) = 5$; $20 - 5 = 15$ ✅.",
            },
            {
              id: "fp2q7",
              enunciado:
                "A reta que representa $f(x) = mx + 3$ passa pelo ponto $(2, 9)$. Qual é $m$?",
              alternativas: [
                { letra: "A", texto: "$m = 2$" },
                { letra: "B", texto: "$m = 3$" },
                { letra: "C", texto: "$m = 6$" },
                { letra: "D", texto: "$m = 4$" },
                { letra: "E", texto: "$m = 9$" },
              ],
              gabarito: "B",
              explicacao:
                "$f(2) = 9 \\implies 2m + 3 = 9 \\implies 2m = 6 \\implies m = 3$.",
            },
            {
              id: "fp2q8",
              enunciado:
                "Duas funções afim têm o mesmo coeficiente angular $a = 2$, mas coeficientes lineares diferentes: $b_1 = 1$ e $b_2 = -3$. Como seus gráficos se relacionam?",
              alternativas: [
                { letra: "A", texto: "As retas se intersectam em um ponto." },
                { letra: "B", texto: "As retas são perpendiculares." },
                { letra: "C", texto: "As retas são paralelas (e distintas)." },
                { letra: "D", texto: "As retas são coincidentes." },
                { letra: "E", texto: "Impossível determinar sem mais informações." },
              ],
              gabarito: "C",
              explicacao:
                "Duas retas com o mesmo coeficiente angular $a$ e coeficientes lineares diferentes são **paralelas** — mesma inclinação, mas em alturas diferentes no plano. Só seriam coincidentes se $b_1 = b_2$ também.",
            },
            {
              id: "fp2q9",
              enunciado:
                "O gráfico de $f(x) = ax + b$ corta os eixos nos pontos $(3, 0)$ e $(0, -6)$. Qual é o coeficiente angular?",
              alternativas: [
                { letra: "A", texto: "$a = 3$" },
                { letra: "B", texto: "$a = -2$" },
                { letra: "C", texto: "$a = 2$" },
                { letra: "D", texto: "$a = 6$" },
                { letra: "E", texto: "$a = -3$" },
              ],
              gabarito: "C",
              explicacao:
                "Os dois pontos são $(3, 0)$ e $(0, -6)$. $b = -6$ (coeficiente linear). $a = \\dfrac{0 - (-6)}{3 - 0} = \\dfrac{6}{3} = 2$.",
            },
            {
              id: "fp2q10",
              enunciado:
                "Uma função afim $f$ é tal que $f(1) = 7$ e $f(4) = 16$. Qual é o valor de $f(10)$?",
              alternativas: [
                { letra: "A", texto: "$28$" },
                { letra: "B", texto: "$31$" },
                { letra: "C", texto: "$34$" },
                { letra: "D", texto: "$37$" },
                { letra: "E", texto: "$40$" },
              ],
              gabarito: "C",
              explicacao:
                "$a = \\dfrac{16 - 7}{4 - 1} = \\dfrac{9}{3} = 3$. Com $f(1)=7$: $3(1)+b=7 \\implies b=4$. Logo $f(x) = 3x + 4$. $f(10) = 30 + 4 = 34$.",
            },
          ],
        },

        // =====================================================================
        // Lição 3 — Zero da função e estudo do sinal
        // =====================================================================
        {
          slug: "zero-e-sinal",
          titulo: "Zero e estudo do sinal",
          resumo:
            "Calcule o zero de $f(x) = ax + b$ e determine os intervalos em que $f(x) > 0$ e $f(x) < 0$ — técnica essencial para inequações.",
          duracaoMinutos: 15,

          explicacao: `
### Zero da função afim

O **zero** (ou raiz) é o valor de $x$ que torna $f(x) = 0$:

$$
ax + b = 0 \\implies x_0 = -\\frac{b}{a}
$$

Geometricamente, $x_0$ é a **abscissa do ponto onde a reta cruza o eixo $x$**.

### Estudo do sinal

Depois de calcular o zero $x_0 = -b/a$, o sinal de $f(x)$ é determinado pelo **sinal de $a$**:

**Caso $a > 0$ (função crescente):**

$$
f(x) < 0 \\text{ para } x < x_0 \\qquad\\qquad f(x) > 0 \\text{ para } x > x_0
$$

**Caso $a < 0$ (função decrescente):**

$$
f(x) > 0 \\text{ para } x < x_0 \\qquad\\qquad f(x) < 0 \\text{ para } x > x_0
$$

Em ambos os casos, $f(x_0) = 0$.

### Tabela-resumo de sinais

| | $x < x_0$ | $x = x_0$ | $x > x_0$ |
|---|---|---|---|
| $a > 0$ | $f(x) < 0$ | $0$ | $f(x) > 0$ |
| $a < 0$ | $f(x) > 0$ | $0$ | $f(x) < 0$ |

### Uso em inequações

Para resolver $ax + b > 0$ (ou $< 0$, $\\geq 0$, $\\leq 0$), basta:

1. Calcular $x_0 = -b/a$.
2. Usar a tabela acima para ler o intervalo da solução.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Zero e estudo do sinal completo",
              problema:
                "Determine o zero e faça o estudo do sinal de $f(x) = 2x - 6$.",
              resolucao: `
**Zero:** $2x - 6 = 0 \\implies x = 3$.

**Coeficiente angular:** $a = 2 > 0 \\implies$ função crescente.

**Estudo do sinal:**

- Para $x < 3$: $f(x) < 0$ (a reta está abaixo do eixo $x$).
- Para $x = 3$: $f(x) = 0$.
- Para $x > 3$: $f(x) > 0$ (a reta está acima do eixo $x$).

**Resposta:** $f(x) > 0 \\iff x > 3$ e $f(x) < 0 \\iff x < 3$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Inequação com função afim",
              problema:
                "Resolva a inequação $-3x + 9 > 0$.",
              resolucao: `
Identificamos $f(x) = -3x + 9$ com $a = -3 < 0$ (decrescente).

**Zero:** $-3x + 9 = 0 \\implies x = 3$.

**Estudo do sinal** (com $a < 0$):
- Para $x < 3$: $f(x) > 0$ ← é o que queremos!
- Para $x > 3$: $f(x) < 0$.

**Solução da inequação $-3x + 9 > 0$:**

$$
x < 3 \\quad \\text{ou, em notação de intervalo:} \\quad x \\in (-\\infty,\\, 3)
$$
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "fp3q1",
              enunciado: "Qual é o zero da função $f(x) = 3x - 9$?",
              alternativas: [
                { letra: "A", texto: "$x = 9$" },
                { letra: "B", texto: "$x = -3$" },
                { letra: "C", texto: "$x = 3$" },
                { letra: "D", texto: "$x = -9$" },
                { letra: "E", texto: "$x = 1$" },
              ],
              gabarito: "C",
              explicacao:
                "$3x - 9 = 0 \\implies 3x = 9 \\implies x = 3$.",
            },
            {
              id: "fp3q2",
              enunciado:
                "Para $f(x) = -x + 5$, em qual intervalo $f(x) > 0$?",
              alternativas: [
                { letra: "A", texto: "$x > 5$" },
                { letra: "B", texto: "$x < -5$" },
                { letra: "C", texto: "$x > -5$" },
                { letra: "D", texto: "$x < 5$" },
                { letra: "E", texto: "$x = 5$" },
              ],
              gabarito: "D",
              explicacao:
                "Zero: $-x + 5 = 0 \\implies x = 5$. $a = -1 < 0$ (decrescente) $\\implies f(x) > 0$ para $x < x_0 = 5$. Resposta: $x < 5$.",
            },
            {
              id: "fp3q3",
              enunciado:
                "Resolva a inequação $2x - 10 \\geq 0$.",
              alternativas: [
                { letra: "A", texto: "$x \\leq 5$" },
                { letra: "B", texto: "$x \\geq 10$" },
                { letra: "C", texto: "$x \\geq 5$" },
                { letra: "D", texto: "$x \\leq -5$" },
                { letra: "E", texto: "$x > 5$" },
              ],
              gabarito: "C",
              explicacao:
                "Zero: $x_0 = 10/2 = 5$. $a = 2 > 0 \\implies f(x) \\geq 0$ para $x \\geq 5$. O sinal de igualdade é incluído (o zero também satisfaz $\\geq 0$).",
            },
            {
              id: "fp3q4",
              enunciado:
                "Sobre a função $f(x) = -4x + 8$, é correto afirmar que $f(x) < 0$ quando:",
              alternativas: [
                { letra: "A", texto: "$x < 2$" },
                { letra: "B", texto: "$x > 8$" },
                { letra: "C", texto: "$x < -2$" },
                { letra: "D", texto: "$x > 2$" },
                { letra: "E", texto: "$x = 2$" },
              ],
              gabarito: "D",
              explicacao:
                "Zero: $-4x + 8 = 0 \\implies x = 2$. $a = -4 < 0$ (decrescente) $\\implies f(x) < 0$ para $x > 2$.",
            },
            {
              id: "fp3q5",
              enunciado:
                "Para qual valor de $x$ a função $f(x) = 5x + 20$ muda de sinal?",
              alternativas: [
                { letra: "A", texto: "$x = 20$" },
                { letra: "B", texto: "$x = 5$" },
                { letra: "C", texto: "$x = -4$" },
                { letra: "D", texto: "$x = -20$" },
                { letra: "E", texto: "$x = 4$" },
              ],
              gabarito: "C",
              explicacao:
                "A função muda de sinal no seu zero: $5x + 20 = 0 \\implies x = -4$. Para $x < -4$: $f < 0$; para $x > -4$: $f > 0$.",
            },
            {
              id: "fp3q6",
              enunciado:
                "Em qual intervalo a função $f(x) = 6 - 2x$ é positiva?",
              alternativas: [
                { letra: "A", texto: "$x > 3$" },
                { letra: "B", texto: "$x > 6$" },
                { letra: "C", texto: "$x < 6$" },
                { letra: "D", texto: "$x < 3$" },
                { letra: "E", texto: "$x < -3$" },
              ],
              gabarito: "D",
              explicacao:
                "Reescrevendo: $f(x) = -2x + 6$, com $a = -2 < 0$ e zero $x_0 = 3$. Como $a < 0$, $f(x) > 0$ para $x < 3$.",
            },
            {
              id: "fp3q7",
              enunciado:
                "Uma função afim tem zero em $x = -2$ e coeficiente angular $a = 3$. Para quais $x$ a função é negativa?",
              alternativas: [
                { letra: "A", texto: "$x > -2$" },
                { letra: "B", texto: "$x > 2$" },
                { letra: "C", texto: "$x < 2$" },
                { letra: "D", texto: "$x < -2$" },
                { letra: "E", texto: "$x > 3$" },
              ],
              gabarito: "D",
              explicacao:
                "$a = 3 > 0$ (crescente) e zero $x_0 = -2$. Função crescente é negativa antes do zero: $f(x) < 0 \\iff x < -2$.",
            },
            {
              id: "fp3q8",
              enunciado:
                "Qual é o conjunto solução de $\\dfrac{x}{2} - 1 > 0$?",
              alternativas: [
                { letra: "A", texto: "$\\{x \\in \\mathbb{R} \\mid x > 1\\}$" },
                { letra: "B", texto: "$\\{x \\in \\mathbb{R} \\mid x > 2\\}$" },
                { letra: "C", texto: "$\\{x \\in \\mathbb{R} \\mid x < 2\\}$" },
                { letra: "D", texto: "$\\{x \\in \\mathbb{R} \\mid x > 0\\}$" },
                { letra: "E", texto: "$\\{x \\in \\mathbb{R} \\mid x < -2\\}$" },
              ],
              gabarito: "B",
              explicacao:
                "Zero: $\\frac{x}{2} - 1 = 0 \\implies x = 2$. $a = \\frac{1}{2} > 0$ (crescente) $\\implies f(x) > 0$ para $x > 2$.",
            },
            {
              id: "fp3q9",
              enunciado:
                "Para $f(x) = 3x + k$, sabe-se que $f(x) > 0$ para todo $x > -5$. Qual é o valor de $k$?",
              alternativas: [
                { letra: "A", texto: "$k = -3$" },
                { letra: "B", texto: "$k = 5$" },
                { letra: "C", texto: "$k = 15$" },
                { letra: "D", texto: "$k = -15$" },
                { letra: "E", texto: "$k = 3$" },
              ],
              gabarito: "C",
              explicacao:
                "O zero da função é $x_0 = -k/3$. Para que $f(x) > 0$ exatamente para $x > -5$, o zero deve ser $x_0 = -5$. Logo: $-k/3 = -5 \\implies k = 15$.",
            },
            {
              id: "fp3q10",
              enunciado:
                "(ENEM adaptado) Uma prestadora de serviços cobra uma taxa de visita de R\\$\\,50{,}00 mais R\\$\\,30{,}00 por hora de trabalho. A partir de quantas horas de trabalho o custo supera R\\$\\,200{,}00?",
              alternativas: [
                { letra: "A", texto: "A partir de $4$ horas." },
                { letra: "B", texto: "A partir de $5$ horas." },
                { letra: "C", texto: "A partir de $6$ horas." },
                { letra: "D", texto: "A partir de $7$ horas." },
                { letra: "E", texto: "A partir de $8$ horas." },
              ],
              gabarito: "C",
              explicacao:
                "Custo: $C(h) = 30h + 50$. Queremos $C(h) > 200$: $30h + 50 > 200 \\implies 30h > 150 \\implies h > 5$. Com exatamente $5$ horas, $C(5) = 150 + 50 = 200$ — igual, não supera. A primeira quantidade de horas inteiras em que o custo **supera** R\\$\\,200 é $h = 6$: $C(6) = 180 + 50 = 230 > 200$ ✅. Resposta: **a partir de 6 horas**.",
            },
          ],
        },
      ],
    },
  ],
};
