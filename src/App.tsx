import { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/Navbar";
import Footer from "@/Footer";
import Dashboard from "@/Dashboard";
import Simulador from "@/Simulador";
import Resultado from "@/Resultado";
import Historico from "@/Historico";
import Questoes from "@/Questoes";
import AdminQuestoes from "@/AdminQuestoes";
import AdminUsuarios from "@/AdminUsuarios";
import AdminFormulas from "@/AdminFormulas";
import AdminRevise from "@/AdminRevise";
import AdminTrilhas from "@/AdminTrilhas";
import Flashcards from "@/Flashcards";
import AdminFlashcards from "@/AdminFlashcards";
import Revise from "@/Revise";
import Revisao from "@/Revisao";
import Treino from "@/Treino";
import Ranking from "@/Ranking";
import Formulas from "@/Formulas";
import DesafioPage from "@/DesafioPage";
import Agenda from "@/Agenda";
import Trilha from "@/Trilha";
import Login from "@/Login";
import { Loader2, AlertTriangle } from "lucide-react";

// Sobe a página para o topo sempre que a rota muda (navegação SPA).
// Sem isso, o wouter mantém o scroll da página anterior — usuário vai
// para uma nova rota e aparece no meio/rodapé dela.
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return null;
}

function SubscriptionBanner({ session }: { session: any }) {
  if (session.role === "admin") return null;
  const now = new Date();
  const expiry = session.subscriptionExpiresAt ? new Date(session.subscriptionExpiresAt) : null;
  if (expiry && expiry < now) {
    return (
      <div className="w-full px-4 py-3 text-center text-sm font-semibold flex items-center justify-center gap-2"
        style={{ background: "#FEF2F2", color: "#DC2626", borderBottom: "1px solid #FECACA" }}>
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        Sua assinatura expirou em {expiry.toLocaleDateString("pt-BR")}. Entre em contato com o administrador para renovar.
      </div>
    );
  }
  if (expiry) {
    const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 30) {
      return (
        <div className="w-full px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2"
          style={{ background: "#FFFBEB", color: "#B45309", borderBottom: "1px solid #FCD34D" }}>
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          Sua assinatura expira em {days} {days === 1 ? "dia" : "dias"} ({expiry.toLocaleDateString("pt-BR")}).
        </div>
      );
    }
  }
  return null;
}

export default function App() {
  const { data: session, isLoading, isError } = trpc.auth.me.useQuery(undefined, { retry: false });

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center" style={{ background: "#009688" }}>
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  );

  if (isError || !session) return (
    <Switch>
      <Route path="/login"><Login /></Route>
      <Route><Login /></Route>
    </Switch>
  );

  const isAdmin = session.role === "admin";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <ScrollToTop />
      <Navbar />
      <SubscriptionBanner session={session} />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <Switch>
          <Route path="/"><Dashboard /></Route>
          <Route path="/simulado"><Simulador /></Route>
          <Route path="/simulado/enem"><Simulador fonte="ENEM" /></Route>
          <Route path="/simulado/unicamp"><Simulador fonte="UNICAMP" /></Route>
          <Route path="/simulado/fuvest"><Simulador fonte="FUVEST" /></Route>
          <Route path="/simulado/unesp"><Simulador fonte="UNESP" /></Route>
          <Route path="/simulado/repvet"><Simulador fonte="REPVET" /></Route>
          <Route path="/questoes"><Questoes fonte="ENEM" /></Route>
          <Route path="/questoes/unicamp"><Questoes fonte="UNICAMP" /></Route>
          <Route path="/questoes/fuvest"><Questoes fonte="FUVEST" /></Route>
          <Route path="/questoes/unesp"><Questoes fonte="UNESP" /></Route>
          <Route path="/questoes/repvet"><Questoes fonte="REPVET" /></Route>
          <Route path="/resultado/:id">
            {(params) => <Resultado id={Number(params.id)} />}
          </Route>
          <Route path="/revise"><Revise /></Route>
          <Route path="/revise/:id">
            {(params) => <Revise id={Number(params.id)} />}
          </Route>
          <Route path="/revisao"><Revisao /></Route>
          <Route path="/historico"><Historico /></Route>
          <Route path="/treino"><Treino /></Route>
          <Route path="/ranking"><Ranking /></Route>
          <Route path="/formulas"><Formulas /></Route>
          <Route path="/desafio"><DesafioPage /></Route>
          <Route path="/agenda"><Agenda /></Route>
          <Route path="/trilha/:areaSlug/:licaoSlug">
            {(params) => <Trilha areaSlug={params.areaSlug} licaoSlug={params.licaoSlug} />}
          </Route>
          <Route path="/trilha/:areaSlug">
            {(params) => <Trilha areaSlug={params.areaSlug} />}
          </Route>
          <Route path="/admin/questoes">
            {isAdmin ? <AdminQuestoes /> : <Redirect to="/" />}
          </Route>
          <Route path="/admin/usuarios">
            {isAdmin ? <AdminUsuarios /> : <Redirect to="/" />}
          </Route>
          <Route path="/admin/formulas">
            {isAdmin ? <AdminFormulas /> : <Redirect to="/" />}
          </Route>
          <Route path="/admin/revise">
            {isAdmin ? <AdminRevise /> : <Redirect to="/" />}
          </Route>
          <Route path="/admin/flashcards">
            {isAdmin ? <AdminFlashcards /> : <Redirect to="/" />}
          </Route>
          <Route path="/admin/trilhas">
            {isAdmin ? <AdminTrilhas /> : <Redirect to="/" />}
          </Route>
          <Route path="/flashcards/:deckId">
            {(params) => <Flashcards deckId={Number(params.deckId)} />}
          </Route>
          <Route path="/flashcards"><Flashcards /></Route>
          <Route><Redirect to="/" /></Route>
        </Switch>
      </main>
      <Footer />
    </div>
  );
}
