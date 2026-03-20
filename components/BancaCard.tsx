import Link from "next/link";

type BancaCardProps = {
  nome: string;
  slug: string;
  descricao: string;
  horarios: string[];
  modalidades: string[];
};

export function BancaCard({
  nome,
  slug,
  descricao,
  horarios,
  modalidades,
}: BancaCardProps) {
  return (
    <div className="group flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700 hover:bg-slate-800/80">
      
      {/* topo */}
      <div>
        <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition">
          {nome}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {descricao}
        </p>

        {/* horários */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Horários
          </p>

          <div className="flex flex-wrap gap-2">
            {horarios.map((horario) => (
              <span
                key={horario}
                className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400"
              >
                {horario}
              </span>
            ))}
          </div>
        </div>

        {/* modalidades */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Modalidades
          </p>

          <div className="flex flex-wrap gap-2">
            {modalidades.map((modalidade) => (
              <span
                key={modalidade}
                className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400"
              >
                {modalidade === "maluca" ? "Maluca" : "Normal"}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* botão */}
      <div className="mt-6">
        <Link
          href={`/bancas/${slug}`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-green-500 hover:text-slate-950"
        >
          Ver resultados
        </Link>
      </div>
    </div>
  );
}