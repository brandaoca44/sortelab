type Props = {
  banca: string;
  horario: string;
  dias?: number;
};

function gerarMockPorHorario(banca: string, horario: string) {
  const base = `${banca}-${horario}`.length;

  const grupos = [
    "01 - Avestruz",
    "03 - Burro",
    "07 - Carneiro",
    "11 - Cavalo",
    "14 - Gato",
    "18 - Porco",
    "22 - Tigre",
    "24 - Veado",
  ];

  const dezenas = ["01", "07", "11", "18", "25", "33", "44", "56", "72", "89"];

  return {
    grupoFrequente: grupos[base % grupos.length],
    grupoAtrasado: grupos[(base + 3) % grupos.length],
    dezenaFrequente: dezenas[base % dezenas.length],
    dezenaAtrasada: dezenas[(base + 4) % dezenas.length],
  };
}

export function StatsGrid({ banca, horario, dias = 7 }: Props) {
  const dados = gerarMockPorHorario(banca, horario);

  return (
    <article className="surface-card rounded-2xl p-5 transition duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-2">
            {banca}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">{horario}</h3>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted">
          {dias} dias
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="surface-soft rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-muted-2">
            Grupo que mais saiu
          </p>
          <strong className="mt-2 block text-base font-semibold text-gold">
            {dados.grupoFrequente}
          </strong>
        </div>

        <div className="surface-soft rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-muted-2">
            Grupo atrasado
          </p>
          <strong className="mt-2 block text-base font-semibold text-white">
            {dados.grupoAtrasado}
          </strong>
        </div>

        <div className="surface-soft rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-muted-2">
            Dezena que mais saiu
          </p>
          <strong className="mt-2 block text-base font-semibold text-gold">
            {dados.dezenaFrequente}
          </strong>
        </div>

        <div className="surface-soft rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-muted-2">
            Dezena atrasada
          </p>
          <strong className="mt-2 block text-base font-semibold text-white">
            {dados.dezenaAtrasada}
          </strong>
        </div>
      </div>
    </article>
  );
}