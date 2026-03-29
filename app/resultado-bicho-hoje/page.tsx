import { kv } from "@vercel/kv";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ResultCard } from "@/components/ResultCard";
import { bancas } from "@/data/bancas";
import type { ResultadoModalidade } from "@/data/resultados-completos/types";

type ResultadoBicho = {
  horario: string;
  grupo: string;
  bicho: string;
  milhar: string;
};

export default async function ResultadoBichoHojePage() {
  const hoje = new Date().toISOString().split("T")[0];

  // Banca Bahia como referência para os horários do dia
  const bancaBahia = bancas.find((b) => b.slug === "bahia");
  const horarios = bancaBahia?.horarios ?? [];

  const resultados: ResultadoBicho[] = [];

  for (const horario of horarios) {
    const chave = `bicho:bahia:${hoje}:${horario}`;
    const resultado = await kv.get<ResultadoModalidade>(chave);

    if (resultado && resultado.normal.length > 0) {
      const primeiro = resultado.normal[0];
      resultados.push({
        horario: horario.replace(":00", "h"),
        grupo: primeiro.grupo,
        bicho: primeiro.bicho,
        milhar: primeiro.milhar,
      });
    }
  }

  return (
    <>
      <Header />

      <main className="py-14">
        <div className="container">
          <h1 className="text-4xl font-bold text-white">
            Resultado do Bicho Hoje
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Consulte os resultados do dia por horário, com visualização simples
            e rápida.
          </p>

          {resultados.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {resultados.map((item) => (
                <ResultCard
                  key={item.horario}
                  horario={item.horario}
                  grupo={item.grupo}
                  bicho={item.bicho}
                  milhar={item.milhar}
                />
              ))}
            </div>
          ) : (
            <div className="surface-card mt-10 rounded-2xl p-10 text-center text-muted">
              Nenhum resultado disponível ainda para hoje.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
