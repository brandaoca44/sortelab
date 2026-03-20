type StatsCardProps = {
  titulo: string;
  valor: string;
  detalhe: string;
};

export function StatsCard({ titulo, valor, detalhe }: StatsCardProps) {
  return (
    <article className="surface-card rounded-2xl p-5 transition duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-muted">{titulo}</p>

        <span className="badge-primary text-[11px] uppercase tracking-wide">
          resumo
        </span>
      </div>

      <h3 className="mt-4 text-3xl font-semibold tracking-tight text-gold">
        {valor}
      </h3>

      <p className="mt-3 text-sm leading-6 text-muted">{detalhe}</p>
    </article>
  );
}