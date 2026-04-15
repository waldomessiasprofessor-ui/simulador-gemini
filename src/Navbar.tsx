import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Home, BookOpen, ClipboardList, History, Dumbbell,
  Trophy, Users, LogOut, X, FlaskConical, ChevronRight, ChevronDown,
  User, Mail, Shield, Zap, GraduationCap, Moon, Sun, CalendarDays, Brain
} from "lucide-react";

function useDarkMode() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }
  return [dark, toggle] as const;
}

const PAULISTAS = [
  { id: "unicamp", label: "UNICAMP",       comingSoon: false },
  { id: "fuvest",  label: "FUVEST",        comingSoon: true },
  { id: "unesp",   label: "UNESP",         comingSoon: true },
  { id: "repvet",  label: "Rep. Vetor",    comingSoon: false },
];

interface NavLinkItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

// Ordem: Início → Simulado ENEM → [Paulistas] → Banco de Questões ENEM → resto
const NAV_LINKS: NavLinkItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/simulado", label: "Simulado ENEM", icon: ClipboardList },
  { href: "/questoes", label: "Banco de questões ENEM", icon: BookOpen },
  { href: "/treino", label: "Treino livre", icon: Dumbbell },
  { href: "/desafio", label: "Desafio do dia", icon: Zap },
  { href: "/agenda", label: "Agenda de estudos", icon: CalendarDays },
  { href: "/revisao", label: "Revisão", icon: BookOpen },
  { href: "/formulas", label: "Fórmulas", icon: FlaskConical },
  { href: "/historico", label: "Histórico", icon: History },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/flashcards", label: "Flashcards", icon: Brain },
  { href: "/admin/questoes", label: "Admin — questões", icon: Users, adminOnly: true },
  { href: "/admin/usuarios", label: "Admin — usuários", icon: Users, adminOnly: true },
  { href: "/admin/formulas", label: "Admin — fórmulas", icon: FlaskConical, adminOnly: true },
  { href: "/admin/revise", label: "Admin — revise", icon: BookOpen, adminOnly: true },
  { href: "/admin/flashcards", label: "Admin — flashcards", icon: Brain, adminOnly: true },
];

function PaulistasSubmenu({ location, onClose }: { location: string; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const isPaulistasActive = location.startsWith("/questoes/") || location.startsWith("/simulado/unicamp") || location.startsWith("/simulado/fuvest") || location.startsWith("/simulado/unesp") || location.startsWith("/simulado/repvet");

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
        style={isPaulistasActive ? { background: "#E0F2F1", color: "#009688" } : { color: "var(--muted-foreground)" }}>
        <GraduationCap className="h-4 w-4 flex-shrink-0" />
        Paulistas
        {open
          ? <ChevronDown className="h-3.5 w-3.5 ml-auto" />
          : <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
      </button>

      {open && (
        <div className="ml-4 mt-1 space-y-0.5 border-l-2 pl-3" style={{ borderColor: "#00968844" }}>
          {PAULISTAS.map((p) => (
            <div key={p.id}>
              {p.comingSoon ? (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl opacity-50 cursor-default">
                  <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>{p.label}</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: "#E0F2F1", color: "#009688" }}>Em breve</span>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <Link href={`/questoes/${p.id}`}>
                    <span onClick={onClose}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
                      style={location === `/questoes/${p.id}` ? { background: "#E0F2F1", color: "#009688" } : { color: "var(--muted-foreground)" }}>
                      <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                      {p.label} — Questões
                    </span>
                  </Link>
                  <Link href={`/simulado/${p.id}`}>
                    <span onClick={onClose}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
                      style={location === `/simulado/${p.id}` ? { background: "#E0F2F1", color: "#009688" } : { color: "var(--muted-foreground)" }}>
                      <ClipboardList className="h-3.5 w-3.5 flex-shrink-0" />
                      {p.label} — Simulado
                    </span>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileDrawer({ session, onClose }: { session: any; onClose: () => void }) {
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => { window.location.href = "/login"; },
  });
  const { data: stats } = trpc.simulations.getStats.useQuery();

  const expiry = session.subscriptionExpiresAt ? new Date(session.subscriptionExpiresAt) : null;
  const now = new Date();
  const expired = expiry && expiry < now;
  const daysLeft = expiry && !expired ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full z-50 w-80 shadow-2xl flex flex-col"
        style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}>
        <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Meu perfil</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--muted-foreground)" }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-6 flex items-center gap-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="h-14 w-14 rounded-full flex items-center justify-center text-xl font-black flex-shrink-0"
            style={{ background: "#009688", color: "#fff" }}>
            {(session.name as string)?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="font-bold truncate" style={{ color: "var(--foreground)" }}>{session.name}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: "var(--muted-foreground)" }}>{session.email}</p>
            {session.role === "admin" && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 font-semibold"
                style={{ background: "#E65100", color: "#fff" }}>
                <Shield className="h-3 w-3" /> Admin
              </span>
            )}
          </div>
        </div>

        {stats && (
          <div className="px-5 py-4 grid grid-cols-3 gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="text-center">
              <p className="text-lg font-black" style={{ color: "#009688" }}>{stats.streak}</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>streak</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black" style={{ color: "#009688" }}>{stats.weeklyQuestions}</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>esta semana</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black" style={{ color: "#009688" }}>{stats.weeklyAccuracy}%</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>acerto</p>
            </div>
          </div>
        )}

        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>Assinatura</p>
          {session.role === "admin" ? (
            <span className="text-sm font-medium" style={{ color: "#009688" }}>Acesso admin (ilimitado)</span>
          ) : expired ? (
            <span className="text-sm font-medium" style={{ color: "#E53935" }}>Expirada em {expiry?.toLocaleDateString("pt-BR")}</span>
          ) : expiry ? (
            <span className="text-sm font-medium" style={{ color: "#009688" }}>Ativa · {daysLeft} dias restantes</span>
          ) : (
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Sem assinatura ativa</span>
          )}
        </div>

        <div className="px-5 py-4 space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
            <p className="text-sm truncate" style={{ color: "var(--foreground)" }}>{session.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
            <p className="text-sm" style={{ color: "var(--foreground)" }}>{session.role === "admin" ? "Administrador" : "Aluno"}</p>
          </div>
        </div>

        <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={() => logout.mutate()} disabled={logout.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: "#FFEBEE", color: "#C62828", border: "1px solid #FFCDD2" }}>
            <LogOut className="h-4 w-4" /> Sair da conta
          </button>
        </div>
      </div>
    </>
  );
}

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [location] = useLocation();
  const { data: session } = trpc.auth.me.useQuery();
  const [dark, toggleDark] = useDarkMode();

  function isActive(href: string) {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  }

  const visibleLinks = NAV_LINKS.filter((l) => !l.adminOnly || session?.role === "admin");

  return (
    <>
      <header className="sticky top-0 z-30"
        style={{ backgroundColor: "#009688", boxShadow: "0 2px 8px rgba(0,150,136,0.3)" }}>
        <div className="container mx-auto px-4 max-w-5xl flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Menu">
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
            </button>
            <Link href="/">
              <span className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer">
                <img src="/logo-vetor.png" alt="Prova Real" className="h-10 w-10 object-contain"
                  style={{ filter: "brightness(0) invert(1)" }} />
                <div className="hidden sm:block">
                  <p className="font-black text-white text-sm leading-none tracking-wide">VETOR</p>
                  <p className="text-xs leading-none" style={{ color: "rgba(255,255,255,0.7)" }}>Escola de Alta Performance</p>
                </div>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleDark} aria-label="Alternar tema"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.85)" }}>
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link href="/">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                style={isActive("/") ? { backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" } : { color: "rgba(255,255,255,0.85)" }}>
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Início</span>
              </span>
            </Link>
            {session && (
              <button onClick={() => setProfileOpen(true)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" }} title={session.name as string}>
                {(session.name as string)?.[0]?.toUpperCase() ?? "U"}
              </button>
            )}
          </div>
        </div>
      </header>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)} />}

      <aside className="fixed left-0 top-0 h-full z-50 w-72 flex flex-col"
        style={{
          background: "var(--card)",
          borderRight: "1px solid var(--border)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.15)" : "none",
        }}>
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <img src="/logo-vetor.png" alt="Prova Real" className="h-8 w-8 object-contain"
              style={{ filter: "brightness(0) invert(1)", background: "#009688", borderRadius: 6, padding: 2 }} />
            <div>
              <p className="font-black text-sm leading-none" style={{ color: "var(--foreground)" }}>VETOR</p>
              <p className="text-xs leading-none mt-0.5" style={{ color: "var(--muted-foreground)" }}>Escola de Alta Performance</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--muted-foreground)" }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleLinks.map(({ href, label, icon: Icon }, i) => {
            const active = isActive(href);
            return (
              <div key={href}>
                {/* Insere submenu Paulistas após Simulado ENEM (índice 1) */}
                {i === 1 && (
                  <div className="pb-1">
                    <PaulistasSubmenu location={location} onClose={() => setSidebarOpen(false)} />
                  </div>
                )}
                <Link href={href}>
                  <span onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
                    style={active ? { background: "#E0F2F1", color: "#009688" } : { color: "var(--muted-foreground)" }}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {label}
                    {active && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        {session && (
          <div className="px-3 py-4" style={{ borderTop: "1px solid var(--border)" }}>
            <button onClick={() => { setSidebarOpen(false); setProfileOpen(true); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:opacity-80"
              style={{ background: "#E0F2F1", color: "#009688" }}>
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "#009688", color: "#fff" }}>
                {(session.name as string)?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="text-left min-w-0">
                <p className="font-semibold truncate text-xs">{session.name as string}</p>
                <p className="text-xs truncate" style={{ color: "#00695C" }}>{session.email as string}</p>
              </div>
              <User className="h-4 w-4 ml-auto flex-shrink-0" />
            </button>
          </div>
        )}
      </aside>

      {profileOpen && session && <ProfileDrawer session={session} onClose={() => setProfileOpen(false)} />}
    </>
  );
}
