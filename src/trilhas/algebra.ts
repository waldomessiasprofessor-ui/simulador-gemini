import type { Trilha } from "./types";

// =============================================================================
// Subtrilha 1 — Produtos Notáveis
// =============================================================================
export const algebraProdutosNotaveis: Trilha = {
  slug: "algebra-produtos-notaveis",
  area: "Álgebra",
  titulo: "Produtos Notáveis",
  descricao:
    "As identidades algébricas mais recorrentes do ENEM: quadrado da soma, quadrado da diferença e produto da soma pela diferença.",
  parentSlug: "algebra",
  capitulos: [
    {
      slug: "produtos-notaveis",
      titulo: "Produtos Notáveis",
      licoes: [
        // ── Lição 1 ──────────────────────────────────────────────────────────
        {
          slug: "quadrado-da-soma-e-da-diferenca",
          titulo: "Quadrado da soma e da diferença",
          resumo: "$(a+b)^2$ e $(a-b)^2$: expanda e reconheça o padrão de relance.",
          duracaoMinutos: 15,
          explicacao: `
Os **produtos notáveis** são multiplicações tão frequentes que vale memorizar o resultado direto.

### 1. Quadrado da soma: $(a + b)^2$

$$
(a + b)^2 = a^2 + 2ab + b^2
$$

**Como lembrar:** "primeiro ao quadrado + duas vezes o produto + segundo ao quadrado."

### 2. Quadrado da diferença: $(a - b)^2$

$$
(a - b)^2 = a^2 - 2ab + b^2
$$

Diferença do caso anterior: o termo do meio é **negativo**.

### 3. Erro clássico

$$
(a + b)^2 \neq a^2 + b^2 \quad \text{(falta o } 2ab\text{!)}
$$

### 4. Aplicação

Se $a = 3x$ e $b = 2$:

$$
(3x + 2)^2 = 9x^2 + 12x + 4
$$
`.trim(),
          exemplos: [
            {
              titulo: "Exemplo 1 — Expandir $(x+5)^2$",
              problema: "Expanda $(x+5)^2$.",
              resolucao: `
$(x+5)^2 = x^2 + 2\\cdot x\\cdot 5 + 25 = x^2 + 10x + 25$

**Resposta:** $x^2 + 10x + 25$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Calcular $98^2$",
              problema: "Calcule $98^2$ usando produto notável.",
              resolucao: `
$98 = 100 - 2$:

$$98^2 = (100-2)^2 = 10000 - 400 + 4 = 9604$$

**Resposta:** $9604$.
`.trim(),
            },
            {
              titulo: "Exemplo 3 — $(2x-3)^2$",
              problema: "Expanda $(2x-3)^2$.",
              resolucao: `
$(2x-3)^2 = 4x^2 - 12x + 9$

**Resposta:** $4x^2 - 12x + 9$.
`.trim(),
            },
          ],
          exercicios: [
            // ── nível 1 (basicão) ────────────────────────────────────────────
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
              explicacao: "$(x+4)^2 = x^2 + 2\\cdot x\\cdot 4 + 16 = x^2 + 8x + 16$.",
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
              explicacao: "$(3x-1)^2 = 9x^2 - 6x + 1$.",
            },
            // ── nível 2 ──────────────────────────────────────────────────────
            {
              id: "pn-q3",
              enunciado: "Expanda $(4x + 3)^2$.",
              alternativas: [
                { letra: "A", texto: "$16x^2 + 9$" },
                { letra: "B", texto: "$16x^2 + 12x + 9$" },
                { letra: "C", texto: "$16x^2 + 24x + 9$" },
                { letra: "D", texto: "$8x^2 + 24x + 9$" },
                { letra: "E", texto: "$4x^2 + 24x + 3$" },
              ],
              gabarito: "C",
              explicacao: "$(4x+3)^2 = 16x^2 + 2\\cdot4x\\cdot3 + 9 = 16x^2 + 24x + 9$.",
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
              explicacao: "$101^2=(100+1)^2=10000+200+1=10201$.",
            },
            // ── nível 3 ──────────────────────────────────────────────────────
            {
              id: "pn-q5",
              enunciado: "Se $x + y = 5$ e $xy = 4$, qual é $x^2 + y^2$?",
              alternativas: [
                { letra: "A", texto: "$17$" },
                { letra: "B", texto: "$21$" },
                { letra: "C", texto: "$25$" },
                { letra: "D", texto: "$9$" },
                { letra: "E", texto: "$16$" },
              ],
              gabarito: "A",
              explicacao: "$x^2+y^2=(x+y)^2-2xy=25-8=17$.",
            },
            {
              id: "pn-q6",
              enunciado: "Simplifique $(x+3)^2 - (x-3)^2$.",
              alternativas: [
                { letra: "A", texto: "$12x$" },
                { letra: "B", texto: "$6x$" },
                { letra: "C", texto: "$2x^2 + 18$" },
                { letra: "D", texto: "$18$" },
                { letra: "E", texto: "$12$" },
              ],
              gabarito: "A",
              explicacao: "$(x^2+6x+9)-(x^2-6x+9)=12x$.",
            },
            {
              id: "pn-q7",
              enunciado: "Se $x - y = 4$ e $xy = 3$, qual é $(x + y)^2$?",
              alternativas: [
                { letra: "A", texto: "$10$" },
                { letra: "B", texto: "$22$" },
                { letra: "C", texto: "$25$" },
                { letra: "D", texto: "$28$" },
                { letra: "E", texto: "$34$" },
              ],
              gabarito: "D",
              explicacao: "$(x-y)^2=x^2-2xy+y^2=16 \\Rightarrow x^2+y^2=22$. $(x+y)^2=x^2+2xy+y^2=22+6=28$.",
            },
            // ── nível 4 ──────────────────────────────────────────────────────
            {
              id: "pn-q8",
              enunciado: "Qual é o valor de $(3+\\sqrt{2})^2$?",
              alternativas: [
                { letra: "A", texto: "$11$" },
                { letra: "B", texto: "$11 + 6\\sqrt{2}$" },
                { letra: "C", texto: "$9 + 2$" },
                { letra: "D", texto: "$11 + \\sqrt{2}$" },
                { letra: "E", texto: "$13 + 6\\sqrt{2}$" },
              ],
              gabarito: "B",
              explicacao: "$(3+\\sqrt{2})^2=9+6\\sqrt{2}+2=11+6\\sqrt{2}$.",
            },
            {
              id: "pn-q9",
              enunciado: "Se $(a+b)^2 = 25$ e $ab = 6$, qual é $a^2+b^2$?",
              alternativas: [
                { letra: "A", texto: "$19$" },
                { letra: "B", texto: "$37$" },
                { letra: "C", texto: "$13$" },
                { letra: "D", texto: "$7$" },
                { letra: "E", texto: "$31$" },
              ],
              gabarito: "C",
              explicacao: "$a^2+b^2=(a+b)^2-2ab=25-12=13$.",
            },
            // ── nível 5 (ENEM) ───────────────────────────────────────────────
            {
              id: "pn-q10",
              enunciado: "A expressão $(2n+1)^2-(2n-1)^2$ é sempre igual a:",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$4n$" },
                { letra: "C", texto: "$8$" },
                { letra: "D", texto: "$8n$" },
                { letra: "E", texto: "$4n^2$" },
              ],
              gabarito: "D",
              explicacao: "$(4n^2+4n+1)-(4n^2-4n+1)=8n$.",
            },
          ],
        },
        // ── Lição 2 ──────────────────────────────────────────────────────────
        {
          slug: "produto-da-soma-pela-diferenca",
          titulo: "Produto da soma pela diferença",
          resumo: "$(a+b)(a-b)=a^2-b^2$ — elimina termos e simplifica em segundos.",
          duracaoMinutos: 12,
          explicacao: `
### Fórmula

$$
(a+b)(a-b) = a^2 - b^2
$$

O termo com $ab$ se cancela. Na direção inversa:

$$
a^2 - b^2 = (a+b)(a-b)
$$

### Exemplos numéricos

$$
99 \times 101 = (100-1)(100+1) = 10000 - 1 = 9999
$$
`.trim(),
          exemplos: [
            {
              titulo: "Exemplo 1 — Simplificar fração",
              problema: "Simplifique $\\dfrac{x^2-9}{x+3}$, $x\\neq-3$.",
              resolucao: `
$x^2-9=(x+3)(x-3)$

$$\\frac{(x+3)(x-3)}{x+3}=x-3$$

**Resposta:** $x-3$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — $198\\times202$",
              problema: "Calcule $198\\times202$.",
              resolucao: `
$(200-2)(200+2)=40000-4=39996$

**Resposta:** $39\\,996$.
`.trim(),
            },
          ],
          exercicios: [
            // ── nível 1 ──────────────────────────────────────────────────────
            {
              id: "pn2-q1",
              enunciado: "Qual é o produto $(x-7)(x+7)$?",
              alternativas: [
                { letra: "A", texto: "$x^2+49$" },
                { letra: "B", texto: "$x^2-49$" },
                { letra: "C", texto: "$x^2-14x-49$" },
                { letra: "D", texto: "$x^2+14x-49$" },
                { letra: "E", texto: "$x^2-14$" },
              ],
              gabarito: "B",
              explicacao: "$(x-7)(x+7)=x^2-49$.",
            },
            {
              id: "pn2-q2",
              enunciado: "Calcule $(3x-2y)(3x+2y)$.",
              alternativas: [
                { letra: "A", texto: "$9x^2-4y^2$" },
                { letra: "B", texto: "$9x^2+4y^2$" },
                { letra: "C", texto: "$6x^2-4y^2$" },
                { letra: "D", texto: "$9x^2-12xy-4y^2$" },
                { letra: "E", texto: "$9x^2-4$" },
              ],
              gabarito: "A",
              explicacao: "$(3x)^2-(2y)^2=9x^2-4y^2$.",
            },
            // ── nível 2 ──────────────────────────────────────────────────────
            {
              id: "pn2-q3",
              enunciado: "Fatore $4x^2-25$.",
              alternativas: [
                { letra: "A", texto: "$(4x-25)(4x+25)$" },
                { letra: "B", texto: "$(2x-5)^2$" },
                { letra: "C", texto: "$(2x-5)(2x+5)$" },
                { letra: "D", texto: "$(x-5)(4x+5)$" },
                { letra: "E", texto: "$(2x+5)^2$" },
              ],
              gabarito: "C",
              explicacao: "$4x^2-25=(2x)^2-5^2=(2x-5)(2x+5)$.",
            },
            {
              id: "pn2-q4",
              enunciado: "Calcule $995\\times1005$ usando produto notável.",
              alternativas: [
                { letra: "A", texto: "$999\\,975$" },
                { letra: "B", texto: "$1\\,000\\,025$" },
                { letra: "C", texto: "$999\\,025$" },
                { letra: "D", texto: "$999\\,999$" },
                { letra: "E", texto: "$1\\,000\\,000$" },
              ],
              gabarito: "A",
              explicacao: "$(1000-5)(1000+5)=1000^2-25=999\\,975$.",
            },
            // ── nível 3 ──────────────────────────────────────────────────────
            {
              id: "pn2-q5",
              enunciado: "Simplifique $\\dfrac{4x^2-9}{2x+3}$, $x\\neq-\\dfrac{3}{2}$.",
              alternativas: [
                { letra: "A", texto: "$2x-3$" },
                { letra: "B", texto: "$2x+3$" },
                { letra: "C", texto: "$4x-3$" },
                { letra: "D", texto: "$\\dfrac{4x^2-9}{2x+3}$" },
                { letra: "E", texto: "$4x-9$" },
              ],
              gabarito: "A",
              explicacao: "$4x^2-9=(2x-3)(2x+3)$. Dividindo por $(2x+3)$: $2x-3$.",
            },
            {
              id: "pn2-q6",
              enunciado: "Se $x^2-y^2=15$ e $x+y=5$, qual é $x-y$?",
              alternativas: [
                { letra: "A", texto: "$1$" },
                { letra: "B", texto: "$3$" },
                { letra: "C", texto: "$5$" },
                { letra: "D", texto: "$10$" },
                { letra: "E", texto: "$15$" },
              ],
              gabarito: "B",
              explicacao: "$(x+y)(x-y)=15 \\Rightarrow 5(x-y)=15 \\Rightarrow x-y=3$.",
            },
            // ── nível 4 ──────────────────────────────────────────────────────
            {
              id: "pn2-q7",
              enunciado: "Calcule $203\\times197$.",
              alternativas: [
                { letra: "A", texto: "$39\\,991$" },
                { letra: "B", texto: "$40\\,000$" },
                { letra: "C", texto: "$39\\,000$" },
                { letra: "D", texto: "$40\\,091$" },
                { letra: "E", texto: "$38\\,991$" },
              ],
              gabarito: "A",
              explicacao: "$(200+3)(200-3)=40000-9=39\\,991$.",
            },
            {
              id: "pn2-q8",
              enunciado: "Fatore completamente $x^4-1$.",
              alternativas: [
                { letra: "A", texto: "$(x^2-1)(x^2+1)$" },
                { letra: "B", texto: "$(x-1)^2(x+1)^2$" },
                { letra: "C", texto: "$(x-1)(x+1)(x^2+1)$" },
                { letra: "D", texto: "$(x^2+1)^2$" },
                { letra: "E", texto: "$(x-1)(x^3+1)$" },
              ],
              gabarito: "C",
              explicacao: "$x^4-1=(x^2-1)(x^2+1)=(x-1)(x+1)(x^2+1)$.",
            },
            // ── nível 5 ──────────────────────────────────────────────────────
            {
              id: "pn2-q9",
              enunciado: "Simplifique $\\dfrac{x^2-9}{x^2-6x+9}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{x+3}{x-3}$" },
                { letra: "B", texto: "$\\dfrac{x-3}{x+3}$" },
                { letra: "C", texto: "$x+3$" },
                { letra: "D", texto: "$\\dfrac{1}{x-3}$" },
                { letra: "E", texto: "$1$" },
              ],
              gabarito: "A",
              explicacao: "Numerador: $(x-3)(x+3)$. Denominador: $(x-3)^2$. Resultado: $\\dfrac{x+3}{x-3}$.",
            },
            {
              id: "pn2-q10",
              enunciado: "Um retângulo tem lados $(x+5)$ m e $(x-5)$ m. Sua área, em m², é:",
              alternativas: [
                { letra: "A", texto: "$x^2+25$" },
                { letra: "B", texto: "$x^2-10x+25$" },
                { letra: "C", texto: "$x^2-25$" },
                { letra: "D", texto: "$2x$" },
                { letra: "E", texto: "$x^2+10x-25$" },
              ],
              gabarito: "C",
              explicacao: "$(x+5)(x-5)=x^2-25$.",
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
    "Do fator comum ao trinômio quadrático: decompor polinômios é indispensável para simplificar frações e resolver equações.",
  parentSlug: "algebra",
  capitulos: [
    {
      slug: "fatoracao",
      titulo: "Fatoração de Polinômios",
      licoes: [
        // ── Lição 1 ──────────────────────────────────────────────────────────
        {
          slug: "fator-comum-e-agrupamento",
          titulo: "Fator comum e agrupamento",
          resumo: "Colocar em evidência o MDC e agrupar termos para descobrir fatores.",
          duracaoMinutos: 15,
          explicacao: `
**Fatorar** é escrever um polinômio como produto de fatores mais simples.

### Técnica 1 — Fator comum

Identifique o **MDC** de todos os termos e coloque em evidência:

$$ax + ay = a(x+y)$$

**Exemplo:** $6x^2+9x = 3x(2x+3)$

### Técnica 2 — Agrupamento

Quando não há fator comum a todos, agrupe em pares:

$$ax+ay+bx+by = a(x+y)+b(x+y) = (a+b)(x+y)$$
`.trim(),
          exemplos: [
            {
              titulo: "Exemplo 1 — Fator comum",
              problema: "Fatore $12x^3-8x^2+4x$.",
              resolucao: `
MDC = $4x$:

$$12x^3-8x^2+4x = 4x(3x^2-2x+1)$$
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Agrupamento",
              problema: "Fatore $2xy+6x-y-3$.",
              resolucao: `
$$2x(y+3)-1(y+3)=(2x-1)(y+3)$$
`.trim(),
            },
          ],
          exercicios: [
            // ── nível 1 ──────────────────────────────────────────────────────
            {
              id: "fat-q1",
              enunciado: "Fatore completamente $15x^4-10x^3+5x^2$.",
              alternativas: [
                { letra: "A", texto: "$5x(3x^3-2x^2+x)$" },
                { letra: "B", texto: "$5x^2(3x^2-2x+1)$" },
                { letra: "C", texto: "$x^2(15x^2-10x+5)$" },
                { letra: "D", texto: "$5(3x^4-2x^3+x^2)$" },
                { letra: "E", texto: "$5x^2(3x-1)(x-1)$" },
              ],
              gabarito: "B",
              explicacao: "MDC = $5x^2$: $5x^2(3x^2-2x+1)$.",
            },
            {
              id: "fat-q2",
              enunciado: "O polinômio $x^2y-xy^2$ fatorado é:",
              alternativas: [
                { letra: "A", texto: "$xy(x+y)$" },
                { letra: "B", texto: "$xy(x-y)$" },
                { letra: "C", texto: "$x^2(y-y^2)$" },
                { letra: "D", texto: "$xy^2(x-1)$" },
                { letra: "E", texto: "$(xy)^2-xy$" },
              ],
              gabarito: "B",
              explicacao: "$x^2y-xy^2=xy(x-y)$.",
            },
            // ── nível 2 ──────────────────────────────────────────────────────
            {
              id: "fat-q3",
              enunciado: "Fatore $8a^3-12a^2b$.",
              alternativas: [
                { letra: "A", texto: "$2a(4a^2-6ab)$" },
                { letra: "B", texto: "$4a^2(2a-3b)$" },
                { letra: "C", texto: "$4a(2a^2-3ab)$" },
                { letra: "D", texto: "$8a^2(a-\\frac{3}{2}b)$" },
                { letra: "E", texto: "$4ab(2a-3)$" },
              ],
              gabarito: "B",
              explicacao: "MDC de $8a^3$ e $12a^2b$ é $4a^2$: $4a^2(2a-3b)$.",
            },
            {
              id: "fat-q4",
              enunciado: "Fatore $x^2y+xy^2+xy$.",
              alternativas: [
                { letra: "A", texto: "$xy(x+y)$" },
                { letra: "B", texto: "$x^2y(1+y)$" },
                { letra: "C", texto: "$xy(x+y+1)$" },
                { letra: "D", texto: "$xy^2(x+1)$" },
                { letra: "E", texto: "$xy+xy(x+y)$" },
              ],
              gabarito: "C",
              explicacao: "MDC = $xy$: $xy(x+y+1)$.",
            },
            // ── nível 3 ──────────────────────────────────────────────────────
            {
              id: "fat-q5",
              enunciado: "Fatore $ab+b+a+1$ por agrupamento.",
              alternativas: [
                { letra: "A", texto: "$(a+1)(b+1)$" },
                { letra: "B", texto: "$(ab+1)(a+b)$" },
                { letra: "C", texto: "$(a+b)(2)$" },
                { letra: "D", texto: "$a(b+1)+1$" },
                { letra: "E", texto: "$(ab+a)(b+1)$" },
              ],
              gabarito: "A",
              explicacao: "$b(a+1)+1(a+1)=(b+1)(a+1)$.",
            },
            {
              id: "fat-q6",
              enunciado: "Fatore por agrupamento: $x^3+x^2+x+1$.",
              alternativas: [
                { letra: "A", texto: "$(x^2+1)(x-1)$" },
                { letra: "B", texto: "$(x+1)^3$" },
                { letra: "C", texto: "$(x^2-1)(x+1)$" },
                { letra: "D", texto: "$(x^2+1)(x+1)$" },
                { letra: "E", texto: "$x^3+x^2+x+1$" },
              ],
              gabarito: "D",
              explicacao: "$x^2(x+1)+1(x+1)=(x^2+1)(x+1)$.",
            },
            // ── nível 4 ──────────────────────────────────────────────────────
            {
              id: "fat-q7",
              enunciado: "Fatore completamente $6x^2y-9xy^2+3xy$.",
              alternativas: [
                { letra: "A", texto: "$3x(2xy-3y^2+y)$" },
                { letra: "B", texto: "$3xy(2x-3y)$" },
                { letra: "C", texto: "$3xy(2x-3y+1)$" },
                { letra: "D", texto: "$xy(6x-9y+3)$" },
                { letra: "E", texto: "$3(2x^2y-3xy^2+xy)$" },
              ],
              gabarito: "C",
              explicacao: "MDC = $3xy$: $3xy(2x-3y+1)$.",
            },
            {
              id: "fat-q8",
              enunciado: "Fatore $3xy-6x-y+2$.",
              alternativas: [
                { letra: "A", texto: "$(3x+1)(y-2)$" },
                { letra: "B", texto: "$(3x-1)(y+2)$" },
                { letra: "C", texto: "$(3x-1)(y-2)$" },
                { letra: "D", texto: "$3x(y-2)-(y-2)$" },
                { letra: "E", texto: "$(3x-2)(y-1)$" },
              ],
              gabarito: "C",
              explicacao: "$3x(y-2)-1(y-2)=(3x-1)(y-2)$.",
            },
            // ── nível 5 ──────────────────────────────────────────────────────
            {
              id: "fat-q9",
              enunciado: "Fatorando $x^4-x^3+x-1$ por agrupamento, obtemos:",
              alternativas: [
                { letra: "A", texto: "$(x-1)^2(x^2+x+1)$" },
                { letra: "B", texto: "$(x^3+1)(x-1)$" },
                { letra: "C", texto: "$(x^2+1)(x^2-1)$" },
                { letra: "D", texto: "$(x+1)(x^3-1)$" },
                { letra: "E", texto: "$(x^2-x)(x^2+1)$" },
              ],
              gabarito: "B",
              explicacao: "$x^3(x-1)+1(x-1)=(x^3+1)(x-1)$.",
            },
            {
              id: "fat-q10",
              enunciado: "A expressão $n^3-n$ (com $n$ inteiro) é sempre divisível por:",
              alternativas: [
                { letra: "A", texto: "$2$ apenas" },
                { letra: "B", texto: "$3$ apenas" },
                { letra: "C", texto: "$4$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$12$" },
              ],
              gabarito: "D",
              explicacao: "$n^3-n=n(n^2-1)=n(n-1)(n+1)$ — produto de 3 inteiros consecutivos, sempre divisível por $6$.",
            },
          ],
        },
        // ── Lição 2 ──────────────────────────────────────────────────────────
        {
          slug: "fatoracao-trinomio-e-diferenca-quadrados",
          titulo: "Trinômio e diferença de quadrados",
          resumo: "Decompor $x^2+bx+c$ encontrando duas raízes, e reconhecer $a^2-b^2$ para fatorar instantaneamente.",
          duracaoMinutos: 18,
          explicacao: `
### Diferença de quadrados

$$a^2-b^2=(a+b)(a-b)$$

### Trinômio $x^2+bx+c=(x+p)(x+q)$

Encontre $p$ e $q$ com $p+q=b$ e $pq=c$.

**Exemplo:** $x^2+5x+6$: pares de 6 com soma 5 → $(2,3)$. Logo $(x+2)(x+3)$.

### Trinômio com $a\\neq1$: use Bhaskara

$$x=\\frac{-b\\pm\\sqrt{\\Delta}}{2a},\\quad ax^2+bx+c=a(x-x_1)(x-x_2)$$
`.trim(),
          exemplos: [
            {
              titulo: "Exemplo 1 — Trinômio",
              problema: "Fatore $x^2-7x+12$.",
              resolucao: `
Precisamos $p+q=-7$ e $pq=12$: $(-3)+(-4)=-7$ e $(-3)(-4)=12$.

$$x^2-7x+12=(x-3)(x-4)$$
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Com Bhaskara",
              problema: "Fatore $2x^2-7x+3$.",
              resolucao: `
$\\Delta=49-24=25$, $x=(7\\pm5)/4 \\Rightarrow x_1=3,\\;x_2=\\tfrac{1}{2}$.

$$2x^2-7x+3=(x-3)(2x-1)$$
`.trim(),
            },
          ],
          exercicios: [
            // ── nível 1 ──────────────────────────────────────────────────────
            {
              id: "fat2-q1",
              enunciado: "Fatore $x^2+8x+15$.",
              alternativas: [
                { letra: "A", texto: "$(x+3)(x+5)$" },
                { letra: "B", texto: "$(x+4)(x+4)$" },
                { letra: "C", texto: "$(x+1)(x+15)$" },
                { letra: "D", texto: "$(x+6)(x+2)$" },
                { letra: "E", texto: "$(x+3)(x+12)$" },
              ],
              gabarito: "A",
              explicacao: "$p\\cdot q=15$ e $p+q=8$: $(3,5)$. Logo $(x+3)(x+5)$.",
            },
            {
              id: "fat2-q2",
              enunciado: "Fatore $x^2-16$.",
              alternativas: [
                { letra: "A", texto: "$(x-4)^2$" },
                { letra: "B", texto: "$(x-8)(x+2)$" },
                { letra: "C", texto: "$(x-4)(x+4)$" },
                { letra: "D", texto: "$(x^2-4)(x^2+4)$" },
                { letra: "E", texto: "$(x+4)^2$" },
              ],
              gabarito: "C",
              explicacao: "$x^2-16=x^2-4^2=(x-4)(x+4)$.",
            },
            // ── nível 2 ──────────────────────────────────────────────────────
            {
              id: "fat2-q3",
              enunciado: "Fatore $x^2-x-6$.",
              alternativas: [
                { letra: "A", texto: "$(x-3)(x-2)$" },
                { letra: "B", texto: "$(x+2)(x-3)$" },
                { letra: "C", texto: "$(x-1)(x+6)$" },
                { letra: "D", texto: "$(x+3)(x-2)$" },
                { letra: "E", texto: "$(x-6)(x+1)$" },
              ],
              gabarito: "B",
              explicacao: "$p+q=-1$ e $pq=-6$: $(-3,+2)$. Logo $(x-3)(x+2)$.",
            },
            {
              id: "fat2-q4",
              enunciado: "Fatore $x^2-10x+21$.",
              alternativas: [
                { letra: "A", texto: "$(x-3)(x+7)$" },
                { letra: "B", texto: "$(x+3)(x+7)$" },
                { letra: "C", texto: "$(x-3)(x-7)$" },
                { letra: "D", texto: "$(x-1)(x-21)$" },
                { letra: "E", texto: "$(x-7)^2$" },
              ],
              gabarito: "C",
              explicacao: "$p+q=-10$ e $pq=21$: $(-3,-7)$. Logo $(x-3)(x-7)$.",
            },
            // ── nível 3 ──────────────────────────────────────────────────────
            {
              id: "fat2-q5",
              enunciado: "Fatore $x^2+3x-18$.",
              alternativas: [
                { letra: "A", texto: "$(x+6)(x-3)$" },
                { letra: "B", texto: "$(x-6)(x+3)$" },
                { letra: "C", texto: "$(x+9)(x-2)$" },
                { letra: "D", texto: "$(x+3)(x+6)$" },
                { letra: "E", texto: "$(x-2)(x+9)$" },
              ],
              gabarito: "A",
              explicacao: "$p+q=3$ e $pq=-18$: $(6,-3)$. Logo $(x+6)(x-3)$.",
            },
            {
              id: "fat2-q6",
              enunciado: "Fatore $2x^2+7x+3$.",
              alternativas: [
                { letra: "A", texto: "$(2x-1)(x+3)$" },
                { letra: "B", texto: "$(2x+1)(x-3)$" },
                { letra: "C", texto: "$(x+1)(2x+3)$" },
                { letra: "D", texto: "$(2x+1)(x+3)$" },
                { letra: "E", texto: "$(x+3)^2$" },
              ],
              gabarito: "D",
              explicacao: "$\\Delta=49-24=25$; $x=(-7\\pm5)/4$: $x_1=-\\frac{1}{2}$, $x_2=-3$. Logo $(2x+1)(x+3)$.",
            },
            // ── nível 4 ──────────────────────────────────────────────────────
            {
              id: "fat2-q7",
              enunciado: "Simplifique $\\dfrac{x^2-x-6}{x^2-4}$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{x-3}{x-2}$" },
                { letra: "B", texto: "$\\dfrac{x+3}{x+2}$" },
                { letra: "C", texto: "$\\dfrac{x-3}{x+2}$" },
                { letra: "D", texto: "$x-3$" },
                { letra: "E", texto: "$\\dfrac{x+2}{x-2}$" },
              ],
              gabarito: "A",
              explicacao: "Numerador: $(x-3)(x+2)$. Denominador: $(x-2)(x+2)$. Resultado: $\\dfrac{x-3}{x-2}$.",
            },
            {
              id: "fat2-q8",
              enunciado: "As raízes de $x^2-7x+12=0$ são $x_1$ e $x_2$. Calcule $x_1^2+x_2^2$.",
              alternativas: [
                { letra: "A", texto: "$49$" },
                { letra: "B", texto: "$13$" },
                { letra: "C", texto: "$1$" },
                { letra: "D", texto: "$25$" },
                { letra: "E", texto: "$7$" },
              ],
              gabarito: "D",
              explicacao: "Girard: $x_1+x_2=7$, $x_1x_2=12$. $x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2=49-24=25$.",
            },
            // ── nível 5 ──────────────────────────────────────────────────────
            {
              id: "fat2-q9",
              enunciado: "Determine $k$ para que $x^2+kx+16$ seja trinômio quadrado perfeito.",
              alternativas: [
                { letra: "A", texto: "$k=2$" },
                { letra: "B", texto: "$k=4$ ou $k=-4$" },
                { letra: "C", texto: "$k=8$ ou $k=-8$" },
                { letra: "D", texto: "$k=16$" },
                { letra: "E", texto: "$k=6$" },
              ],
              gabarito: "C",
              explicacao: "$(x+a)^2=x^2+2ax+a^2$: $a^2=16\\Rightarrow a=\\pm4$, $k=2a=\\pm8$.",
            },
            {
              id: "fat2-q10",
              enunciado: "Um terreno retangular tem área $(6x^2+7x-3)$ m² e largura $(2x+3)$ m. O comprimento é:",
              alternativas: [
                { letra: "A", texto: "$3x+1$" },
                { letra: "B", texto: "$2x-3$" },
                { letra: "C", texto: "$3x-1$" },
                { letra: "D", texto: "$6x-1$" },
                { letra: "E", texto: "$x+3$" },
              ],
              gabarito: "C",
              explicacao: "$6x^2+7x-3=(3x-1)(2x+3)$. Dividindo pela largura $(2x+3)$: $3x-1$.",
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
    "Do 1.º ao 2.º grau: Bhaskara, discriminante e Relações de Girard para resolver questões do ENEM sem calcular cada raiz.",
  parentSlug: "algebra",
  capitulos: [
    {
      slug: "equacoes",
      titulo: "Equações",
      licoes: [
        // ── Lição 1 ──────────────────────────────────────────────────────────
        {
          slug: "equacao-do-primeiro-grau",
          titulo: "Equação do 1.º grau",
          resumo: "Isolar $x$ em $ax+b=0$ e interpretar casos especiais.",
          duracaoMinutos: 12,
          explicacao: `
### Forma geral

$$ax+b=0,\quad a\neq0$$

### Estratégia

1. Elimine parênteses.
2. Junte termos com $x$ de um lado, numéricos do outro.
3. Divida pelo coeficiente de $x$.

### Casos especiais

- **Impossível** ($0=k$, $k\\neq0$): sem solução.
- **Indeterminada** ($0=0$): todo real é solução.
`.trim(),
          exemplos: [
            {
              titulo: "Exemplo 1 — Com parênteses",
              problema: "Resolva $2(x-3)+4=3x-5$.",
              resolucao: `
$2x-6+4=3x-5 \\Rightarrow 2x-2=3x-5 \\Rightarrow x=3$

**Resposta:** $x=3$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Com fração",
              problema: "Resolva $\\dfrac{x}{3}+\\dfrac{x}{6}=5$.",
              resolucao: `
MMC = 6: $2x+x=30$, $3x=30$, $x=10$.

**Resposta:** $x=10$.
`.trim(),
            },
          ],
          exercicios: [
            // ── nível 1 ──────────────────────────────────────────────────────
            {
              id: "eq1-q1",
              enunciado: "Qual é a solução de $5x-3=2x+9$?",
              alternativas: [
                { letra: "A", texto: "$x=2$" },
                { letra: "B", texto: "$x=6$" },
                { letra: "C", texto: "$x=4$" },
                { letra: "D", texto: "$x=3$" },
                { letra: "E", texto: "$x=12$" },
              ],
              gabarito: "C",
              explicacao: "$3x=12 \\Rightarrow x=4$.",
            },
            {
              id: "eq1-q2",
              enunciado: "Resolva $\\dfrac{x}{3}+\\dfrac{x}{6}=5$.",
              alternativas: [
                { letra: "A", texto: "$x=15$" },
                { letra: "B", texto: "$x=10$" },
                { letra: "C", texto: "$x=6$" },
                { letra: "D", texto: "$x=12$" },
                { letra: "E", texto: "$x=30$" },
              ],
              gabarito: "B",
              explicacao: "MMC=6: $2x+x=30$, $x=10$.",
            },
            // ── nível 2 ──────────────────────────────────────────────────────
            {
              id: "eq1-q3",
              enunciado: "A equação $4(x-2)=2(2x-4)$ é:",
              alternativas: [
                { letra: "A", texto: "Impossível" },
                { letra: "B", texto: "Determinada, $x=0$" },
                { letra: "C", texto: "Determinada, $x=4$" },
                { letra: "D", texto: "Indeterminada — todo real é solução" },
                { letra: "E", texto: "Determinada, $x=2$" },
              ],
              gabarito: "D",
              explicacao: "$4x-8=4x-8 \\Rightarrow 0=0$. Indeterminada.",
            },
            {
              id: "eq1-q4",
              enunciado: "Resolva $3(2x-1)-4(x+2)=5$.",
              alternativas: [
                { letra: "A", texto: "$x=3$" },
                { letra: "B", texto: "$x=5$" },
                { letra: "C", texto: "$x=6$" },
                { letra: "D", texto: "$x=8$" },
                { letra: "E", texto: "$x=10$" },
              ],
              gabarito: "D",
              explicacao: "$6x-3-4x-8=5 \\Rightarrow 2x=16 \\Rightarrow x=8$.",
            },
            // ── nível 3 ──────────────────────────────────────────────────────
            {
              id: "eq1-q5",
              enunciado: "A soma de dois números consecutivos é 37. Qual é o maior?",
              alternativas: [
                { letra: "A", texto: "$17$" },
                { letra: "B", texto: "$18$" },
                { letra: "C", texto: "$19$" },
                { letra: "D", texto: "$20$" },
                { letra: "E", texto: "$21$" },
              ],
              gabarito: "C",
              explicacao: "$n+(n+1)=37 \\Rightarrow n=18$. Maior: $19$.",
            },
            {
              id: "eq1-q6",
              enunciado: "Resolva $\\dfrac{2x-1}{3}=\\dfrac{x+2}{2}-1$.",
              alternativas: [
                { letra: "A", texto: "$x=1$" },
                { letra: "B", texto: "$x=2$" },
                { letra: "C", texto: "$x=3$" },
                { letra: "D", texto: "$x=4$" },
                { letra: "E", texto: "$x=-1$" },
              ],
              gabarito: "B",
              explicacao: "MMC=6: $2(2x-1)=3(x+2)-6 \\Rightarrow 4x-2=3x \\Rightarrow x=2$. Verificação: $(3)/3=1$ e $(4)/2-1=1$. ✓",
            },
            // ── nível 4 ──────────────────────────────────────────────────────
            {
              id: "eq1-q7",
              enunciado: "A diferença entre o quíntuplo e o dobro de um número é 21. Qual é $3$ vezes esse número?",
              alternativas: [
                { letra: "A", texto: "$7$" },
                { letra: "B", texto: "$14$" },
                { letra: "C", texto: "$21$" },
                { letra: "D", texto: "$28$" },
                { letra: "E", texto: "$63$" },
              ],
              gabarito: "C",
              explicacao: "$5x-2x=21 \\Rightarrow 3x=21$.",
            },
            {
              id: "eq1-q8",
              enunciado: "A média aritmética de $2x$, $3x$ e $5x$ é $20$. Qual é $x$?",
              alternativas: [
                { letra: "A", texto: "$4$" },
                { letra: "B", texto: "$5$" },
                { letra: "C", texto: "$6$" },
                { letra: "D", texto: "$8$" },
                { letra: "E", texto: "$10$" },
              ],
              gabarito: "C",
              explicacao: "$\\dfrac{10x}{3}=20 \\Rightarrow x=6$.",
            },
            // ── nível 5 ──────────────────────────────────────────────────────
            {
              id: "eq1-q9",
              enunciado: "Um recipiente de 40 L está $\\frac{3}{4}$ cheio. Quantos litros faltam para completar?",
              alternativas: [
                { letra: "A", texto: "$30$" },
                { letra: "B", texto: "$15$" },
                { letra: "C", texto: "$10$" },
                { letra: "D", texto: "$8$" },
                { letra: "E", texto: "$20$" },
              ],
              gabarito: "C",
              explicacao: "$40-\\frac{3}{4}\\times40=40-30=10$.",
            },
            {
              id: "eq1-q10",
              enunciado: "(ENEM) Um trabalhador recebe salário $s$. Após aumento de 15%, seu salário passa a R$\\ 920{,}00$. Qual era o salário anterior?",
              alternativas: [
                { letra: "A", texto: "$R\\$\\,780{,}00$" },
                { letra: "B", texto: "$R\\$\\,800{,}00$" },
                { letra: "C", texto: "$R\\$\\,840{,}00$" },
                { letra: "D", texto: "$R\\$\\,860{,}00$" },
                { letra: "E", texto: "$R\\$\\,880{,}00$" },
              ],
              gabarito: "B",
              explicacao: "$1{,}15s=920 \\Rightarrow s=800$.",
            },
          ],
        },
        // ── Lição 2 ──────────────────────────────────────────────────────────
        {
          slug: "equacao-do-segundo-grau",
          titulo: "Equação do 2.º grau — Bhaskara e Girard",
          resumo: "Resolver $ax^2+bx+c=0$, interpretar $\\Delta$ e usar as relações de Girard.",
          duracaoMinutos: 20,
          explicacao: `
### Fórmula de Bhaskara

$$x=\\frac{-b\\pm\\sqrt{\\Delta}}{2a},\quad\\Delta=b^2-4ac$$

### Discriminante $\\Delta$

| $\\Delta$ | Raízes |
|---|---|
| $>0$ | Duas reais distintas |
| $=0$ | Uma real dupla |
| $<0$ | Nenhuma real |

### Relações de Girard

$$x_1+x_2=-\\frac{b}{a}\\qquad x_1\\cdot x_2=\\frac{c}{a}$$
`.trim(),
          exemplos: [
            {
              titulo: "Exemplo 1 — Bhaskara",
              problema: "Resolva $2x^2-6x+4=0$.",
              resolucao: `
$\\Delta=36-32=4$; $x=(6\\pm2)/4$; $x_1=2$, $x_2=1$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Girard",
              problema: "As raízes de $x^2+bx+12=0$ somam $-7$. Determine $b$.",
              resolucao: `
$x_1+x_2=-b=-7 \\Rightarrow b=7$.

Verificação: $(x+3)(x+4)$, raízes $-3$ e $-4$, soma $-7$. ✓
`.trim(),
            },
          ],
          exercicios: [
            // ── nível 1 ──────────────────────────────────────────────────────
            {
              id: "eq2-q1",
              enunciado: "Resolva $x^2-5x+6=0$. As raízes são:",
              alternativas: [
                { letra: "A", texto: "$1$ e $6$" },
                { letra: "B", texto: "$2$ e $3$" },
                { letra: "C", texto: "$-2$ e $-3$" },
                { letra: "D", texto: "$5$ e $1$" },
                { letra: "E", texto: "$6$ e $-1$" },
              ],
              gabarito: "B",
              explicacao: "$\\Delta=1$; $x=(5\\pm1)/2$: $x_1=3$, $x_2=2$.",
            },
            {
              id: "eq2-q2",
              enunciado: "Resolva $x^2-7x+12=0$. As raízes são:",
              alternativas: [
                { letra: "A", texto: "$1$ e $12$" },
                { letra: "B", texto: "$3$ e $4$" },
                { letra: "C", texto: "$-3$ e $-4$" },
                { letra: "D", texto: "$2$ e $6$" },
                { letra: "E", texto: "$1$ e $7$" },
              ],
              gabarito: "B",
              explicacao: "$\\Delta=49-48=1$; $x=(7\\pm1)/2$: $x_1=4$, $x_2=3$.",
            },
            // ── nível 2 ──────────────────────────────────────────────────────
            {
              id: "eq2-q3",
              enunciado: "Para quais valores de $k$ a equação $x^2-4x+k=0$ tem raízes reais?",
              alternativas: [
                { letra: "A", texto: "$k>4$" },
                { letra: "B", texto: "$k\\geq4$" },
                { letra: "C", texto: "$k\\leq4$" },
                { letra: "D", texto: "$k<4$" },
                { letra: "E", texto: "Todo $k$ real" },
              ],
              gabarito: "C",
              explicacao: "$\\Delta=16-4k\\geq0 \\Rightarrow k\\leq4$.",
            },
            {
              id: "eq2-q4",
              enunciado: "Para qual valor de $m$ a equação $x^2-mx+9=0$ tem raiz dupla?",
              alternativas: [
                { letra: "A", texto: "$m=3$" },
                { letra: "B", texto: "$m=6$ ou $m=-6$" },
                { letra: "C", texto: "$m=9$" },
                { letra: "D", texto: "$m=4$" },
                { letra: "E", texto: "$m=18$" },
              ],
              gabarito: "B",
              explicacao: "$\\Delta=m^2-36=0 \\Rightarrow m=\\pm6$.",
            },
            // ── nível 3 ──────────────────────────────────────────────────────
            {
              id: "eq2-q5",
              enunciado: "As raízes de $x^2-3x+2=0$ têm soma $S$ e produto $P$. Qual é $S+P$?",
              alternativas: [
                { letra: "A", texto: "$1$" },
                { letra: "B", texto: "$5$" },
                { letra: "C", texto: "$3$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$-1$" },
              ],
              gabarito: "B",
              explicacao: "Girard: $S=3$, $P=2$. $S+P=5$.",
            },
            {
              id: "eq2-q6",
              enunciado: "Se as raízes de $x^2+px+q=0$ são $2$ e $-3$, quais são $p$ e $q$?",
              alternativas: [
                { letra: "A", texto: "$p=-1,\\;q=-6$" },
                { letra: "B", texto: "$p=1,\\;q=-6$" },
                { letra: "C", texto: "$p=-1,\\;q=6$" },
                { letra: "D", texto: "$p=1,\\;q=6$" },
                { letra: "E", texto: "$p=5,\\;q=6$" },
              ],
              gabarito: "B",
              explicacao: "$x_1+x_2=2+(-3)=-1=-p \\Rightarrow p=1$. $x_1x_2=2\\times(-3)=-6=q$.",
            },
            // ── nível 4 ──────────────────────────────────────────────────────
            {
              id: "eq2-q7",
              enunciado: "Resolva $2x^2+3x-5=0$.",
              alternativas: [
                { letra: "A", texto: "$x_1=1$ e $x_2=-\\dfrac{5}{2}$" },
                { letra: "B", texto: "$x_1=5$ e $x_2=-1$" },
                { letra: "C", texto: "$x_1=2$ e $x_2=-3$" },
                { letra: "D", texto: "$x_1=-1$ e $x_2=\\dfrac{5}{2}$" },
                { letra: "E", texto: "$x_1=\\dfrac{1}{2}$ e $x_2=-5$" },
              ],
              gabarito: "A",
              explicacao: "$\\Delta=9+40=49$; $x=(-3\\pm7)/4$: $x_1=1$, $x_2=-5/2$.",
            },
            {
              id: "eq2-q8",
              enunciado: "(ENEM) Um número positivo $x$ satisfaz $x^2=x+2$. Qual é esse número?",
              alternativas: [
                { letra: "A", texto: "$-1$" },
                { letra: "B", texto: "$1$" },
                { letra: "C", texto: "$2$" },
                { letra: "D", texto: "$3$" },
                { letra: "E", texto: "$4$" },
              ],
              gabarito: "C",
              explicacao: "$x^2-x-2=0 \\Rightarrow (x-2)(x+1)=0$. Como $x>0$: $x=2$.",
            },
            // ── nível 5 ──────────────────────────────────────────────────────
            {
              id: "eq2-q9",
              enunciado: "Se $a$ é coeficiente líder e a soma das raízes de $ax^2-10x+c=0$ é $5$, qual é $a$?",
              alternativas: [
                { letra: "A", texto: "$1$" },
                { letra: "B", texto: "$2$" },
                { letra: "C", texto: "$5$" },
                { letra: "D", texto: "$10$" },
                { letra: "E", texto: "$\\dfrac{1}{2}$" },
              ],
              gabarito: "B",
              explicacao: "$x_1+x_2=10/a=5 \\Rightarrow a=2$.",
            },
            {
              id: "eq2-q10",
              enunciado: "(ENEM) A altura de uma pedra lançada verticalmente é $h(t)=-5t^2+30t$. Em que instante ela atinge a altura máxima?",
              alternativas: [
                { letra: "A", texto: "$1$ s" },
                { letra: "B", texto: "$2$ s" },
                { letra: "C", texto: "$3$ s" },
                { letra: "D", texto: "$5$ s" },
                { letra: "E", texto: "$6$ s" },
              ],
              gabarito: "C",
              explicacao: "Vértice: $t=-b/(2a)=30/10=3$ s.",
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
    "Substituição, adição, classificação (SPD/SPI/SI) e problemas de contexto — tudo que o ENEM cobra em sistemas lineares.",
  parentSlug: "algebra",
  capitulos: [
    {
      slug: "sistemas",
      titulo: "Sistemas de Equações",
      licoes: [
        {
          slug: "sistemas-lineares",
          titulo: "Sistemas lineares — substituição e adição",
          resumo: "Resolver sistemas $2\\times2$ pelos métodos de substituição e adição.",
          duracaoMinutos: 20,
          explicacao: `
### Sistema $2\\times2$

$$\\begin{cases}ax+by=c\\\\dx+ey=f\\end{cases}$$

### Substituição

1. Isole uma variável.
2. Substitua na outra equação.
3. Resolva e volte para encontrar a outra.

### Adição

Multiplique as equações por constantes e some para eliminar uma variável.

### Classificação

| Tipo | Soluções |
|---|---|
| SPD | Uma única |
| SPI | Infinitas |
| SI | Nenhuma |
`.trim(),
          exemplos: [
            {
              titulo: "Exemplo 1 — Substituição",
              problema: "$\\begin{cases}x+2y=8\\\\3x-y=3\\end{cases}$",
              resolucao: `
$x=8-2y$. Sub: $3(8-2y)-y=3 \\Rightarrow y=3$, $x=2$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Adição",
              problema: "$\\begin{cases}3x+2y=16\\\\5x-2y=8\\end{cases}$",
              resolucao: `
Somando: $8x=24 \\Rightarrow x=3$, $y=3{,}5$.
`.trim(),
            },
          ],
          exercicios: [
            // ── nível 1 ──────────────────────────────────────────────────────
            {
              id: "sis-q1",
              enunciado: "Resolva $\\begin{cases}x+y=10\\\\x-y=4\\end{cases}$. O valor de $x\\cdot y$ é:",
              alternativas: [
                { letra: "A", texto: "$21$" },
                { letra: "B", texto: "$24$" },
                { letra: "C", texto: "$20$" },
                { letra: "D", texto: "$18$" },
                { letra: "E", texto: "$15$" },
              ],
              gabarito: "A",
              explicacao: "Adição: $x=7$, $y=3$. Produto: $21$.",
            },
            {
              id: "sis-q2",
              enunciado: "Resolva $\\begin{cases}x+y=8\\\\x-y=2\\end{cases}$. Qual é $x$?",
              alternativas: [
                { letra: "A", texto: "$3$" },
                { letra: "B", texto: "$4$" },
                { letra: "C", texto: "$5$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$7$" },
              ],
              gabarito: "C",
              explicacao: "Adição: $2x=10 \\Rightarrow x=5$.",
            },
            // ── nível 2 ──────────────────────────────────────────────────────
            {
              id: "sis-q3",
              enunciado: "Se $\\begin{cases}2x+y=5\\\\x+2y=4\\end{cases}$, qual é $x+y$?",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$3$" },
                { letra: "C", texto: "$4$" },
                { letra: "D", texto: "$9$" },
                { letra: "E", texto: "$1$" },
              ],
              gabarito: "B",
              explicacao: "Somando as equações: $3(x+y)=9 \\Rightarrow x+y=3$.",
            },
            {
              id: "sis-q4",
              enunciado: "Resolva $\\begin{cases}y=3x\\\\x+y=8\\end{cases}$. Qual é $y$?",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$4$" },
                { letra: "C", texto: "$5$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$8$" },
              ],
              gabarito: "D",
              explicacao: "$x+3x=8 \\Rightarrow x=2$, $y=6$.",
            },
            // ── nível 3 ──────────────────────────────────────────────────────
            {
              id: "sis-q5",
              enunciado: "$\\begin{cases}2x+3y=12\\\\x-y=1\\end{cases}$. Qual é $y$?",
              alternativas: [
                { letra: "A", texto: "$1$" },
                { letra: "B", texto: "$2$" },
                { letra: "C", texto: "$3$" },
                { letra: "D", texto: "$4$" },
                { letra: "E", texto: "$5$" },
              ],
              gabarito: "B",
              explicacao: "$x=y+1$; sub: $2(y+1)+3y=12 \\Rightarrow 5y=10 \\Rightarrow y=2$.",
            },
            {
              id: "sis-q6",
              enunciado: "Dois números somam $30$ e um é o dobro do outro. Qual é o maior?",
              alternativas: [
                { letra: "A", texto: "$8$" },
                { letra: "B", texto: "$12$" },
                { letra: "C", texto: "$16$" },
                { letra: "D", texto: "$18$" },
                { letra: "E", texto: "$20$" },
              ],
              gabarito: "E",
              explicacao: "$x+y=30$ e $x=2y$: $3y=30 \\Rightarrow y=10$, $x=20$.",
            },
            {
              id: "sis-q7",
              enunciado: "Classifique o sistema $\\begin{cases}2x+4y=8\\\\x+2y=4\\end{cases}$.",
              alternativas: [
                { letra: "A", texto: "SPD — uma solução" },
                { letra: "B", texto: "SI — impossível" },
                { letra: "C", texto: "SPI — infinitas soluções" },
                { letra: "D", texto: "Não é linear" },
                { letra: "E", texto: "SPD — $x=2$" },
              ],
              gabarito: "C",
              explicacao: "A segunda equação é exatamente a metade da primeira: infinitas soluções (SPI).",
            },
            {
              id: "sis-q8",
              enunciado: "Classifique $\\begin{cases}x+y=3\\\\x+y=5\\end{cases}$.",
              alternativas: [
                { letra: "A", texto: "SPD" },
                { letra: "B", texto: "SPI" },
                { letra: "C", texto: "SI — impossível" },
                { letra: "D", texto: "Determinado, $x=4$" },
                { letra: "E", texto: "Indeterminado" },
              ],
              gabarito: "C",
              explicacao: "Subtraindo: $0=2$. Impossível (SI).",
            },
            // ── nível 4 ──────────────────────────────────────────────────────
            {
              id: "sis-q9",
              enunciado: "$\\begin{cases}3x+y=10\\\\x-y=2\\end{cases}$. Qual é $x+y$?",
              alternativas: [
                { letra: "A", texto: "$3$" },
                { letra: "B", texto: "$4$" },
                { letra: "C", texto: "$5$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$7$" },
              ],
              gabarito: "B",
              explicacao: "Adição: $4x=12 \\Rightarrow x=3$, $y=1$. $x+y=4$.",
            },
            {
              id: "sis-q10",
              enunciado: "$\\begin{cases}x+y+z=10\\\\x+y=7\\\\y+z=6\\end{cases}$. Qual é $x$?",
              alternativas: [
                { letra: "A", texto: "$1$" },
                { letra: "B", texto: "$3$" },
                { letra: "C", texto: "$4$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$7$" },
              ],
              gabarito: "C",
              explicacao: "De eq1−eq2: $z=3$. De eq3: $y=3$. De eq2: $x=4$.",
            },
            {
              id: "sis-q11",
              enunciado: "(Problema) Em uma loja, 3 camisetas e 2 calças custam R$\\ 200$. 2 camisetas e 3 calças custam R$\\ 250$. Qual é o preço de uma calça?",
              alternativas: [
                { letra: "A", texto: "$R\\$\\,50$" },
                { letra: "B", texto: "$R\\$\\,60$" },
                { letra: "C", texto: "$R\\$\\,70$" },
                { letra: "D", texto: "$R\\$\\,80$" },
                { letra: "E", texto: "$R\\$\\,90$" },
              ],
              gabarito: "C",
              explicacao: "$3c+2p=200$; $2c+3p=250$. Multiplicando: $9c+6p=600$; $4c+6p=500$. Subtraindo: $5c=100$, $c=20$. Sub: $p=70$.",
            },
            {
              id: "sis-q12",
              enunciado: "Classifique $\\begin{cases}2x-y=3\\\\4x-2y=6\\end{cases}$.",
              alternativas: [
                { letra: "A", texto: "SI — impossível" },
                { letra: "B", texto: "SPD — $x=2$" },
                { letra: "C", texto: "SPD — $x=3$" },
                { letra: "D", texto: "SPI — infinitas soluções" },
                { letra: "E", texto: "SPD — $x=1$" },
              ],
              gabarito: "D",
              explicacao: "A segunda equação é o dobro da primeira: SPI.",
            },
            // ── nível 5 ──────────────────────────────────────────────────────
            {
              id: "sis-q13",
              enunciado: "Um cinema vende ingressos adulto (R$\\ 20$) e infantil (R$\\ 10$). Com 30 ingressos e R$\\ 500$ em total, quantos adultos compraram?",
              alternativas: [
                { letra: "A", texto: "$10$" },
                { letra: "B", texto: "$15$" },
                { letra: "C", texto: "$20$" },
                { letra: "D", texto: "$25$" },
                { letra: "E", texto: "$28$" },
              ],
              gabarito: "C",
              explicacao: "$a+i=30$; $20a+10i=500 \\Rightarrow 2a+i=50$. Subtraindo: $a=20$.",
            },
            {
              id: "sis-q14",
              enunciado: "Um pai tem 3 vezes a idade do filho. Daqui a 10 anos, terá o dobro. Qual é a idade atual do filho?",
              alternativas: [
                { letra: "A", texto: "$8$" },
                { letra: "B", texto: "$10$" },
                { letra: "C", texto: "$12$" },
                { letra: "D", texto: "$15$" },
                { letra: "E", texto: "$20$" },
              ],
              gabarito: "B",
              explicacao: "$p=3f$; $p+10=2(f+10)$: $3f+10=2f+20 \\Rightarrow f=10$.",
            },
            {
              id: "sis-q15",
              enunciado: "$\\begin{cases}x+2y=7\\\\3x-y=7\\end{cases}$. Calcule $x-y$.",
              alternativas: [
                { letra: "A", texto: "$0$" },
                { letra: "B", texto: "$1$" },
                { letra: "C", texto: "$2$" },
                { letra: "D", texto: "$3$" },
                { letra: "E", texto: "$5$" },
              ],
              gabarito: "B",
              explicacao: "Substituição: $y=3x-7$; $x+2(3x-7)=7 \\Rightarrow x=3$, $y=2$. $x-y=1$.",
            },
            {
              id: "sis-q16",
              enunciado: "Para que o sistema $\\begin{cases}ax+y=3\\\\2x+by=1\\end{cases}$ tenha solução $(1,1)$, os valores de $a$ e $b$ são:",
              alternativas: [
                { letra: "A", texto: "$a=1,\\;b=2$" },
                { letra: "B", texto: "$a=2,\\;b=-1$" },
                { letra: "C", texto: "$a=-1,\\;b=2$" },
                { letra: "D", texto: "$a=3,\\;b=0$" },
                { letra: "E", texto: "$a=2,\\;b=1$" },
              ],
              gabarito: "B",
              explicacao: "$a+1=3 \\Rightarrow a=2$; $2+b=1 \\Rightarrow b=-1$.",
            },
            {
              id: "sis-q17",
              enunciado: "Em termos de $a$ e $b$, a solução de $\\begin{cases}x+y=a\\\\x-y=b\\end{cases}$ é $x=$:",
              alternativas: [
                { letra: "A", texto: "$a-b$" },
                { letra: "B", texto: "$\\dfrac{a-b}{2}$" },
                { letra: "C", texto: "$\\dfrac{a+b}{2}$" },
                { letra: "D", texto: "$a+b$" },
                { letra: "E", texto: "$\\dfrac{b-a}{2}$" },
              ],
              gabarito: "C",
              explicacao: "Somando as equações: $2x=a+b \\Rightarrow x=\\dfrac{a+b}{2}$.",
            },
            {
              id: "sis-q18",
              enunciado: "$\\begin{cases}2x+3y=13\\\\3x-2y=0\\end{cases}$. Qual é $x+y$?",
              alternativas: [
                { letra: "A", texto: "$3$" },
                { letra: "B", texto: "$4$" },
                { letra: "C", texto: "$5$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$7$" },
              ],
              gabarito: "C",
              explicacao: "De eq2: $y=3x/2$. Sub: $2x+9x/2=13 \\Rightarrow x=2$, $y=3$. $x+y=5$.",
            },
            {
              id: "sis-q19",
              enunciado: "(ENEM) Uma mistura de suco A (40% fruta) e suco B (70% fruta) resulta em 30 L a 52%. Quantos litros de A foram usados?",
              alternativas: [
                { letra: "A", texto: "$12$ L" },
                { letra: "B", texto: "$15$ L" },
                { letra: "C", texto: "$18$ L" },
                { letra: "D", texto: "$20$ L" },
                { letra: "E", texto: "$24$ L" },
              ],
              gabarito: "C",
              explicacao: "$a+b=30$; $0{,}4a+0{,}7b=15{,}6$. Sub: $0{,}3b=4{,}8 \\Rightarrow b=16$, $a=18$... aguarda: $0{,}4(30-b)+0{,}7b=15{,}6$; $12+0{,}3b=15{,}6$; $b=12$, $a=18$. ✓",
            },
            {
              id: "sis-q20",
              enunciado: "(ENEM) Uma empresa produz tênis A (2h máquina + 3h mão de obra) e B (4h + 1h). Disponível: 20h máquina e 15h mão de obra. Quantos tênis A podem ser produzidos?",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$3$" },
                { letra: "C", texto: "$4$" },
                { letra: "D", texto: "$5$" },
                { letra: "E", texto: "$6$" },
              ],
              gabarito: "C",
              explicacao: "$2A+4B=20$; $3A+B=15 \\Rightarrow B=15-3A$. Sub: $2A+4(15-3A)=20 \\Rightarrow -10A=-40 \\Rightarrow A=4$.",
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
    "Definição, propriedades, mudança de base e equações logarítmicas — tudo que o ENEM cobra com $\\log 2$ e $\\log 3$ tabelados.",
  parentSlug: "algebra",
  capitulos: [
    {
      slug: "logaritmos",
      titulo: "Logaritmos",
      licoes: [
        {
          slug: "definicao-e-propriedades",
          titulo: "Definição e propriedades",
          resumo: "O que é logaritmo e as quatro propriedades operacionais essenciais.",
          duracaoMinutos: 20,
          explicacao: `
### Definição

$$\\log_a b=x \\iff a^x=b\\quad(a>0,\\;a\\neq1,\\;b>0)$$

**Exemplo:** $\\log_2 8=3$ porque $2^3=8$.

### Casos especiais

$$\\log_a 1=0\\qquad\\log_a a=1\\qquad\\log_{10}x=\\log x$$

### 4 Propriedades

| | Fórmula |
|---|---|
| Produto | $\\log_a(MN)=\\log_a M+\\log_a N$ |
| Quociente | $\\log_a(M/N)=\\log_a M-\\log_a N$ |
| Potência | $\\log_a M^p=p\\cdot\\log_a M$ |
| Mudança de base | $\\log_a b=\\dfrac{\\log_c b}{\\log_c a}$ |
`.trim(),
          exemplos: [
            {
              titulo: "Exemplo 1 — Calcular",
              problema: "Calcule $\\log_3 81$ e $\\log_5\\frac{1}{25}$.",
              resolucao: `
$3^x=81=3^4 \\Rightarrow x=4$.

$5^x=5^{-2} \\Rightarrow x=-2$.
`.trim(),
            },
            {
              titulo: "Exemplo 2 — Propriedades",
              problema: "Com $\\log 2=0{,}301$ e $\\log 3=0{,}477$, calcule $\\log 72$.",
              resolucao: `
$72=2^3\\times3^2$

$\\log 72=3(0{,}301)+2(0{,}477)=1{,}857$
`.trim(),
            },
            {
              titulo: "Exemplo 3 — Equação",
              problema: "Resolva $\\log_2(x+1)=3$.",
              resolucao: `
$2^3=x+1 \\Rightarrow x=7$.
`.trim(),
            },
          ],
          exercicios: [
            // ── nível 1 ──────────────────────────────────────────────────────
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
              explicacao: "$4^x=64=4^3 \\Rightarrow x=3$.",
            },
            {
              id: "log-q2",
              enunciado: "$\\log_2 1 = ?$",
              alternativas: [
                { letra: "A", texto: "$0$" },
                { letra: "B", texto: "$1$" },
                { letra: "C", texto: "$2$" },
                { letra: "D", texto: "$-1$" },
                { letra: "E", texto: "$\\dfrac{1}{2}$" },
              ],
              gabarito: "A",
              explicacao: "$2^x=1 \\Rightarrow x=0$.",
            },
            {
              id: "log-q3",
              enunciado: "$\\log_5 125 = ?$",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$5$" },
                { letra: "C", texto: "$3$" },
                { letra: "D", texto: "$15$" },
                { letra: "E", texto: "$25$" },
              ],
              gabarito: "C",
              explicacao: "$5^x=125=5^3 \\Rightarrow x=3$.",
            },
            // ── nível 2 ──────────────────────────────────────────────────────
            {
              id: "log-q4",
              enunciado: "Se $\\log 2=0{,}30$ e $\\log 3=0{,}48$, qual é $\\log 6$?",
              alternativas: [
                { letra: "A", texto: "$0{,}14$" },
                { letra: "B", texto: "$0{,}78$" },
                { letra: "C", texto: "$0{,}18$" },
                { letra: "D", texto: "$0{,}90$" },
                { letra: "E", texto: "$1{,}08$" },
              ],
              gabarito: "B",
              explicacao: "$\\log 6=\\log 2+\\log 3=0{,}78$.",
            },
            {
              id: "log-q5",
              enunciado: "Se $\\log 2=0{,}30$, qual é $\\log 8$?",
              alternativas: [
                { letra: "A", texto: "$0{,}30$" },
                { letra: "B", texto: "$0{,}60$" },
                { letra: "C", texto: "$0{,}90$" },
                { letra: "D", texto: "$1{,}20$" },
                { letra: "E", texto: "$2{,}40$" },
              ],
              gabarito: "C",
              explicacao: "$\\log 8=\\log 2^3=3\\times0{,}30=0{,}90$.",
            },
            {
              id: "log-q6",
              enunciado: "Se $\\log 5=0{,}70$, qual é $\\log 50$?",
              alternativas: [
                { letra: "A", texto: "$0{,}70$" },
                { letra: "B", texto: "$1{,}40$" },
                { letra: "C", texto: "$1{,}70$" },
                { letra: "D", texto: "$3{,}50$" },
                { letra: "E", texto: "$7{,}00$" },
              ],
              gabarito: "C",
              explicacao: "$\\log 50=\\log 5+\\log 10=0{,}70+1=1{,}70$.",
            },
            // ── nível 3 ──────────────────────────────────────────────────────
            {
              id: "log-q7",
              enunciado: "Resolva $\\log_3(2x-1)=2$.",
              alternativas: [
                { letra: "A", texto: "$x=4$" },
                { letra: "B", texto: "$x=5$" },
                { letra: "C", texto: "$x=9$" },
                { letra: "D", texto: "$x=3$" },
                { letra: "E", texto: "$x=7$" },
              ],
              gabarito: "B",
              explicacao: "$3^2=2x-1 \\Rightarrow 9=2x-1 \\Rightarrow x=5$.",
            },
            {
              id: "log-q8",
              enunciado: "Qual é o valor de $\\log_2 32-\\log_2 4$?",
              alternativas: [
                { letra: "A", texto: "$8$" },
                { letra: "B", texto: "$4$" },
                { letra: "C", texto: "$2$" },
                { letra: "D", texto: "$3$" },
                { letra: "E", texto: "$1$" },
              ],
              gabarito: "D",
              explicacao: "$\\log_2(32/4)=\\log_2 8=3$.",
            },
            {
              id: "log-q9",
              enunciado: "Resolva $\\log_x 16=2$.",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$4$" },
                { letra: "C", texto: "$8$" },
                { letra: "D", texto: "$16$" },
                { letra: "E", texto: "$32$" },
              ],
              gabarito: "B",
              explicacao: "$x^2=16 \\Rightarrow x=4$ (base positiva, $\\neq1$).",
            },
            {
              id: "log-q10",
              enunciado: "Simplifique $\\log_2 32+\\log_2 4-\\log_2 8$.",
              alternativas: [
                { letra: "A", texto: "$2$" },
                { letra: "B", texto: "$3$" },
                { letra: "C", texto: "$4$" },
                { letra: "D", texto: "$6$" },
                { letra: "E", texto: "$8$" },
              ],
              gabarito: "C",
              explicacao: "$5+2-3=4$.",
            },
            // ── nível 4 ──────────────────────────────────────────────────────
            {
              id: "log-q11",
              enunciado: "$\\log_3 27+\\log_3\\dfrac{1}{3}=?$",
              alternativas: [
                { letra: "A", texto: "$0$" },
                { letra: "B", texto: "$2$" },
                { letra: "C", texto: "$3$" },
                { letra: "D", texto: "$4$" },
                { letra: "E", texto: "$9$" },
              ],
              gabarito: "B",
              explicacao: "$3+(-1)=2$.",
            },
            {
              id: "log-q12",
              enunciado: "Se $\\log_2 x=4$, qual é $\\log_2 x^3$?",
              alternativas: [
                { letra: "A", texto: "$4$" },
                { letra: "B", texto: "$7$" },
                { letra: "C", texto: "$8$" },
                { letra: "D", texto: "$12$" },
                { letra: "E", texto: "$16$" },
              ],
              gabarito: "D",
              explicacao: "$\\log_2 x^3=3\\log_2 x=12$.",
            },
            {
              id: "log-q13",
              enunciado: "Resolva $\\log_3(x+2)=\\log_3(2x-1)$.",
              alternativas: [
                { letra: "A", texto: "$x=1$" },
                { letra: "B", texto: "$x=2$" },
                { letra: "C", texto: "$x=3$" },
                { letra: "D", texto: "$x=5$" },
                { letra: "E", texto: "$x=7$" },
              ],
              gabarito: "C",
              explicacao: "$x+2=2x-1 \\Rightarrow x=3$. Verificação: $\\log_3 5=\\log_3 5$. ✓",
            },
            {
              id: "log-q14",
              enunciado: "Calcule $\\log_4 32$ usando mudança de base ($\\log_2$).",
              alternativas: [
                { letra: "A", texto: "$1{,}5$" },
                { letra: "B", texto: "$2$" },
                { letra: "C", texto: "$2{,}5$" },
                { letra: "D", texto: "$3$" },
                { letra: "E", texto: "$4$" },
              ],
              gabarito: "C",
              explicacao: "$\\log_4 32=\\dfrac{\\log_2 32}{\\log_2 4}=\\dfrac{5}{2}=2{,}5$.",
            },
            // ── nível 5 ──────────────────────────────────────────────────────
            {
              id: "log-q15",
              enunciado: "Se $\\log 2=0{,}30$, qual é $\\log\\sqrt{2}$?",
              alternativas: [
                { letra: "A", texto: "$0{,}10$" },
                { letra: "B", texto: "$0{,}15$" },
                { letra: "C", texto: "$0{,}20$" },
                { letra: "D", texto: "$0{,}60$" },
                { letra: "E", texto: "$0{,}30$" },
              ],
              gabarito: "B",
              explicacao: "$\\log 2^{1/2}=\\frac{1}{2}\\times0{,}30=0{,}15$.",
            },
            {
              id: "log-q16",
              enunciado: "Se $\\log_5 x=2$ e $\\log_5 y=3$, calcule $\\log_5(x^2y)$.",
              alternativas: [
                { letra: "A", texto: "$5$" },
                { letra: "B", texto: "$6$" },
                { letra: "C", texto: "$7$" },
                { letra: "D", texto: "$8$" },
                { letra: "E", texto: "$9$" },
              ],
              gabarito: "C",
              explicacao: "$2\\log_5 x+\\log_5 y=4+3=7$.",
            },
            {
              id: "log-q17",
              enunciado: "Resolva $\\log_2(x-1)+\\log_2(x+1)=3$.",
              alternativas: [
                { letra: "A", texto: "$x=2$" },
                { letra: "B", texto: "$x=3$" },
                { letra: "C", texto: "$x=4$" },
                { letra: "D", texto: "$x=5$" },
                { letra: "E", texto: "$x=9$" },
              ],
              gabarito: "B",
              explicacao: "$\\log_2[(x-1)(x+1)]=3 \\Rightarrow x^2-1=8 \\Rightarrow x^2=9 \\Rightarrow x=3$ (domínio: $x>1$).",
            },
            {
              id: "log-q18",
              enunciado: "Calcule $\\log_8 2+\\log_4 2$.",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{1}{2}$" },
                { letra: "B", texto: "$\\dfrac{2}{3}$" },
                { letra: "C", texto: "$\\dfrac{5}{6}$" },
                { letra: "D", texto: "$1$" },
                { letra: "E", texto: "$\\dfrac{1}{3}$" },
              ],
              gabarito: "C",
              explicacao: "$\\log_8 2=\\frac{1}{3}$ (pois $8^{1/3}=2$); $\\log_4 2=\\frac{1}{2}$ (pois $4^{1/2}=2$). Soma: $\\frac{1}{3}+\\frac{1}{2}=\\frac{5}{6}$.",
            },
            {
              id: "log-q19",
              enunciado: "(ENEM) Uma bactéria se divide a cada hora, dobrando a população. Após quantas horas uma bactéria se tornará $1024$?",
              alternativas: [
                { letra: "A", texto: "$8$" },
                { letra: "B", texto: "$10$" },
                { letra: "C", texto: "$12$" },
                { letra: "D", texto: "$5$" },
                { letra: "E", texto: "$7$" },
              ],
              gabarito: "B",
              explicacao: "$2^n=1024=2^{10} \\Rightarrow n=10$ horas.",
            },
            {
              id: "log-q20",
              enunciado: "(ENEM) Uma substância radioativa perde metade da massa a cada 10 anos. Após quantos anos restará $12{,}5\\%$ da quantidade inicial?",
              alternativas: [
                { letra: "A", texto: "$20$ anos" },
                { letra: "B", texto: "$25$ anos" },
                { letra: "C", texto: "$30$ anos" },
                { letra: "D", texto: "$40$ anos" },
                { letra: "E", texto: "$50$ anos" },
              ],
              gabarito: "C",
              explicacao: "$(1/2)^n=0{,}125=(1/2)^3 \\Rightarrow n=3$ meias-vidas $\\times 10=30$ anos.",
            },
          ],
        },
      ],
    },
  ],
};

// =============================================================================
// Trilha Hub — Álgebra
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
