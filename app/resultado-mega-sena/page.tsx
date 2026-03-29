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

export default async function ResultadoMegaSenaPage() {
  const lista = await kv.get<ResultadoLoteria[]>("loteria:megasena:lista") ?? [];

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
