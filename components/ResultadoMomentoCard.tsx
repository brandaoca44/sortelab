import Link from "next/link";

type PremioProps = {
  grupo: string;
  bicho: string;
  milhar: string;
};

type ResultadoMomentoCardProps = {
  banca: string;
  slug: string;
  horario: string;
  novo?: boolean;
  primeiroPremio: {
    normal: PremioProps;
    maluca: PremioProps;
  };
};

export function ResultadoMomentoCard({
  banca,
  slug,
  horario,
  novo = false,
  primeiroPremio,
}: ResultadoMomentoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:bg-slate-800/80">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Banca
          </p>
          <h3 className="mt-1 text-xl font-bold text-white">{banca}</h3>
        </div>

        <div className="flex flex-col items-end gap-2">
          {novo && (
            <span className="rounded-full bg-green-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-950">
              Novo
            </span>
          )}

          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
            {horario}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              1º prêmio
            </p>
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
              Normal
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <span className="font-semibold text-slate-200">Bicho:</span>{" "}
              {primeiroPremio.normal.bicho}
            </p>
            <p>
              <span className="font-semibold text-slate-200">Grupo:</span>{" "}
              {primeiroPremio.normal.grupo}
            </p>
            <p>
              <span className="font-semibold text-slate-200">Milhar:</span>{" "}
              {primeiroPremio.normal.milhar}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              1º prêmio
            </p>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
              Maluca
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <span className="font-semibold text-slate-200">Bicho:</span>{" "}
              {primeiroPremio.maluca.bicho}
            </p>
            <p>
              <span className="font-semibold text-slate-200">Grupo:</span>{" "}
              {primeiroPremio.maluca.grupo}
            </p>
            <p>
              <span className="font-semibold text-slate-200">Milhar:</span>{" "}
              {primeiroPremio.maluca.milhar}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Link
          href={`/bancas/${slug}`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-green-500 hover:text-slate-950"
        >
          Ver resultado completo
        </Link>
      </div>
    </div>
  );
}