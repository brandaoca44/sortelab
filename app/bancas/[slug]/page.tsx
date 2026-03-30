import Link from "next/link";
import { kv } from "@vercel/kv";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultadoCompletoTabela } from "@/components/ResultadoCompletoTabela";
import { bancas } from "@/data/bancas";
import type { ResultadoModalidade } from "@/data/resultados-completos/types";

function getUltimasDatasBrasil(quantidade: number): string[] {
  const datas: string[] = [];
  // Usa fuso de Brasília (UTC-3) para calcular a data correta
  const agora = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );
  for (let i = 0; i < quantidade; i++) {
    const d = new Date(agora);
    d.setDate(agora.getDate() - i);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    datas.push(`${ano}-${mes}-${dia}`);
  }
  return datas;
}

function formatarDataLabel(data: string, index: number) {
  if (index === 0) return "Hoje";
  const [ano, mes, dia] = data.split("-").map(Number);
  const date = new Date(ano, mes - 1, dia);
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return `${dias[date.getDay()]} ${String(dia).padStart(2, "0")}`;
}

function formatarDataCompleta(data: string) {
  const [ano, mes, dia] = data.split("-").map(Number);
  return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}`;
}

function formatarHorario(horario: string) {
  return horario.replace(":00", "h");
}

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ data?: string; horario?: string }>;
};

export default async function BancaPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { data, horario } = await searchParams;

  const bancaInfo = bancas.find((item) => item.slug === slug);

  if (!bancaInfo) {
    return <div className="p-10 text-white">Banca não encontrada</div>;
  }

  const datasDisponiveis = getUltimasDatasBrasil(7);
  const dataAtual = data && datasDisponiveis.includes(data) ? data : datasDisponiveis[0];
  const horariosDisponiveis = bancaInfo.horarios;
  const horarioAtual = horario && horariosDisponiveis.includes(horario) ? horario : horariosDisponiveis[0];

  const chave = `bicho:${slug}:${dataAtual}:${horarioAtual}`;
  const resultado = await kv.get<ResultadoModalidade>(chave);

  return (
    <>
      <Header />

      <main className="py-14">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">
              Resultado — {bancaInfo.nome}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Consulte os resultados completos do 1º ao 10º prêmio por data e
              horário, separados entre normal e maluca.
            </p>
          </div>

          <section className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Datas recentes
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {datasDisponiveis.map((item, index) => {
                const ativo = item === dataAtual;
                return (
                  <Link
                    key={item}
                    href={`/bancas/${slug}?data=${encodeURIComponent(item)}`}
                    className={`min-w-[90px] rounded-xl border px-4 py-3 text-center text-sm font-medium transition ${
                      ativo
                        ? "border-green-500 bg-green-500 text-slate-950"
                        : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <div className="text-xs uppercase opacity-70">
                      {index === 0 ? "Atual" : "Anterior"}
                    </div>
                    <div className="text-base font-bold">
                      {formatarDataLabel(item, index)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Horários disponíveis
            </p>
            <div className="flex flex-wrap gap-3">
              {horariosDisponiveis.map((item) => {
                const ativo = item === horarioAtual;
                return (
                  <Link
                    key={item}
                    href={`/bancas/${slug}?data=${encodeURIComponent(dataAtual)}&horario=${encodeURIComponent(item)}`}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      ativo
                        ? "bg-green-500 text-slate-950"
                        : "border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              Resultado{" "}
              {dataAtual === datasDisponiveis[0]
                ? "de hoje"
                : `de ${formatarDataCompleta(dataAtual)}`}{" "}
              às {formatarHorario(horarioAtual)}
            </h2>
            <p className="mt-2 text-slate-400">
              Visualização completa do 1º ao 10º prêmio para as modalidades
              normal e maluca.
            </p>
          </section>

          {resultado ? (
            <div className="grid gap-6 md:grid-cols-2">
              <ResultadoCompletoTabela
                titulo="Resultado Normal"
                dados={resultado.normal}
              />
              <ResultadoCompletoTabela
                titulo="Resultado Maluca"
                dados={resultado.maluca}
              />
            </div>
          ) : (
            <div className="surface-card rounded-2xl p-10 text-center text-muted">
              Resultado ainda não disponível para este horário.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
