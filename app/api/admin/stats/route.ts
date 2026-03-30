import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
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

function getUltimasDatas(quantidade: number): string[] {
  const datas: string[] = [];
  const agora = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );
  for (let i = 0; i < quantidade; i++) {
    const d = new Date(agora);
    d.setDate(agora.getDate() - i);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    datas.push(`${ano}-${mes}-${dia}`);
  }
  return datas;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("banca");
    const dias = Math.min(Number(searchParams.get("dias") || "30"), 30);

    const bancaInfo = bancas.find((b) => b.slug === slug);
    if (!bancaInfo) {
      return NextResponse.json({ erro: "Banca não encontrada" }, { status: 400 });
    }

    const datas = getUltimasDatas(dias);
    const horarios = bancaInfo.horarios;

    // Contagem de grupos e dezenas por horário
    const statsPorHorario: Record<string, {
      grupos: Record<string, number>;
      dezenas: Record<string, number>;
      totalResultados: number;
      diasComDados: number;
    }> = {};

    for (const horario of horarios) {
      statsPorHorario[horario] = { grupos: {}, dezenas: {}, totalResultados: 0, diasComDados: 0 };
    }

    let totalDiasComDados = 0;

    for (const data of datas) {
      let temDadoNesseDia = false;

      for (const horario of horarios) {
        const chave = `bicho:${slug}:${data}:${horario}`;
        const resultado = await kv.get<ResultadoModalidade>(chave);

        if (resultado && resultado.normal.length > 0) {
          temDadoNesseDia = true;
          statsPorHorario[horario].diasComDados++;
          statsPorHorario[horario].totalResultados++;

          for (const premio of resultado.normal) {
            const grupoKey = `${premio.grupo}-${premio.bicho}`;
            statsPorHorario[horario].grupos[grupoKey] =
              (statsPorHorario[horario].grupos[grupoKey] || 0) + 1;

            const dezena = premio.milhar.slice(-2);
            statsPorHorario[horario].dezenas[dezena] =
              (statsPorHorario[horario].dezenas[dezena] || 0) + 1;
          }
        }
      }

      if (temDadoNesseDia) totalDiasComDados++;
    }

    // Monta resultado final por horário
    const resultado: Record<string, {
      grupoFrequente: string;
      grupoAtrasado: string;
      dezenaFrequente: string;
      dezenaAtrasada: string;
      diasComDados: number;
      totalResultados: number;
    }> = {};

    const todosGrupos = [
      "01-Avestruz","02-Águia","03-Burro","04-Borboleta","05-Cachorro",
      "06-Cabra","07-Carneiro","08-Camelo","09-Cobra","10-Coelho",
      "11-Cavalo","12-Elefante","13-Galo","14-Gato","15-Jacaré",
      "16-Leão","17-Macaco","18-Porco","19-Pavão","20-Peru",
      "21-Touro","22-Tigre","23-Urso","24-Veado","25-Vaca",
    ];

    const todasDezenas = Array.from({ length: 100 }, (_, i) =>
      String(i).padStart(2, "0")
    );

    for (const horario of horarios) {
      const stats = statsPorHorario[horario];

      if (stats.totalResultados === 0) {
        resultado[horario] = {
          grupoFrequente: "—",
          grupoAtrasado: "—",
          dezenaFrequente: "—",
          dezenaAtrasada: "—",
          diasComDados: 0,
          totalResultados: 0,
        };
        continue;
      }

      // Grupo mais frequente
      const gruposSorted = Object.entries(stats.grupos).sort((a, b) => b[1] - a[1]);
      const grupoFrequente = gruposSorted[0]?.[0].replace("-", " - ") || "—";

      // Grupo mais atrasado (não aparece há mais tempo)
      const grupoAtrasado = todosGrupos
        .filter((g) => {
          const key = g.replace("-", "-");
          return !stats.grupos[key];
        })[0]?.replace("-", " - ") || gruposSorted[gruposSorted.length - 1]?.[0].replace("-", " - ") || "—";

      // Dezena mais frequente
      const dezenasSorted = Object.entries(stats.dezenas).sort((a, b) => b[1] - a[1]);
      const dezenaFrequente = dezenasSorted[0]?.[0] || "—";

      // Dezena mais atrasada
      // Mapa de grupos → dezenas
const gruposDezenas: Record<string, string[]> = {
  "01": ["01","02","03","04"], "02": ["05","06","07","08"],
  "03": ["09","10","11","12"], "04": ["13","14","15","16"],
  "05": ["17","18","19","20"], "06": ["21","22","23","24"],
  "07": ["25","26","27","28"], "08": ["29","30","31","32"],
  "09": ["33","34","35","36"], "10": ["37","38","39","40"],
  "11": ["41","42","43","44"], "12": ["45","46","47","48"],
  "13": ["49","50","51","52"], "14": ["53","54","55","56"],
  "15": ["57","58","59","60"], "16": ["61","62","63","64"],
  "17": ["65","66","67","68"], "18": ["69","70","71","72"],
  "19": ["73","74","75","76"], "20": ["77","78","79","80"],
  "21": ["81","82","83","84"], "22": ["85","86","87","88"],
  "23": ["89","90","91","92"], "24": ["93","94","95","96"],
  "25": ["97","98","99","00"],
};

// Dezena atrasada — busca dentro das dezenas do grupo atrasado
const grupoAtrasadoNum = grupoAtrasado.split(" - ")[0];
const dezenasDoGrupoAtrasado = gruposDezenas[grupoAtrasadoNum] || todasDezenas;
const dezenaAtrasada = dezenasDoGrupoAtrasado
  .filter((d) => !stats.dezenas[d])[0]
  || dezenasDoGrupoAtrasado[0];
      resultado[horario] = {
        grupoFrequente,
        grupoAtrasado,
        dezenaFrequente,
        dezenaAtrasada,
        diasComDados: stats.diasComDados,
        totalResultados: stats.totalResultados,
      };
    }

    return NextResponse.json({
      sucesso: true,
      banca: slug,
      totalDiasComDados,
      diasSolicitados: dias,
      resultado,
    });
  } catch (erro) {
    console.error("Erro ao buscar estatísticas:", erro);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}