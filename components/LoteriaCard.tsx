type LoteriaCardProps = {
  concurso: string;
  data: string;
  dezenas: string[];
};

export function LoteriaCard({
  concurso,
  data,
  dezenas,
}: LoteriaCardProps) {
  return (
    <article className="surface-card rounded-2xl p-6 transition duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-muted-2">Concurso</span>
          <h3 className="mt-1 text-xl font-semibold text-white">
            {concurso}
          </h3>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted">
          {data}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {dezenas.map((dezena) => (
          <span
            key={dezena}
            className="number-ball flex h-11 w-11 items-center justify-center text-sm font-semibold"
          >
            {dezena}
          </span>
        ))}
      </div>
    </article>
  );
}