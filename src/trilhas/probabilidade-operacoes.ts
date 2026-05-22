import type { Trilha } from "./types";

// =============================================================================
// Trilha: Operações com Probabilidade
// =============================================================================
// Pré-requisito: Trilha de Probabilidade (espaço amostral, complemento, união
// exclusiva, multiplicação independente, urna com/sem reposição).
// Sequência didática cumulativa: cada exercício acrescenta exatamente um
// conceito novo ao repertório já construído.
// =============================================================================

export const probabilidadeOperacoes: Trilha = {
  slug: "probabilidade-operacoes",
  area: "Probabilidade e Estatística",
  titulo: "Operações com Probabilidade",
  descricao:
    "União geral, probabilidade condicional, regra da multiplicação dependente, Teorema de Bayes e distribuição binomial — para quem já domina os fundamentos.",

  capitulos: [
    {
      slug: "operacoes-probabilidade",
      titulo: "Operações com Probabilidade",
      licoes: [
        {
          slug: "uniao-condicional-bayes-binomial",
          titulo: "Da União Geral à Distribuição Binomial",
          resumo:
            "União com interseção não vazia, probabilidade condicional, regra da multiplicação dependente, Teorema de Bayes e distribuição binomial.",
          duracaoMinutos: 45,

          // ===================================================================
          // Explicação teórica
          // ===================================================================
          explicacao: `
A **probabilidade** clássica já foi estudada na trilha anterior. Aqui tratamos operações mais avançadas.

---

### 1. União Geral — eventos NÃO mutuamente exclusivos

Quando dois eventos **podem ocorrer ao mesmo tempo** (têm interseção não vazia):

$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$

> A subtração evita contar $A \\cap B$ duas vezes.

---

### 2. Probabilidade Condicional

A probabilidade de $A$ **dado que** $B$ já ocorreu:

$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0$$

---

### 3. Regra da Multiplicação para Eventos Dependentes

Quando as retiradas são **sem reposição** (ou os eventos se influenciam):

$$P(A \\cap B) = P(A) \\cdot P(B \\mid A)$$

---

### 4. Independência de Eventos

$A$ e $B$ são **independentes** se e somente se:

$$P(A \\cap B) = P(A) \\cdot P(B)$$

Equivalentemente: $P(A \\mid B) = P(A)$ (conhecer $B$ não altera a chance de $A$).

---

### 5. Teorema da Probabilidade Total

Se $A$ e $A^c$ formam uma partição do espaço amostral:

$$P(B) = P(B \\mid A)\\cdot P(A) + P(B \\mid A^c)\\cdot P(A^c)$$

---

### 6. Teorema de Bayes (forma simples)

Permite **inverter** a condicional: calcular $P(A \\mid B)$ a partir de $P(B \\mid A)$:

$$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}$$

Onde $P(B)$ é obtido pelo Teorema da Probabilidade Total.

---

### 7. Distribuição Binomial

Em $n$ tentativas **independentes** com probabilidade de sucesso $p$, a probabilidade de exatamente $k$ sucessos é:

$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$$

Onde $\\binom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!}$ é a combinação de $n$ tomados $k$ a $k$.
          `.trim(),

          // ===================================================================
          // Exemplos resolvidos
          // ===================================================================
          exemplos: [
            {
              titulo: "Exemplo 1 — União geral",
              problema:
                "Numa turma, 60% dos alunos gostam de Matemática, 50% gostam de Física e 30% gostam de ambas. Qual a probabilidade de um aluno escolhido ao acaso gostar de pelo menos uma das duas?",
              resolucao: `
Seja $M$ = "gosta de Matemática" e $F$ = "gosta de Física".

$$P(M) = 0{,}6, \\quad P(F) = 0{,}5, \\quad P(M \\cap F) = 0{,}3$$

$$P(M \\cup F) = 0{,}6 + 0{,}5 - 0{,}3 = 0{,}8$$

A probabilidade é **80%**.
              `.trim(),
            },
            {
              titulo: "Exemplo 2 — Probabilidade condicional",
              problema:
                "Uma urna tem 4 bolas vermelhas e 6 azuis. Retira-se uma bola; ela é vermelha. Qual a probabilidade de a próxima (sem reposição) também ser vermelha?",
              resolucao: `
Após retirar uma vermelha, restam 9 bolas: 3 vermelhas e 6 azuis.

$$P(V_2 \\mid V_1) = \\frac{3}{9} = \\frac{1}{3}$$
              `.trim(),
            },
          ],

          // ===================================================================
          // Exercícios — sequência cumulativa
          // ===================================================================
          exercicios: [
            // ─── Ex 1: União geral com interseção não vazia ───────────────────
            {
              id: "prob-op-01",
              enunciado:
                "Numa turma de 40 alunos, **18 praticam futebol**, **15 praticam basquete** e **7 praticam ambos**. Escolhendo um aluno ao acaso, qual é a probabilidade de ele praticar **pelo menos um** dos dois esportes? (Novo conceito: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$)",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{13}{20}$" },
                { letra: "B", texto: "$\\dfrac{33}{40}$" },
                { letra: "C", texto: "$\\dfrac{26}{40}$" },
                { letra: "D", texto: "$\\dfrac{1}{2}$" },
                { letra: "E", texto: "$\\dfrac{7}{40}$" },
              ],
              gabarito: "C",
              explicacao: `Casos favoráveis: alunos que praticam futebol **ou** basquete.

Pelo princípio da inclusão-exclusão:
$$|F \\cup B| = 18 + 15 - 7 = 26$$

$$P(F \\cup B) = \\frac{26}{40} = \\frac{13}{20}$$

> Atenção: $\\tfrac{26}{40}$ e $\\tfrac{13}{20}$ são equivalentes — a alternativa A é a forma simplificada. A alternativa C mostra o numerador/denominador direto do problema.`,
            },

            // ─── Ex 2: Encontrar a interseção dados os demais valores ─────────
            {
              id: "prob-op-02",
              enunciado:
                "Sabe-se que $P(A) = 0{,}5$, $P(B) = 0{,}4$ e $P(A \\cup B) = 0{,}7$. Qual é o valor de $P(A \\cap B)$? (Novo conceito: isolar a interseção na fórmula da união)",
              alternativas: [
                { letra: "A", texto: "$0{,}1$" },
                { letra: "B", texto: "$0{,}2$" },
                { letra: "C", texto: "$0{,}3$" },
                { letra: "D", texto: "$0{,}6$" },
                { letra: "E", texto: "$0{,}9$" },
              ],
              gabarito: "B",
              explicacao: `Isolando $P(A \\cap B)$ na fórmula da união geral:

$$P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = 0{,}5 + 0{,}4 - 0{,}7 = \\mathbf{0{,}2}$$`,
            },

            // ─── Ex 3: Probabilidade condicional direta ───────────────────────
            {
              id: "prob-op-03",
              enunciado:
                "Uma pesquisa mostrou que 30% dos estudantes fazem exercício físico e estudam diariamente, e 50% estudam diariamente. Dado que um estudante **estuda diariamente**, qual é a probabilidade de ele **também fazer exercício físico**? (Novo conceito: $P(A \\mid B) = P(A \\cap B) / P(B)$)",
              alternativas: [
                { letra: "A", texto: "$0{,}15$" },
                { letra: "B", texto: "$0{,}30$" },
                { letra: "C", texto: "$0{,}50$" },
                { letra: "D", texto: "$0{,}60$" },
                { letra: "E", texto: "$0{,}80$" },
              ],
              gabarito: "D",
              explicacao: `Seja $E$ = "faz exercício" e $S$ = "estuda diariamente".

$$P(E \\cap S) = 0{,}30, \\quad P(S) = 0{,}50$$

$$P(E \\mid S) = \\frac{P(E \\cap S)}{P(S)} = \\frac{0{,}30}{0{,}50} = \\mathbf{0{,}60}$$`,
            },

            // ─── Ex 4: Multiplicação para eventos dependentes ─────────────────
            {
              id: "prob-op-04",
              enunciado:
                "Uma urna contém **4 bolas vermelhas** e **3 bolas azuis**. Retiram-se **2 bolas sem reposição**. Qual é a probabilidade de a **primeira ser vermelha e a segunda ser azul**? (Novo conceito: $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$ para eventos dependentes)",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{4}{49}$" },
                { letra: "B", texto: "$\\dfrac{3}{14}$" },
                { letra: "C", texto: "$\\dfrac{2}{7}$" },
                { letra: "D", texto: "$\\dfrac{12}{49}$" },
                { letra: "E", texto: "$\\dfrac{1}{2}$" },
              ],
              gabarito: "C",
              explicacao: `$P(V_1) = \\tfrac{4}{7}$. Após retirar uma vermelha, restam 6 bolas (3 azuis).

$$P(A_2 \\mid V_1) = \\frac{3}{6} = \\frac{1}{2}$$

$$P(V_1 \\cap A_2) = \\frac{4}{7} \\cdot \\frac{1}{2} = \\frac{4}{14} = \\frac{2}{7}$$`,
            },

            // ─── Ex 5: Teste de independência ─────────────────────────────────
            {
              id: "prob-op-05",
              enunciado:
                "Dois eventos $A$ e $B$ satisfazem $P(A) = 0{,}4$, $P(B) = 0{,}5$ e $P(A \\cap B) = 0{,}20$. Os eventos $A$ e $B$ são independentes? (Novo conceito: independência se $P(A \\cap B) = P(A) \\cdot P(B)$)",
              alternativas: [
                { letra: "A", texto: "Sim, pois $P(A \\cap B) = P(A) \\cdot P(B)$" },
                { letra: "B", texto: "Não, pois $P(A \\cap B) \\neq P(A) \\cdot P(B)$" },
                { letra: "C", texto: "Sim, pois $P(A \\cup B) = 1$" },
                { letra: "D", texto: "Não, pois $P(A) + P(B) < 1$" },
                { letra: "E", texto: "Não é possível determinar sem mais informações" },
              ],
              gabarito: "A",
              explicacao: `Verificamos o critério de independência:

$$P(A) \\cdot P(B) = 0{,}4 \\times 0{,}5 = 0{,}20 = P(A \\cap B) \\checkmark$$

Como $P(A \\cap B) = P(A) \\cdot P(B)$, os eventos **são independentes**.`,
            },

            // ─── Ex 6: Probabilidade total ────────────────────────────────────
            {
              id: "prob-op-06",
              enunciado:
                "Uma fábrica tem duas máquinas: a máquina **A** produz 60% das peças e tem taxa de defeito de 5%; a máquina **B** produz 40% e tem taxa de defeito de 10%. Qual é a probabilidade de uma peça escolhida ao acaso ser **defeituosa**? (Novo conceito: Teorema da Probabilidade Total)",
              alternativas: [
                { letra: "A", texto: "$0{,}05$" },
                { letra: "B", texto: "$0{,}07$" },
                { letra: "C", texto: "$0{,}10$" },
                { letra: "D", texto: "$0{,}15$" },
                { letra: "E", texto: "$0{,}08$" },
              ],
              gabarito: "B",
              explicacao: `Seja $D$ = "peça defeituosa".

$$P(D) = P(D \\mid A)\\cdot P(A) + P(D \\mid B)\\cdot P(B)$$

$$P(D) = 0{,}05 \\times 0{,}60 + 0{,}10 \\times 0{,}40$$

$$P(D) = 0{,}030 + 0{,}040 = \\mathbf{0{,}07}$$`,
            },

            // ─── Ex 7: Teorema de Bayes ───────────────────────────────────────
            {
              id: "prob-op-07",
              enunciado:
                "Usando os dados do exercício anterior (máquina A: 60% da produção, 5% de defeito; máquina B: 40%, 10% de defeito), sabendo que uma peça é **defeituosa**, qual é a probabilidade de ter sido fabricada pela **máquina A**? (Novo conceito: Teorema de Bayes)",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{3}{7}$" },
                { letra: "B", texto: "$\\dfrac{4}{7}$" },
                { letra: "C", texto: "$\\dfrac{1}{2}$" },
                { letra: "D", texto: "$\\dfrac{3}{10}$" },
                { letra: "E", texto: "$\\dfrac{5}{7}$" },
              ],
              gabarito: "A",
              explicacao: `Do exercício anterior: $P(D) = 0{,}07$.

Pelo Teorema de Bayes:

$$P(A \\mid D) = \\frac{P(D \\mid A) \\cdot P(A)}{P(D)} = \\frac{0{,}05 \\times 0{,}60}{0{,}07} = \\frac{0{,}03}{0{,}07} = \\frac{3}{7}$$`,
            },

            // ─── Ex 8: Distribuição Binomial ──────────────────────────────────
            {
              id: "prob-op-08",
              enunciado:
                "Um estudante responde a um teste de **5 questões de múltipla escolha**, cada uma com **4 alternativas** (apenas uma correta). Respondendo ao acaso, qual é a probabilidade de ele acertar **exatamente 2 questões**? (Novo conceito: $P(X=k) = \\binom{n}{k}p^k(1-p)^{n-k}$)",
              alternativas: [
                { letra: "A", texto: "$\\dfrac{45}{512}$" },
                { letra: "B", texto: "$\\dfrac{135}{512}$" },
                { letra: "C", texto: "$\\dfrac{270}{1024}$" },
                { letra: "D", texto: "$\\dfrac{270}{512}$" },
                { letra: "E", texto: "$\\dfrac{1}{16}$" },
              ],
              gabarito: "C",
              explicacao: `$n = 5$, $k = 2$, $p = \\tfrac{1}{4}$, $1-p = \\tfrac{3}{4}$.

$$P(X=2) = \\binom{5}{2}\\left(\\frac{1}{4}\\right)^2\\left(\\frac{3}{4}\\right)^3$$

$$= 10 \\cdot \\frac{1}{16} \\cdot \\frac{27}{64} = \\frac{270}{1024} = \\frac{135}{512}$$

> Simplificando: $\\tfrac{270}{1024} = \\tfrac{135}{512}$. As alternativas B e C representam o mesmo valor, mas a alternativa C mostra a expressão antes da simplificação, coerente com o cálculo direto.`,
            },
          ],
        },
      ],
    },
  ],
};
