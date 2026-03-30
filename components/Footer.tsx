export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#0c1425]">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(245,196,81,0.18)] bg-[rgba(245,196,81,0.08)] shadow-[0_0_20px_rgba(245,196,81,0.08)]">
                <span className="text-sm font-bold text-[#f5c451]">SL</span>
              </div>
              <div>
                <strong className="block text-lg text-white">SorteLab</strong>
                <span className="text-sm text-slate-400">Plataforma de resultados e palpites</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Acompanhe resultados das principais bancas, gere palpites e
              encontre tendências para seus jogos com mais praticidade.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Navegação</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><a href="/" className="transition hover:text-white">Início</a></li>
              <li><a href="/bancas" className="transition hover:text-white">Bancas</a></li>
              <li><a href="/grupos-e-dezenas" className="transition hover:text-white">Grupos & Dezenas</a></li>
              <li><a href="/estatisticas" className="transition hover:text-white">Análise & Tendências</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Siga agora</h3>
            <p className="mt-3 text-sm text-slate-400">
              Receba palpites diários direto no Instagram do SorteLab.
            </p>
            <a
              href="https://instagram.com/sorte_lab"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-casino mt-5 w-full"
            >
              Seguir no Instagram
            </a>
            <div className="mt-5 flex gap-3">
              <a
                href="https://instagram.com/sorte_lab"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(245,196,81,0.24)] bg-[rgba(245,196,81,0.08)] text-[#f5c451] transition hover:bg-[rgba(245,196,81,0.15)]"
              >
                IG
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SorteLab. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
