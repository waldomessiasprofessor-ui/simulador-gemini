import { PlayCircle } from "lucide-react";

// Converte qualquer URL do YouTube para o formato embed
export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;

    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        videoId = u.searchParams.get("v");
      } else if (u.pathname.startsWith("/shorts/")) {
        videoId = u.pathname.split("/shorts/")[1].split("?")[0];
      } else if (u.pathname.startsWith("/embed/")) {
        return url; // já é embed
      }
    } else if (u.hostname === "youtu.be") {
      videoId = u.pathname.slice(1).split("?")[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

// Botão que, ao clicar, expande o player embutido abaixo
interface VideoButtonProps {
  url: string;
  open: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

export function VideoButton({ url, open, onToggle, size = "md" }: VideoButtonProps) {
  const embedUrl = getYouTubeEmbedUrl(url);
  if (!embedUrl) return null;

  const isSm = size === "sm";

  return (
    <div className="space-y-2">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 font-semibold rounded-xl transition-all"
        style={{
          padding: isSm ? "4px 10px" : "8px 12px",
          fontSize: isSm ? "12px" : "14px",
          background: open ? "#DC2626" : "#FEE2E2",
          color: open ? "#fff" : "#DC2626",
          border: "1px solid #FECACA",
        }}
      >
        <PlayCircle className={isSm ? "h-3 w-3" : "h-4 w-4"} />
        {open ? "Fechar vídeo" : "▶ Assistir resolução em vídeo"}
      </button>

      {open && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #FECACA" }}>
          <iframe
            src={embedUrl}
            className="w-full"
            style={{ aspectRatio: "16/9", display: "block", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
