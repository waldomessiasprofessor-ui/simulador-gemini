// ============================================================================
// Conteúdos adicionais: revisões de matemática básica + flashcards de
// Geometria Espacial. Importado por server/index.ts e exposto via
// /admin/seed-review-matematica-basica e /admin/seed-flashcards-geoespacial.
// ============================================================================

export type ReviseArticle = {
  titulo: string;
  topico: string;
  conteudo: string;
  questoes: Array<{
    enunciado: string;
    opcoes: string[];
    correta: number; // índice da opção correta (0-based)
  }>;
};

export type Flashcard = { front: string; back: string };

// ============================================================================
// 1. Operações com frações
// ============================================================================

export const FRACOES_ARTICLE: ReviseArticle = {
  titulo: "Operações com Frações",
  topico: "Aritmética",
  conteudo: `## 1. O que é uma fração?

Uma **fração** representa uma parte de um todo dividido em partes iguais. Na notação $\\dfrac{a}{b}$, com $b \\neq 0$:

• $a$ é o **numerador** (quantas partes tomamos)
• $b$ é o **denominador** (em quantas partes o todo foi dividido)

**Tipos de frações:**
• **Própria:** $|a| < |b|$ — representa menos que um inteiro. Ex.: $\\tfrac{3}{5}$
• **Imprópria:** $|a| \\geq |b|$ — representa um inteiro ou mais. Ex.: $\\tfrac{7}{3}$
• **Aparente:** quando é equivalente a um inteiro. Ex.: $\\tfrac{8}{4} = 2$
• **Mista:** um inteiro mais uma fração. Ex.: $2\\tfrac{1}{3} = \\tfrac{7}{3}$

---

## 2. Frações equivalentes e simplificação

Duas frações são **equivalentes** quando representam a mesma quantidade. Multiplicar (ou dividir) numerador e denominador pelo mesmo número diferente de zero gera uma fração equivalente:

$$\\frac{a}{b} = \\frac{a \\cdot k}{b \\cdot k} \\quad (k \\neq 0)$$

**Simplificar** uma fração é dividir numerador e denominador pelo seu máximo divisor comum (MDC), obtendo a **forma irredutível**.

**Exemplo:**

$$\\frac{24}{36} = \\frac{24 \\div 12}{36 \\div 12} = \\frac{2}{3}$$

---

## 3. Adição e subtração

**Caso 1 — Mesmo denominador:** soma-se (ou subtrai-se) os numeradores e conserva-se o denominador.

$$\\frac{a}{c} + \\frac{b}{c} = \\frac{a+b}{c}$$

**Caso 2 — Denominadores diferentes:** calcula-se o **MMC** dos denominadores e reduzem-se as frações a esse denominador comum antes de somar.

**Exemplo:**

$$\\frac{1}{6} + \\frac{3}{4} = \\frac{2}{12} + \\frac{9}{12} = \\frac{11}{12}$$

(MMC(6,4) = 12; depois: $12 \\div 6 \\cdot 1 = 2$ e $12 \\div 4 \\cdot 3 = 9$.)

**Atalho (soma cruzada)** — útil para duas frações:

$$\\frac{a}{b} + \\frac{c}{d} = \\frac{a\\,d + b\\,c}{b\\,d}$$

⚠️ Gera um denominador maior; simplifique ao final.

---

## 4. Multiplicação

Multiplica-se numerador com numerador e denominador com denominador:

$$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$$

**Dica:** simplifique antes de multiplicar (cancelamento cruzado) — evita números grandes.

**Exemplo:**

$$\\frac{4}{9} \\cdot \\frac{3}{8} = \\frac{\\cancel{4}^{\\,1}}{9} \\cdot \\frac{\\cancel{3}^{\\,1}}{\\cancel{8}^{\\,2}} \\cdot \\frac{1}{\\cancel{9}^{\\,3}} = \\frac{1}{6}$$

---

## 5. Divisão

Dividir por uma fração é multiplicar pelo seu **inverso** (também chamado recíproco):

$$\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c} = \\frac{a \\cdot d}{b \\cdot c}$$

**Exemplo:**

$$\\frac{5}{6} \\div \\frac{2}{3} = \\frac{5}{6} \\cdot \\frac{3}{2} = \\frac{15}{12} = \\frac{5}{4}$$

---

## 6. Potenciação e radiciação

**Potência:** eleva-se separadamente numerador e denominador:

$$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$$

**Expoente negativo** inverte a fração:

$$\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n$$

**Raiz:** extrai-se a raiz do numerador e do denominador:

$$\\sqrt[n]{\\frac{a}{b}} = \\frac{\\sqrt[n]{a}}{\\sqrt[n]{b}}$$

---

## 7. Fração de uma quantidade

"Fração de" em problemas significa **multiplicação**:

$$\\frac{a}{b} \\text{ de } N = \\frac{a}{b} \\cdot N$$

**Exemplo:** $\\tfrac{3}{4}$ de 200 reais $= \\tfrac{3}{4} \\cdot 200 = 150$ reais.

---

## 8. Erros mais comuns

❌ Somar numeradores e denominadores separadamente: $\\tfrac{1}{2} + \\tfrac{1}{3} \\neq \\tfrac{2}{5}$.

✅ O correto é: $\\tfrac{1}{2} + \\tfrac{1}{3} = \\tfrac{3}{6} + \\tfrac{2}{6} = \\tfrac{5}{6}$.

❌ Inverter a fração errada na divisão: na divisão $\\tfrac{a}{b} \\div \\tfrac{c}{d}$ inverte-se **apenas** a segunda.

❌ Esquecer de simplificar ao final: respostas como $\\tfrac{6}{8}$ devem virar $\\tfrac{3}{4}$.

---

## Resumo das operações

| Operação | Regra |
|---|---|
| Soma/Subtração (mesmo denom.) | $\\dfrac{a}{c} \\pm \\dfrac{b}{c} = \\dfrac{a \\pm b}{c}$ |
| Soma/Subtração (denom. diferentes) | Reduzir ao MMC |
| Multiplicação | $\\dfrac{a}{b} \\cdot \\dfrac{c}{d} = \\dfrac{ac}{bd}$ |
| Divisão | $\\dfrac{a}{b} \\div \\dfrac{c}{d} = \\dfrac{a}{b} \\cdot \\dfrac{d}{c}$ |
| Potência | $\\left(\\dfrac{a}{b}\\right)^n = \\dfrac{a^n}{b^n}$ |
| Fração de N | $\\dfrac{a}{b} \\cdot N$ |`,
  questoes: [
    {
      enunciado: "Calcule: $\\dfrac{2}{3} + \\dfrac{1}{4} - \\dfrac{1}{6}$.",
      opcoes: [
        "$\\dfrac{3}{4}$",
        "$\\dfrac{5}{6}$",
        "$\\dfrac{7}{12}$",
        "$\\dfrac{11}{12}$",
      ],
      correta: 0,
    },
    {
      enunciado: "Uma torneira enche $\\dfrac{3}{5}$ de um tanque em uma hora. Em quantas horas o tanque fica cheio?",
      opcoes: [
        "$\\dfrac{3}{5}$ h",
        "$\\dfrac{5}{3}$ h",
        "$\\dfrac{8}{5}$ h",
        "$2$ h",
      ],
      correta: 1,
    },
    {
      enunciado: "Simplifique a expressão $\\dfrac{\\tfrac{2}{3}}{\\tfrac{4}{9}}$.",
      opcoes: [
        "$\\dfrac{8}{27}$",
        "$\\dfrac{1}{3}$",
        "$\\dfrac{3}{2}$",
        "$\\dfrac{2}{3}$",
      ],
      correta: 2,
    },
  ],
};

// ============================================================================
// 2. Razão e Proporção
// ============================================================================

export const RAZAO_PROPORCAO_ARTICLE: ReviseArticle = {
  titulo: "Razão e Proporção",
  topico: "Aritmética",
  conteudo: `## 1. O que é uma razão?

**Razão** entre dois números $a$ e $b$ (com $b \\neq 0$) é o quociente $\\dfrac{a}{b}$, lido "$a$ está para $b$". Também escrito $a : b$.

• $a$ é o **antecedente**
• $b$ é o **consequente**

**Importante:** para fazer sentido como razão, as duas grandezas devem estar na **mesma unidade** (ou ser adimensionais, como em escalas e densidades).

**Exemplos:**
• Escala: $1 : 50\\,000$ — cada 1 cm no mapa equivale a 50.000 cm no real.
• Densidade: $\\rho = \\dfrac{m}{V}$ (kg/m³).
• Velocidade média: $v = \\dfrac{\\Delta s}{\\Delta t}$ (km/h).

---

## 2. Razões equivalentes

Duas razões são **equivalentes** quando representam o mesmo quociente:

$$\\frac{2}{3} = \\frac{4}{6} = \\frac{10}{15}$$

---

## 3. O que é uma proporção?

**Proporção** é uma igualdade entre duas razões:

$$\\frac{a}{b} = \\frac{c}{d}$$

Lê-se "$a$ está para $b$ assim como $c$ está para $d$".

• $a$ e $d$ são os **extremos**
• $b$ e $c$ são os **meios**

---

## 4. Propriedade Fundamental

> **Em toda proporção, o produto dos meios é igual ao produto dos extremos.**

$$\\frac{a}{b} = \\frac{c}{d} \\iff a \\cdot d = b \\cdot c$$

Esta é a famosa **regra do "cruzamento"** (ou multiplicação em cruz), muito usada para resolver equações.

**Exemplo:** encontrar $x$ em $\\dfrac{x}{12} = \\dfrac{3}{4}$.

$$4x = 12 \\cdot 3 \\implies x = \\frac{36}{4} = 9$$

---

## 5. Propriedades úteis

**5.1 Soma/subtração de antecedentes e consequentes:**

$$\\frac{a}{b} = \\frac{c}{d} \\implies \\frac{a+c}{b+d} = \\frac{a-c}{b-d} = \\frac{a}{b}$$

**5.2 Inversão:**

$$\\frac{a}{b} = \\frac{c}{d} \\iff \\frac{b}{a} = \\frac{d}{c}$$

**5.3 Alternar:**

$$\\frac{a}{b} = \\frac{c}{d} \\iff \\frac{a}{c} = \\frac{b}{d}$$

---

## 6. Grandezas Diretamente Proporcionais

Duas grandezas $x$ e $y$ são **diretamente proporcionais** quando seu **quociente** é constante:

$$\\frac{y}{x} = k \\implies y = k \\cdot x$$

Quando uma **dobra**, a outra **dobra**; quando uma **triplica**, a outra **triplica**.

**Exemplo:** preço total × quantidade de produto (com preço unitário constante).

---

## 7. Grandezas Inversamente Proporcionais

Duas grandezas $x$ e $y$ são **inversamente proporcionais** quando seu **produto** é constante:

$$x \\cdot y = k \\implies y = \\frac{k}{x}$$

Quando uma **dobra**, a outra é **reduzida à metade**.

**Exemplo:** velocidade × tempo de viagem (para distância fixa); número de operários × tempo de obra (para a mesma tarefa).

---

## 8. Regra de Três Simples

**Direta** (grandezas diretamente proporcionais):

$$\\frac{a}{b} = \\frac{x}{y}$$

**Inversa** (grandezas inversamente proporcionais): invertem-se os termos do lado não conhecido:

$$\\frac{a}{b} = \\frac{y}{x}$$

**Exemplo direta:** 5 kg de arroz custam R\\$ 25; quanto custam 12 kg?

$$\\frac{5}{25} = \\frac{12}{x} \\implies x = \\frac{12 \\cdot 25}{5} = 60 \\text{ reais}$$

**Exemplo inversa:** 6 operários constroem um muro em 12 dias. Em quantos dias 9 operários constroem o mesmo muro?

$$\\frac{6}{9} = \\frac{x}{12} \\implies x = \\frac{6 \\cdot 12}{9} = 8 \\text{ dias}$$

---

## 9. Regra de Três Composta

Envolve **três ou mais grandezas**. Passos:

1. Monte uma tabela relacionando as grandezas com a incógnita $x$.
2. Analise se cada grandeza é **direta** ou **inversa** em relação a $x$ (marque com setas).
3. Grandezas **diretas**: mantêm a fração como está.
4. Grandezas **inversas**: invertem a fração correspondente.
5. Isole $x$.

**Exemplo:** 4 máquinas produzem 800 peças em 5 dias. Quantas peças 6 máquinas produzem em 8 dias?

| Máquinas | Peças | Dias |
|---|---|---|
| 4 | 800 | 5 |
| 6 | $x$ | 8 |

• Máquinas × peças: quanto mais máquinas, mais peças → **direta**.
• Dias × peças: quanto mais dias, mais peças → **direta**.

$$\\frac{800}{x} = \\frac{4}{6} \\cdot \\frac{5}{8} = \\frac{20}{48} = \\frac{5}{12}$$

$$x = \\frac{800 \\cdot 12}{5} = 1920 \\text{ peças}$$

---

## Resumo

| Conceito | Fórmula / Regra |
|---|---|
| Razão | $\\dfrac{a}{b}$, com $b \\neq 0$ |
| Proporção | $\\dfrac{a}{b} = \\dfrac{c}{d}$ |
| Prop. fundamental | $a \\cdot d = b \\cdot c$ |
| Diretamente prop. | $y = k \\cdot x$ |
| Inversamente prop. | $x \\cdot y = k$ |
| Regra de 3 simples | $\\dfrac{a}{b} = \\dfrac{x}{y}$ (direta) ou $\\dfrac{a}{b} = \\dfrac{y}{x}$ (inversa) |`,
  questoes: [
    {
      enunciado: "Se 8 operários constroem um muro em 15 dias, em quantos dias 12 operários construirão o mesmo muro, trabalhando no mesmo ritmo?",
      opcoes: [
        "8 dias",
        "10 dias",
        "12 dias",
        "22,5 dias",
      ],
      correta: 1,
    },
    {
      enunciado: "Em um mapa, a distância entre duas cidades é de 6 cm. Se a escala do mapa é 1 : 500.000, a distância real entre as cidades é:",
      opcoes: [
        "3 km",
        "30 km",
        "60 km",
        "300 km",
      ],
      correta: 1,
    },
    {
      enunciado: "Duas grandezas $x$ e $y$ são inversamente proporcionais. Se $x = 6$ quando $y = 20$, qual é o valor de $y$ quando $x = 15$?",
      opcoes: [
        "4",
        "8",
        "12",
        "50",
      ],
      correta: 1,
    },
  ],
};

// ============================================================================
// 3. Divisão em Partes Proporcionais
// ============================================================================

export const DIVISAO_PROPORCIONAL_ARTICLE: ReviseArticle = {
  titulo: "Divisão em Partes Proporcionais",
  topico: "Aritmética",
  conteudo: `## 1. Introdução

Dividir uma quantidade **em partes proporcionais** significa repartir essa quantidade de modo que **cada parte seja proporcional** a um número dado. É uma aplicação direta de proporção — muito cobrada em questões de sociedade, herança, premiação e divisão de lucros.

---

## 2. Divisão em Partes Diretamente Proporcionais

**Problema-padrão:** dividir o número $N$ em partes $x$, $y$, $z$ **diretamente proporcionais** a $a$, $b$, $c$.

Condições:

$$\\frac{x}{a} = \\frac{y}{b} = \\frac{z}{c} = k \\qquad \\text{e} \\qquad x + y + z = N$$

**Método da constante $k$:**

$$k = \\frac{N}{a + b + c}$$

Depois, $x = k \\cdot a$, $y = k \\cdot b$, $z = k \\cdot c$.

**Exemplo:** dividir R\\$ 1.800 entre três sócios, em partes diretamente proporcionais a 2, 3 e 4.

$$k = \\frac{1800}{2+3+4} = \\frac{1800}{9} = 200$$

Logo: $x = 400$, $y = 600$, $z = 800$. (Confere: $400+600+800 = 1800$ ✓)

---

## 3. Divisão em Partes Inversamente Proporcionais

**Problema-padrão:** dividir $N$ em partes **inversamente proporcionais** a $a$, $b$, $c$.

Quando uma parte é inversamente proporcional a $a$, é **diretamente proporcional a $\\dfrac{1}{a}$**. Então:

$$\\frac{x}{1/a} = \\frac{y}{1/b} = \\frac{z}{1/c} = k$$

Logo: $x = \\dfrac{k}{a}$, $y = \\dfrac{k}{b}$, $z = \\dfrac{k}{c}$, com:

$$k = \\frac{N}{\\tfrac{1}{a} + \\tfrac{1}{b} + \\tfrac{1}{c}}$$

**Dica prática:** some $\\tfrac{1}{a} + \\tfrac{1}{b} + \\tfrac{1}{c}$ reduzindo ao MMC e divida $N$ pelo resultado.

**Exemplo:** dividir R\\$ 1.300 em partes inversamente proporcionais a 2, 3 e 4.

Inverter: $\\tfrac{1}{2}, \\tfrac{1}{3}, \\tfrac{1}{4}$. MMC(2,3,4) = 12.

$$\\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4} = \\frac{6+4+3}{12} = \\frac{13}{12}$$

$$k = \\frac{1300}{13/12} = 1300 \\cdot \\frac{12}{13} = 1200$$

Logo: $x = \\tfrac{1200}{2} = 600$, $y = \\tfrac{1200}{3} = 400$, $z = \\tfrac{1200}{4} = 300$. (Confere: $600+400+300 = 1300$ ✓)

---

## 4. Divisão Composta

Dividir $N$ em partes **simultaneamente proporcionais** a mais de um critério.

**Exemplo:** dividir R\\$ 9.500 entre dois funcionários A e B:
• Diretamente proporcional aos anos de serviço: 8 e 12
• Diretamente proporcional às horas trabalhadas: 40 e 50

Para cada funcionário, multiplicam-se os fatores:

$$A : B = (8 \\cdot 40) : (12 \\cdot 50) = 320 : 600 = 8 : 15$$

$$k = \\frac{9500}{8+15} = \\frac{9500}{23}$$

Como $9500 / 23 \\approx 413{,}04$, vem: $A \\approx 3304{,}35$ e $B \\approx 6195{,}65$.

**Regra geral — grandezas diretas multiplicam, inversas dividem (ou usam o recíproco).**

---

## 5. Situações típicas em vestibular

### 5.1 Sociedade / Capital

> Três sócios investiram R\\$ 20.000, R\\$ 30.000 e R\\$ 50.000. Como dividir um lucro de R\\$ 20.000?

Diretamente proporcional ao capital: razões $2 : 3 : 5$, $k = 20000/10 = 2000$.

→ R\\$ 4.000, R\\$ 6.000, R\\$ 10.000.

### 5.2 Sociedade com tempos diferentes

> A entrou com R\\$ 10.000 por 6 meses; B entrou com R\\$ 15.000 por 4 meses.

Multiplicar capital × tempo: $A : B = 60000 : 60000 = 1 : 1$ — lucro igual.

### 5.3 Herança

> Três herdeiros recebem em partes **inversamente** proporcionais às suas idades (18, 24, 36 anos) — o mais novo recebe mais.

---

## 6. Estratégia para resolver qualquer exercício

1. **Identifique** se é direta ou inversa (releia o enunciado).
2. **Monte** as razões $x/a = y/b = \\ldots = k$.
3. **Use** a equação de soma $x + y + \\ldots = N$ para achar $k$.
4. **Multiplique** (direta) ou **divida por** (inversa) cada número de proporção.
5. **Confira:** a soma dos valores deve dar o total $N$.

---

## Resumo

| Tipo | Fórmula de $k$ | Cada parte |
|---|---|---|
| Direta | $k = \\dfrac{N}{a+b+c}$ | $x = k \\cdot a$ |
| Inversa | $k = \\dfrac{N}{\\tfrac{1}{a}+\\tfrac{1}{b}+\\tfrac{1}{c}}$ | $x = \\dfrac{k}{a}$ |
| Composta | Multiplica diretas, inverte inversas, depois aplica direta. | — |`,
  questoes: [
    {
      enunciado: "Divida R\\$ 4.200 entre três pessoas em partes diretamente proporcionais a 2, 5 e 7. Quanto recebe a pessoa com proporção 5?",
      opcoes: [
        "R\\$ 600",
        "R\\$ 1.050",
        "R\\$ 1.500",
        "R\\$ 2.100",
      ],
      correta: 2,
    },
    {
      enunciado: "Uma quantia de R\\$ 2.600 é dividida entre dois irmãos em partes inversamente proporcionais às idades 10 e 15. O irmão mais velho recebe:",
      opcoes: [
        "R\\$ 1.040",
        "R\\$ 1.300",
        "R\\$ 1.560",
        "R\\$ 1.800",
      ],
      correta: 0,
    },
    {
      enunciado: "Três sócios, A, B e C, montaram uma empresa com os capitais R\\$ 10.000, R\\$ 20.000 e R\\$ 30.000, respectivamente. Ao fim do ano, o lucro de R\\$ 18.000 foi distribuído em partes diretamente proporcionais ao capital investido. A parte de B é:",
      opcoes: [
        "R\\$ 3.000",
        "R\\$ 6.000",
        "R\\$ 9.000",
        "R\\$ 12.000",
      ],
      correta: 1,
    },
  ],
};

// ============================================================================
// 4. Princípio Fundamental da Contagem + Fatorial (novo)
// ============================================================================

export const CONTAGEM_FATORIAL_ARTICLE: ReviseArticle = {
  titulo: "Princípio Fundamental da Contagem e Fatorial",
  topico: "Análise Combinatória",
  conteudo: `## 1. O que é contar sem contar?

Imagine que você precise saber de quantas maneiras algo pode acontecer — **sem ter paciência de listar todas**. A **Análise Combinatória** entrega fórmulas e princípios que resolvem esse tipo de problema.

O ponto de partida de tudo é o **Princípio Fundamental da Contagem (PFC)**, também chamado de **princípio multiplicativo**.

---

## 2. Princípio Fundamental da Contagem

> Se uma decisão $D_1$ pode ser tomada de $n_1$ maneiras, e, em seguida, uma decisão $D_2$ pode ser tomada de $n_2$ maneiras, então o número total de maneiras de tomar as duas decisões **sucessivamente** é:
>
> $$n_1 \\cdot n_2$$

O princípio se estende a **qualquer quantidade de etapas**:

$$N = n_1 \\cdot n_2 \\cdot n_3 \\cdot \\ldots \\cdot n_k$$

**Ideia-chave:** cada "decisão" é uma escolha independente entre alternativas. Quando estão encadeadas ("e depois"), multiplicamos; quando estão em paralelo ("ou"), somamos.

---

## 3. Exemplos práticos

### 3.1 Placas de carro (combinatória básica)

> Uma placa tem 3 letras (A–Z, 26 letras) seguidas de 4 algarismos (0–9). Quantas placas diferentes existem?

$$N = 26 \\cdot 26 \\cdot 26 \\cdot 10 \\cdot 10 \\cdot 10 \\cdot 10 = 26^3 \\cdot 10^4 = 175\\,760\\,000$$

### 3.2 Cardápio

> Um restaurante oferece 4 entradas, 6 pratos principais e 3 sobremesas. Quantos menus completos (entrada + prato + sobremesa) podem ser montados?

$$4 \\cdot 6 \\cdot 3 = 72 \\text{ menus}$$

### 3.3 Senha com letras distintas

> Quantas senhas de 4 letras distintas podem ser formadas com as 26 letras do alfabeto?

Primeira letra: 26 opções. Segunda: 25 (não repete). Terceira: 24. Quarta: 23.

$$26 \\cdot 25 \\cdot 24 \\cdot 23 = 358\\,800$$

### 3.4 Senha com dígitos, sem restrição

> Quantas senhas de 4 dígitos existem se os dígitos podem se repetir?

$$10 \\cdot 10 \\cdot 10 \\cdot 10 = 10\\,000$$

### 3.5 Caminho em um tabuleiro

> De quantas formas ir de A até B num grid 3×2 andando sempre para a direita ou para cima?

Cada caminho é uma sequência de 3 "direitas" (D) e 2 "cimas" (C), em alguma ordem. São 5 passos dos quais 2 são "C":

$$\\binom{5}{2} = 10 \\text{ caminhos}$$

(Aqui já aparece o coeficiente binomial, que se apoia no PFC + fatorial.)

---

## 4. E quando algo **não pode** acontecer? Use o complementar.

> Quantas senhas de 4 algarismos existem em que **pelo menos um** dígito é ímpar?

Em vez de contar casos complicados, conte o **complementar**:

$$N_{\\text{total}} = 10^4 = 10\\,000$$

$$N_{\\text{nenhum ímpar}} = 5^4 = 625 \\quad (\\text{só dígitos pares: } 0,2,4,6,8)$$

$$N_{\\text{pelo menos um ímpar}} = 10\\,000 - 625 = 9\\,375$$

---

## 5. Fatorial — a ferramenta que multiplica descendentes

### 5.1 Definição

O **fatorial** de um número natural $n$ é o produto de todos os inteiros positivos de 1 até $n$:

$$n! = n \\cdot (n-1) \\cdot (n-2) \\cdot \\ldots \\cdot 2 \\cdot 1$$

**Definições especiais:** $\\;0! = 1\\;$ e $\\;1! = 1$.

### 5.2 Tabela dos primeiros fatoriais

| $n$ | $n!$ |
|---|---|
| 0 | 1 |
| 1 | 1 |
| 2 | 2 |
| 3 | 6 |
| 4 | 24 |
| 5 | 120 |
| 6 | 720 |
| 7 | 5 040 |
| 8 | 40 320 |
| 9 | 362 880 |
| 10 | 3 628 800 |

Perceba como $n!$ cresce **muito depressa**: $20! \\approx 2{,}4 \\cdot 10^{18}$.

### 5.3 Propriedade recursiva

$$n! = n \\cdot (n-1)!$$

Consequência útil em questões com fatoriais no numerador e denominador:

$$\\frac{10!}{8!} = \\frac{10 \\cdot 9 \\cdot 8!}{8!} = 10 \\cdot 9 = 90$$

$$\\frac{(n+1)!}{(n-1)!} = (n+1) \\cdot n$$

---

## 6. Por que $0! = 1$?

Duas razões justificam:

**Razão algébrica** — para que $n! = n \\cdot (n-1)!$ funcione em $n=1$: $1! = 1 \\cdot 0! \\implies 0! = 1$.

**Razão combinatória** — existe **exatamente 1 maneira** de ordenar 0 objetos (a sequência vazia). Portanto o total de permutações de zero elementos é 1.

---

## 7. Ligando PFC e fatorial: permutações

**Permutações** são arranjos ordenados de **todos** os $n$ elementos de um conjunto. Aplicando o PFC:

$$P_n = n \\cdot (n-1) \\cdot (n-2) \\cdot \\ldots \\cdot 1 = n!$$

**Exemplo:** de quantas maneiras 5 livros diferentes podem ser arranjados em uma prateleira?

$$P_5 = 5! = 120$$

E se quisermos arranjos de $p$ elementos em $n$ (sem repetição)?

$$A_{n,p} = n \\cdot (n-1) \\cdot \\ldots \\cdot (n-p+1) = \\frac{n!}{(n-p)!}$$

(Isto é o **arranjo simples** — quando a ordem importa.)

Para **combinação simples** (quando a ordem **não** importa):

$$C_{n,p} = \\binom{n}{p} = \\frac{n!}{p!\\,(n-p)!}$$

---

## 8. Dicas para a prova

• **Leia devagar**: "e" geralmente significa multiplicação (PFC); "ou" em casos disjuntos significa soma.
• **Ordem importa?** Se sim → arranjo (ou PFC direto). Se não → combinação.
• **Pode repetir?** Elementos repetidos mudam o problema (permutações com repetição).
• **"Pelo menos um"** — pense no complementar.
• **Simplifique fatoriais** antes de calcular: em $\\tfrac{n!}{(n-2)!}$, não calcule $n!$ cheio.

---

## Resumo

| Conceito | Fórmula |
|---|---|
| PFC | $N = n_1 \\cdot n_2 \\cdot \\ldots \\cdot n_k$ |
| Fatorial | $n! = n \\cdot (n-1) \\cdot \\ldots \\cdot 1$ |
| Convenção | $0! = 1$ |
| Recursão | $n! = n \\cdot (n-1)!$ |
| Permutação simples | $P_n = n!$ |
| Arranjo simples | $A_{n,p} = \\dfrac{n!}{(n-p)!}$ |
| Combinação simples | $C_{n,p} = \\dfrac{n!}{p!\\,(n-p)!}$ |`,
  questoes: [
    {
      enunciado: "De quantas maneiras diferentes 6 amigos podem se sentar em 6 cadeiras em fila?",
      opcoes: [
        "36",
        "120",
        "360",
        "720",
      ],
      correta: 3,
    },
    {
      enunciado: "Simplifique a expressão $\\dfrac{(n+2)!}{n!}$.",
      opcoes: [
        "$n + 2$",
        "$(n+1)(n+2)$",
        "$n(n+1)(n+2)$",
        "$\\dfrac{n+2}{n}$",
      ],
      correta: 1,
    },
    {
      enunciado: "Quantas senhas de 4 dígitos podem ser formadas usando apenas os algarismos de 0 a 9, permitindo repetição, mas que tenham pelo menos um dígito par?",
      opcoes: [
        "625",
        "5 000",
        "9 375",
        "10 000",
      ],
      correta: 2,
    },
  ],
};

// ============================================================================
// Lista dos 4 artigos para o seed com upsert
// ============================================================================

export const MATEMATICA_BASICA_ARTICLES: ReviseArticle[] = [
  FRACOES_ARTICLE,
  RAZAO_PROPORCAO_ARTICLE,
  DIVISAO_PROPORCIONAL_ARTICLE,
  CONTAGEM_FATORIAL_ARTICLE,
];

// ============================================================================
// Flashcards de Geometria Espacial (50 cards)
// Mistura conceitos, fórmulas e relações (Euler, Cavalieri, Platão).
// ============================================================================

export const GEO_ESPACIAL_CARDS: Flashcard[] = [
  // ── Conceitos iniciais ──────────────────────────────────────────────────
  {
    front: "O que é um poliedro?",
    back:  "Sólido geométrico limitado por um **número finito de polígonos planos**, chamados **faces**. As intersecções das faces formam as **arestas**, e os pontos de encontro das arestas formam os **vértices**.",
  },
  {
    front: "Relação de Euler\n\nVálida em todo poliedro convexo, relaciona vértices ($V$), arestas ($A$) e faces ($F$).",
    back:  "$$V - A + F = 2$$\n\nVale também para muitos poliedros não convexos de gênero 0 (sem \"furos\").",
  },
  {
    front: "Poliedros de Platão — quantos são?\n\nCite-os.",
    back:  "São **5**: tetraedro regular, cubo (hexaedro), octaedro, dodecaedro e icosaedro.\n\nTodos têm faces regulares congruentes e o mesmo número de arestas em cada vértice.",
  },
  {
    front: "Poliedros de Platão — faces, vértices e arestas\n\nComplete a tabela.",
    back:  "| Poliedro | $F$ | $V$ | $A$ |\n|---|---|---|---|\n| Tetraedro | 4 | 4 | 6 |\n| Cubo | 6 | 8 | 12 |\n| Octaedro | 8 | 6 | 12 |\n| Dodecaedro | 12 | 20 | 30 |\n| Icosaedro | 20 | 12 | 30 |",
  },
  {
    front: "Relação entre arestas e faces em um poliedro\n\nSe $F_n$ = número de faces de $n$ lados, qual é a soma que dá $2A$?",
    back:  "$$2A = \\sum_{n \\geq 3} n \\cdot F_n = 3F_3 + 4F_4 + 5F_5 + \\ldots$$\n\nCada aresta é compartilhada por exatamente 2 faces.",
  },
  {
    front: "Teorema de Cavalieri\n\nEnuncie.",
    back:  "Dois sólidos com **mesma altura** e cujas **secções planas paralelas à base têm sempre áreas iguais** possuem o **mesmo volume**.\n\nEste é o princípio que justifica as fórmulas de volume de sólidos oblíquos a partir dos retos.",
  },
  // ── Prismas ─────────────────────────────────────────────────────────────
  {
    front: "Prisma — definição",
    back:  "Sólido com **duas bases poligonais congruentes e paralelas**, ligadas por paralelogramos (faces laterais).\n\nReto: arestas laterais ⊥ à base. Oblíquo: não perpendicular.",
  },
  {
    front: "Volume do prisma\n\nÁrea da base $A_b$ e altura $h$.",
    back:  "$$V = A_b \\cdot h$$\n\nVale para prismas **retos ou oblíquos** (consequência de Cavalieri).",
  },
  {
    front: "Área total do prisma reto\n\nÁrea da base $A_b$ e área lateral $A_l$.",
    back:  "$$A_t = 2 \\cdot A_b + A_l$$\n\n$A_l = \\text{perímetro da base} \\cdot h$.",
  },
  {
    front: "Paralelepípedo retângulo — diagonal\n\nArestas $a$, $b$, $c$.",
    back:  "$$d = \\sqrt{a^2 + b^2 + c^2}$$\n\nAplicação dupla de Pitágoras: primeiro na base ($d_b = \\sqrt{a^2+b^2}$), depois com a altura.",
  },
  {
    front: "Paralelepípedo retângulo — volume e área\n\nArestas $a$, $b$, $c$.",
    back:  "$$V = a \\cdot b \\cdot c \\qquad A_t = 2(ab + ac + bc)$$",
  },
  {
    front: "Cubo — diagonal, volume e área\n\nAresta $a$.",
    back:  "$$d = a\\sqrt{3} \\qquad V = a^3 \\qquad A_t = 6a^2$$\n\nDiagonal de face: $d_f = a\\sqrt{2}$.",
  },
  // ── Cilindro ───────────────────────────────────────────────────────────
  {
    front: "Cilindro — volume\n\nRaio da base $r$, altura $h$.",
    back:  "$$V = \\pi r^2 \\cdot h$$\n\nVale para cilindros retos ou oblíquos.",
  },
  {
    front: "Cilindro reto — área lateral, base e total\n\nRaio $r$, altura $h$.",
    back:  "$$A_l = 2\\pi r h \\qquad A_b = \\pi r^2$$\n$$A_t = 2\\pi r h + 2\\pi r^2 = 2\\pi r (h + r)$$",
  },
  {
    front: "Cilindro equilátero",
    back:  "Cilindro cuja **altura é igual ao diâmetro da base**: $h = 2r$.\n\nA secção meridiana é um **quadrado** de lado $2r$.",
  },
  {
    front: "Cilindro — superfície lateral planificada",
    back:  "A lateral de um cilindro reto, quando planificada, é um **retângulo** com:\n\n• Base = $2\\pi r$ (comprimento da circunferência)\n• Altura = $h$",
  },
  // ── Cone ───────────────────────────────────────────────────────────────
  {
    front: "Cone — volume\n\nRaio da base $r$, altura $h$.",
    back:  "$$V = \\frac{1}{3}\\,\\pi r^2 \\cdot h$$\n\nTrês cones inscritos num cilindro de mesma base e altura enchem exatamente o cilindro.",
  },
  {
    front: "Cone reto — geratriz\n\nRaio $r$, altura $h$.",
    back:  "$$g = \\sqrt{r^2 + h^2}$$\n\nPitágoras no triângulo retângulo formado pela altura, pelo raio e pela geratriz.",
  },
  {
    front: "Cone reto — áreas\n\nRaio $r$, geratriz $g$.",
    back:  "$$A_l = \\pi r g \\qquad A_b = \\pi r^2 \\qquad A_t = \\pi r (g + r)$$",
  },
  {
    front: "Cone equilátero",
    back:  "Cone cuja **geratriz é igual ao diâmetro da base**: $g = 2r$.\n\nA secção meridiana é um **triângulo equilátero** de lado $2r$, portanto a altura vale $h = r\\sqrt{3}$.",
  },
  {
    front: "Superfície lateral do cone planificada — qual é o ângulo do setor?",
    back:  "A lateral planificada é um **setor circular** de raio $g$. Seu ângulo central (em radianos) é:\n\n$$\\theta = \\frac{2\\pi r}{g}$$\n\nEm graus: $\\theta = \\dfrac{360° \\cdot r}{g}$.",
  },
  // ── Pirâmide ───────────────────────────────────────────────────────────
  {
    front: "Pirâmide — volume\n\nÁrea da base $A_b$, altura $h$.",
    back:  "$$V = \\frac{1}{3} A_b \\cdot h$$\n\nTrês pirâmides de mesma base e altura iguais a um prisma enchem esse prisma.",
  },
  {
    front: "Pirâmide regular — apótema da pirâmide\n\nApótema da base $a_b$, altura $h$.",
    back:  "$$a_p = \\sqrt{a_b^2 + h^2}$$\n\nA apótema da pirâmide é a altura da face lateral (triângulo isósceles). Também é a geratriz da face.",
  },
  {
    front: "Pirâmide regular — área lateral",
    back:  "$$A_l = \\frac{\\text{perímetro da base} \\cdot a_p}{2}$$\n\nTodas as faces laterais são triângulos isósceles congruentes.",
  },
  {
    front: "Tetraedro regular — altura\n\nAresta $a$.",
    back:  "$$h = \\frac{a\\sqrt{6}}{3}$$\n\nObtido por Pitágoras entre a aresta $a$ e a distância do centro da base (baricentro) a um vértice: $\\tfrac{a\\sqrt{3}}{3}$.",
  },
  {
    front: "Tetraedro regular — volume\n\nAresta $a$.",
    back:  "$$V = \\frac{a^3 \\sqrt{2}}{12}$$",
  },
  {
    front: "Tetraedro regular — área total\n\nAresta $a$.",
    back:  "$$A_t = a^2 \\sqrt{3}$$\n\nÉ a área de 4 triângulos equiláteros de lado $a$: $4 \\cdot \\dfrac{a^2\\sqrt{3}}{4}$.",
  },
  // ── Esfera ─────────────────────────────────────────────────────────────
  {
    front: "Esfera — volume\n\nRaio $R$.",
    back:  "$$V = \\frac{4}{3}\\pi R^3$$",
  },
  {
    front: "Esfera — área da superfície\n\nRaio $R$.",
    back:  "$$S = 4 \\pi R^2$$\n\nEquivale à área de 4 círculos máximos.",
  },
  {
    front: "Secção de uma esfera por um plano\n\nRaio $R$, distância $d$ do centro ao plano ($d < R$).",
    back:  "A intersecção é um **círculo** de raio:\n\n$$r = \\sqrt{R^2 - d^2}$$",
  },
  {
    front: "Calota esférica — área",
    back:  "$$A_{\\text{calota}} = 2\\pi R h$$\n\n$R$ = raio da esfera, $h$ = altura da calota. Não depende de onde ela seja retirada, apenas da altura.",
  },
  {
    front: "Calota esférica — volume",
    back:  "$$V = \\frac{\\pi h^2 (3R - h)}{3}$$\n\n$R$ = raio da esfera, $h$ = altura da calota.",
  },
  {
    front: "Fuso e cunha esférica — áreas e volumes\n\nÂngulo $\\alpha$ (em graus).",
    back:  "Fuso (parte da superfície):\n$$A_{\\text{fuso}} = \\frac{\\alpha}{360°} \\cdot 4\\pi R^2 = \\frac{\\pi R^2 \\alpha}{90°}$$\n\nCunha (parte do volume):\n$$V_{\\text{cunha}} = \\frac{\\alpha}{360°} \\cdot \\frac{4}{3}\\pi R^3 = \\frac{\\pi R^3 \\alpha}{270°}$$",
  },
  // ── Troncos ────────────────────────────────────────────────────────────
  {
    front: "Tronco de cone — volume\n\nRaios $R$ (maior) e $r$ (menor), altura $h$.",
    back:  "$$V = \\frac{\\pi h}{3}\\,\\bigl(R^2 + R\\,r + r^2\\bigr)$$",
  },
  {
    front: "Tronco de cone — área lateral\n\nRaios $R$ e $r$, geratriz $g$.",
    back:  "$$A_l = \\pi (R + r)\\,g$$\n\nÁrea total: $A_t = \\pi (R + r) g + \\pi R^2 + \\pi r^2$.",
  },
  {
    front: "Tronco de pirâmide — volume\n\nÁreas das bases $A_1$ (maior) e $A_2$ (menor), altura $h$.",
    back:  "$$V = \\frac{h}{3}\\,\\bigl(A_1 + \\sqrt{A_1 A_2} + A_2\\bigr)$$",
  },
  // ── Sólidos de revolução ───────────────────────────────────────────────
  {
    front: "Sólido de revolução",
    back:  "Sólido gerado pela **rotação de uma figura plana em torno de um eixo** pertencente ao plano da figura.\n\nExemplos: rotação de um retângulo → cilindro; de um triângulo retângulo (um cateto no eixo) → cone; de um semicírculo (diâmetro no eixo) → esfera.",
  },
  {
    front: "Qual sólido resulta de girar um retângulo em torno de um de seus lados?",
    back:  "Um **cilindro reto** cujo raio é o lado **perpendicular** ao eixo e cuja altura é o lado **paralelo** ao eixo.",
  },
  {
    front: "Qual sólido resulta de girar um triângulo retângulo em torno de um de seus catetos?",
    back:  "Um **cone reto** cuja altura é o cateto no eixo e cujo raio é o outro cateto. A hipotenusa passa a ser a geratriz.",
  },
  {
    front: "Qual sólido resulta de girar um semicírculo em torno de seu diâmetro?",
    back:  "Uma **esfera** cujo raio é o raio do semicírculo.",
  },
  // ── Relações métricas e diagonais ─────────────────────────────────────
  {
    front: "Diagonal de uma face do cubo × diagonal do cubo\n\nAresta $a$.",
    back:  "Diagonal da face: $d_f = a\\sqrt{2}$.\n\nDiagonal do cubo: $d = a\\sqrt{3}$.\n\nRazão: $\\dfrac{d}{d_f} = \\sqrt{\\dfrac{3}{2}}$.",
  },
  {
    front: "Cilindro inscrito em um cubo\n\nAresta do cubo $a$. Qual é o volume do cilindro inscrito?",
    back:  "O cilindro tem raio $r = a/2$ e altura $h = a$:\n\n$$V = \\pi \\left(\\tfrac{a}{2}\\right)^2 a = \\frac{\\pi a^3}{4}$$",
  },
  {
    front: "Esfera inscrita em um cubo\n\nAresta $a$.",
    back:  "Raio $R = a/2$ (metade da aresta).\n\nVolume da esfera: $V = \\dfrac{4}{3}\\pi \\left(\\dfrac{a}{2}\\right)^3 = \\dfrac{\\pi a^3}{6}$.",
  },
  {
    front: "Esfera circunscrita a um cubo\n\nAresta $a$.",
    back:  "A esfera passa pelos 8 vértices; seu diâmetro é a **diagonal do cubo**:\n\n$$2R = a\\sqrt{3} \\implies R = \\frac{a\\sqrt{3}}{2}$$",
  },
  {
    front: "Cone inscrito em um cilindro\n\nMesmo raio $r$ e mesma altura $h$. Razão entre volumes?",
    back:  "$$\\frac{V_{\\text{cone}}}{V_{\\text{cilindro}}} = \\frac{\\tfrac{1}{3}\\pi r^2 h}{\\pi r^2 h} = \\frac{1}{3}$$\n\nO cone ocupa 1/3 do cilindro de mesma base e altura.",
  },
  // ── Princípios de contagem espacial / observações ─────────────────────
  {
    front: "Prisma hexagonal regular — quantas diagonais?\n\nConte só diagonais do sólido.",
    back:  "Total de diagonais do sólido de $n$ lados na base:\n\n$$D = n(n - 3)$$\n\nPara $n = 6$: $D = 6 \\cdot 3 = 18$ diagonais espaciais.",
  },
  {
    front: "Prisma — qual é o total de arestas em função da base?\n\nBase com $n$ lados.",
    back:  "$$A = 3n$$\n\n$n$ arestas na base superior, $n$ na inferior, $n$ laterais.",
  },
  {
    front: "Pirâmide — quantos vértices, faces e arestas?\n\nBase com $n$ lados.",
    back:  "Vértices: $V = n + 1$ (todos os da base mais o ápice).\nFaces: $F = n + 1$ (a base + $n$ faces triangulares laterais).\nArestas: $A = 2n$ ($n$ da base + $n$ laterais).\n\nVerifique Euler: $(n+1) - 2n + (n+1) = 2$ ✓.",
  },
  {
    front: "Octaedro regular — volume\n\nAresta $a$.",
    back:  "$$V = \\frac{a^3 \\sqrt{2}}{3}$$\n\nO octaedro pode ser visto como duas pirâmides de base quadrada unidas pela base.",
  },
  {
    front: "Volume do sólido formado girando um retângulo de lados $a$ e $b$ em torno do lado $a$",
    back:  "Cilindro reto com raio $b$ e altura $a$:\n\n$$V = \\pi b^2 \\cdot a$$\n\nCompare: se o eixo for o lado $b$, o resultado seria $\\pi a^2 \\cdot b$ — diferente!",
  },
];
