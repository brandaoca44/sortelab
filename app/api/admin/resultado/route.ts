import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senha, tipo, dados } = body;

    if (!ADMIN_PASSWORD || senha !== ADMIN_PASSWORD) {
      return NextResponse.json({ erro: "Senha incorreta" }, { status: 401 });
    }

    // Salvar resultado do bicho
    if (tipo === "bicho") {
      const { banca, data, horario, normal, maluca } = dados;
      if (!banca || !data || !horario || !normal || !maluca) {
        return NextResponse.json({ erro: "Dados incompletos" }, { status: 400 });
      }
      const chave = `bicho:${banca}:${data}:${horario}`;
      await kv.set(chave, { normal, maluca });
      return NextResponse.json({ sucesso: true, chave });
    }

    // Salvar resultado de loteria
    if (tipo === "loteria") {
      const { nome, concurso, data, dezenas } = dados;
      if (!nome || !concurso || !data || !dezenas) {
        return NextResponse.json({ erro: "Dados incompletos" }, { status: 400 });
      }
      const chave = `loteria:${nome}:${concurso}`;
      const listaAtual = await kv.get<object[]>(`loteria:${nome}:lista`) || [];
      const novaLista = [{ concurso, data, dezenas }, ...listaAtual].slice(0, 20);
      await kv.set(`loteria:${nome}:lista`, novaLista);
      await kv.set(chave, { concurso, data, dezenas });
      return NextResponse.json({ sucesso: true, chave });
    }

    // Excluir resultado do bicho
    if (tipo === "excluir-bicho") {
      const { banca, data, horario } = dados;
      if (!banca || !data || !horario) {
        return NextResponse.json({ erro: "Dados incompletos" }, { status: 400 });
      }
      const chave = `bicho:${banca}:${data}:${horario}`;
      await kv.del(chave);
      return NextResponse.json({ sucesso: true, chave });
    }

    // Excluir concurso de loteria
    if (tipo === "excluir-loteria") {
      const { nome, concurso } = dados;
      if (!nome || !concurso) {
        return NextResponse.json({ erro: "Dados incompletos" }, { status: 400 });
      }
      const chave = `loteria:${nome}:${concurso}`;
      await kv.del(chave);

      // Remove também da lista
      const listaAtual = await kv.get<{ concurso: string }[]>(`loteria:${nome}:lista`) || [];
      const novaLista = listaAtual.filter((item) => item.concurso !== concurso);
      await kv.set(`loteria:${nome}:lista`, novaLista);

      return NextResponse.json({ sucesso: true, chave });
    }

    return NextResponse.json({ erro: "Tipo inválido" }, { status: 400 });

  } catch (erro) {
    console.error("Erro na API admin:", erro);
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 });
  }
}