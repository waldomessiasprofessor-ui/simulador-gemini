import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Trash2, Loader2, Search, Shield, KeyRound,
  ChevronDown, ChevronUp, X, Check, Calendar,
  PlusCircle, MinusCircle, Clock
} from "lucide-react";

type ActionState =
  | { type: "none" }
  | { type: "confirmDelete"; userId: number }
  | { type: "resetPassword"; userId: number; name: string }
  | { type: "setSubscription"; userId: number; name: string };

const STATUS_CONFIG = {
  admin:          { label: "Admin",           bg: "#F3EAF9", color: "#263238" },
  ativa:          { label: "Assinatura ativa", bg: "#E0F2F1", color: "var(--pr-teal-dark)" },
  expirada:       { label: "Expirada",         bg: "#FFEBEE", color: "var(--pr-danger)" },
  sem_assinatura: { label: "Sem assinatura",   bg: "#F1F5F9", color: "var(--muted-foreground)" },
};

export default function AdminUsuarios() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState<ActionState>({ type: "none" });
  const [newPassword, setNewPassword] = useState("");
  const [months, setMonths] = useState(12);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.users.list.useQuery({ search: search || undefined });

  const deleteMutation = trpc.users.delete.useMutation({
    onSuccess: () => { toast.success("Usuário excluído."); setAction({ type: "none" }); utils.users.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const resetMutation = trpc.users.resetPassword.useMutation({
    onSuccess: () => { toast.success("Senha redefinida."); setAction({ type: "none" }); setNewPassword(""); },
    onError: (e) => toast.error(e.message),
  });

  const subMutation = trpc.users.setSubscription.useMutation({
    onSuccess: (d) => {
      const date = new Date(d.expiresAt).toLocaleDateString("pt-BR");
      toast.success(`Assinatura ativa até ${date}`);
      setAction({ type: "none" });
      utils.users.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const revokeMutation = trpc.users.revokeSubscription.useMutation({
    onSuccess: () => { toast.success("Assinatura revogada."); utils.users.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const users_list = data ?? [];
  const inputStyle: React.CSSProperties = {
    padding: "0.6rem 0.85rem", borderRadius: "0.75rem",
    border: "1.5px solid var(--border)", fontSize: "0.875rem",
    outline: "none", color: "var(--foreground)", background: "var(--card)",
  };

  // Resumo
  const ativas = users_list.filter((u) => u.subscriptionStatus === "ativa").length;
  const expiradas = users_list.filter((u) => u.subscriptionStatus === "expirada").length;
  const semAssinatura = users_list.filter((u) => u.subscriptionStatus === "sem_assinatura").length;

  return (
    <div className="space-y-6 py-2">

      {/* Cabeçalho */}
      <div className="rounded-2xl px-6 py-5 text-white"
        style={{ background: "linear-gradient(135deg, #263238, #009688)" }}>
        <h1 className="text-xl font-bold">Usuários e Assinaturas</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
          {users_list.length} usuário(s) cadastrado(s)
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Ativas", value: ativas, bg: "#E0F2F1", color: "var(--pr-teal-dark)" },
          { label: "Expiradas", value: expiradas, bg: "#FFEBEE", color: "var(--pr-danger)" },
          { label: "Sem assinatura", value: semAssinatura, bg: "#F1F5F9", color: "var(--muted-foreground)" },
        ].map(({ label, value, bg, color }) => (
          <div key={label} className="rounded-xl p-4 text-center" style={{ background: bg, border: `1.5px solid ${color}33` }}>
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ border: "1.5px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--pr-teal)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--pr-teal)" }} />
        </div>
      ) : users_list.length === 0 ? (
        <div className="text-center py-16 text-sm" style={{ color: "var(--muted-foreground)" }}>Nenhum usuário encontrado.</div>
      ) : (
        <div className="space-y-2">
          {users_list.map((u) => {
            const isExpanded = expandedId === u.id;
            const isConfirmingDelete = action.type === "confirmDelete" && action.userId === u.id;
            const isResetting = action.type === "resetPassword" && action.userId === u.id;
            const isSettingSub = action.type === "setSubscription" && action.userId === u.id;
            const statusCfg = STATUS_CONFIG[u.subscriptionStatus as keyof typeof STATUS_CONFIG];

            return (
              <div key={u.id} className="rounded-xl overflow-hidden"
                style={{ border: "1.5px solid var(--border)", background: "var(--card)" }}>

                {/* Linha principal */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: u.role === "admin" ? "#263238" : "#E0F2F1", color: u.role === "admin" ? "#fff" : "#009688" }}>
                    {u.name[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{u.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                        style={{ background: statusCfg.bg, color: statusCfg.color }}>
                        {u.role === "admin" && <Shield className="h-3 w-3" />}
                        {statusCfg.label}
                      </span>
                      {u.daysRemaining !== null && (
                        <span className="text-xs" style={{ color: u.daysRemaining <= 30 ? "#E65100" : "#64748B" }}>
                          {u.daysRemaining <= 30
                            ? `⚠ ${u.daysRemaining} dias restantes`
                            : `${u.daysRemaining} dias restantes`}
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{u.email}</p>
                    {u.subscriptionExpiresAt && (
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {u.subscriptionStatus === "expirada" ? "Expirou" : "Expira"} em{" "}
                        {new Date(u.subscriptionExpiresAt).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>

                  {/* Acções */}
                  {u.role !== "admin" && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => { setAction(isSettingSub ? { type: "none" } : { type: "setSubscription", userId: u.id, name: u.name }); }}
                        className="p-2 rounded-lg transition-colors" title="Gerenciar assinatura"
                        style={{ background: isSettingSub ? "#E0F2F1" : "transparent" }}>
                        <Calendar className="h-4 w-4" style={{ color: "var(--pr-teal)" }} />
                      </button>
                      <button onClick={() => { setNewPassword(""); setAction(isResetting ? { type: "none" } : { type: "resetPassword", userId: u.id, name: u.name }); }}
                        className="p-2 rounded-lg transition-colors" title="Redefinir senha"
                        style={{ background: isResetting ? "#E0F2F1" : "transparent" }}>
                        <KeyRound className="h-4 w-4" style={{ color: "var(--pr-teal)" }} />
                      </button>
                      <button onClick={() => setAction(isConfirmingDelete ? { type: "none" } : { type: "confirmDelete", userId: u.id })}
                        className="p-2 rounded-lg transition-colors" title="Excluir"
                        style={{ background: isConfirmingDelete ? "#FFEBEE" : "transparent" }}>
                        <Trash2 className="h-4 w-4" style={{ color: "var(--pr-danger)" }} />
                      </button>
                      <button onClick={() => setExpandedId(isExpanded ? null : u.id)}
                        className="p-2 rounded-lg" style={{ color: "var(--muted-foreground)" }}>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Painel: gerenciar assinatura */}
                {isSettingSub && (
                  <div className="px-4 py-4 space-y-3" style={{ borderTop: "1px solid var(--pr-teal-border)", background: "var(--muted)" }}>
                    <p className="text-sm font-bold" style={{ color: "var(--pr-teal)" }}>
                      Assinatura de {u.name}
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setMonths((m) => Math.max(1, m - 1))}
                          className="h-8 w-8 rounded-lg flex items-center justify-center"
                          style={{ background: "var(--pr-teal-soft)", color: "var(--pr-teal)" }}>
                          <MinusCircle className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-bold w-28 text-center" style={{ color: "var(--foreground)" }}>
                          {months} {months === 1 ? "mês" : "meses"}
                        </span>
                        <button onClick={() => setMonths((m) => Math.min(24, m + 1))}
                          className="h-8 w-8 rounded-lg flex items-center justify-center"
                          style={{ background: "var(--pr-teal-soft)", color: "var(--pr-teal)" }}>
                          <PlusCircle className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {[1, 3, 6, 12].map((m) => (
                          <button key={m} onClick={() => setMonths(m)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            style={months === m
                              ? { background: "#009688", color: "#fff" }
                              : { background: "var(--pr-teal-soft)", color: "var(--pr-teal)" }}>
                            {m === 1 ? "1 mês" : m === 12 ? "1 ano" : `${m} meses`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Previsão */}
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      <Clock className="h-3 w-3 inline mr-1" />
                      Expira em:{" "}
                      <strong>
                        {(() => {
                          const base = u.subscriptionExpiresAt && new Date(u.subscriptionExpiresAt) > new Date()
                            ? new Date(u.subscriptionExpiresAt)
                            : new Date();
                          base.setMonth(base.getMonth() + months);
                          return base.toLocaleDateString("pt-BR");
                        })()}
                      </strong>
                      {u.subscriptionExpiresAt && new Date(u.subscriptionExpiresAt) > new Date() && (
                        <span style={{ color: "var(--pr-teal-dark)" }}> (renovação a partir da data actual)</span>
                      )}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => subMutation.mutate({ id: u.id, months })} disabled={subMutation.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                        style={{ background: "#009688" }}>
                        {subMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Confirmar assinatura
                      </button>
                      {u.subscriptionExpiresAt && (
                        <button onClick={() => { if (confirm("Revogar assinatura?")) revokeMutation.mutate({ id: u.id }); }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
                          style={{ background: "var(--pr-danger-bg)", color: "var(--pr-danger)" }}>
                          <MinusCircle className="h-3.5 w-3.5" /> Revogar
                        </button>
                      )}
                      <button onClick={() => setAction({ type: "none" })}
                        className="px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Painel: redefinir senha */}
                {isResetting && (
                  <div className="px-4 py-3 space-y-2" style={{ borderTop: "1px solid var(--pr-teal-border)", background: "var(--muted)" }}>
                    <p className="text-sm font-semibold" style={{ color: "var(--pr-teal)" }}>Nova senha para {u.name}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nova senha (mínimo 6 caracteres)"
                        style={{ ...inputStyle, flex: 1, minWidth: 200 }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--pr-teal)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        onKeyDown={(e) => e.key === "Enter" && resetMutation.mutate({ id: u.id, newPassword })} />
                      <button onClick={() => resetMutation.mutate({ id: u.id, newPassword })}
                        disabled={resetMutation.isPending || newPassword.length < 6}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                        style={{ background: "#009688" }}>
                        {resetMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Redefinir
                      </button>
                      <button onClick={() => { setAction({ type: "none" }); setNewPassword(""); }}
                        className="px-3 py-2 rounded-xl text-sm" style={{ color: "var(--muted-foreground)" }}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Painel: confirmar exclusão */}
                {isConfirmingDelete && (
                  <div className="px-4 py-3 flex items-center gap-3 flex-wrap"
                    style={{ borderTop: "1px solid var(--pr-danger-border)", background: "var(--pr-danger-bg)" }}>
                    <p className="text-sm font-semibold flex-1" style={{ color: "var(--pr-danger)" }}>
                      Excluir "{u.name}"? Todos os dados serão apagados.
                    </p>
                    <button onClick={() => deleteMutation.mutate({ id: u.id })} disabled={deleteMutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
                      style={{ background: "#C62828" }}>
                      {deleteMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Confirmar
                    </button>
                    <button onClick={() => setAction({ type: "none" })}
                      className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Expansão: detalhes */}
                {isExpanded && !isConfirmingDelete && !isResetting && !isSettingSub && (
                  <div className="px-4 py-3 space-y-1" style={{ borderTop: "1px solid var(--border)", background: "var(--muted)" }}>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}><span className="font-semibold">ID:</span> {u.id}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}><span className="font-semibold">E-mail:</span> {u.email}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}><span className="font-semibold">Função:</span> {u.role === "admin" ? "Administrador" : "Aluno"}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}><span className="font-semibold">Status:</span> {u.active ? "Ativo" : "Inativo"}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      <span className="font-semibold">Assinatura:</span>{" "}
                      {u.subscriptionExpiresAt
                        ? `${u.subscriptionStatus === "expirada" ? "Expirou" : "Expira"} em ${new Date(u.subscriptionExpiresAt).toLocaleDateString("pt-BR")}`
                        : "Sem assinatura definida"}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}><span className="font-semibold">Cadastrado:</span> {new Date(u.createdAt).toLocaleString("pt-BR")}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
