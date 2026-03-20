"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const jogoDoDia = {
  milhar: "2244",
  grupo: "Cavalo",
  horarios: ["14h", "18h"],
  mensagem:
    "Bom momento para seguir uma sugestão mais direta, com foco em jogo rápido e objetivo.",
};

const signos = {
  Áries: { milhar: "3187", grupo: "Águia", mensagem: "Dia de movimento e iniciativa." },
  Touro: { milhar: "4492", grupo: "Cavalo", mensagem: "Estabilidade favorece escolhas seguras." },
  Gêmeos: { milhar: "2716", grupo: "Borboleta", mensagem: "Intuição em alta hoje." },
  Câncer: { milhar: "5834", grupo: "Veado", mensagem: "Confie mais na percepção." },
  Leão: { milhar: "7711", grupo: "Leão", mensagem: "Dia de destaque e força." },
  Virgem: { milhar: "6248", grupo: "Cabra", mensagem: "Atenção aos detalhes." },
  Libra: { milhar: "9056", grupo: "Pavão", mensagem: "Equilíbrio traz boas chances." },
  Escorpião: { milhar: "1439", grupo: "Tigre", mensagem: "Energia intensa favorece risco." },
  Sagitário: { milhar: "8624", grupo: "Galo", mensagem: "Confiança é chave hoje." },
  Capricórnio: { milhar: "4908", grupo: "Elefante", mensagem: "Disciplina traz resultado." },
  Aquário: { milhar: "7352", grupo: "Macaco", mensagem: "Criatividade favorece." },
  Peixes: { milhar: "2845", grupo: "Coelho", mensagem: "Intuição guia bem." },
} as const;

type Signo = keyof typeof signos;

function getCentena(milhar: string) {
  return milhar.slice(-3);
}

function getDezena(milhar: string) {
  return milhar.slice(-2);
}

function JogoInfoCard({ milhar, grupo, mensagem }: any) {
  return (
    <div className="surface-card rounded-2xl p-5">
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Milhar", value: milhar, highlight: true },
            { label: "Centena", value: getCentena(milhar) },
            { label: "Dezena", value: getDezena(milhar) },
            { label: "Grupo", value: grupo },
          ].map((item) => (
            <div key={item.label} className="surface-soft rounded-xl p-4">
              <p className="text-xs text-muted">{item.label}</p>
              <strong
                className={`mt-2 block text-xl font-semibold ${
                  item.highlight ? "text-gold" : "text-white"
                }`}
              >
                {item.value}
              </strong>
            </div>
          ))}
        </div>

        <div className="surface-soft rounded-xl p-4">
          <p className="text-xs text-muted">Mensagem</p>
          <p className="mt-2 text-sm text-muted">{mensagem}</p>
        </div>
      </div>
    </div>
  );
}

export default function PalpitesPage() {
  const [signo, setSigno] = useState<Signo>("Gêmeos");
  const atual = signos[signo];

  return (
    <>
      <Header />

      <main className="py-12">
        <div className="container grid gap-8 lg:grid-cols-[1fr_280px]">

          {/* ESQUERDA */}
          <div>
            <span className="badge-primary">Tendências</span>

            <h1 className="title-premium mt-4 text-3xl font-semibold">
              Tendências do dia
            </h1>

            <p className="mt-2 text-muted">
              Sugestões rápidas para hoje.
            </p>

            <section className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Jogo do dia
                </h2>

                <span className="badge-primary">Destaque</span>
              </div>

              <JogoInfoCard {...jogoDoDia} />

              <p className="mt-3 text-sm text-muted">
                Melhor horário: {jogoDoDia.horarios.join(" e ")}
              </p>
            </section>

            <section className="mt-10">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Palpite por signo
                  </h2>
                  <p className="text-sm text-muted">
                    Escolha seu signo.
                  </p>
                </div>

                <select
                  value={signo}
                  onChange={(e) => setSigno(e.target.value as Signo)}
                  className="select-base"
                >
                  {Object.keys(signos).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <JogoInfoCard {...atual} />
            </section>
          </div>

          {/* DIREITA */}
          <aside className="space-y-4">
            <div className="surface-card-strong rounded-2xl p-5">
              <span className="badge-primary">Parceiro</span>

              <h3 className="mt-3 text-lg font-semibold text-white">
                Faça seu jogo
              </h3>

              <p className="mt-2 text-sm text-muted">
                Aposte com segurança em nossa plataforma recomendada.
              </p>

              <a
                href="#"
                target="_blank"
                className="btn-primary mt-4 w-full"
              >
                Apostar agora
              </a>

              <div className="mt-4 surface-soft rounded-xl p-4 text-center">
                <span className="text-xs text-muted">Publicidade</span>

                <p className="mt-2 text-sm text-muted">
                  Plataforma parceira oficial
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}