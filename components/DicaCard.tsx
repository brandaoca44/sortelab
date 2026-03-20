type DicaCardProps = {
  titulo: string;
  descricao: string;
};

export function DicaCard({ titulo, descricao }: DicaCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-bold text-white">{titulo}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{descricao}</p>
    </div>
  );
}