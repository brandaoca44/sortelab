"use client";

import { useEffect, useState } from "react";

type LotteryGeneratorCardProps = {
  titulo: string;
  descricao: string;
  quantidade: number;
  maxNumero: number;
};

function gerarNumeros(quantidade: number, maxNumero: number) {
  const numeros = new Set<number>();

  while (numeros.size < quantidade) {
    numeros.add(Math.floor(Math.random() * maxNumero) + 1);
  }

  return Array.from(numeros)
    .sort((a, b) => a - b)
    .map((n) => n.toString().padStart(2, "0"));
}

export function LotteryGeneratorCard({
  titulo,
  descricao,
  quantidade,
  maxNumero,
}: LotteryGeneratorCardProps) {
  const [numeros, setNumeros] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    setNumeros(gerarNumeros(quantidade, maxNumero));
  }, [quantidade, maxNumero]);

  useEffect(() => {
    if (!mensagem) return;

    const timer = setTimeout(() => setMensagem(""), 2200);
    return () => clearTimeout(timer);
  }, [mensagem]);

  function gerarNovoJogo() {
    setNumeros(gerarNumeros(quantidade, maxNumero));
  }

  async function compartilhar() {
    const texto = `🎯 ${titulo}

Números: ${numeros.join(" - ")}

Gerado no SorteLab`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: titulo,
          text: texto,
        });
        return;
      }

      await navigator.clipboard.writeText(texto);
      setMensagem("Jogo copiado.");
    } catch {
      setMensagem("Não foi possível compartilhar agora.");
    }
  }

  return (
    <section className="surface-card-strong rounded-3xl p-6 md:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="badge-primary">Gerador automático</span>

          <h2 className="title-premium mt-4 text-2xl font-semibold">
            {titulo}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted md:text-base">
            {descricao}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={gerarNovoJogo} className="btn-primary">
            Gerar números
          </button>

          <button type="button" onClick={compartilhar} className="btn-secondary">
            Compartilhar
          </button>
        </div>
      </div>

      {mensagem ? (
        <div className="mt-4 rounded-xl border border-[rgba(245,196,81,0.2)] bg-[rgba(245,196,81,0.08)] px-4 py-3 text-sm text-[#f5c451]">
          {mensagem}
        </div>
      ) : null}

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="flex flex-wrap justify-center gap-3">
          {numeros.map((numero) => (
            <span
              key={numero}
              className="number-ball flex h-12 w-12 items-center justify-center text-sm font-semibold"
            >
              {numero}
            </span>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-muted-2">
          Números gerados aleatoriamente • Boa sorte 🍀
        </p>
      </div>
    </section>
  );
}