type PartnerBetCardProps = {
  titulo?: string;
  descricao?: string;
  ctaLabel?: string;
  href: string;
};

export function PartnerBetCard({
  titulo = "Aposte online",
  descricao = "Faça seu jogo com segurança em nossa plataforma parceira.",
  ctaLabel = "Apostar agora",
  href,
}: PartnerBetCardProps) {
  return (
    <aside className="space-y-4">
      <div className="surface-card-strong rounded-3xl p-5">
        <span className="badge-primary">Parceiro recomendado</span>

        <h3 className="title-premium mt-4 text-xl font-semibold">
          {titulo}
        </h3>

        <p className="mt-3 text-sm leading-6 text-muted">
          {descricao}
        </p>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-5 w-full"
        >
          {ctaLabel}
        </a>

        <div className="mt-5 rounded-2xl border border-[rgba(245,196,81,0.16)] bg-[rgba(245,196,81,0.06)] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gold">
            Vantagem
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Acesse rapidamente a plataforma parceira para montar seu jogo com
            mais praticidade.
          </p>
        </div>
      </div>

      <div className="surface-card rounded-2xl p-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Publicidade
        </p>

        <p className="mt-2 text-sm text-muted">
          Espaço reservado para anúncio ou parceiro extra.
        </p>
      </div>
    </aside>
  );
}