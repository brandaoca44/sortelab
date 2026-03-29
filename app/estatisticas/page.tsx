"use client";

import { useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StatsGrid } from "@/components/StatsGrid";
import { estatisticasPorBanca } from "@/data/estatisticasDetalhadas";

export default function EstatisticasPage() {
  const [bancaSelecionada, setBancaSelecionada] = useState(
    estatisticasPorBanca[0]?.banca || ""
  );

  const bancaAtual = useMemo(
    () =>
      estatisticasPorBanca.find((item) => item.banca === bancaSelecionada) ||
      estatisticasPorBanca[0],
    [bancaSelecionada]
  );

  return (
    <>
      <Header />

      <main className="py-14">
        <div className="container">
          <section>
            <span className="badge-primary">Painel estatístico</span>

            <h1 className="title-premium mt-6 text-4xl font-semibold md:text-5xl">
              Estatísticas
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Consulte frequência, atraso e destaques recentes por banca e
              horário em uma leitura mais clara e objetiva.
            </p>
          </section>

        
          <section className="mt-10">
            <div className="surface-card-strong rounded-3xl p-6 md:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="title-premium text-2xl font-semibold md:text-3xl">
                    Por banca e horário
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted md:text-base">
                    Selecione a banca para visualizar os grupos e dezenas em
                    destaque, com foco no que mais saiu e no que está em atraso.
                  </p>
                </div>

                <div className="w-full max-w-xs">
                  <label
                    htmlFor="banca"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Selecione a banca
                  </label>

                  <select
                    id="banca"
                    value={bancaSelecionada}
                    onChange={(e) => setBancaSelecionada(e.target.value)}
                    className="select-base"
                  >
                    {estatisticasPorBanca.map((item) => (
                      <option key={item.banca} value={item.banca}>
                        {item.banca}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="badge-primary">
                  Últimos {bancaAtual?.dias || 7} dias
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted">
                  {bancaAtual?.horarios.length || 0} horários monitorados
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {bancaAtual?.horarios.map((horario) => (
                  <StatsGrid
                    key={`${bancaAtual.banca}-${horario}`}
                    banca={bancaAtual.banca}
                    horario={horario}
                    dias={Number(bancaAtual.dias) || 7}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}