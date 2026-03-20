"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { grupos } from "@/data/grupos";
import { InstagramIcon } from "@/components/icons/SocialIcons";

type BichoPalpite = {
  id: string;
  grupo: string;
  nome: string;
  imagem: string;
  dezena: string;
  centena: string;
  milhar: string;
};

const STORAGE_KEY = "sortelab_bicho";

function gerarPalpite(): BichoPalpite {
  const grupo = grupos[Math.floor(Math.random() * grupos.length)];
  const dezena =
    grupo.dezenas[Math.floor(Math.random() * grupo.dezenas.length)];

  const prefixo = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");

  const milhar = `${prefixo}${dezena}`;
  const centena = milhar.slice(-3);

  return {
    id: Date.now().toString(),
    grupo: grupo.grupo,
    nome: grupo.nome,
    imagem: grupo.imagem,
    dezena,
    centena,
    milhar,
  };
}

export function BichoGeneratorCard() {
  const [palpite, setPalpite] = useState<BichoPalpite | null>(null);
  const [historico, setHistorico] = useState<BichoPalpite[]>([]);

  useEffect(() => {
    setPalpite(gerarPalpite());

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHistorico(JSON.parse(saved));
  }, []);

  function gerarNovo() {
    setPalpite(gerarPalpite());
  }

  function salvar() {
    if (!palpite) return;

    const novo = [palpite, ...historico].slice(0, 5);
    setHistorico(novo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
  }

  const texto = useMemo(() => {
    if (!palpite) return "";
    return `Palpite SorteLab

Milhar: ${palpite.milhar}
Centena: ${palpite.centena}
Dezena: ${palpite.dezena}
Grupo: ${palpite.grupo} - ${palpite.nome}`;
  }, [palpite]);

  function copiar() {
    navigator.clipboard.writeText(texto);
  }

  function abrirInstagram() {
    window.open("https://instagram.com/sorte_lab", "_blank");
  }

  if (!palpite) return null;

  return (
    <section className="card-premium rounded-3xl p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="badge-primary">Gerador automático</span>

          <h2 className="title-premium mt-3 text-2xl font-semibold">
            Palpite do jogo do bicho
          </h2>

          <p className="subtitle-soft mt-1 text-sm">
            Gere combinações alinhadas automaticamente.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={gerarNovo} className="btn-primary">
            Gerar
          </button>

          <button onClick={copiar} className="btn-secondary">
            Copiar
          </button>

          <button onClick={salvar} className="btn-secondary">
            Salvar
          </button>
        </div>
      </div>

      {/* NÚMEROS */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-soft rounded-2xl p-4">
          <p className="text-xs text-muted">Milhar</p>
          <strong className="mt-2 block text-3xl text-gold">
            {palpite.milhar}
          </strong>
        </div>

        <div className="card-soft rounded-2xl p-4">
          <p className="text-xs text-muted">Centena</p>
          <strong className="mt-2 block text-xl text-white">
            {palpite.centena}
          </strong>
        </div>

        <div className="card-soft rounded-2xl p-4">
          <p className="text-xs text-muted">Dezena</p>
          <strong className="mt-2 block text-xl text-white">
            {palpite.dezena}
          </strong>
        </div>

        <div className="card-soft rounded-2xl p-4">
          <p className="text-xs text-muted">Grupo</p>
          <strong className="mt-2 block text-xl text-white">
            {palpite.grupo}
          </strong>
        </div>
      </div>

      {/* ANIMAL (AGORA MAIS COMPACTO) */}
      <div className="card-soft mt-5 flex items-center gap-3 rounded-xl p-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/30">
          <Image
            src={palpite.imagem}
            alt={palpite.nome}
            width={40}
            height={40}
          />
        </div>

        <div className="flex-1">
          <strong className="text-sm text-white">{palpite.nome}</strong>
          <p className="text-xs text-muted">
            Grupo {palpite.grupo} • Dezena {palpite.dezena}
          </p>
        </div>

        {/* CTA PEQUENO */}
        <button
          onClick={abrirInstagram}
          className="flex items-center gap-1 rounded-lg border border-[rgba(245,196,81,0.25)] bg-[rgba(245,196,81,0.08)] px-3 py-1.5 text-xs font-medium text-gold transition hover:bg-[rgba(245,196,81,0.15)]"
        >
          <InstagramIcon className="h-3 w-3" />
          Instagram
        </button>
      </div>

      {/* HISTÓRICO */}
      {historico.length > 0 && (
        <div className="mt-5">
          <p className="text-xs text-muted">Últimos palpites</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {historico.map((h) => (
              <button
                key={h.id}
                onClick={() => setPalpite(h)}
                className="rounded-lg border border-white/10 px-2 py-1 text-xs text-white hover:border-[rgba(245,196,81,0.3)]"
              >
                {h.milhar}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}