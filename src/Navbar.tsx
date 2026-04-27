import { useState, useEffect, type ReactElement } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  House, Books, ClipboardText, ClockCounterClockwise, Barbell,
  Trophy, Users, SignOut, X, Flask, CaretRight, CaretDown,
  User, Envelope, ShieldCheck, Lightning, GraduationCap, Moon, Sun,
  CalendarDots, Brain, Star, YoutubeLogo,
} from "@phosphor-icons/react";
import LevelBadge, { type DiagnosisLevel } from "@/LevelBadge";

// Pre-binds weight="duotone" so icons work as plain <Icon className="..." />
function d(Icon: React.ElementType) {
  return function D(props: any) { return <Icon weight="duotone" {...props} />; };
}

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

// =============================================================================
// Hierarquia do menu
// =============================================================================
// Estrutura nova (abril 2026):
//   Banco de Questões
//     ENEM · Paulistas (em breve) · Repositório Vetor
//   Simulados
//     ENEM (com TRI) · Paulistas (em breve — UNICAMP/Fuvest/UNESP)
//   Treino Livre · Desafio do Dia · Planner de Estudos · Flashcards ·
//   Revisão · Fórmulas · Histórico · Ranking
//   (Admin — só para administradores)

// Item de link disponível
interface LinkItem {
  kind: "link";
  href: string;
  label: string;
  icon?: React.ElementType;
  badge?: string;
}
// Item desabilitado (em breve)
interface SoonItem {
  kind: "soon";
  label: string;
  icon?: React.ElementType;
  children?: SoonItem[];  // UNICAMP/Fuvest/UNESP dentro de Paulistas
}
type SubItem = LinkItem | SoonItem;

// Itens que têm sub-menu (Banco de Questões, Simulados)
interface GroupItem {
  kind: "group";
  label: string;
  icon: React.ElementType;
  children: SubItem[];
}
type TopItem = GroupItem | LinkItem;

const NAV_TREE: TopItem[] = [
  {
    kind: "group",
    label: "Banco de Questões",
    icon: d(Books),
    children: [
      { kind: "link", href: "/questoes",        label: "ENEM",              icon: d(GraduationCap) },
      { kind: "soon", label: "Paulistas",       icon: d(GraduationCap) },
      { kind: "link", href: "/questoes/repvet", label: "Repositório Vetor", icon: d(Star) },
    ],
  },
  {
    kind: "group",
    label: "Simulados",
    icon: d(ClipboardText),
    children: [
      { kind: "link", href: "/simulado", label: "ENEM", icon: d(GraduationCap), badge: "Com TRI" },
      {
        kind: "soon",
        label: "Paulistas",
        icon: d(GraduationCap),
        children: [
          { kind: "soon", label: "UNICAMP" },
          { kind: "soon", label: "Fuvest"  },
          { kind: "soon", label: "UNESP"   },
        ],
      },
    ],
  },
  { kind: "link", href: "/trilhas",    label: "Trilhas",            icon: d(YoutubeLogo) },
  { kind: "link", href: "/treino",     label: "Treino Livre",       icon: d(Barbell) },
  { kind: "link", href: "/desafio",    label: "Desafio do Dia",     icon: d(Lightning) },
  { kind: "link", href: "/agenda",     label: "Planner de Estudos", icon: d(CalendarDots) },
  { kind: "link", href: "/flashcards", label: "Flashcards",         icon: d(Brain) },
  { kind: "link", href: "/formulas",   label: "Fórmulas",           icon: d(Flask) },
  { kind: "link", href: "/historico",  label: "Histórico",          icon: d(ClockCounterClockwise) },
  { kind: "link", href: "/ranking",    label: "Ranking",            icon: d(Trophy) },
];

const ADMIN_LINKS: LinkItem[] = [
  { kind: "link", href: "/admin/questoes",   label: "Admin — questões",   icon: d(Users) },
  { kind: "link", href: "/admin/usuarios",   label: "Admin — usuários",   icon: d(Users) },
  { kind: "link", href: "/admin/formulas",   label: "Admin — fórmulas",   icon: d(Flask) },
  { kind: "link", href: "/admin/flashcards", label: "Admin — flashcards", icon: d(Brain) },
  { kind: "link", href: "/admin/trilhas",    label: "Admin — trilhas",    icon: d(YoutubeLogo) },
];

// =============================================================================
// Renderização dos sub-itens
// =============================================================================

function SoonBadge() {
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
      style={{ background: "#E0F2F1", color: "#00695C", letterSpacing: "0.03em" }}>
      Em breve
    </span>
  );
}

function renderSub(item: SubItem, location: string, onClose: () => void, depth = 0): ReactElement {
  const Icon = item.icon;
  const pad = depth === 0 ? "pl-3" : "pl-5";

  if (item.kind === "soon") {
    return (
      <div key={item.label + depth}>
        <div className={`flex items-center gap-2 pr-3 py-2 rounded-xl cursor-default opacity-70 ${pad}`}>
          {Icon && <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />}
          <span className="text-sm font-medium flex-1" style={{ color: "var(--muted-foreground)" }}>
            {item.label}
          </span>
          <SoonBadge />
        </div>
        {item.children && (
          <div className="space-y-0.5 mt-0.5">
            {item.children.map((c) => renderSub(c, location, onClose, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  // link ativo
  const active = location === item.href;
  return (
    <Link key={item.href} href={item.href}>
      <span onClick={onClose}
        className={`flex items-center gap-2 pr-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all ${pad}`}
        style={active ? { background: "#E0F2F1", color: "#009688" } : { color: "var(--muted-foreground)" }}>
        {Icon && <Icon className="h-3.5 w-3.5 flex-shrink-0" />}
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{ background: "#009688", color: "#fff", letterSpacing: "0.03em" }}>
            {item.badge}
          </span>
        )}
      </span>
    </Link>
  );
}

function GroupMenu({ item, location, onClose, startOpen }: {
  item: GroupItem; location: string; onClose: () => void; startOpen: boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  const Icon = item.icon;

  // Pai ativo quando alguma criança está na rota atual
  const isActive = item.children.some(
    (c) => c.kind === "link" && location === c.href
  );

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={isActive ? { background: "#E0F2F1", color: "#009688" } : { color: "var(--foreground)" }}>
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {open
          ? <CaretDown className="h-3.5 w-3.5" />
          : <CaretRight className="h-3.5 w-3.5" />}
      </button>
      {open && (
        <div className="ml-3 mt-1 space-y-0.5 border-l-2 pl-2" style={{ borderColor: "#B2DFDB" }}>
          {item.children.map((c) => renderSub(c, location, onClose))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Drawer de perfil (inalterado do anterior)
// =============================================================================

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
            <X size={16} />
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
            <div className="flex flex-wrap gap-1 mt-1">
              {session.role === "admin" && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "#B45309", color: "#fff" }}>
                  <ShieldCheck size={12} weight="duotone" /> Admin
                </span>
              )}
              {(session as any).diagnosisLevel && (
                <LevelBadge level={(session as any).diagnosisLevel as DiagnosisLevel} size="md" />
              )}
            </div>
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
            <span className="text-sm font-medium" style={{ color: "#DC2626" }}>Expirada em {expiry?.toLocaleDateString("pt-BR")}</span>
          ) : expiry ? (
            <span className="text-sm font-medium" style={{ color: "#009688" }}>Ativa · {daysLeft} dias restantes</span>
          ) : (
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Sem assinatura ativa</span>
          )}
        </div>

        <div className="px-5 py-4 space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <Envelope size={16} weight="duotone" className="flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
            <p className="text-sm truncate" style={{ color: "var(--foreground)" }}>{session.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <User size={16} weight="duotone" className="flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
            <p className="text-sm" style={{ color: "var(--foreground)" }}>{session.role === "admin" ? "Administrador" : "Aluno"}</p>
          </div>
        </div>

        <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={() => logout.mutate()} disabled={logout.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
            <SignOut size={16} /> Sair da conta
          </button>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// Navbar + Sidebar
// =============================================================================

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [location] = useLocation();
  const { data: session } = trpc.auth.me.useQuery();
  const [dark, toggleDark] = useDarkMode();

  // Trava o scroll do body enquanto o sidebar está aberto.
  // Elimina o rubber-band / overscroll do iOS Safari no sidebar.
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [sidebarOpen]);

  function isActive(href: string) {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  }

  // Decide quais grupos começam abertos baseado na rota atual
  const bancoOpen = location.startsWith("/questoes");
  const simOpen   = location.startsWith("/simulado");
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <header className="sticky top-0 z-30"
        style={{ backgroundColor: "#263238", boxShadow: "0 2px 8px rgba(38,50,56,0.35)" }}>
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
                  <p className="text-xs leading-none" style={{ fontFamily: "var(--pr-font-serif)", fontStyle: "italic", fontWeight: 700, color: "rgba(255,255,255,0.72)" }}>Prova Real</p>
                </div>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleDark} aria-label="Alternar tema"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.85)" }}>
              {dark ? <Sun size={16} weight="duotone" /> : <Moon size={16} weight="duotone" />}
            </button>
            <Link href="/">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                style={isActive("/") ? { backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" } : { color: "rgba(255,255,255,0.85)" }}>
                <House size={16} weight="duotone" />
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

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={closeSidebar} />}

      <aside className="fixed left-0 top-0 z-50 w-72 flex flex-col overflow-hidden"
        style={{
          height: "100dvh",          /* altura dinâmica: exclui chrome do browser mobile */
          background: "var(--card)",
          borderRight: "1px solid var(--border)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.15)" : "none",
        }}>
        <div className="flex items-center justify-between px-5 py-5"
          style={{ background: "#263238", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-2">
            <img src="/logo-vetor.png" alt="Prova Real" className="h-8 w-8 object-contain"
              style={{ filter: "brightness(0) invert(1)" }} />
            <div>
              <p className="font-black text-sm leading-none text-white">VETOR</p>
              <p className="text-xs leading-none mt-0.5" style={{ fontFamily: "var(--pr-font-serif)", fontStyle: "italic", fontWeight: 700, color: "rgba(255,255,255,0.72)" }}>Prova Real</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.7)" }}>
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
          style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}>
          {NAV_TREE.map((item, i) => {
            if (item.kind === "group") {
              return (
                <GroupMenu
                  key={item.label + i}
                  item={item}
                  location={location}
                  onClose={closeSidebar}
                  startOpen={item.label === "Banco de Questões" ? bancoOpen : simOpen}
                />
              );
            }
            // link de topo
            const Icon = item.icon!;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <span onClick={closeSidebar}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
                  style={active ? { background: "#E0F2F1", color: "#009688" } : { color: "var(--muted-foreground)" }}>
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                  {active && <CaretRight className="h-3.5 w-3.5 ml-auto" />}
                </span>
              </Link>
            );
          })}

          {/* Tutor IA */}
          <div className="pt-3 mt-1" style={{ borderTop: "1px solid var(--border)" }}>
            <button
              onClick={() => {
                closeSidebar();
                window.dispatchEvent(new CustomEvent("open-tutor"));
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ color: "var(--foreground)" }}>
              <Brain weight="duotone" className="h-4 w-4 flex-shrink-0" style={{ color: "#009688" }} />
              <span className="flex-1 text-left">Tutor IA</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#263238,#009688)", color: "#fff" }}>
                IA
              </span>
            </button>
          </div>

          {/* Área admin */}
          {session?.role === "admin" && (
            <div className="pt-3 mt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                Administração
              </p>
              {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link key={href} href={href}>
                    <span onClick={closeSidebar}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
                      style={active ? { background: "#E0F2F1", color: "#009688" } : { color: "var(--muted-foreground)" }}>
                      {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                      {label}
                      {active && <CaretRight className="h-3.5 w-3.5 ml-auto" />}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
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
              <div className="text-left min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-semibold truncate text-xs">{session.name as string}</p>
                  {(session as any).diagnosisLevel && (
                    <LevelBadge level={(session as any).diagnosisLevel as DiagnosisLevel} size="sm" />
                  )}
                </div>
                <p className="text-xs truncate" style={{ color: "#00695C" }}>{session.email as string}</p>
              </div>
              <User size={16} weight="duotone" className="flex-shrink-0" />
            </button>
          </div>
        )}
      </aside>

      {profileOpen && session && <ProfileDrawer session={session} onClose={() => setProfileOpen(false)} />}
    </>
  );
}
