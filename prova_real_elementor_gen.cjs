const fs = require('fs');
const crypto = require('crypto');

const uid = () => crypto.randomBytes(4).toString('hex').slice(0, 7);

const section = (elements_list, bg_color = "#ffffff", padding_tb = "80") => ({
  id: uid(), elType: "section",
  settings: {
    background_background: "classic", background_color: bg_color,
    padding: { top: padding_tb, right: "0", bottom: padding_tb, left: "0", unit: "px", isLinked: false },
    content_width: { unit: "px", size: 1100 }
  },
  elements: elements_list
});

const column = (widgets, size = 100) => ({
  id: uid(), elType: "column",
  settings: { _column_size: size, _inline_size: null },
  elements: widgets
});

const heading = (text, tag = "h2", align = "center", color = "#1a1a2e", size = 38, weight = "700", line_height = 1.3) => ({
  id: uid(), elType: "widget", widgetType: "heading",
  settings: {
    title: text, header_size: tag, align, title_color: color,
    typography_typography: "custom",
    typography_font_size: { unit: "px", size },
    typography_font_weight: weight,
    typography_line_height: { unit: "em", size: line_height }
  }
});

const textWidget = (content, align = "center", color = "#555555", size = 18, line_height = 1.7) => ({
  id: uid(), elType: "widget", widgetType: "text-editor",
  settings: {
    editor: content, align, text_color: color,
    typography_typography: "custom",
    typography_font_size: { unit: "px", size },
    typography_line_height: { unit: "em", size: line_height }
  }
});

const btn = (label, url = "#", bg = "#00897B", color = "#ffffff", size = 20) => ({
  id: uid(), elType: "widget", widgetType: "button",
  settings: {
    text: label, link: { url, is_external: false },
    align: "center", size: "xl",
    button_text_color: color, background_color: bg,
    border_radius: { top: "8", right: "8", bottom: "8", left: "8", unit: "px" },
    typography_typography: "custom",
    typography_font_size: { unit: "px", size },
    typography_font_weight: "700",
    padding: { top: "20", right: "50", bottom: "20", left: "50", unit: "px", isLinked: false }
  }
});

const spacer = (size = 30) => ({
  id: uid(), elType: "widget", widgetType: "spacer",
  settings: { space: { unit: "px", size } }
});

const iconList = (items, icon_color = "#00897B", text_color = "#2D3436", size = 17) => ({
  id: uid(), elType: "widget", widgetType: "icon-list",
  settings: {
    icon_list: items.map(item => ({
      id: uid(), text: item,
      selected_icon: { value: "fas fa-check-circle", library: "fa-solid" },
      _id: uid()
    })),
    space_between: { unit: "px", size: 18 },
    icon_color, text_color,
    icon_size: { unit: "px", size },
    typography_typography: "custom",
    typography_font_size: { unit: "px", size },
    typography_line_height: { unit: "em", size: 1.6 }
  }
});

const sections = [];

// 1. HERO
sections.push(section([
  column([
    heading("Você está a 45 questões de mudar o seu futuro.", "h1", "center", "#FFFFFF", 48, "900", 1.2),
    spacer(20),
    textWidget(
      "A <strong>Prova Real</strong> é a plataforma de alta performance em Matemática que transforma o seu maior obstáculo no ENEM e vestibulares em uma vantagem estratégica.",
      "center", "#B0BEC5", 20, 1.8
    ),
    spacer(30),
    btn("Quero começar agora — R$ 27,97/mês", "#", "#00BFA5", "#0D2137", 20),
    spacer(15),
    textWidget("<em>Menos de R$ 1 por dia. Cancele quando quiser.</em>", "center", "#78909C", 14),
  ])
], "#0D2137", "100"));

// 2. DOR
sections.push(section([
  column([
    heading("A Matemática do ENEM não é só difícil. Ela é estratégica.", "h2", "center", "#0D2137", 34),
    spacer(20),
    textWidget(
      "São <strong>45 questões</strong> em menos de 4 horas. Cada minuto conta. Cada erro custa pontos. E quem não está preparado sente isso na pele.",
      "center", "#444444", 18
    ),
    spacer(30),
    iconList([
      '"Fico preso nas questões difíceis e o tempo acaba antes de terminar"',
      '"Não sei identificar o conteúdo e fico sem saber por onde começar"',
      '"Treino muito, mas na hora H a cabeça trava"',
      '"Não tenho como saber se estou evoluindo de verdade"',
      '"Já deixei passar vestibulares por causa da Matemática"',
    ], "#E53935", "#333333"),
    spacer(30),
    textWidget("<strong>Se você se identificou com algum desses cenários, a Prova Real foi criada para você.</strong>", "center", "#0D2137", 20),
  ])
], "#F5F5F5", "70"));

// 3. SOLUÇÃO
sections.push(section([
  column([
    heading("Apresentamos a Prova Real", "h2", "center", "#FFFFFF", 40),
    spacer(15),
    textWidget("<strong>Plataforma de alta performance em Matemática para o ENEM e vestibulares</strong>", "center", "#E0F2F1", 22),
    spacer(20),
    textWidget(
      "A Prova Real foi desenvolvida para ir muito além de \"estudar mais\". Aqui você treina a <strong>capacidade de identificar, interpretar e decidir</strong> — as mesmas habilidades que os candidatos aprovados usam na prova.",
      "center", "#E0F2F1", 18
    ),
  ])
], "#00897B", "80"));

// 4. BENEFÍCIOS
sections.push(section([
  column([
    heading("Tudo que você precisa para dominar a Matemática do ENEM", "h2", "center", "#0D2137", 34),
    spacer(10),
    textWidget("Uma plataforma completa, pensada para quem quer resultado real.", "center", "#666666", 17),
    spacer(30),
    iconList([
      "Exercícios de provas anteriores + questões inéditas selecionadas estrategicamente",
      "Banco de questões com resolução atualizado toda semana",
      "Simulados com correção por TRI — o mesmo sistema do ENEM",
      "Temporizador de questões para treinar velocidade e controle",
      "Artigos de revisão dos conteúdos mais cobrados",
      "Flashcards para fixação e memorização de fórmulas e conceitos",
      "Análise gráfica de desempenho para acompanhar sua evolução",
      "Aulas dos conteúdos que mais caem no ENEM e nos vestibulares",
    ], "#00897B", "#2D3436"),
  ])
], "#FFFFFF", "80"));

// 5. DESTAQUE TRI
sections.push(section([
  column([
    heading("O único simulador com correção por TRI", "h2", "center", "#1B5E20", 32),
    spacer(15),
    textWidget(
      "A <strong>Teoria de Resposta ao Item (TRI)</strong> é o sistema real usado pelo INEP para calcular a nota do ENEM. Treinar com simulados corrigidos por TRI é a diferença entre <em>estudar muito</em> e <em>estudar certo</em>.",
      "center", "#2E7D32", 18
    ),
    spacer(20),
    textWidget(
      "Na Prova Real, você sabe exatamente onde está e o que precisa melhorar — antes do dia da prova.",
      "center", "#1B5E20", 18
    ),
  ])
], "#E8F5E9", "60"));

// 6. PREÇO
sections.push(section([
  column([
    heading("Acesso completo por menos de R$ 1 por dia", "h2", "center", "#FFFFFF", 36),
    spacer(20),
    heading("R$ 27,97/mês", "h2", "center", "#00BFA5", 56, "900"),
    spacer(10),
    textWidget("✅ Acesso a todos os recursos &nbsp;|&nbsp; ✅ Cancele quando quiser &nbsp;|&nbsp; ✅ Conteúdo atualizado semanalmente", "center", "#B0BEC5", 16),
    spacer(30),
    btn("Garantir meu acesso agora", "#", "#00BFA5", "#0D2137", 22),
    spacer(15),
    textWidget("🔒 Pagamento seguro. Satisfação garantida.", "center", "#78909C", 14),
  ])
], "#0D2137", "80"));

// 7. CTA FINAL
sections.push(section([
  column([
    heading("Cada semana sem treinar é uma semana perdida.", "h2", "center", "#0D2137", 32),
    spacer(15),
    textWidget(
      "Os candidatos aprovados não têm um segredo mágico. Eles <strong>treinaram de forma consistente, estratégica e com as ferramentas certas</strong>. A Prova Real coloca essas ferramentas nas suas mãos — hoje.",
      "center", "#444444", 18
    ),
    spacer(25),
    btn("Quero minha alta performance — R$ 27,97/mês", "#", "#00897B", "#ffffff", 20),
    spacer(20),
    textWidget("<em>Comece agora. Sua próxima prova agradece.</em>", "center", "#888888", 15),
  ])
], "#F5F5F5", "70"));

const template = {
  version: "0.4",
  title: "Prova Real — Página de Vendas",
  type: "page",
  content: sections,
  page_settings: { hide_title: "yes" }
};

const outPath = "prova_real_elementor.json";
fs.writeFileSync(outPath, JSON.stringify(template, null, 2), "utf8");
const size = fs.statSync(outPath).size;
console.log(`Gerado: ${outPath}`);
console.log(`Seções: ${sections.length}`);
console.log(`Tamanho: ${(size/1024).toFixed(1)} KB`);
