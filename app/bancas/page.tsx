import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BancaCard } from "@/components/BancaCard";
import { bancas } from "@/data/bancas";

export default function BancasPage() {
  return (
    <>
      <Header />

      <main className="py-14">
        <div className="container">
          <section>
            <span className="badge-primary">Bancas</span>

            <h1 className="title-premium mt-6 text-4xl font-semibold md:text-5xl">
              Bancas do jogo do bicho
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              Consulte resultados, horários e modalidades das principais bancas
              do jogo do bicho em um só lugar.
            </p>
          </section>

          <section className="mt-10">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {bancas.map((banca) => (
                <BancaCard
                  key={banca.slug}
                  nome={banca.nome}
                  slug={banca.slug}
                  descricao={banca.descricao}
                  horarios={banca.horarios}
                  modalidades={banca.modalidades}
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