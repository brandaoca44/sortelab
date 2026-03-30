"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PartnerBetCard } from "@/components/PartnerBetCard";
import { bancas } from "@/data/bancas";

// ========================
// FRASES POR SIGNO
// ========================
const FRASES = [
  "O universo conspira a seu favor hoje.", "Confie no seu instinto, ele raramente erra.",
  "Números que dormiam acordam hoje.", "A paciência é a maior estratégia.",
  "Um dia de surpresas positivas se aproxima.", "Observe os padrões antes de agir.",
  "A sorte favorece quem está atento.", "Energia renovada traz novas oportunidades.",
  "Hoje é dia de arriscar com cautela.", "O equilíbrio é sua maior força agora.",
  "Foque no que realmente importa hoje.", "Movimentos sutis trazem grandes resultados.",
  "A intuição fala mais alto que a razão.", "Dia de colher o que foi plantado.",
  "Novos ciclos se abrem para você.", "A determinação supera qualquer obstáculo.",
  "Esteja aberto para o inesperado.", "Pequenas apostas, grandes retornos.",
  "A mente calma atrai boas vibrações.", "Hoje a sorte favorece os corajosos.",
  "Analise antes de decidir.", "O momento certo chegará, seja paciente.",
  "Sua energia positiva atrai resultados.", "Confie no processo e nos números.",
  "Dia favorável para novas tentativas.", "Observe o que os astros indicam.",
  "A persistência é recompensada hoje.", "Combine razão e intuição.",
  "O risco calculado é seu aliado.", "Energia alta, probabilidades favoráveis.",
  "Dê atenção aos sinais ao seu redor.", "Hoje é dia de ousar com sabedoria.",
  "A clareza mental traz boas escolhas.", "Resultados positivos estão próximos.",
  "Mantenha o foco no seu objetivo.", "A sorte sorri para quem persiste.",
  "Dia de grandes movimentações.", "Confie na sua experiência acumulada.",
  "O ambiente está favorável para você.", "Transformações positivas se aproximam.",
  "Sua determinação abre novos caminhos.", "Hoje os números falam por si.",
  "Equilíbrio e foco são suas ferramentas.", "A virada está mais perto do que parece.",
  "Novidades positivas chegam logo.", "Ação e intuição caminham juntas hoje.",
  "Seja estratégico nas suas escolhas.", "O universo está alinhado a seu favor.",
  "Dia de conquistar o que deseja.", "Sua energia atrai o que é seu.",
  "Observe os padrões e confie neles.", "O sucesso favorece quem está preparado.",
  "Hoje é dia de acreditar mais.", "Movimentos precisos geram grandes resultados.",
  "A calma é sua maior aliada.", "Dia de viradas inesperadas e positivas.",
  "Confie no fluxo natural dos eventos.", "Sua hora chegou, aproveite bem.",
  "Números e intuição se alinham hoje.", "O equilíbrio atrai prosperidade.",
];

const SIGNOS = {
  Áries: { grupo: "02", bicho: "Águia" },
  Touro: { grupo: "11", bicho: "Cavalo" },
  Gêmeos: { grupo: "04", bicho: "Borboleta" },
  Câncer: { grupo: "24", bicho: "Veado" },
  Leão: { grupo: "16", bicho: "Leão" },
  Virgem: { grupo: "06", bicho: "Cabra" },
  Libra: { grupo: "19", bicho: "Pavão" },
  Escorpião: { grupo: "22", bicho: "Tigre" },
  Sagitário: { grupo: "13", bicho: "Galo" },
  Capricórnio: { grupo: "12", bicho: "Elefante" },
  Aquário: { grupo: "17", bicho: "Macaco" },
  Peixes: { grupo: "10", bicho: "Coelho" },
} as const;

type Signo = keyof typeof SIGNOS;

// Gera milhar aleatória mas determinística por signo + data
function gerarMilhar(signo: string): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const seed = (signo + hoje).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return String(seed % 10000).padStart(4, "0");
}

function getFrase(signo: string): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const seed = (signo + hoje + "frase").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FRASES[seed % FRASES.length];
}

// ========================
// TIPOS
// ========================
type StatHorario = {
  grupoFrequente: string;
  grupoAtrasado: string;
  dezenaFrequente: string;
  dezenaAtrasada: string;
  diasComDados: number;
  totalResultados: number;
};

type StatsResponse = {
  sucesso: boolean;
  banca: string;
  totalDiasComDados: number;
  diasSolicitados: number;
  resultado: Record<string, StatHorario>;
};

// ========================
// COMPONENTE CARD DE STATS
// ========================
function StatCard({ horario, stats, diasMeta }: { horario: string; stats: StatHorario; diasMeta: number }) {
  const progresso = Math.min(Math.round((stats.diasComDados / diasMeta) * 100), 100);
  const semDados = stats.totalResultados === 0;

  return (
    <article className="surface-card rounded-2xl p-5 transition duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">{horario}</h3>
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted">
          {stats.diasComDados} dia{stats.diasComDados !== 1 ? "s" : ""}
        </span>
      </div>

      {semDados ? (
        <div className="mt-4">
          <p className="text-xs text-muted">Acumulando dados...</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[rgba(245,196,81,0.4)]" style={{ width: `${progresso}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted">{progresso}% de {diasMeta} dias</p>
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="surface-soft rounded-xl p-3">
              <p className="text-xs uppercase tracking-wide text-muted-2">Grupo frequente</p>
              <strong className="mt-1 block text-sm font-semibold text-gold">{stats.grupoFrequente}</strong>
            </div>
            <div className="surface-soft rounded-xl p-3">
              <p className="text-xs uppercase tracking-wide text-muted-2">Grupo atrasado</p>
              <strong className="mt-1 block text-sm font-semibold text-white">{stats.grupoAtrasado}</strong>
            </div>
            <div className="surface-soft rounded-xl p-3">
              <p className="text-xs uppercase tracking-wide text-muted-2">Dezena frequente</p>
              <strong className="mt-1 block text-sm font-semibold text-gold">{stats.dezenaFrequente}</strong>
            </div>
            <div className="surface-soft rounded-xl p-3">
              <p className="text-xs uppercase tracking-wide text-muted-2">Dezena atrasada</p>
              <strong className="mt-1 block text-sm font-semibold text-white">{stats.dezenaAtrasada}</strong>
            </div>
          </div>

          {/* TENDÊNCIA */}
          <div className="mt-4 rounded-xl border border-[rgba(245,196,81,0.2)] bg-[rgba(245,196,81,0.05)] p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">Tendência sugerida</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {stats.dezenaAtrasada !== "—" && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white">
                  Dezena {stats.dezenaAtrasada}
                </span>
              )}
              {stats.grupoAtrasado !== "—" && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white">
                  {stats.grupoAtrasado}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </article>
  );
}

// ========================
// PÁGINA PRINCIPAL
// ========================
export default function AnalisePage() {
  const [aba, setAba] = useState<"estatisticas" | "tendencias">("estatisticas");
  const [bancaSelecionada, setBancaSelecionada] = useState(bancas[0].slug);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [signo, setSigno] = useState<Signo>("Áries");

  const carregarStats = useCallback(async (slug: string) => {
    setCarregando(true);
    setStats(null);
    try {
      const res = await fetch(`/api/admin/stats?banca=${slug}&dias=30`);
      const json = await res.json();
      if (json.sucesso) setStats(json);
    } catch {
      console.error("Erro ao carregar estatísticas");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarStats(bancaSelecionada);
  }, [bancaSelecionada, carregarStats]);

  const bancaAtual = bancas.find((b) => b.slug === bancaSelecionada);
  const milharSigno = gerarMilhar(signo);
  const fraseSigno = getFrase(signo);
  const signoInfo = SIGNOS[signo];

  return (
    <>
      <Header />

      <main className="py-14">
        <div className="container grid gap-8 lg:grid-cols-[1fr_280px]">

          {/* CONTEÚDO PRINCIPAL */}
          <div>
            {/* HEADER DA PÁGINA */}
            <section>
              <span className="badge-primary">Análise & Tendências</span>
              <h1 className="title-premium mt-4 text-4xl font-semibold md:text-5xl">
                Análise & Tendências
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                Estatísticas reais dos resultados, tendências automáticas e palpites
                personalizados por signo — tudo em um só lugar.
              </p>
            </section>

            {/* ABAS */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setAba("estatisticas")}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                  aba === "estatisticas"
                    ? "border border-[rgba(245,196,81,0.3)] bg-[rgba(245,196,81,0.15)] text-gold"
                    : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                }`}
              >
                Estatísticas
              </button>
              <button
                onClick={() => setAba("tendencias")}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                  aba === "tendencias"
                    ? "border border-[rgba(245,196,81,0.3)] bg-[rgba(245,196,81,0.15)] text-gold"
                    : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                }`}
              >
                Tendências do dia
              </button>
            </div>

            {/* ======================== ABA ESTATÍSTICAS ======================== */}
            {aba === "estatisticas" && (
              <section className="mt-6">
                <div className="surface-card-strong rounded-3xl p-6 md:p-7">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <h2 className="title-premium text-2xl font-semibold">
                        Por banca e horário
                      </h2>
                      <p className="mt-2 text-sm text-muted">
                        Frequência, atraso e tendências baseadas nos resultados reais.
                      </p>
                    </div>
                    <div className="w-full max-w-xs">
                      <label className="mb-2 block text-xs font-medium text-muted">
                        Selecione a banca
                      </label>
                      <select
                        value={bancaSelecionada}
                        onChange={(e) => setBancaSelecionada(e.target.value)}
                        className="select-base"
                      >
                        {bancas.map((b) => (
                          <option key={b.slug} value={b.slug}>{b.nome}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* BARRA DE PROGRESSO GERAL */}
                  {stats && (
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <span className="badge-primary">
                        {stats.totalDiasComDados} dia{stats.totalDiasComDados !== 1 ? "s" : ""} de dados
                      </span>
                      {stats.totalDiasComDados < 7 && (
                        <span className="rounded-full border border-[rgba(245,196,81,0.2)] bg-[rgba(245,196,81,0.06)] px-3 py-1 text-xs text-gold">
                          Acumulando histórico — estatísticas ficam mais precisas com 30 dias
                        </span>
                      )}
                    </div>
                  )}

                  {carregando ? (
                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {(bancaAtual?.horarios || []).map((h) => (
                        <div key={h} className="surface-card animate-pulse rounded-2xl p-5 h-40" />
                      ))}
                    </div>
                  ) : stats ? (
                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {Object.entries(stats.resultado).map(([horario, data]) => (
                        <StatCard
                          key={horario}
                          horario={horario}
                          stats={data}
                          diasMeta={30}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>
            )}

            {/* ======================== ABA TENDÊNCIAS ======================== */}
            {aba === "tendencias" && (
              <section className="mt-6 space-y-6">

                {/* TENDÊNCIAS POR BANCA */}
                <div className="surface-card-strong rounded-3xl p-6 md:p-7">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <h2 className="title-premium text-2xl font-semibold">
                        Tendências por banca
                      </h2>
                      <p className="mt-2 text-sm text-muted">
                        Sugestões automáticas baseadas nos grupos e dezenas atrasados.
                      </p>
                    </div>
                    <div className="w-full max-w-xs">
                      <label className="mb-2 block text-xs font-medium text-muted">
                        Selecione a banca
                      </label>
                      <select
                        value={bancaSelecionada}
                        onChange={(e) => setBancaSelecionada(e.target.value)}
                        className="select-base"
                      >
                        {bancas.map((b) => (
                          <option key={b.slug} value={b.slug}>{b.nome}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {carregando ? (
                    <p className="mt-6 text-sm text-muted">Carregando tendências...</p>
                  ) : stats ? (
                    <div className="mt-6 space-y-4">
                      {Object.entries(stats.resultado).map(([horario, data]) => {
                        if (data.totalResultados === 0) return null;
                        const milhar = `${String(Math.floor(Math.random() * 100)).padStart(2, "0")}${data.dezenaAtrasada !== "—" ? data.dezenaAtrasada : "00"}`;
                        return (
                          <div key={horario} className="surface-card rounded-2xl p-5">
                            <div className="flex items-center justify-between gap-4">
                              <h3 className="text-base font-semibold text-white">{horario}</h3>
                              <span className="badge-primary text-xs">Sugestão</span>
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              {[
                                { label: "Milhar", value: milhar, gold: true },
                                { label: "Centena", value: milhar.slice(-3) },
                                { label: "Dezena", value: data.dezenaAtrasada !== "—" ? data.dezenaAtrasada : "—" },
                                { label: "Grupo", value: data.grupoAtrasado !== "—" ? data.grupoAtrasado.split(" - ")[0] + " - " + data.grupoAtrasado.split(" - ")[1] : "—" },
                              ].map((item) => (
                                <div key={item.label} className="surface-soft rounded-xl p-3">
                                  <p className="text-xs text-muted">{item.label}</p>
                                  <strong className={`mt-1 block text-lg font-semibold ${item.gold ? "text-gold" : "text-white"}`}>
                                    {item.value}
                                  </strong>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      {Object.values(stats.resultado).every((d) => d.totalResultados === 0) && (
                        <div className="surface-card rounded-2xl p-8 text-center">
                          <p className="text-muted">Acumulando dados para gerar tendências precisas.</p>
                          <p className="mt-2 text-xs text-muted">As sugestões aparecem conforme os resultados são registrados.</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* PALPITE POR SIGNO */}
                <div className="surface-card-strong rounded-3xl p-6 md:p-7">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="title-premium text-2xl font-semibold">
                        Palpite por signo
                      </h2>
                      <p className="mt-2 text-sm text-muted">
                        Combinações do dia baseadas nos astros.
                      </p>
                    </div>
                    <div className="w-full max-w-xs">
                      <label className="mb-2 block text-xs font-medium text-muted">
                        Seu signo
                      </label>
                      <select
                        value={signo}
                        onChange={(e) => setSigno(e.target.value as Signo)}
                        className="select-base"
                      >
                        {Object.keys(SIGNOS).map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        { label: "Milhar", value: milharSigno, gold: true },
                        { label: "Centena", value: milharSigno.slice(-3) },
                        { label: "Dezena", value: milharSigno.slice(-2) },
                        { label: "Grupo", value: `${signoInfo.grupo} - ${signoInfo.bicho}` },
                      ].map((item) => (
                        <div key={item.label} className="surface-soft rounded-xl p-4">
                          <p className="text-xs text-muted">{item.label}</p>
                          <strong className={`mt-2 block text-xl font-semibold ${item.gold ? "text-gold" : "text-white"}`}>
                            {item.value}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 surface-soft rounded-xl p-4">
                      <p className="text-xs text-muted">Mensagem do dia</p>
                      <p className="mt-2 text-sm text-white">{fraseSigno}</p>
                    </div>
                  </div>
                </div>

              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-4">
            <PartnerBetCard
              titulo="Aposte agora"
              descricao="Leve suas tendências para a plataforma parceira e faça seu jogo com segurança."
              ctaLabel="Ir para a banca"
              href="#"
            />
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
