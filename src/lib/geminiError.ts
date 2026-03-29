/**
 * geminiError.ts
 * Coloca este ficheiro em src/lib/geminiError.ts
 * 
 * Usa esta função sempre que fizeres uma chamada à API Gemini para
 * converter erros técnicos em mensagens legíveis em português.
 */

export interface GeminiErrorResponse {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

export function parseGeminiError(raw: unknown): string {
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    const err = (data as GeminiErrorResponse)?.error;
    if (!err) return "Erro desconhecido na API Gemini.";

    const code = err.code;
    const status = err.status ?? "";

    if (code === 429 || status === "RESOURCE_EXHAUSTED") {
      return [
        "⚠️ Limite de uso da API Gemini atingido.",
        "",
        "A chave de API está no plano gratuito, que tem cota limitada.",
        "Soluções:",
        "1. Aguarde alguns minutos e tente novamente.",
        "2. Acesse console.cloud.google.com e ative o faturamento para a chave.",
        "3. Gere uma nova chave de API em aistudio.google.com.",
      ].join("\n");
    }

    if (code === 401 || code === 403) {
      return "❌ Chave de API inválida ou sem permissão. Verifique a variável GEMINI_API_KEY.";
    }

    if (code === 400) {
      return "❌ Requisição inválida para a Gemini. Verifique o conteúdo enviado.";
    }

    if (code === 503) {
      return "⏳ API Gemini temporariamente indisponível. Tente novamente em alguns minutos.";
    }

    return `Erro Gemini (${code ?? status}): ${err.message?.slice(0, 200) ?? "sem detalhe"}`;
  } catch {
    return "Erro ao comunicar com a API Gemini.";
  }
}
