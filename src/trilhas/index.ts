import type { Trilha } from "./types";
import { matematicaBasica } from "./matematica-basica";

// =============================================================================
// Registry de trilhas disponíveis
// =============================================================================
// Para adicionar uma nova trilha:
//  1. Crie o arquivo src/trilhas/<nome>.ts usando matematica-basica.ts como base
//  2. Importe aqui e inclua no TRILHAS array abaixo
//  3. O campo `area` deve casar EXATAMENTE com o conteudo_principal das
//     questions no banco (para o Dashboard achar a trilha ao clicar em
//     "Pontos a melhorar")
// =============================================================================

export const TRILHAS: Trilha[] = [
  matematicaBasica,
];

/** Procura uma trilha pelo slug (usado em /trilha/:slug). */
export function getTrilhaBySlug(slug: string): Trilha | undefined {
  return TRILHAS.find((t) => t.slug === slug);
}

/** Procura uma trilha pelo nome da área (ex: "Matemática Básica"). */
export function getTrilhaByArea(area: string): Trilha | undefined {
  return TRILHAS.find((t) => t.area === area);
}

/** Lista de áreas que têm trilha — usado no Dashboard para decidir se item é clicável. */
export function hasTrilhaForArea(area: string): boolean {
  return TRILHAS.some((t) => t.area === area);
}

export type { Trilha, Capitulo, Licao, Exemplo, Exercicio, Alternativa } from "./types";
