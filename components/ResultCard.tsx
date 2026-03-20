type ResultCardProps = {
  horario: string;
  grupo: string;
  bicho: string;
  milhar: string;
};

export function ResultCard({
  horario,
  grupo,
  bicho,
  milhar,
}: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-slate-400">Horário</span>
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
          {horario}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-white">{bicho}</h3>

      <div className="mt-4 space-y-2 text-slate-300">
        <p>
          <strong>Grupo:</strong> {grupo}
        </p>
        <p>
          <strong>Milhar:</strong> {milhar}
        </p>
      </div>
    </div>
  );
}