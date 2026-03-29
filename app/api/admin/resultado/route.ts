import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senha, tipo, dados } = body;

    // Verifica a senha
    if (!ADMIN_PASSWORD || senha !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { erro: "Senha incorreta" },
        { status: 401 }
      );
    }

    // Salva resultado do bicho
    if (tipo === "bicho") {
      const { banca, data, horario, normal, maluca } = dados;

      if (!banca || !data || !horario || !normal || !maluca) {
        return NextResponse.json(
          { erro: "Dados incompletos" },
          { status: 400 }
        );
      }

      const chave = `bicho:${banca}:${data}:${horario}`;
      await kv.set(chave, { normal, maluca });

      return NextResponse.json({ sucesso: true, chave });
    }

    // Salva resultado de loteria
    if (tipo === "loteria") {
      const { nome, concurso, data, dezenas } = dados;

      if (!nome || !concurso || !data || !dezenas) {
        return NextResponse.json(
          { erro: "Dados incompletos" },
          { status: 400 }
        );
      }

      const chave = `loteria:${nome}:${concurso}`;

      // Busca lista atual e adiciona no início
      const listaAtual = await kv.get<object[]>(`loteria:${nome}:lista`) || [];
      const novaLista = [{ concurso, data, dezenas }, ...listaAtual].slice(0, 20);
      await kv.set(`loteria:${nome}:lista`, novaLista);
      await kv.set(chave, { concurso, data, dezenas });

      return NextResponse.json({ sucesso: true, chave });
    }

    return NextResponse.json(
      { erro: "Tipo inválido" },
      { status: 400 }
    );

  } catch (erro) {
    console.error("Erro na API admin:", erro);
    return NextResponse.json(
      { erro: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}