import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ResultCard } from "@/components/ResultCard";
import { resultadosBichoHoje } from "@/data/bicho";

export default function ResultadoBichoHojePage() {
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

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {resultadosBichoHoje.map((item) => (
              <ResultCard
                key={item.horario}
                horario={item.horario}
                grupo={item.grupo}
                bicho={item.bicho}
                milhar={item.milhar}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}