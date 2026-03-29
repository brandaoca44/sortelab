export function AdBanner({ position }: { position: "left" | "right" }) {
  return (
    <aside
      className={`fixed top-28 z-10 hidden 2xl:flex ${
        position === "left" ? "left-4" : "right-4"
      }`}
      aria-label={`Anúncio lateral ${position === "left" ? "esquerdo" : "direito"}`}
    >
      <div className="flex h-[600px] w-[120px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[rgba(245,196,81,0.25)] bg-[rgba(245,196,81,0.04)] px-3 text-center transition hover:border-[rgba(245,196,81,0.45)] hover:bg-[rgba(245,196,81,0.07)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(245,196,81,0.3)] bg-[rgba(245,196,81,0.1)]">
          <span className="text-sm text-[#f5c451]">★</span>
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#f5c451]">
          Anuncie aqui
        </p>

        <p className="text-[10px] leading-4 text-slate-400">
          Alcance milhares de jogadores diariamente
        </p>

        <div className="mt-1 rounded-lg border border-[rgba(245,196,81,0.2)] bg-[rgba(245,196,81,0.08)] px-2 py-1">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-[#f5c451]">
            Fale conosco
          </p>
        </div>
      </div>
    </aside>
  );
}
