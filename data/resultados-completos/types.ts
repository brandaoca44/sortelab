// Tipos do jogo do bicho
export type PremioItem = {
  premio: number;
  grupo: string;
  bicho: string;
  milhar: string;
};

export type ResultadoModalidade = {
  normal: PremioItem[];
  maluca: PremioItem[];
};

export type ResultadoPorHorario = {
  [horario: string]: ResultadoModalidade;
};

export type ResultadoPorData = {
  [data: string]: ResultadoPorHorario;
};

export type ResultadosCompletos = {
  [slug: string]: ResultadoPorData;
};

// Tipos das loterias
export type ResultadoLoteria = {
  concurso: string;
  data: string;
  dezenas: string[];
};

// Tipo geral para salvar no KV
export type ChaveKV =
  | `bicho:${string}:${string}:${string}` // bicho:banca:data:horario
  | `loteria:${"megasena" | "lotofacil"}:${string}`; // loteria:nome:concurso