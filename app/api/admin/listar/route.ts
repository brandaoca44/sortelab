import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

function getHojeBrasil() {
  const agora = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export async function GET() {
  try {
    const hoje = getHojeBrasil();

    // Lista todas as chaves do bicho de hoje
    const chavesBicho = await kv.keys(`bicho:*:${hoje}:*`);

    // Lista chaves de loteria
    const chavesLoteria = await kv.keys(`loteria:*:lista`);

    // Monta lista de resultados do bicho
    const bicho = chavesBicho.map((chave) => {
      const partes = chave.split(":");
      return {
        chave,
        banca: partes[1],
        data: partes[2],
        horario: partes[3],
      };
    }).sort((a, b) => a.banca.localeCompare(b.banca));

    // Busca listas de loteria
    const loteria: { nome: string; concurso: string; data: string }[] = [];

    for (const chave of chavesLoteria) {
      const nome = chave.split(":")[1];
      const lista = await kv.get<{ concurso: string; data: string }[]>(chave) || [];
      for (const item of lista) {
        loteria.push({ nome, concurso: item.concurso, data: item.data });
      }
    }

    return NextResponse.json({ sucesso: true, bicho, loteria });
  } catch (erro) {
    console.error("Erro ao listar resultados:", erro);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}