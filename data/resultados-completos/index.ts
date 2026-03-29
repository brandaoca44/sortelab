import type { ResultadosCompletos } from "./types";
import { bahiaResultados } from "./bahia";
import { nacionalResultados } from "./nacional";
import { lookResultados } from "./look";
import { rioDeJaneiroResultados } from "./rio-de-janeiro";
import { lotepResultados } from "./lotep";
import { loteceResultados } from "./lotece";
import { saoPauloResultados } from "./sao-paulo";
import { goiasResultados } from "./goias";
import { minasGeraisResultados } from "./minas-gerais";

export const resultadosCompletos: ResultadosCompletos = {
  bahia: bahiaResultados,
  nacional: nacionalResultados,
  look: lookResultados,
  "rio-de-janeiro": rioDeJaneiroResultados,
  lotep: lotepResultados,
  lotece: loteceResultados,
  "sao-paulo": saoPauloResultados,
  goias: goiasResultados,
  "minas-gerais": minasGeraisResultados,
};

export * from "./types";