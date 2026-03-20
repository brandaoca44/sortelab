import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { GrupoCard } from "@/components/GrupoCard";
import { BichoGeneratorCard } from "@/components/BichoGeneratorCard";
import { grupos } from "@/data/grupos";

export default function GruposEDezenasPage() {
  return (
    <>
      <Header />

      <main className="py-14">
        <div className="container">
          <section>
            <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
              Consulta rápida
            </span>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Grupos e dezenas
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Consulte os grupos do jogo do bicho e gere palpites automáticos
              com milhar, centena, dezena e grupo alinhados.
            </p>
          </section>

          <section className="mt-10">
            <BichoGeneratorCard />
          </section>

          <section className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {grupos.map((item) => (
                <GrupoCard
                  key={item.grupo}
                  grupo={item.grupo}
                  nome={item.nome}
                  dezenas={item.dezenas}
                  imagem={item.imagem}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}