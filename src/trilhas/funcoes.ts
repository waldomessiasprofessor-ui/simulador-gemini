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
\\underbrace{x \\in D_f}_{\\text{domínio}} \\xrightarrow{\\;f\\;} \\underbrace{f(x) \\in \\text{Im}_f \\subseteq CD}_{\\text{imagem} \\subseteq \\text{contradomínio}}
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

Dado $f(x) = \\text{lei}$, o **valor numérico** em $x = a$ é obtido substituindo cada ocorrência de $x$ por $a$:

$$
f(a) = \\text{(substitui } x \\leftarrow a \\text{ na lei)}
$$

**Exemplo:** Se $f(x) = 3x^2 - x + 2$, então:

$$
f(4) = 3(4)^2 - 4 + 2 = 3 \\cdot 16 - 4 + 2 = 48 - 4 + 2 = 46
$$

### Cuidado com argumentos compostos

Se o argumento não for apenas $x$, mas uma expressão, substitua **tudo** de uma vez:

$$
f(2t - 1) \\Rightarrow \\text{substitui } x \\leftarrow (2t - 1) \\text{ em cada } x \\text{ da lei}
$$

**Exemplo:** Com $f(x) = x + 3$:

$$
f(2t - 1) = (2t - 1) + 3 = 2t + 2
$$

### Resolvendo $f(x) = k$

A pergunta inversa é: "para qual $x$ a função vale $k$?" Para isso, **iguale a lei a $k$** e resolva a equação:

$$
f(x) = k \\implies \\text{lei}(x) = k \\implies \\text{resolve a equação}
$$

**Exemplo:** $f(x) = 2x - 3$ e queremos $f(x) = 7$:

$$
2x - 3 = 7 \\implies 2x = 10 \\implies x = 5
$$

### Igualdade de funções

Se $f(a) = f(b)$ e $f$ é injetora (cada $y$ tem no máximo um $x$), então $a = b$. Mas se $f$ não for injetora (ex.: $f(x)=x^2$), pode haver $a \\neq b$ com $f(a)=f(b)$.
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
  ],
};
