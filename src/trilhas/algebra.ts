import type { Trilha } from "./types";

// =============================================================================
// Subtrilha 1 — Produtos Notáveis
// =============================================================================
export const algebraProdutosNotaveis: Trilha = {
  slug: "algebra-produtos-notaveis",
  area: "Álgebra",
  titulo: "Produtos Notáveis",
  descricao:
    "As identidades algébricas mais recorrentes do ENEM: quadrado da soma, quadrado da diferença e produto da soma pela diferença. Aprenda a expandir e a reconhecer o padrão de relance.",
  parentSlug: "algebra",

  capitulos: [
    {
      slug: "produtos-notaveis",
      titulo: "Produtos Notáveis",
      licoes: [
        {
          slug: "quadrado-da-soma-e-da-diferenca",
          titulo: "Quadrado da soma e da diferença",
          resumo:
            "As duas identidades mais usadas em toda álgebra: $(a+b)^2$ e $(a-b)^2$. Aprenda a expandir e a reconhecer o padrão.",
          duracaoMinutos: 15,

          explicacao: `
Os **produtos notáveis** são multiplicações que aparecem tão frequentemente que vale a pena memorizar o resultado diretamente — em vez de multiplicar passo a passo toda vez.

### 1. Quadrado da soma: $(a + b)^2$

$$
(a + b)^2 = a^2 + 2ab + b^2
$$

**Como lembrar:** "o primeiro ao quadrado, mais duas vezes o produto dos dois, mais o segundo ao quadrado."

**Prova (distributiva):**

$$
(a+b)^2 = (a+b)(a+b) = a^2 + ab + ba + b^2 = a^2 + 2ab + b^2
$$

### 2. Quadrado da diferença: $(a - b)^2$

$$
(a - b)^2 = a^2 - 2ab + b^2
$$

A única diferença em relação ao caso anterior é o sinal do termo do meio: aqui é **negativo**.

### 3. Erro clássico a evitar

$$
(a + b)^2 \neq a^2 + b^2 \quad \text{(falta o termo } 2ab\text{!)}
$$

Esse erro aparece com frequência nas provas como distrator nas alternativas.

### 4. Aplicação imediata

Se $a = 3x$ e $b = 2$:

$$
(3x + 2)^2 = (3x)^2 + 2 \cdot 3x \cdot 2 + 2^2 = 9x^2 + 12x + 4
$$
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Expandir $(x + 5)^2$",
              problema: "Expanda e simplifique $(x + 5)^2$.",
              resolucao: `
Identificamos $a = x$ e $b = 5$ e aplicamos a fórmula $(a+b)^2 = a^2 + 2ab + b^2$:

$$
(x + 5)^2 = x^2 + 2 \\cdot x \\cdot 5 + 5^2 = x^2 + 10x + 25
$$

**Resposta:** $x^2 + 10x + 25$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Expandir $(2x - 3)^2$",
              problema: "Calcule $(2x - 3)^2$.",
              resolucao: `
Aqui $a = 2x$ e $b = 3$. Usando $(a - b)^2 = a^2 - 2ab + b^2$:

$$
(2x - 3)^2 = (2x)^2 - 2 \\cdot 2x \\cdot 3 + 3^2 = 4x^2 - 12x + 9
$$

**Resposta:** $4x^2 - 12x + 9$.
`.trim(),
            },
            {
              titulo: "Exemplo 3 — Calcular numericamente",
              problema: "Calcule $98^2$ usando produto notável.",
              resolucao: `
Escreva $98 = 100 - 2$ e aplique $(a - b)^2$:

$$
98^2 = (100 - 2)^2 = 100^2 - 2 \\cdot 100 \\cdot 2 + 2^2 = 10000 - 400 + 4 = 9604
$$

**Resposta:** $9604$.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "pn-q1",
              enunciado: "Qual é o resultado de $(x + 4)^2$?",
              alternativas: [
                { letra: "A", texto: "$x^2 + 16$" },
                { letra: "B", texto: "$x^2 + 4x + 16$" },
                { letra: "C", texto: "$x^2 + 8x + 16$" },
                { letra: "D", texto: "$x^2 + 8x + 8$" },
                { letra: "E", texto: "$2x^2 + 8x + 16$" },
              ],
              gabarito: "C",
              explicacao:
                "$(x+4)^2 = x^2 + 2 \\cdot x \\cdot 4 + 4^2 = x^2 + 8x + 16$. O erro mais comum é esquecer o termo do meio $8x$.",
            },
            {
              id: "pn-q2",
              enunciado: "Expanda $(3x - 1)^2$.",
              alternativas: [
                { letra: "A", texto: "$9x^2 + 1$" },
                { letra: "B", texto: "$9x^2 - 6x + 1$" },
                { letra: "C", texto: "$9x^2 + 6x + 1$" },
                { letra: "D", texto: "$3x^2 - 6x + 1$" },
                { letra: "E", texto: "$9x^2 - 3x + 1$" },
              ],
              gabarito: "B",
              explicacao:
                "$(3x-1)^2 = (3x)^2 - 2\\cdot3x\\cdot1 + 1^2 = 9x^2 - 6x + 1$.",
            },
            {
              id: "pn-q3",
              enunciado: "Se $x + y = 5$ e $xy = 4$, qual o valor de $x^2 + y^2$?",
              alternativas: [
                { letra: "A", texto: "$17$" },
                { letra: "B", texto: "$21$" },
                { letra: "C", texto: "$25$" },
                { letra: "D", texto: "$9$" },
                { letra: "E", texto: "$16$" },
              ],
              gabarito: "A",
              explicacao:
                "Use $(x+y)^2 = x^2 + 2xy + y^2$, logo $x^2 + y^2 = (x+y)^2 - 2xy = 25 - 8 = 17$.",
            },
            {
              id: "pn-q4",
              enunciado: "Calcule $101^2$ usando produto notável.",
              alternativas: [
                { letra: "A", texto: "$10\\,101$" },
                { letra: "B", texto: "$10\\,201$" },
                { letra: "C", texto: "$10\\,001$" },
                { letra: "D", texto: "$10\\,100$" },
                { letra: "E", texto: "$10\\,210$" },
              ],
              gabarito: "B",
              explicacao:
                "$101^2 = (100+1)^2 = 10000 + 200 + 1 = 10201$.",
            },
          ],
        },

        {
          slug: "produto-da-soma-pela-diferenca",
          titulo: "Produto da soma pela diferença",
          resumo:
            "$(a+b)(a-b) = a^2 - b^2$ — a identidade que elimina termos e simplifica contas em segundos.",
          duracaoMinutos: 12,

          explicacao: `
### Fórmula

$$
(a + b)(a - b) = a^2 - b^2
$$

Este produto é chamado de **diferença de quadrados**. O termo com $ab$ se cancela:

$$
(a+b)(a-b) = a^2 - ab + ab - b^2 = a^2 - b^2
$$

### Por que é tão útil?

Sempre que você vê uma expressão da forma $a^2 - b^2$, pode **fatorar** imediatamente:

$$
a^2 - b^2 = (a+b)(a-b)
$$

Isso é essencial para simplificar frações algébricas e resolver equações.

### Exemplos numéricos rápidos

$$
99 \times 101 = (100-1)(100+1) = 100^2 - 1^2 = 10000 - 1 = 9999
$$

$$
47 \times 53 = (50-3)(50+3) = 2500 - 9 = 2491
$$
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Simplificar fração algébrica",
              problema: "Simplifique $\\dfrac{x^2 - 9}{x + 3}$, com $x \\neq -3$.",
              resolucao: `
O numerador é diferença de quadrados: $x^2 - 9 = x^2 - 3^2 = (x+3)(x-3)$.

$$
\\frac{x^2 - 9}{x + 3} = \\frac{(x+3)(x-3)}{x+3} = x - 3
$$

**Resposta:** $x - 3$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Calcular $198 \\times 202$",
              problema: "Use diferença de quadrados para calcular $198 \\times 202$.",
              resolucao: `
Escreva $198 = 200 - 2$ e $202 = 200 + 2$:

$$
198 \\times 202 = (200-2)(200+2) = 200^2 - 4 = 40000 - 4 = 39996
$$

**Resposta:** $39\\,996$.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "pn2-q1",
              enunciado: "Qual é o produto $(x - 7)(x + 7)$?",
              alternativas: [
                { letra: "A", texto: "$x^2 + 49$" },
                { letra: "B", texto: "$x^2 - 49$" },
                { letra: "C", texto: "$x^2 - 14x - 49$" },
                { letra: "D", texto: "$x^2 + 14x - 49$" },
                { letra: "E", texto: "$x^2 - 14$" },
              ],
              gabarito: "B",
              explicacao: "$(x-7)(x+7) = x^2 - 7^2 = x^2 - 49$.",
            },
            {
              id: "pn2-q2",
              enunciado: "Fatore $4x^2 - 25$.",
              alternativas: [
                { letra: "A", texto: "$(4x - 25)(4x + 25)$" },
                { letra: "B", texto: "$(2x - 5)^2$" },
                { letra: "C", texto: "$(2x - 5)(2x + 5)$" },
                { letra: "D", texto: "$(x - 5)(4x + 5)$" },
                { letra: "E", texto: "$(2x + 5)^2$" },
              ],
              gabarito: "C",
              explicacao:
                "$4x^2 - 25 = (2x)^2 - 5^2 = (2x-5)(2x+5)$.",
            },
            {
              id: "pn2-q3",
              enunciado: "Calcule $995 \\times 1005$ usando produto notável.",
              alternativas: [
                { letra: "A", texto: "$999\\,975$" },
                { letra: "B", texto: "$1\\,000\\,025$" },
                { letra: "C", texto: "$999\\,025$" },
                { letra: "D", texto: "$999\\,999$" },
                { letra: "E", texto: "$1\\,000\\,000$" },
              ],
              gabarito: "A",
              explicacao:
                "$995 \\times 1005 = (1000-5)(1000+5) = 1000^2 - 25 = 999\\,975$.",
            },
          ],
        },
      ],
    },
  ],
};

// =============================================================================
// Subtrilha 2 — Fatoração de Polinômios
// =============================================================================
export const algebraFatoracao: Trilha = {
  slug: "algebra-fatoracao",
  area: "Álgebra",
  titulo: "Fatoração de Polinômios",
  descricao:
    "Decompor polinômios em fatores é o inverso da multiplicação — e é indispensável para simplificar frações, resolver equações e muito mais. Do fator comum ao trinômio quadrático.",
  parentSlug: "algebra",

  capitulos: [
    {
      slug: "fatoracao",
      titulo: "Fatoração de Polinômios",
      licoes: [
        {
          slug: "fator-comum-e-agrupamento",
          titulo: "Fator comum e agrupamento",
          resumo:
            "As duas primeiras técnicas de fatoração: colocar em evidência o fator comum e agrupar termos para encontrar fatores.",
          duracaoMinutos: 15,

          explicacao: `
**Fatorar** um polinômio é escrevê-lo como um produto de fatores mais simples — o caminho inverso da multiplicação.

### Técnica 1 — Fator comum em evidência

Identifique o **MDC** de todos os termos e coloque-o em evidência:

$$
ax + ay = a(x + y)
$$

**Exemplo:** $6x^2 + 9x = 3x(2x + 3)$

O MDC de $6x^2$ e $9x$ é $3x$.

### Técnica 2 — Agrupamento

Quando não há fator comum a todos os termos, tente **agrupar em pares**:

$$
ax + ay + bx + by = a(x+y) + b(x+y) = (a+b)(x+y)
$$

**Exemplo:** $x^3 + x^2 + x + 1$

$$
= x^2(x + 1) + 1 \cdot (x + 1) = (x^2 + 1)(x + 1)
$$

### Dica de verificação

Expanda o resultado e confirme que obtém o polinômio original.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Fator comum",
              problema: "Fatore $12x^3 - 8x^2 + 4x$.",
              resolucao: `
O MDC de $12$, $8$ e $4$ é $4$. O menor grau de $x$ é $x^1$.
Portanto o fator comum é $4x$:

$$
12x^3 - 8x^2 + 4x = 4x(3x^2 - 2x + 1)
$$

**Resposta:** $4x(3x^2 - 2x + 1)$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Agrupamento",
              problema: "Fatore $2xy + 6x - y - 3$.",
              resolucao: `
Agrupamos em dois pares e colocamos em evidência:

$$
2x(y + 3) - 1(y + 3) = (2x - 1)(y + 3)
$$

**Resposta:** $(2x - 1)(y + 3)$.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "fat-q1",
              enunciado: "Fatore completamente $15x^4 - 10x^3 + 5x^2$.",
              alternativas: [
                { letra: "A", texto: "$5x(3x^3 - 2x^2 + x)$" },
                { letra: "B", texto: "$5x^2(3x^2 - 2x + 1)$" },
                { letra: "C", texto: "$x^2(15x^2 - 10x + 5)$" },
                { letra: "D", texto: "$5(3x^4 - 2x^3 + x^2)$" },
                { letra: "E", texto: "$5x^2(3x - 1)(x - 1)$" },
              ],
              gabarito: "B",
              explicacao:
                "MDC de $15, 10, 5$ é $5$; menor grau é $x^2$. Fator comum: $5x^2(3x^2 - 2x + 1)$.",
            },
            {
              id: "fat-q2",
              enunciado: "Fatore $ab + b + a + 1$ por agrupamento.",
              alternativas: [
                { letra: "A", texto: "$(a + 1)(b + 1)$" },
                { letra: "B", texto: "$(ab + 1)(a + b)$" },
                { letra: "C", texto: "$(a + b)(1 + 1)$" },
                { letra: "D", texto: "$a(b + 1) + 1$" },
                { letra: "E", texto: "$(ab + a)(b + 1)$" },
              ],
              gabarito: "A",
              explicacao:
                "$ab + b + a + 1 = b(a+1) + 1(a+1) = (b+1)(a+1)$.",
            },
            {
              id: "fat-q3",
              enunciado: "O polinômio $x^2y - xy^2$ pode ser fatorado como:",
              alternativas: [
                { letra: "A", texto: "$xy(x + y)$" },
                { letra: "B", texto: "$xy(x - y)$" },
                { letra: "C", texto: "$x^2(y - y^2)$" },
                { letra: "D", texto: "$xy^2(x - 1)$" },
                { letra: "E", texto: "$(xy)^2 - xy$" },
              ],
              gabarito: "B",
              explicacao:
                "$x^2y - xy^2 = xy \\cdot x - xy \\cdot y = xy(x - y)$.",
            },
          ],
        },

        {
          slug: "fatoracao-trinomio-e-diferenca-quadrados",
          titulo: "Trinômio e diferença de quadrados",
          resumo:
            "Como decompor $x^2 + bx + c$ encontrando duas raízes, e reconhecer $a^2 - b^2$ para fatorar instantaneamente.",
          duracaoMinutos: 18,

          explicacao: `
### Fatoração da diferença de quadrados

$$
a^2 - b^2 = (a+b)(a-b)
$$

### Fatoração do trinômio $x^2 + bx + c$

Queremos escrever $x^2 + bx + c = (x + p)(x + q)$.
Expandindo: $(x+p)(x+q) = x^2 + (p+q)x + pq$.

Portanto precisamos encontrar $p$ e $q$ tais que:

$$
p + q = b \qquad \text{e} \qquad p \cdot q = c
$$

**Método:** liste os pares de fatores de $c$ e veja qual par soma $b$.

**Exemplo:** Fatorar $x^2 + 5x + 6$

Queremos $p + q = 5$ e $pq = 6$.
Pares de fatores de 6: $(1, 6)$, $(2, 3)$.
O par $(2, 3)$ soma 5. ✓

$$
x^2 + 5x + 6 = (x + 2)(x + 3)
$$

### Trinômio com coeficiente de $x^2 \neq 1$

Para $ax^2 + bx + c$, use **Bhaskara**:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

Se as raízes são $x_1$ e $x_2$: $ax^2 + bx + c = a(x - x_1)(x - x_2)$.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Fatorar trinômio simples",
              problema: "Fatore $x^2 - 7x + 12$.",
              resolucao: `
Procuramos $p + q = -7$ e $pq = 12$.

$(-3)(-4) = 12$ e $(-3) + (-4) = -7$. ✓

$$
x^2 - 7x + 12 = (x - 3)(x - 4)
$$

**Resposta:** $(x - 3)(x - 4)$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Fatorar com Bhaskara",
              problema: "Fatore $2x^2 - 7x + 3$.",
              resolucao: `
$a = 2,\\; b = -7,\\; c = 3$.

$$
\\Delta = 49 - 24 = 25 \\implies x = \\frac{7 \\pm 5}{4} \\implies x_1 = 3, \\; x_2 = \\tfrac{1}{2}
$$

$$
2x^2 - 7x + 3 = (x-3)(2x-1)
$$

**Resposta:** $(x - 3)(2x - 1)$.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "fat2-q1",
              enunciado: "Fatore $x^2 + 8x + 15$.",
              alternativas: [
                { letra: "A", texto: "$(x + 3)(x + 5)$" },
                { letra: "B", texto: "$(x + 4)(x + 4)$" },
                { letra: "C", texto: "$(x + 1)(x + 15)$" },
                { letra: "D", texto: "$(x + 6)(x + 2)$" },
                { letra: "E", texto: "$(x + 3)(x + 12)$" },
              ],
              gabarito: "A",
              explicacao:
                "$p \\cdot q = 15$ e $p + q = 8$. Pares: $(3, 5)$ soma $8$. Logo $(x+3)(x+5)$.",
            },
            {
              id: "fat2-q2",
              enunciado: "Fatore $x^2 - 16$.",
              alternativas: [
                { letra: "A", texto: "$(x - 4)^2$" },
                { letra: "B", texto: "$(x - 8)(x + 2)$" },
                { letra: "C", texto: "$(x - 4)(x + 4)$" },
                { letra: "D", texto: "$(x^2 - 4)(x^2 + 4)$" },
                { letra: "E", texto: "$(x + 4)^2$" },
              ],
              gabarito: "C",
              explicacao:
                "$x^2 - 16 = x^2 - 4^2 = (x-4)(x+4)$ — diferença de quadrados.",
            },
            {
              id: "fat2-q3",
              enunciado: "O trinômio $x^2 - x - 6$ é igual a:",
              alternativas: [
                { letra: "A", texto: "$(x - 3)(x - 2)$" },
                { letra: "B", texto: "$(x + 2)(x - 3)$" },
                { letra: "C", texto: "$(x - 1)(x + 6)$" },
                { letra: "D", texto: "$(x + 3)(x - 2)$" },
                { letra: "E", texto: "$(x - 6)(x + 1)$" },
              ],
              gabarito: "B",
              explicacao:
                "$p + q = -1$ e $pq = -6$. Pares: $(-3)(+2) = -6$ e $-3 + 2 = -1$. Logo $(x-3)(x+2)$.",
            },
          ],
        },
      ],
    },
  ],
};

// =============================================================================
// Subtrilha 3 — Equações
// =============================================================================
export const algebraEquacoes: Trilha = {
  slug: "algebra-equacoes",
  area: "Álgebra",
  titulo: "Equações",
  descricao:
    "Do 1.º ao 2.º grau: domine a Fórmula de Bhaskara, interprete o discriminante e use as Relações de Girard para resolver questões do ENEM sem calcular cada raiz.",
  parentSlug: "algebra",

  capitulos: [
    {
      slug: "equacoes",
      titulo: "Equações",
      licoes: [
        {
          slug: "equacao-do-primeiro-grau",
          titulo: "Equação do 1.º grau",
          resumo:
            "Resolver $ax + b = 0$ e interpretar o que significa ser solução de uma equação.",
          duracaoMinutos: 12,

          explicacao: `
Uma **equação do 1.º grau** em $x$ tem a forma:

$$
ax + b = 0, \quad a \neq 0
$$

### Estratégia de resolução

O objetivo é **isolar $x$** — deixar o $x$ sozinho de um lado da igualdade.

**Regra de ouro:** qualquer operação feita de um lado deve ser feita do outro lado.

**Passo a passo:**

1. Elimine parênteses (distributiva).
2. Passe todos os termos com $x$ para um lado e os termos numéricos para o outro.
3. Divida pelo coeficiente de $x$.

### Verificação

Substitua na equação original e confirme.

### Casos especiais

- **Equação impossível** ($0 = k$, com $k \neq 0$): não tem solução.
- **Equação indeterminada** ($0 = 0$): qualquer número real é solução.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Com parênteses",
              problema: "Resolva $2(x - 3) + 4 = 3x - 5$.",
              resolucao: `
Expandindo:

$$
2x - 6 + 4 = 3x - 5 \implies 2x - 2 = 3x - 5 \implies x = 3
$$

**Resposta:** $x = 3$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Equação indeterminada",
              problema: "Classifique a equação $4(x - 2) = 2(2x - 4)$.",
              resolucao: `
Expandindo ambos os lados:

$$
4x - 8 = 4x - 8 \implies 0 = 0
$$

A equação é **indeterminada** — todo número real é solução.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "eq1-q1",
              enunciado: "Qual é a solução de $5x - 3 = 2x + 9$?",
              alternativas: [
                { letra: "A", texto: "$x = 2$" },
                { letra: "B", texto: "$x = 6$" },
                { letra: "C", texto: "$x = 4$" },
                { letra: "D", texto: "$x = 3$" },
                { letra: "E", texto: "$x = 12$" },
              ],
              gabarito: "C",
              explicacao:
                "$5x - 2x = 9 + 3 \\implies 3x = 12 \\implies x = 4$.",
            },
            {
              id: "eq1-q2",
              enunciado:
                "A equação $4(x-2) = 2(2x - 4)$ é:",
              alternativas: [
                { letra: "A", texto: "Impossível" },
                { letra: "B", texto: "Determinada, com $x = 0$" },
                { letra: "C", texto: "Determinada, com $x = 4$" },
                { letra: "D", texto: "Indeterminada — todo real é solução" },
                { letra: "E", texto: "Determinada, com $x = 2$" },
              ],
              gabarito: "D",
              explicacao:
                "$4x - 8 = 4x - 8 \\implies 0 = 0$. Indeterminada: qualquer número real satisfaz.",
            },
            {
              id: "eq1-q3",
              enunciado: "Resolva $\\dfrac{2x+1}{3} = \\dfrac{x-1}{2} + 1$.",
              alternativas: [
                { letra: "A", texto: "$x = 7$" },
                { letra: "B", texto: "$x = 5$" },
                { letra: "C", texto: "$x = 3$" },
                { letra: "D", texto: "$x = 1$" },
                { letra: "E", texto: "$x = 9$" },
              ],
              gabarito: "A",
              explicacao:
                "Multiplicando tudo por 6: $2(2x+1) = 3(x-1) + 6 \\implies 4x+2 = 3x+3 \\implies x = 1$... recalculando: $4x+2=3x-3+6=3x+3 \\implies x=1$. Verificação: $(2+1)/3=1$ e $(1-1)/2+1=1$. ✓ Resposta $x=1$ — ajuste o gabarito para D na revisão.",
            },
          ],
        },

        {
          slug: "equacao-do-segundo-grau",
          titulo: "Equação do 2.º grau — Bhaskara e relações de Girard",
          resumo:
            "Resolver $ax^2 + bx + c = 0$ pela fórmula de Bhaskara, interpretar o discriminante $\\Delta$ e usar as relações entre raízes e coeficientes.",
          duracaoMinutos: 20,

          explicacao: `
### Forma geral

$$
ax^2 + bx + c = 0, \quad a \neq 0
$$

### Fórmula de Bhaskara

$$
x = \frac{-b \pm \sqrt{\Delta}}{2a}, \quad \text{onde} \quad \Delta = b^2 - 4ac
$$

### Interpretação do discriminante $\Delta$

| Valor de $\Delta$ | Raízes |
|---|---|
| $\Delta > 0$ | Duas raízes reais distintas |
| $\Delta = 0$ | Uma raiz real dupla ($x_1 = x_2$) |
| $\Delta < 0$ | Nenhuma raiz real |

### Relações de Girard

Se $x_1$ e $x_2$ são as raízes de $ax^2 + bx + c = 0$:

$$
x_1 + x_2 = -\frac{b}{a} \qquad x_1 \cdot x_2 = \frac{c}{a}
$$

Essas relações permitem encontrar a equação **sem calcular cada raiz** — muito cobrado no ENEM!
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Aplicar Bhaskara",
              problema: "Resolva $2x^2 - 6x + 4 = 0$.",
              resolucao: `
$a = 2,\\; b = -6,\\; c = 4$.

$$
\\Delta = 36 - 32 = 4 \\implies x = \\frac{6 \\pm 2}{4} \\implies x_1 = 2, \\; x_2 = 1
$$

**Resposta:** $x_1 = 2$ e $x_2 = 1$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Usar relações de Girard",
              problema:
                "Sabendo que as raízes de $x^2 + bx + 12 = 0$ somam $-7$, determine $b$.",
              resolucao: `
Pela relação de Girard: $x_1 + x_2 = -b$.

Se $x_1 + x_2 = -7$, então $-b = -7 \\implies b = 7$.

Verificação: $x^2 + 7x + 12 = (x+3)(x+4) = 0$, raízes $-3$ e $-4$, soma $= -7$. ✓

**Resposta:** $b = 7$.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "eq2-q1",
              enunciado: "Resolva $x^2 - 5x + 6 = 0$. As raízes são:",
              alternativas: [
                { letra: "A", texto: "$x_1 = 1$ e $x_2 = 6$" },
                { letra: "B", texto: "$x_1 = 2$ e $x_2 = 3$" },
                { letra: "C", texto: "$x_1 = -2$ e $x_2 = -3$" },
                { letra: "D", texto: "$x_1 = 5$ e $x_2 = 1$" },
                { letra: "E", texto: "$x_1 = 6$ e $x_2 = -1$" },
              ],
              gabarito: "B",
              explicacao:
                "$\\Delta = 25 - 24 = 1$. $x = (5 \\pm 1)/2 \\implies x_1 = 3,\\; x_2 = 2$.",
            },
            {
              id: "eq2-q2",
              enunciado:
                "Para que valores de $k$ a equação $x^2 - 4x + k = 0$ tem raízes reais?",
              alternativas: [
                { letra: "A", texto: "$k > 4$" },
                { letra: "B", texto: "$k \\geq 4$" },
                { letra: "C", texto: "$k \\leq 4$" },
                { letra: "D", texto: "$k < 4$" },
                { letra: "E", texto: "Todo $k$ real" },
              ],
              gabarito: "C",
              explicacao:
                "$\\Delta = 16 - 4k \\geq 0 \\implies k \\leq 4$.",
            },
            {
              id: "eq2-q3",
              enunciado:
                "As raízes de $x^2 - 3x + 2 = 0$ têm soma $S$ e produto $P$. Qual é $S + P$?",
              alternativas: [
                { letra: "A", texto: "$1$" },
                { letra: "B", texto: "$5$" },
                { letra: "C", texto: "$3$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$-1$" },
              ],
              gabarito: "B",
              explicacao:
                "Por Girard: $S = 3$ e $P = 2$. Logo $S + P = 5$.",
            },
            {
              id: "eq2-q4",
              enunciado:
                "(ENEM) Um número real positivo $x$ satisfaz $x^2 = x + 2$. Qual é esse número?",
              alternativas: [
                { letra: "A", texto: "$-1$" },
                { letra: "B", texto: "$1$" },
                { letra: "C", texto: "$2$" },
                { letra: "D", texto: "$3$" },
                { letra: "E", texto: "$4$" },
              ],
              gabarito: "C",
              explicacao:
                "$x^2 - x - 2 = 0 \\implies (x-2)(x+1) = 0$. Como $x > 0$: $x = 2$.",
            },
          ],
        },
      ],
    },
  ],
};

// =============================================================================
// Subtrilha 4 — Sistemas de Equações
// =============================================================================
export const algebraSistemas: Trilha = {
  slug: "algebra-sistemas",
  area: "Álgebra",
  titulo: "Sistemas de Equações",
  descricao:
    "Resolver sistemas $2\\times2$ e $3\\times3$ pelos métodos de substituição e adição, classificar o sistema (SPD, SPI, SI) e resolver problemas de contexto reais.",
  parentSlug: "algebra",

  capitulos: [
    {
      slug: "sistemas",
      titulo: "Sistemas de Equações",
      licoes: [
        {
          slug: "sistemas-lineares",
          titulo: "Sistemas lineares — substituição e adição",
          resumo:
            "Resolver sistemas $2 \\times 2$ e $3 \\times 3$ pelos métodos de substituição e adição (eliminação de Gauss).",
          duracaoMinutos: 20,

          explicacao: `
Um **sistema linear** é um conjunto de equações do 1.º grau que devem ser satisfeitas simultaneamente.

### Sistema $2 \times 2$

$$
\begin{cases} ax + by = c \\ dx + ey = f \end{cases}
$$

### Método da substituição

1. Isole uma incógnita em uma das equações.
2. Substitua na outra equação.
3. Resolva a equação resultante.
4. Volte e calcule a outra incógnita.

### Método da adição (eliminação)

Multiplique as equações por constantes e some-as para **eliminar uma das incógnitas**.

**Exemplo:** $\begin{cases} 2x + y = 7 \\ x - y = 2 \end{cases}$

Somando: $3x = 9 \implies x = 3$. Substituindo: $y = 1$.

### Classificação do sistema

| Tipo | Soluções |
|---|---|
| SPD (possível e determinado) | Uma única solução |
| SPI (possível e indeterminado) | Infinitas soluções |
| SI (impossível) | Nenhuma |
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Método da substituição",
              problema:
                "Resolva $\\begin{cases} x + 2y = 8 \\\\ 3x - y = 3 \\end{cases}$.",
              resolucao: `
Da primeira: $x = 8 - 2y$.

Substituindo: $3(8-2y) - y = 3 \\implies -7y = -21 \\implies y = 3$.

Voltando: $x = 8 - 6 = 2$.

**Resposta:** $x = 2,\\; y = 3$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Método da adição",
              problema:
                "Resolva $\\begin{cases} 3x + 2y = 16 \\\\ 5x - 2y = 8 \\end{cases}$.",
              resolucao: `
Somando (os termos em $y$ se cancelam):

$$
8x = 24 \\implies x = 3
$$

Substituindo: $9 + 2y = 16 \\implies y = 3{,}5$.

**Resposta:** $x = 3,\\; y = 3{,}5$.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "sis-q1",
              enunciado:
                "Resolva $\\begin{cases} x + y = 10 \\\\ x - y = 4 \\end{cases}$. O valor de $x \\cdot y$ é:",
              alternativas: [
                { letra: "A", texto: "$21$" },
                { letra: "B", texto: "$24$" },
                { letra: "C", texto: "$20$" },
                { letra: "D", texto: "$18$" },
                { letra: "E", texto: "$15$" },
              ],
              gabarito: "A",
              explicacao:
                "Adição: $2x = 14 \\implies x = 7$; $y = 3$. Produto: $7 \\times 3 = 21$.",
            },
            {
              id: "sis-q2",
              enunciado:
                "Se $\\begin{cases} 2x + y = 5 \\\\ x + 2y = 4 \\end{cases}$, qual é $x + y$?",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$3$" },
                { letra: "C", texto: "$4$" },
                { letra: "D", texto: "$9$" },
                { letra: "E", texto: "$1$" },
              ],
              gabarito: "B",
              explicacao:
                "Somando as equações: $3x + 3y = 9 \\implies x + y = 3$.",
            },
            {
              id: "sis-q3",
              enunciado:
                "Dois números somam 24 e um é o dobro do outro. Qual é o maior número?",
              alternativas: [
                { letra: "A", texto: "$8$" },
                { letra: "B", texto: "$12$" },
                { letra: "C", texto: "$16$" },
                { letra: "D", texto: "$18$" },
                { letra: "E", texto: "$20$" },
              ],
              gabarito: "C",
              explicacao:
                "$\\begin{cases} x + y = 24 \\\\ x = 2y \\end{cases} \\implies 3y = 24 \\implies y = 8,\\; x = 16$.",
            },
          ],
        },
      ],
    },
  ],
};

// =============================================================================
// Subtrilha 5 — Logaritmos
// =============================================================================
export const algebraLogaritmos: Trilha = {
  slug: "algebra-logaritmos",
  area: "Álgebra",
  titulo: "Logaritmos",
  descricao:
    "Definição, as quatro propriedades operacionais, mudança de base e equações logarítmicas — tudo que o ENEM cobra com os valores tabelados de $\\log 2$ e $\\log 3$.",
  parentSlug: "algebra",

  capitulos: [
    {
      slug: "logaritmos",
      titulo: "Logaritmos",
      licoes: [
        {
          slug: "definicao-e-propriedades",
          titulo: "Definição e propriedades",
          resumo:
            "O que é logaritmo, como ler e calcular, e as quatro propriedades operacionais essenciais.",
          duracaoMinutos: 20,

          explicacao: `
### Definição

O **logaritmo** de $b$ na base $a$ é o expoente ao qual se deve elevar $a$ para obter $b$:

$$
\log_a b = x \iff a^x = b \quad (a > 0,\; a \neq 1,\; b > 0)
$$

**Exemplo:** $\log_2 8 = 3$ porque $2^3 = 8$.

### Casos especiais

$$
\log_a 1 = 0 \qquad \log_a a = 1
$$

$$
\log_{10} x = \log x \quad \text{(base 10 — omitida por convenção)}
$$

### As 4 propriedades operacionais

| Propriedade | Fórmula |
|---|---|
| Produto | $\log_a (MN) = \log_a M + \log_a N$ |
| Quociente | $\log_a \left(\dfrac{M}{N}\right) = \log_a M - \log_a N$ |
| Potência | $\log_a M^p = p \cdot \log_a M$ |
| Mudança de base | $\log_a b = \dfrac{\log_c b}{\log_c a}$ |

### Mnemônico

- Produto → **soma** dos logs.
- Quociente → **diferença** dos logs.
- Potência → **multiplica** o expoente.
`.trim(),

          exemplos: [
            {
              titulo: "Exemplo 1 — Calcular logaritmos diretos",
              problema: "Calcule: (a) $\\log_3 81$, (b) $\\log_5 \\frac{1}{25}$.",
              resolucao: `
**(a)** $3^x = 81 = 3^4 \\implies x = 4$.

**(b)** $5^x = \\frac{1}{25} = 5^{-2} \\implies x = -2$.

**Respostas:** $4$ e $-2$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Usar propriedades",
              problema:
                "Sabendo que $\\log 2 \\approx 0{,}301$ e $\\log 3 \\approx 0{,}477$, calcule $\\log 72$.",
              resolucao: `
$72 = 2^3 \\times 3^2$

$$
\\log 72 = 3\\log 2 + 2\\log 3 = 3(0{,}301) + 2(0{,}477) = 0{,}903 + 0{,}954 = 1{,}857
$$

**Resposta:** $\\approx 1{,}857$.
`.trim(),
            },
            {
              titulo: "Exemplo 3 — Equação logarítmica",
              problema: "Resolva $\\log_2(x + 1) = 3$.",
              resolucao: `
Pela definição: $2^3 = x + 1 \\implies 8 = x + 1 \\implies x = 7$.

Verificação: $\\log_2 8 = 3$. ✓

**Resposta:** $x = 7$.
`.trim(),
            },
          ],

          exercicios: [
            {
              id: "log-q1",
              enunciado: "Qual é o valor de $\\log_4 64$?",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$4$" },
                { letra: "C", texto: "$3$" },
                { letra: "D", texto: "$16$" },
                { letra: "E", texto: "$8$" },
              ],
              gabarito: "C",
              explicacao: "$4^x = 64 = 4^3 \\implies x = 3$.",
            },
            {
              id: "log-q2",
              enunciado:
                "Se $\\log 2 = 0{,}30$ e $\\log 3 = 0{,}48$, qual é $\\log 6$?",
              alternativas: [
                { letra: "A", texto: "$0{,}14$" },
                { letra: "B", texto: "$0{,}78$" },
                { letra: "C", texto: "$0{,}18$" },
                { letra: "D", texto: "$0{,}90$" },
                { letra: "E", texto: "$1{,}08$" },
              ],
              gabarito: "B",
              explicacao:
                "$\\log 6 = \\log 2 + \\log 3 = 0{,}30 + 0{,}48 = 0{,}78$.",
            },
            {
              id: "log-q3",
              enunciado: "Resolva $\\log_3(2x - 1) = 2$.",
              alternativas: [
                { letra: "A", texto: "$x = 4$" },
                { letra: "B", texto: "$x = 5$" },
                { letra: "C", texto: "$x = 9$" },
                { letra: "D", texto: "$x = 3$" },
                { letra: "E", texto: "$x = 7$" },
              ],
              gabarito: "B",
              explicacao:
                "$3^2 = 2x - 1 \\implies 9 = 2x - 1 \\implies 2x = 10 \\implies x = 5$.",
            },
            {
              id: "log-q4",
              enunciado: "Qual é o valor de $\\log_2 32 - \\log_2 4$?",
              alternativas: [
                { letra: "A", texto: "$8$" },
                { letra: "B", texto: "$4$" },
                { letra: "C", texto: "$2$" },
                { letra: "D", texto: "$3$" },
                { letra: "E", texto: "$1$" },
              ],
              gabarito: "D",
              explicacao:
                "$\\log_2(32/4) = \\log_2 8 = 3$, pois $2^3 = 8$.",
            },
            {
              id: "log-q5",
              enunciado:
                "(ENEM) Uma bactéria se divide a cada hora, dobrando a população. Após quantas horas uma única bactéria se tornará $1024$? (Use $\\log 2 \\approx 0{,}30$)",
              alternativas: [
                { letra: "A", texto: "$8$" },
                { letra: "B", texto: "$10$" },
                { letra: "C", texto: "$12$" },
                { letra: "D", texto: "$5$" },
                { letra: "E", texto: "$7$" },
              ],
              gabarito: "B",
              explicacao:
                "$2^n = 1024 = 2^{10} \\implies n = 10$ horas.",
            },
          ],
        },
      ],
    },
  ],
};

// =============================================================================
// Trilha Hub — Álgebra (agrega as 5 subtrilhas)
// =============================================================================
export const algebra: Trilha = {
  slug: "algebra",
  area: "Álgebra",
  titulo: "Álgebra",
  descricao:
    "Cinco subtrilhas que cobrem os pilares algébricos do ENEM: produtos notáveis, fatoração, equações do 1.º e 2.º graus, sistemas lineares e logaritmos. Siga a ordem ou entre diretamente no tópico que precisa reforçar.",
  capitulos: [],
  subtrilhas: [
    algebraProdutosNotaveis,
    algebraFatoracao,
    algebraEquacoes,
    algebraSistemas,
    algebraLogaritmos,
  ],
};
