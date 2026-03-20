import Image from "next/image";

type GrupoCardProps = {
  grupo: string;
  nome: string;
  dezenas: string[];
  imagem: string;
};

export function GrupoCard({
  grupo,
  nome,
  dezenas,
  imagem,
}: GrupoCardProps) {
  return (
    <article className="surface-card group rounded-2xl p-4 transition duration-200 hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
          <Image
            src={imagem}
            alt={nome}
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
        </div>

        <div className="min-w-0">
          <p className="text-base font-semibold text-white">{nome}</p>
          <span className="text-sm text-muted">Grupo {grupo}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {dezenas.map((dezena) => (
          <span
            key={dezena}
            className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-slate-300 transition group-hover:border-[rgba(245,196,81,0.22)] group-hover:text-gold"
          >
            {dezena}
          </span>
        ))}
      </div>
    </article>
  );
}