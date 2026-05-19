import { useEffect, useState } from "react";

const CHECK_INTERVAL = 30_000; // 30s

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  async function check() {
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      setOffline(!res.ok);
    } catch {
      setOffline(true);
    }
  }

  useEffect(() => {
    check();
    const id = setInterval(check, CHECK_INTERVAL);
    return () => clearInterval(id);
  }, []);

  if (!offline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white"
      style={{ background: "linear-gradient(90deg, #B71C1C 0%, #E53935 100%)" }}
    >
      {/* wifi-off icon inline */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="1" x2="23" y2="23"/>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
        <line x1="12" y1="20" x2="12.01" y2="20"/>
      </svg>
      Servidor em manutenção. Estamos trabalhando para voltar em breve. 🔧
    </div>
  );
}
