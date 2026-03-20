import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultadoCompletoTabela } from "@/components/ResultadoCompletoTabela";
import { resultadosCompletos } from "@/data/resultados-completos";
import { bancas } from "@/data/bancas";

function formatarDataLabel(data: string, index: number) {
  const date = new Date(data);

  if (index === 0) return "Hoje";

  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const diaSemana = dias[date.getDay()];
  const dia = date.getDate().toString().padStart(2, "0");

  return `${diaSemana} ${dia}`;
}
function formatarDataCompleta(data: string) {
  const date = new Date(data);

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function formatarHorario(horario: string) {
  return horario.replace(":00", "h");
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    data?: string;
    horario?: string;
  }>;
};

export default async function BancaPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { data, horario } = await searchParams;

  const bancaInfo = bancas.find((item) => item.slug === slug);
  const banca = resultadosCompletos[slug as keyof typeof resultadosCompletos];

  if (!bancaInfo || !banca) {
    return <div className="p-10 text-white">Banca não encontrada</div>;
  }

  const datasDisponiveis = Object.keys(banca)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 7);

  const dataAtual =
    data && datasDisponiveis.includes(data) ? data : datasDisponiveis[0];

  const resultadosDaData = banca[dataAtual];

  if (!resultadosDaData) {
    return <div className="p-10 text-white">Data não encontrada</div>;
  }

  const horariosDisponiveis = Object.keys(resultadosDaData);
  const horarioAtual =
    horario && horariosDisponiveis.includes(horario)
      ? horario
      : horariosDisponiveis[0];

  const resultado = resultadosDaData[horarioAtual];

  if (!resultado) {
    return <div className="p-10 text-white">Resultado não encontrado</div>;
  }

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
                    href={`/bancas/${slug}?data=${encodeURIComponent(
                      dataAtual
                    )}&horario=${encodeURIComponent(item)}`}
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
        </div>
      </main>

      <Footer />
    </>
  );
}