"use client";

import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const atalhos = [
  {
    titulo: "Bancas",
    descricao:
      "Consulte Bahia, Nacional, Look, Rio de Janeiro, Lotep, Lotece, São Paulo, Goiás e Minas Gerais.",
    href: "/bancas",
    tag: "Resultados por banca",
  },
  {
    titulo: "Mega-Sena",
    descricao: "Veja concursos recentes e acompanhe resultados rapidamente.",
    href: "/resultado-mega-sena",
    tag: "Loterias",
  },
  {
    titulo: "Lotofácil",
    descricao: "Consulte dezenas sorteadas e histórico recente.",
    href: "/resultado-lotofacil",
    tag: "Loterias",
  },
  {
    titulo: "Estatísticas",
    descricao: "Acompanhe frequência, atraso e tendências do momento.",
    href: "/estatisticas",
    tag: "Análises",
  },
  {
    titulo: "Grupos e Dezenas",
    descricao: "Veja grupos do bicho, dezenas, dicas do dia e gerador.",
    href: "/grupos-e-dezenas",
    tag: "Consulta rápida",
  },
];

const bancasDestaque = [
  {
    nome: "Bahia",
    descricao: "Resultados por horário, normal e maluca.",
    href: "/bancas/bahia",
  },
  {
    nome: "Nacional",
    descricao: "Resultados completos e histórico recente.",
    href: "/bancas/nacional",
  },
  {
    nome: "São Paulo",
    descricao: "Resultados atualizados por horário.",
    href: "/bancas/sao-paulo",
  },
];

function AdBlock() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP}?text=Quero%20anunciar%20no%20SorteLab`}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-[rgba(245,196,81,0.25)] bg-[rgba(245,196,81,0.04)] px-6 py-5 transition hover:border-[rgba(245,196,81,0.45)] hover:bg-[rgba(245,196,81,0.07)]">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(245,196,81,0.3)] bg-[rgba(245,196,81,0.1)]">
            <span className="text-base text-[#f5c451]">★</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f5c451]">
              Anuncie aqui
            </p>
            <p className="text-xs text-slate-400">
              Alcance milhares de jogadores diariamente
            </p>
          </div>
        </div>
        <div className="hidden rounded-xl border border-[rgba(245,196,81,0.2)] bg-[rgba(245,196,81,0.08)] px-4 py-2 sm:block">
          <p className="text-xs font-semibold text-[#f5c451]">Fale conosco</p>
        </div>
      </div>
    </a>
  );
}

function SectionHeader({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 className="title-premium text-2xl font-semibold md:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted md:text-base">
          {description}
        </p>
      </div>
      {href && cta ? (
        <Link href={href} className="btn-secondary">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [tipoPremio, setTipoPremio] = useState<
    "milhar" | "centena" | "dezena" | "grupo"
  >("milhar");
  const [valorAposta, setValorAposta] = useState("10");

  const multiplicadores = {
    milhar: 8000,
    centena: 800,
    dezena: 80,
    grupo: 20,
  };

  const valorNumerico = Number(valorAposta) || 0;
  const retornoEstimado = valorNumerico * multiplicadores[tipoPremio];

  return (
    <>
      <Header />

      <main className="py-16">
        <section className="border-b border-white/10">
          <div className="container py-10 md:py-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="max-w-2xl">
                <span className="badge-primary">
                  Plataforma inteligente de resultados e tendências
                </span>
                <h1 className="title-premium mt-4 text-3xl font-semibold leading-tight md:text-4xl">
                  Resultados, estatísticas e palpites em um só lugar
                </h1>
                <p className="mt-3 text-sm text-muted md:text-base">
                  Consulte bancas, acompanhe loterias e visualize tendências de
                  forma rápida e direta.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/bancas" className="btn-primary px-5 py-2.5 text-sm">
                    Ver bancas
                  </Link>
                  <Link href="/resultado-mega-sena" className="btn-secondary px-5 py-2.5 text-sm">
                    Mega-Sena
                  </Link>
                  <Link href="/resultado-lotofacil" className="btn-secondary px-5 py-2.5 text-sm">
                    Lotofácil
                  </Link>
                </div>
              </div>

              <div className="surface-card-strong rounded-2xl p-4 md:p-5">
                <p className="text-xs text-muted">Calculadora rápida</p>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  Simule retorno
                </h3>
                <div className="mt-3 grid gap-3">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(["milhar", "centena", "dezena", "grupo"] as const).map(
                      (tipo) => {
                        const ativo = tipoPremio === tipo;
                        return (
                          <button
                            key={tipo}
                            onClick={() => setTipoPremio(tipo)}
                            className={`rounded-lg px-2 py-1.5 text-xs capitalize transition ${
                              ativo
                                ? "bg-[rgba(245,196,81,0.15)] text-[#f5c451]"
                                : "bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                            }`}
                          >
                            {tipo}
                          </button>
                        );
                      }
                    )}
                  </div>
                  <input
                    type="number"
                    value={valorAposta}
                    onChange={(e) => {
                      const val = Math.min(Math.max(Number(e.target.value), 0), 10000);
                      setValorAposta(String(val));
                    }}
                    className="input-base py-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="surface-soft rounded-xl p-3">
                      <p className="text-xs text-muted">Multiplicador</p>
                      <strong className="text-lg text-gold">
                        {multiplicadores[tipoPremio]}x
                      </strong>
                    </div>
                    <div className="surface-soft rounded-xl p-3">
                      <p className="text-xs text-muted">Retorno</p>
                      <strong className="text-lg text-gold">
                        R$ {retornoEstimado.toLocaleString("pt-BR")}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="container">
            <AdBlock />
          </div>
        </section>

        <section className="py-14">
          <div className="container">
            <SectionHeader
              title="Acesso rápido"
              description="As principais áreas da plataforma organizadas para uma navegação mais simples e objetiva."
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {atalhos.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="surface-card group rounded-2xl p-6 transition duration-200 hover:-translate-y-1"
                >
                  <span className="badge-primary text-xs">{item.tag}</span>
                  <h3 className="mt-4 text-lg font-semibold text-white transition group-hover:text-gold">
                    {item.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {item.descricao}
                  </p>
                  <span className="mt-6 inline-flex items-center text-sm font-medium text-slate-300 transition group-hover:text-white">
                    Acessar
                    <span className="ml-2 transition group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-4">
          <div className="container">
            <AdBlock />
          </div>
        </section>

        <section className="py-14">
          <div className="container">
            <SectionHeader
              title="Resultados por bancas"
              description="Consulte resultados completos do jogo do bicho por banca, com horários atualizados, histórico recente e navegação direta."
              href="/bancas"
              cta="Ver todas as bancas"
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {bancasDestaque.map((banca) => (
                <Link
                  key={banca.href}
                  href={banca.href}
                  className="surface-card group rounded-2xl p-6 transition duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-white">
                      {banca.nome}
                    </h3>
                    <span className="text-sm text-slate-500 transition group-hover:text-[#f5c451]">
                      →
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {banca.descricao}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="container">
            <AdBlock />
          </div>
        </section>

        <section className="py-14">
          <div className="container">
            <SectionHeader
              title="Últimos resultados da Mega-Sena"
              description="Consulte os concursos mais recentes com dezenas organizadas para leitura rápida e visual mais limpo."
              href="/resultado-mega-sena"
              cta="Ver Mega-Sena completa"
            />
            <p className="text-sm text-muted">
              Acesse a página completa para ver os resultados mais recentes.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="container">
            <SectionHeader
              title="Últimos resultados da Lotofácil"
              description="Visualize os concursos recentes da Lotofácil com dezenas organizadas de forma simples e objetiva."
              href="/resultado-lotofacil"
              cta="Ver Lotofácil completa"
            />
            <p className="text-sm text-muted">
              Acesse a página completa para ver os resultados mais recentes.
            </p>
          </div>
        </section>

        <section className="py-6">
          <div className="container">
            <AdBlock />
          </div>
        </section>

        <section className="py-14">
          <div className="container">
            <div className="surface-card-strong rounded-3xl px-6 py-8 md:px-8 md:py-10">
              <div className="grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <span className="badge-primary">SorteLab</span>
                  <h2 className="title-premium mt-4 text-3xl font-semibold">
                    Uma plataforma feita para consulta rápida e evolução contínua
                  </h2>
                  <p className="mt-3 max-w-2xl text-muted">
                    Resultados, bancas, loterias, estatísticas e tendências em
                    uma estrutura mais organizada, com visual mais profissional
                    e preparada para crescer.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 md:justify-end">
                  <Link href="/bancas" className="btn-primary">
                    Explorar bancas
                  </Link>
                  <Link href="/estatisticas" className="btn-secondary">
                    Ver estatísticas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
