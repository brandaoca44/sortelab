"use client";

import { useMemo, useState } from "react";

const megaBase = Array.from({ length: 60 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const lotofacilBase = Array.from({ length: 25 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const gruposBase = Array.from({ length: 25 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

function gerarNumero(tamanho: number) {
  return Math.floor(Math.random() * 10 ** tamanho)
    .toString()
    .padStart(tamanho, "0");
}

function gerarSemRepetir(base: string[], quantidade: number) {
  const copia = [...base].sort(() => Math.random() - 0.5);
  return copia.slice(0, quantidade).sort((a, b) => Number(a) - Number(b));
}

export function GeradorPalpites() {
  const [modalidade, setModalidade] = useState("milhar");
  const [resultado, setResultado] = useState<string[]>([]);

  const titulo = useMemo(() => {
    const titulos: Record<string, string> = {
      milhar: "Gerador de Milhar",
      centena: "Gerador de Centena",
      dezena: "Gerador de Dezena",
      grupo: "Gerador de Grupo",
      lotofacil: "Gerador da Lotofácil",
      megasena: "Gerador da Mega-Sena",
    };

    return titulos[modalidade];
  }, [modalidade]);

  function gerar() {
    switch (modalidade) {
      case "milhar":
        setResultado([gerarNumero(4)]);
        break;
      case "centena":
        setResultado([gerarNumero(3)]);
        break;
      case "dezena":
        setResultado([gerarNumero(2)]);
        break;
      case "grupo":
        setResultado([gruposBase[Math.floor(Math.random() * gruposBase.length)]]);
        break;
      case "lotofacil":
        setResultado(gerarSemRepetir(lotofacilBase, 15));
        break;
      case "megasena":
        setResultado(gerarSemRepetir(megaBase, 6));
        break;
      default:
        setResultado([]);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ferramenta
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">{titulo}</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Gere combinações automáticas para consulta e entretenimento, sem
            qualquer garantia de resultado.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:min-w-[280px]">
          <select
            value={modalidade}
            onChange={(e) => setModalidade(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none"
          >
            <option value="milhar">Milhar</option>
            <option value="centena">Centena</option>
            <option value="dezena">Dezena</option>
            <option value="grupo">Grupo</option>
            <option value="lotofacil">Lotofácil</option>
            <option value="megasena">Mega-Sena</option>
          </select>

          <button
            onClick={gerar}
            className="rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-green-400"
          >
            Gerar combinação
          </button>
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Resultado gerado
        </p>

        {resultado.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {resultado.map((item) => (
              <span
                key={item}
                className="rounded-full bg-blue-500/10 px-4 py-2 text-base font-bold text-blue-400"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">
            Escolha uma modalidade e clique em gerar.
          </p>
        )}
      </div>
    </div>
  );
}