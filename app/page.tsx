"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

// ========================
// DADOS DO PAINEL GANHADOR
// ========================
const BANCAS_NOMES = [
  "Bahia", "Nacional", "São Paulo", "Look", "Rio de Janeiro",
  "Lotep", "Lotece", "Goiás", "Minas Gerais",
];

const MODALIDADES = [
  { nome: "Milhar", mult: 8000, apostas: [1, 2, 5, 10, 20, 50, 100, 200, 300] },
  { nome: "Centena", mult: 800, apostas: [1, 2, 5, 10, 20, 50, 100, 200, 300] },
  { nome: "Dezena", mult: 80, apostas: [1, 2, 5, 10, 20, 50, 100, 200, 500] },
  { nome: "Grupo", mult: 20, apostas: [1, 2, 5, 10, 20, 50, 100, 300, 500] },
  { nome: "Duque Dez", mult: 300, apostas: [1, 2, 5, 10, 20, 50, 100] },
  { nome: "Duque GP", mult: 180, apostas: [1, 2, 5, 10, 20, 50, 100, 200] },
  { nome: "Terno Dez", mult: 5000, apostas: [1, 2, 5, 10, 20, 50] },
  { nome: "Terno Dez Seco", mult: 10000, apostas: [1, 2, 5, 10, 20] },
  { nome: "Terno GP", mult: 1500, apostas: [1, 2, 5, 10, 20, 50, 100] },
  { nome: "Quadra GP", mult: 1000, apostas: [1, 2, 5, 10, 20, 50, 100] },
  { nome: "Unidade", mult: 8, apostas: [5, 10, 20, 50, 100, 200, 500, 1000] },
];

const HORARIOS = ["10:00", "12:00", "14:00", "15:00", "16:00", "18:00", "19:00", "21:00"];
const MODALIDADES_LABEL = ["Normal", "Maluca"];

const NOMES = [
  "J. Silva", "M. Santos", "A. Oliveira", "C. Souza", "R. Lima",
  "P. Costa", "L. Ferreira", "T. Alves", "D. Pereira", "F. Rodrigues",
  "K. Nascimento", "B. Carvalho", "G. Martins", "H. Araújo", "N. Gomes",
  "V. Ribeiro", "E. Mendes", "I. Barbosa", "W. Cardoso", "S. Rocha",
];

const MILHARES = [
  "4587","1208","7742","3391","8815","6420","5521","7088","1436","6214",
  "8142","3905","2321","9544","5019","0706","3102","1917","2244","5834",
  "7711","6248","9056","1439","8624","4908","7352","2845","3187","4492",
];

function gerarGanhador(seed: number) {
  const s = (n: number, max: number) => Math.abs((seed * 1103515245 + n * 12345) & 0x7fffffff) % max;
  const modalidade = MODALIDADES[s(1, MODALIDADES.length)];
  const aposta = modalidade.apostas[s(2, modalidade.apostas.length)];
  const premio = aposta * modalidade.mult;

  return {
    nome: NOMES[s(3, NOMES.length)],
    banca: BANCAS_NOMES[s(4, BANCAS_NOMES.length)],
    modalidadeLabel: MODALIDADES_LABEL[s(5, MODALIDADES_LABEL.length)],
    modalidade: modalidade.nome,
    palpite: MILHARES[s(6, MILHARES.length)],
    horario: HORARIOS[s(7, HORARIOS.length)],
    aposta,
    premio,
  };
}

// Gera 100 ganhadores fixos (baseados em índice, não aleatórios a cada render)
const GANHADORES = Array.from({ length: 100 }, (_, i) => gerarGanhador(i * 7919 + 31337));

const STORAGE_KEY = "sortelab_ganhador";
const INTERVALO_MS = 30 * 60 * 1000; // 30 minutos

function UltimoGanhador() {
  const [ganhador, setGanhador] = useState(GANHADORES[0]);
  const [proximo, setProximo] = useState(0);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        const { indice, timestamp } = JSON.parse(salvo);
        const agora = Date.now();
        if (agora - timestamp < INTERVALO_MS) {
          setGanhador(GANHADORES[indice % GANHADORES.length]);
          const restante = INTERVALO_MS - (agora - timestamp);
          const timer = setTimeout(() => avancar(indice), restante);
          return () => clearTimeout(timer);
        }
      }
      avancar(Math.floor(Math.random() * GANHADORES.length));
    } catch {
      avancar(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function avancar(indice: number) {
    const novoIndice = (indice + 1) % GANHADORES.length;
    setGanhador(GANHADORES[novoIndice]);
    setProximo(novoIndice);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ indice: novoIndice, timestamp: Date.now() }));
    } catch {}
    const timer = setTimeout(() => avancar(novoIndice), INTERVALO_MS);
    return () => clearTimeout(timer);
  }

  return (
    <div className="surface-card-strong rounded-2xl p-4 md:p-5 h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        <p className="text-xs font-semibold uppercase tracking-widest text-green-400">
          Último Ganhador
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(245,196,81,0.3)] bg-[rgba(245,196,81,0.1)]">
          <span className="text-base">🏆</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{ganhador.nome}</p>
          <p className="text-xs text-muted">{ganhador.horario} — {ganhador.banca}</p>
        </div>
      </div>

      <div className="grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="surface-soft rounded-xl p-3">
            <p className="text-xs text-muted">Loteria</p>
            <strong className="mt-1 block text-sm text-white">
              {ganhador.modalidadeLabel}
            </strong>
          </div>
          <div className="surface-soft rounded-xl p-3">
            <p className="text-xs text-muted">Modalidade</p>
            <strong className="mt-1 block text-sm text-white">
              {ganhador.modalidade}
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="surface-soft rounded-xl p-3">
            <p className="text-xs text-muted">Palpite</p>
            <strong className="mt-1 block text-lg text-gold">
              {ganhador.palpite}
            </strong>
          </div>
          <div className="surface-soft rounded-xl p-3">
            <p className="text-xs text-muted">Aposta</p>
            <strong className="mt-1 block text-sm text-white">
              R$ {ganhador.aposta.toLocaleString("pt-BR")}
            </strong>
          </div>
        </div>

        <div className="rounded-xl border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.08)] p-3 text-center">
          <p className="text-xs text-green-400 font-medium uppercase tracking-wide">Prêmio recebido</p>
          <strong className="mt-1 block text-2xl font-bold text-green-400">
            R$ {ganhador.premio.toLocaleString("pt-BR")}
          </strong>
        </div>
      </div>
    </div>
  );
}

// ========================
// COMPONENTES AUXILIARES
// ========================
const atalhos = [
  { titulo: "Bancas", descricao: "Consulte Bahia, Nacional, Look, Rio de Janeiro, Lotep, Lotece, São Paulo, Goiás e Minas Gerais.", href: "/bancas", tag: "Resultados por banca" },
  { titulo: "Mega-Sena", descricao: "Veja concursos recentes e acompanhe resultados rapidamente.", href: "/resultado-mega-sena", tag: "Loterias" },
  { titulo: "Lotofácil", descricao: "Consulte dezenas sorteadas e histórico recente.", href: "/resultado-lotofacil", tag: "Loterias" },
  { titulo: "Análise & Tendências", descricao: "Acompanhe frequência, atraso e tendências do momento.", href: "/estatisticas", tag: "Análises" },
  { titulo: "Grupos e Dezenas", descricao: "Veja grupos do bicho, dezenas, dicas do dia e gerador.", href: "/grupos-e-dezenas", tag: "Consulta rápida" },
];

const bancasDestaque = [
  { nome: "Bahia", descricao: "Resultados por horário, normal e maluca.", href: "/bancas/bahia" },
  { nome: "Nacional", descricao: "Resultados completos e histórico recente.", href: "/bancas/nacional" },
  { nome: "São Paulo", descricao: "Resultados atualizados por horário.", href: "/bancas/sao-paulo" },
];

function AdBlock() {
  return (
    <a href={`https://wa.me/${WHATSAPP}?text=Quero%20anunciar%20no%20SorteLab`} target="_blank" rel="noopener noreferrer" className="block w-full">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-[rgba(245,196,81,0.25)] bg-[rgba(245,196,81,0.04)] px-6 py-5 transition hover:border-[rgba(245,196,81,0.45)] hover:bg-[rgba(245,196,81,0.07)]">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(245,196,81,0.3)] bg-[rgba(245,196,81,0.1)]">
            <span className="text-base text-[#f5c451]">★</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f5c451]">Anuncie aqui</p>
            <p className="text-xs text-slate-400">Alcance milhares de jogadores diariamente</p>
          </div>
        </div>
        <div className="hidden rounded-xl border border-[rgba(245,196,81,0.2)] bg-[rgba(245,196,81,0.08)] px-4 py-2 sm:block">
          <p className="text-xs font-semibold text-[#f5c451]">Fale conosco</p>
        </div>
      </div>
    </a>
  );
}

function SectionHeader({ title, description, href, cta }: { title: string; description: string; href?: string; cta?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 className="title-premium text-2xl font-semibold md:text-3xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted md:text-base">{description}</p>
      </div>
      {href && cta ? <Link href={href} className="btn-secondary">{cta}</Link> : null}
    </div>
  );
}

// ========================
// PÁGINA PRINCIPAL
// ========================
export default function Home() {
  return (
    <>
      <Header />

      <main className="py-16">
        {/* HERO */}
        <section className="border-b border-white/10">
          <div className="container py-10 md:py-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
              <div className="max-w-2xl flex flex-col justify-center">
                <span className="badge-primary">Plataforma inteligente de resultados e tendências</span>
                <h1 className="title-premium mt-4 text-3xl font-semibold leading-tight md:text-4xl">
                  Resultados, estatísticas e palpites em um só lugar
                </h1>
                <p className="mt-3 text-sm text-muted md:text-base">
                  Consulte bancas, acompanhe loterias e visualize tendências de forma rápida e direta.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/bancas" className="btn-primary px-5 py-2.5 text-sm">Ver bancas</Link>
                  <Link href="/resultado-mega-sena" className="btn-secondary px-5 py-2.5 text-sm">Mega-Sena</Link>
                  <Link href="/resultado-lotofacil" className="btn-secondary px-5 py-2.5 text-sm">Lotofácil</Link>
                </div>
              </div>

              <UltimoGanhador />
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="container"><AdBlock /></div>
        </section>

        <section className="py-14">
          <div className="container">
            <SectionHeader title="Acesso rápido" description="As principais áreas da plataforma organizadas para uma navegação mais simples e objetiva." />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {atalhos.map((item) => (
                <Link key={item.href} href={item.href} className="surface-card group rounded-2xl p-6 transition duration-200 hover:-translate-y-1">
                  <span className="badge-primary text-xs">{item.tag}</span>
                  <h3 className="mt-4 text-lg font-semibold text-white transition group-hover:text-gold">{item.titulo}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.descricao}</p>
                  <span className="mt-6 inline-flex items-center text-sm font-medium text-slate-300 transition group-hover:text-white">
                    Acessar <span className="ml-2 transition group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-4">
          <div className="container"><AdBlock /></div>
        </section>

        <section className="py-14">
          <div className="container">
            <SectionHeader title="Resultados por bancas" description="Consulte resultados completos do jogo do bicho por banca, com horários atualizados, histórico recente e navegação direta." href="/bancas" cta="Ver todas as bancas" />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {bancasDestaque.map((banca) => (
                <Link key={banca.href} href={banca.href} className="surface-card group rounded-2xl p-6 transition duration-200 hover:-translate-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-white">{banca.nome}</h3>
                    <span className="text-sm text-slate-500 transition group-hover:text-[#f5c451]">→</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{banca.descricao}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="container"><AdBlock /></div>
        </section>

        <section className="py-14">
          <div className="container">
            <SectionHeader title="Últimos resultados da Mega-Sena" description="Consulte os concursos mais recentes com dezenas organizadas para leitura rápida e visual mais limpo." href="/resultado-mega-sena" cta="Ver Mega-Sena completa" />
            <p className="text-sm text-muted">Acesse a página completa para ver os resultados mais recentes.</p>
          </div>
        </section>

        <section className="py-14">
          <div className="container">
            <SectionHeader title="Últimos resultados da Lotofácil" description="Visualize os concursos recentes da Lotofácil com dezenas organizadas de forma simples e objetiva." href="/resultado-lotofacil" cta="Ver Lotofácil completa" />
            <p className="text-sm text-muted">Acesse a página completa para ver os resultados mais recentes.</p>
          </div>
        </section>

        <section className="py-6">
          <div className="container"><AdBlock /></div>
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
                    Resultados, bancas, loterias, estatísticas e tendências em uma estrutura mais organizada, com visual mais profissional e preparada para crescer.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 md:justify-end">
                  <Link href="/bancas" className="btn-primary">Explorar bancas</Link>
                  <Link href="/estatisticas" className="btn-secondary">Ver estatísticas</Link>
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
