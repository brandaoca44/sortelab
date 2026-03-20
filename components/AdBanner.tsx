export function AdBanner({ position }: { position: "left" | "right" }) {
  return (
    <aside
      className={`fixed top-28 z-10 hidden 2xl:flex ${
        position === "left" ? "left-4" : "right-4"
      }`}
      aria-label={`Anúncio lateral ${position === "left" ? "esquerdo" : "direito"}`}
    >
      <div className="flex h-[600px] w-[120px] items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-500">
        Anúncio
      </div>
    </aside>
  );
}