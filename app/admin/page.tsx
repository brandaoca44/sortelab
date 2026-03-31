"use client";

import { useState, useEffect, useCallback } from "react";
import { bancas } from "@/data/bancas";

type Aba = "adicionar" | "excluir";
type Tipo = "bicho" | "loteria";
type NomeLoteria = "megasena" | "lotofacil";

type ResultadoBicho = { chave: string; banca: string; data: string; horario: string };
type ResultadoLoteria = { nome: string; concurso: string; data: string };

const BICHOS = [
  { grupo: "01", nome: "Avestruz" }, { grupo: "02", nome: "Águia" },
  { grupo: "03", nome: "Burro" }, { grupo: "04", nome: "Borboleta" },
  { grupo: "05", nome: "Cachorro" }, { grupo: "06", nome: "Cabra" },
  { grupo: "07", nome: "Carneiro" }, { grupo: "08", nome: "Camelo" },
  { grupo: "09", nome: "Cobra" }, { grupo: "10", nome: "Coelho" },
  { grupo: "11", nome: "Cavalo" }, { grupo: "12", nome: "Elefante" },
  { grupo: "13", nome: "Galo" }, { grupo: "14", nome: "Gato" },
  { grupo: "15", nome: "Jacaré" }, { grupo: "16", nome: "Leão" },
  { grupo: "17", nome: "Macaco" }, { grupo: "18", nome: "Porco" },
  { grupo: "19", nome: "Pavão" }, { grupo: "20", nome: "Peru" },
  { grupo: "21", nome: "Touro" }, { grupo: "22", nome: "Tigre" },
  { grupo: "23", nome: "Urso" }, { grupo: "24", nome: "Veado" },
  { grupo: "25", nome: "Vaca" },
];

const NOMES_BANCAS: Record<string, string> = Object.fromEntries(
  bancas.map((b) => [b.slug, b.nome])
);

function getPremioVazio() {
  return { grupo: "", bicho: "", milhar: "" };
}

function getHojeBrasil() {
  const agora = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [aba, setAba] = useState<Aba>("adicionar");

  // --- ADICIONAR ---
  const [tipo, setTipo] = useState<Tipo>("bicho");
  const [banca, setBanca] = useState(bancas[0].slug);
  const [data, setData] = useState(getHojeBrasil());
  const [horario, setHorario] = useState("10:00");
  const [premiosNormal, setPremiosNormal] = useState(Array.from({ length: 10 }, getPremioVazio));
  const [premiosMaluca, setPremiosMaluca] = useState(Array.from({ length: 10 }, getPremioVazio));
  const [nomeLoteria, setNomeLoteria] = useState<NomeLoteria>("megasena");
  const [concurso, setConcurso] = useState("");
  const [dataLoteria, setDataLoteria] = useState(getHojeBrasil());
  const [dezenas, setDezenas] = useState<string[]>(Array(6).fill(""));
  const [acumulado, setAcumulado] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // --- EXCLUIR ---
  const [excTipo, setExcTipo] = useState<Tipo>("bicho");
  const [resultadosBicho, setResultadosBicho] = useState<ResultadoBicho[]>([]);
  const [resultadosLoteria, setResultadosLoteria] = useState<ResultadoLoteria[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [mensagemExc, setMensagemExc] = useState("");
  const [erroExc, setErroExc] = useState("");

  const bancaAtual = bancas.find((b) => b.slug === banca);
  const horariosDaBanca = bancaAtual?.horarios || [];

  const carregarLista = useCallback(async () => {
    setCarregandoLista(true);
    setSelecionado(null);
    setMensagemExc("");
    setErroExc("");
    try {
      const res = await fetch("/api/admin/listar");
      const json = await res.json();
      if (json.sucesso) {
        setResultadosBicho(json.bicho || []);
        setResultadosLoteria(json.loteria || []);
      }
    } catch {
      setErroExc("Erro ao carregar lista.");
    } finally {
      setCarregandoLista(false);
    }
  }, []);

  useEffect(() => {
    if (aba === "excluir" && autenticado) carregarLista();
  }, [aba, autenticado, carregarLista]);

  function atualizarPremio(modalidade: "normal" | "maluca", index: number, campo: "grupo" | "milhar", valor: string) {
    const lista = modalidade === "normal" ? [...premiosNormal] : [...premiosMaluca];
    const grupoEncontrado = BICHOS.find((b) => b.grupo === valor);
    lista[index] = {
      ...lista[index],
      [campo]: valor,
      ...(campo === "grupo" && grupoEncontrado ? { bicho: grupoEncontrado.nome } : {}),
    };
    if (modalidade === "normal") setPremiosNormal(lista);
    else setPremiosMaluca(lista);
  }

  function atualizarDezena(index: number, valor: string) {
    const novas = [...dezenas];
    novas[index] = valor.replace(/\D/g, "").slice(0, 2);
    setDezenas(novas);
  }

  function limparFormulario() {
    setPremiosNormal(Array.from({ length: 10 }, getPremioVazio));
    setPremiosMaluca(Array.from({ length: 10 }, getPremioVazio));
    setDezenas(Array(nomeLoteria === "megasena" ? 6 : 15).fill(""));
    setConcurso("");
    setAcumulado("");
  }

  async function verificarSenha() {
    const res = await fetch("/api/admin/resultado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha, tipo: "ping", dados: {} }),
    });
    if (res.status === 401) { setErroSenha("Senha incorreta."); return; }
    setAutenticado(true);
    setErroSenha("");
  }

  async function salvar() {
    setSalvando(true);
    setMensagem("");
    setErro("");
    try {
      let body = {};
      if (tipo === "bicho") {
        body = {
          senha, tipo: "bicho",
          dados: {
            banca, data, horario,
            normal: premiosNormal.map((p, i) => ({ premio: i + 1, ...p })),
            maluca: premiosMaluca.map((p, i) => ({ premio: i + 1, ...p })),
          },
        };
      } else {
        body = {
          senha, tipo: "loteria",
          dados: { nome: nomeLoteria, concurso, data: dataLoteria, dezenas, acumulado },
        };
      }
      const res = await fetch("/api/admin/resultado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) setErro(json.erro || "Erro ao salvar.");
      else { setMensagem("Resultado salvo com sucesso!"); limparFormulario(); }
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir() {
    if (!selecionado) return;
    setExcluindo(true);
    setMensagemExc("");
    setErroExc("");
    try {
      let body = {};
      if (excTipo === "bicho") {
        const item = resultadosBicho.find((r) => r.chave === selecionado);
        if (!item) return;
        body = { senha, tipo: "excluir-bicho", dados: { banca: item.banca, data: item.data, horario: item.horario } };
      } else {
        const [nome, conc] = selecionado.split("|");
        body = { senha, tipo: "excluir-loteria", dados: { nome, concurso: conc } };
      }
      const res = await fetch("/api/admin/resultado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) setErroExc(json.erro || "Erro ao excluir.");
      else {
        setMensagemExc("Resultado excluído com sucesso!");
        setSelecionado(null);
        await carregarLista();
      }
    } catch {
      setErroExc("Erro de conexão. Tente novamente.");
    } finally {
      setExcluindo(false);
    }
  }

  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c1425] px-4">
        <div className="surface-card-strong w-full max-w-sm rounded-3xl p-8">
          <h1 className="title-premium text-2xl font-semibold">Painel Admin</h1>
          <p className="mt-2 text-sm text-muted">Digite a senha para acessar.</p>
          <div className="mt-6 grid gap-3">
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} onKeyDown={(e) => e.key === "Enter" && verificarSenha()} placeholder="Senha" className="input-base" />
            {erroSenha && <p className="text-sm text-red-400">{erroSenha}</p>}
            <button onClick={verificarSenha} className="btn-primary">Entrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1425] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="title-premium text-3xl font-semibold">Painel Admin</h1>
            <p className="mt-1 text-sm text-muted">Gerencie os resultados do site.</p>
          </div>
          <button onClick={() => setAutenticado(false)} className="btn-ghost text-sm">Sair</button>
        </div>

        <div className="mb-6 flex gap-3">
          <button onClick={() => { setAba("adicionar"); setMensagem(""); setErro(""); }} className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${aba === "adicionar" ? "border border-[rgba(245,196,81,0.3)] bg-[rgba(245,196,81,0.15)] text-gold" : "border border-white/10 bg-white/[0.03] text-slate-300"}`}>Adicionar resultado</button>
          <button onClick={() => setAba("excluir")} className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${aba === "excluir" ? "border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] text-red-400" : "border border-white/10 bg-white/[0.03] text-slate-300"}`}>Excluir resultado</button>
        </div>

        {aba === "adicionar" && (
          <>
            <div className="mb-6 flex gap-3">
              {(["bicho", "loteria"] as Tipo[]).map((t) => (
                <button key={t} onClick={() => setTipo(t)} className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${tipo === t ? "border border-[rgba(245,196,81,0.3)] bg-[rgba(245,196,81,0.15)] text-gold" : "border border-white/10 bg-white/[0.03] text-slate-300"}`}>
                  {t === "bicho" ? "Jogo do Bicho" : "Loteria"}
                </button>
              ))}
            </div>

            {tipo === "bicho" && (
              <div className="surface-card-strong rounded-3xl p-6 md:p-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted">Banca</label>
                    <select value={banca} onChange={(e) => { setBanca(e.target.value); const nova = bancas.find((b) => b.slug === e.target.value); if (nova) setHorario(nova.horarios[0]); }} className="select-base">
                      {bancas.map((b) => <option key={b.slug} value={b.slug}>{b.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted">Data</label>
                    <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="input-base" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted">Horário</label>
                    <select value={horario} onChange={(e) => setHorario(e.target.value)} className="select-base">
                      {horariosDaBanca.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
                {(["normal", "maluca"] as const).map((modalidade) => {
                  const premios = modalidade === "normal" ? premiosNormal : premiosMaluca;
                  return (
                    <div key={modalidade} className="mt-8">
                      <h2 className="mb-4 text-lg font-semibold capitalize text-white">{modalidade === "normal" ? "Normal" : "Maluca"}</h2>
                      <div className="grid gap-3">
                        {premios.map((premio, index) => (
                          <div key={index} className="grid grid-cols-[40px_1fr_1fr_1fr] items-center gap-3">
                            <span className="text-center text-sm font-semibold text-gold">{index + 1}º</span>
                            <select value={premio.grupo} onChange={(e) => atualizarPremio(modalidade, index, "grupo", e.target.value)} className="select-base text-sm">
                              <option value="">Grupo</option>
                              {BICHOS.map((b) => <option key={b.grupo} value={b.grupo}>{b.grupo} - {b.nome}</option>)}
                            </select>
                            <input type="text" value={premio.bicho} readOnly placeholder="Bicho" className="input-base text-sm opacity-60" />
                            <input type="text" value={premio.milhar} onChange={(e) => atualizarPremio(modalidade, index, "milhar", e.target.value)} placeholder="Milhar" maxLength={4} className="input-base text-sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {tipo === "loteria" && (
              <div className="surface-card-strong rounded-3xl p-6 md:p-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted">Loteria</label>
                    <select value={nomeLoteria} onChange={(e) => { setNomeLoteria(e.target.value as NomeLoteria); setDezenas(Array(e.target.value === "megasena" ? 6 : 15).fill("")); }} className="select-base">
                      <option value="megasena">Mega-Sena</option>
                      <option value="lotofacil">Lotofácil</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted">Concurso</label>
                    <input type="text" value={concurso} onChange={(e) => setConcurso(e.target.value)} placeholder="Ex: 2822" className="input-base" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-muted">Data</label>
                    <input type="date" value={dataLoteria} onChange={(e) => setDataLoteria(e.target.value)} className="input-base" />
                  </div>
                </div>

                {/* ACUMULADO */}
                <div className="mt-6">
                  <label className="mb-2 block text-xs font-medium text-muted">
                    Valor acumulado (opcional)
                  </label>
                  <input
                    type="text"
                    value={acumulado}
                    onChange={(e) => setAcumulado(e.target.value)}
                    placeholder="Ex: 50.000.000"
                    className="input-base"
                  />
                  <p className="mt-1 text-xs text-muted">
                    Digite o valor por extenso como aparece nos sites oficiais. Ex: 50.000.000
                  </p>
                </div>

                <div className="mt-6">
                  <h2 className="mb-4 text-lg font-semibold text-white">Dezenas sorteadas</h2>
                  <div className="flex flex-wrap gap-3">
                    {dezenas.map((dezena, index) => (
                      <input key={index} type="text" value={dezena} onChange={(e) => atualizarDezena(index, e.target.value)} placeholder="00" maxLength={2} className="input-base w-16 text-center text-lg font-semibold" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mensagem && <div className="mt-4 rounded-xl border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] px-4 py-3 text-sm text-green-400">{mensagem}</div>}
            {erro && <div className="mt-4 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] px-4 py-3 text-sm text-red-400">{erro}</div>}
            <button onClick={salvar} disabled={salvando} className="btn-primary mt-6 w-full">
              {salvando ? "Salvando..." : "Salvar resultado"}
            </button>
          </>
        )}

        {aba === "excluir" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-3">
                {(["bicho", "loteria"] as Tipo[]).map((t) => (
                  <button key={t} onClick={() => { setExcTipo(t); setSelecionado(null); }} className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${excTipo === t ? "border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] text-red-400" : "border border-white/10 bg-white/[0.03] text-slate-300"}`}>
                    {t === "bicho" ? "Jogo do Bicho" : "Loteria"}
                  </button>
                ))}
              </div>
              <button onClick={carregarLista} disabled={carregandoLista} className="btn-ghost text-xs">
                {carregandoLista ? "Carregando..." : "↻ Atualizar"}
              </button>
            </div>

            {excTipo === "bicho" && (
              <div className="surface-card-strong rounded-3xl p-6">
                <p className="mb-4 text-sm font-medium text-muted">Resultados de hoje — clique para selecionar e excluir</p>
                {carregandoLista ? <p className="text-sm text-muted">Carregando...</p> : resultadosBicho.length === 0 ? <p className="text-sm text-muted">Nenhum resultado salvo hoje.</p> : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {resultadosBicho.map((item) => {
                      const sel = selecionado === item.chave;
                      return (
                        <button key={item.chave} onClick={() => setSelecionado(sel ? null : item.chave)} className={`rounded-xl border p-4 text-left transition ${sel ? "border-red-500 bg-[rgba(239,68,68,0.12)]" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}>
                          <p className="text-sm font-semibold text-white">{NOMES_BANCAS[item.banca] || item.banca}</p>
                          <p className="mt-1 text-xs text-muted">{item.horario}</p>
                          {sel && <p className="mt-2 text-xs font-semibold text-red-400">Selecionado para excluir</p>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {excTipo === "loteria" && (
              <div className="surface-card-strong rounded-3xl p-6">
                <p className="mb-4 text-sm font-medium text-muted">Concursos salvos — clique para selecionar e excluir</p>
                {carregandoLista ? <p className="text-sm text-muted">Carregando...</p> : resultadosLoteria.length === 0 ? <p className="text-sm text-muted">Nenhum concurso salvo.</p> : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {resultadosLoteria.map((item) => {
                      const chave = `${item.nome}|${item.concurso}`;
                      const sel = selecionado === chave;
                      return (
                        <button key={chave} onClick={() => setSelecionado(sel ? null : chave)} className={`rounded-xl border p-4 text-left transition ${sel ? "border-red-500 bg-[rgba(239,68,68,0.12)]" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}>
                          <p className="text-sm font-semibold text-white capitalize">{item.nome === "megasena" ? "Mega-Sena" : "Lotofácil"}</p>
                          <p className="mt-1 text-xs text-muted">Concurso {item.concurso} • {item.data}</p>
                          {sel && <p className="mt-2 text-xs font-semibold text-red-400">Selecionado para excluir</p>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {mensagemExc && <div className="mt-4 rounded-xl border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] px-4 py-3 text-sm text-green-400">{mensagemExc}</div>}
            {erroExc && <div className="mt-4 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] px-4 py-3 text-sm text-red-400">{erroExc}</div>}
            {selecionado && (
              <button onClick={excluir} disabled={excluindo} className="mt-6 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
                {excluindo ? "Excluindo..." : "Confirmar exclusão"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
