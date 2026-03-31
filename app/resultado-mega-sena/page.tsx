import type { Metadata } from "next";
import { kv } from "@vercel/kv";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoteriaCard } from "@/components/LoteriaCard";
import { LotteryGeneratorCard } from "@/components/LotteryGeneratorCard";
import { PartnerBetCard } from "@/components/PartnerBetCard";
import type { ResultadoLoteria } from "@/data/resultados-completos/types";

export const metadata: Metadata = {
  title: "Resultado da Mega-Sena",
  description: "Confira os últimos resultados da Mega-Sena no SorteLab.",
};

function formatarAcumulado(valor: string): string {
  const num = Number(valor.replace(/\./g, "").replace(",", "."));
  if (isNaN(num)) return valor;
  if (num >= 1_000_000) {
    const milhoes = num / 1_000_000;
    return `${milhoes.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} MILHÕES`;
  }
  return num.toLocaleString("pt-BR");
}

export default async function ResultadoMegaSenaPage() {
  const lista = await kv.get<ResultadoLoteria[]>("loteria:megasena:lista") ?? [];
  const acumulado = await kv.get<string>("loteria:megasena:acumulado");

  return (
    <>
      <Header />

      <main className="py-14">
        <div className="container grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <section>
              <span className="badge-primary">Loterias</span>
              <h1 className="title-premium mt-6 text-4xl font-semibold md:text-5xl">
                Resultado da Mega-Sena
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                Consulte os concursos mais recentes da Mega-Sena e gere palpites
                automáticos para novos jogos.
              </p>
            </section>

            {/* CARD ACUMULADO */}
            {acumulado && (
              <section className="mt-8">
                <div className="relative overflow-hidden rounded-3xl border border-[rgba(245,196,81,0.3)] bg-[rgba(245,196,81,0.06)] p-6 text-center">
                  {/* Estrelinhas CSS */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                      <span
                        key={i}
                        className="absolute text-[#f5c451] opacity-60"
                        style={{
                          left: `${(i * 37 + 5) % 95}%`,
                          top: `${(i * 53 + 10) % 80}%`,
                          fontSize: `${8 + (i % 3) * 4}px`,
                          animation: `pulse ${1.5 + (i % 3) * 0.5}s ease-in-out infinite`,
                          animationDelay: `${(i * 0.2) % 1.5}s`,
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="relative text-sm font-semibold uppercase tracking-widest text-[#f5c451]">
                    Prêmio Acumulado
                  </p>
                  <p className="relative mt-2 text-4xl font-bold text-white md:text-5xl">
                    R$ {formatarAcumulado(acumulado)}
                  </p>
                  <p className="relative mt-2 text-base font-semibold text-[#f5c451]">
                    {formatarAcumulado(acumulado).includes("MILHÕES")
                      ? `R$ ${Number(acumulado.replace(/\./g, "")).toLocaleString("pt-BR")}!!!`
                      : "Não perca essa chance!"}
                  </p>
                </div>
              </section>
            )}

            <section className="mt-10">
              <LotteryGeneratorCard
                titulo="Gerador da Mega-Sena"
                descricao="Gere 6 dezenas automáticas entre 01 e 60 de forma rápida."
                quantidade={6}
                maxNumero={60}
              />
            </section>

            <section className="mt-10 space-y-5">
              {lista.length > 0 ? (
                lista.map((resultado) => (
                  <LoteriaCard
                    key={resultado.concurso}
                    concurso={resultado.concurso}
                    data={resultado.data}
                    dezenas={resultado.dezenas}
                  />
                ))
              ) : (
                <div className="surface-card rounded-2xl p-10 text-center text-muted">
                  Nenhum resultado disponível ainda.
                </div>
              )}
            </section>
          </div>

          <PartnerBetCard
            titulo="Aposte na Mega-Sena"
            descricao="Faça sua aposta em uma plataforma parceira de forma rápida e segura."
            ctaLabel="Apostar agora"
            href="#"
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
