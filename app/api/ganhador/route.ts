import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { bancas } from "@/data/bancas";

type PremioItem = {
  premio: number;
  grupo: string;
  bicho: string;
  milhar: string;
};

type ResultadoModalidade = {
  normal: PremioItem[];
  maluca: PremioItem[];
};

function getHojeBrasil() {
  const agora = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

const MODALIDADES = [
  { nome: "Milhar", mult: 8000, apostas: [1, 2, 5, 10, 20, 50, 100, 200, 300] },
  { nome: "Centena", mult: 800, apostas: [1, 2, 5, 10, 20, 50, 100, 200, 300] },
  { nome: "Dezena", mult: 80, apostas: [1, 2, 5, 10, 20, 50, 100, 200, 500] },
  { nome: "Unidade", mult: 8, apostas: [5, 10, 20, 50, 100, 200, 500, 1000] },
];

const NOMES = [
  "J. Silva", "M. Santos", "A. Oliveira", "C. Souza", "R. Lima",
  "P. Costa", "L. Ferreira", "T. Alves", "D. Pereira", "F. Rodrigues",
  "K. Nascimento", "B. Carvalho", "G. Martins", "H. Araújo", "N. Gomes",
  "V. Ribeiro", "E. Mendes", "I. Barbosa", "W. Cardoso", "S. Rocha",
];

export async function GET() {
  try {
    const hoje = getHojeBrasil();
    const resultados: {
      banca: string;
      slug: string;
      horario: string;
      modalidadeLabel: string;
      palpite: string;
      grupo: string;
      bicho: string;
    }[] = [];

    for (const banca of bancas) {
      for (const horario of banca.horarios) {
        const chave = `bicho:${banca.slug}:${hoje}:${horario}`;
        const resultado = await kv.get<ResultadoModalidade>(chave);

        if (resultado) {
          // Apenas o 1º prêmio normal
          if (resultado.normal.length > 0) {
            const primeiro = resultado.normal[0];
            resultados.push({
              banca: banca.nome,
              slug: banca.slug,
              horario,
              modalidadeLabel: "Normal",
              palpite: primeiro.milhar,
              grupo: primeiro.grupo,
              bicho: primeiro.bicho,
            });
          }
          // Apenas o 1º prêmio maluca
          if (resultado.maluca.length > 0) {
            const primeiro = resultado.maluca[0];
            resultados.push({
              banca: banca.nome,
              slug: banca.slug,
              horario,
              modalidadeLabel: "Maluca",
              palpite: primeiro.milhar,
              grupo: primeiro.grupo,
              bicho: primeiro.bicho,
            });
          }
        }
      }
    }

    if (resultados.length === 0) {
      return NextResponse.json({ sucesso: true, ganhadores: [] });
    }

    const ganhadores = Array.from({ length: Math.min(100, resultados.length * 10) }, (_, i) => {
      const seed = i * 7919 + 31337;
      const s = (n: number, max: number) =>
        Math.abs((seed * 1103515245 + n * 12345) & 0x7fffffff) % max;

      const resultado = resultados[s(1, resultados.length)];
      const modalidade = MODALIDADES[s(2, MODALIDADES.length)];
      const aposta = modalidade.apostas[s(3, modalidade.apostas.length)];
      const premio = aposta * modalidade.mult;
      const nome = NOMES[s(4, NOMES.length)];

      const milhar = resultado.palpite;
      const palpiteFormatado =
        modalidade.nome === "Unidade" ? milhar.slice(-1) :
        modalidade.nome === "Dezena" ? milhar.slice(-2) :
        modalidade.nome === "Centena" ? milhar.slice(-3) :
        milhar;

      return {
        nome,
        banca: resultado.banca,
        horario: resultado.horario,
        modalidadeLabel: resultado.modalidadeLabel,
        modalidade: modalidade.nome,
        palpite: palpiteFormatado,
        grupo: resultado.grupo,
        bicho: resultado.bicho,
        premioPos: "1º Prêmio",
        aposta,
        premio,
      };
    });

    return NextResponse.json({ sucesso: true, ganhadores });
  } catch (erro) {
    console.error("Erro ao buscar ganhadores:", erro);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}