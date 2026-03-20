type Item = {
  premio: number;
  grupo: string;
  bicho: string;
  milhar: string;
};

export function ResultadoCompletoTabela({
  titulo,
  dados,
}: {
  titulo: string;
  dados: Item[];
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="mb-4 text-xl font-bold text-white">{titulo}</h3>

      {dados.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
          Resultado ainda não disponível
        </div>
      ) : (
        <div className="space-y-2">
          {dados.map((item) => (
            <div
              key={item.premio}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2 text-sm"
            >
              <span className="font-semibold text-green-400">
                {item.premio}º
              </span>

              <span className="text-slate-300">{item.bicho}</span>

              <span className="text-slate-400">G{item.grupo}</span>

              <span className="font-bold text-white">{item.milhar}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}