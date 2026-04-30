// =============================================================================
// Sistema de XP — níveis de engajamento e diagnóstico
// =============================================================================

// ─── Níveis de XP (engajamento) ───────────────────────────────────────────────

export interface XpLevel {
  slug: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  min: number;
  max: number; // Infinity para o último nível
}

export const XP_LEVELS: XpLevel[] = [
  {
    slug: "baby-math",
    label: "Baby Math",
    emoji: "🍼",
    color: "#64748B",
    bg: "#F1F5F9",
    min: 0,
    max: 99,
  },
  {
    slug: "explorador",
    label: "Explorador",
    emoji: "🗺️",
    color: "#2563EB",
    bg: "#EFF6FF",
    min: 100,
    max: 349,
  },
  {
    slug: "desafiador",
    label: "Desafiador",
    emoji: "⚔️",
    color: "#7C3AED",
    bg: "#F3E8FF",
    min: 350,
    max: 649,
  },
  {
    slug: "dominador",
    label: "Dominador",
    emoji: "🔥",
    color: "#EA580C",
    bg: "#FFF7ED",
    min: 650,
    max: 899,
  },
  {
    slug: "lendario",
    label: "Lendário",
    emoji: "👑",
    color: "#B45309",
    bg: "#FFFBEB",
    min: 900,
    max: Infinity,
  },
];

/** Retorna o nível XP atual do aluno. */
export function getXpLevel(xp: number): XpLevel {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].min) return XP_LEVELS[i];
  }
  return XP_LEVELS[0];
}

/** Percentual de progresso dentro do nível atual (0-100). */
export function getXpProgress(xp: number): number {
  const level = getXpLevel(xp);
  if (level.max === Infinity) return 100;
  const range = level.max - level.min + 1;
  return Math.min(100, Math.round(((xp - level.min) / range) * 100));
}

/** XP necessário para o próximo nível (null se já é lendário). */
export function getNextLevelXp(xp: number): number | null {
  const level = getXpLevel(xp);
  if (level.max === Infinity) return null;
  return level.max + 1;
}

// ─── Níveis de Diagnóstico (conhecimento) ────────────────────────────────────

export interface DiagnosisLevelInfo {
  emoji: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  msg: string;
  advice: string;
  scoreRange: string;
}

export const DIAGNOSIS_LEVELS: Record<string, DiagnosisLevelInfo> = {
  curioso: {
    emoji: "🌱",
    label: "Curioso",
    color: "#16A34A",
    bg: "#DCFCE7",
    border: "#86EFAC",
    scoreRange: "0–3 acertos",
    msg: "Ótimo começo! Todo grande matemático começou do zero. Agora você tem uma rota personalizada para crescer.",
    advice: "Comece pelas Trilhas de Matemática Básica. Use o Tutor sempre que travar.",
  },
  aprendiz: {
    emoji: "📖",
    label: "Aprendiz",
    color: "#0284C7",
    bg: "#E0F2FE",
    border: "#7DD3FC",
    scoreRange: "4–8 acertos",
    msg: "Você está no caminho certo! Com prática direcionada, o ENEM fica cada vez mais próximo.",
    advice: "Reforce os fundamentos nas Trilhas e pratique com o desafio diário.",
  },
  calculista: {
    emoji: "🔢",
    label: "Calculista",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE047",
    scoreRange: "9–12 acertos",
    msg: "Você já domina boa parte do conteúdo! Foco nas lacunas vai elevar muito sua nota.",
    advice: "Identifique os temas com menor desempenho e faça simulados regulares.",
  },
  expert: {
    emoji: "⚡",
    label: "Expert",
    color: "#7C3AED",
    bg: "#F3E8FF",
    border: "#C4B5FD",
    scoreRange: "13–16 acertos",
    msg: "Impressionante! Você está bem acima da média. Polir os detalhes vai te levar aos 900+.",
    advice: "Use os simulados TRI para afinar sua pontuação e revise os temas avançados.",
  },
  genio: {
    emoji: "🧠",
    label: "Gênio",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FCA5A5",
    scoreRange: "17–20 acertos",
    msg: "Nível elite! Você domina a matemática do ENEM. Mire nos 950+ pontos.",
    advice: "Foque em velocidade e precisão nos simulados. Cada segundo conta.",
  },
};

/** XP ganho por cada ação (referência para o frontend). */
export const XP_REWARDS = {
  simuladoAcerto12: 2,      // 2 XP por acerto (etapas 1 e 2)
  simuladoTRI: 100,          // até 100 XP no TRI (score/10)
  desafiodiario: 15,         // desafio diário completo
  treino: 1,                 // 1 XP por acerto no treino
  trilhaLicao: 20,           // completar uma lição da trilha
  tutor: 3,                  // usar o tutor
  flashcard: 5,              // revisar flashcards
} as const;
