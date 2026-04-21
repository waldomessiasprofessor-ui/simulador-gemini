import { TRILHAS, getTrilhaBySlug } from "./index";
import type { Licao } from "./types";

// =============================================================================
// Estatísticas agregadas das trilhas (lidas do localStorage)
// =============================================================================
// Cada lição concluída grava em `trilha:<trilhaSlug>:<licaoSlug>` um objeto
// { answers, finishedAt?, lastScorePct?, totalTimeSec? }. Aqui nós varremos
// todas as chaves desse formato e somamos em números agregados, para alimentar
// o gráfico de Performance (Dedicação + Questões).
//
// Por que localStorage e não servidor?
//   — V1 preferiu resiliência (funciona offline / aba privada) sem mudar schema.
//   — Migrar para DB é um passo natural quando validarmos o conceito.

export interface TrilhaStats {
  lessonsCompleted: number;   // lições com finishedAt
  totalExercises: number;     // soma dos exercícios das lições concluídas
  totalCorrect: number;       // acertos aproximados (lastScorePct × total)
  totalTimeSec: number;       // tempo cronometrado nas lições
  totalLeituras: number;      // cliques em "Concluir Leitura" nas trilhas
}

export function getTrilhaStats(): TrilhaStats {
  const out: TrilhaStats = {
    lessonsCompleted: 0,
    totalExercises: 0,
    totalCorrect: 0,
    totalTimeSec: 0,
    totalLeituras: 0,
  };

  if (typeof window === "undefined" || !window.localStorage) return out;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("trilha:")) continue;

      const parts = key.split(":");
      if (parts.length < 3) continue;
      const trilhaSlug = parts[1];
      const licaoSlug  = parts.slice(2).join(":");

      const trilha = getTrilhaBySlug(trilhaSlug);
      if (!trilha) continue;

      const licao: Licao | undefined = trilha.capitulos
        .flatMap((c) => c.licoes)
        .find((l) => l.slug === licaoSlug);
      if (!licao) continue;

      let data: { finishedAt?: number; lastScorePct?: number; totalTimeSec?: number } = {};
      try {
        data = JSON.parse(localStorage.getItem(key) || "{}");
      } catch { continue; }

      if (!data.finishedAt) continue;

      out.lessonsCompleted += 1;
      out.totalExercises   += licao.exercicios.length;
      out.totalTimeSec     += Math.max(0, data.totalTimeSec ?? 0);
      out.totalCorrect     += Math.round(
        ((data.lastScorePct ?? 0) / 100) * licao.exercicios.length
      );
    }
  } catch { /* localStorage bloqueado (aba privada etc.) — retorna zeros */ }

  try {
    out.totalLeituras = parseInt(localStorage.getItem("trilha:leituras") || "0", 10) || 0;
  } catch { /* ignora */ }

  return out;
}

// Total de lições existentes em todas as trilhas — útil para mostrar
// "X de Y lições concluídas" no radar ou num futuro dashboard de progresso.
export function getTotalLessonsAvailable(): number {
  return TRILHAS.reduce(
    (sum, t) => sum + t.capitulos.reduce((s, c) => s + c.licoes.length, 0),
    0
  );
}
