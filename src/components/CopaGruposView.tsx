/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, CheckCircle, HelpCircle, FastForward } from 'lucide-react';
import { Grupo, Partida, Participante, ClassificacaoGrupo } from '../types';
import { calcularClassificacao, todasPartidasGruposConcluidas } from '../utils';
import CartaoParticipante from './CartaoParticipante';

interface CopaGruposViewProps {
  grupos: Grupo[];
  partidas: Partida[];
  participantes: Participante[];
  setPartidas: React.Dispatch<React.SetStateAction<Partida[]>>;
  aoAvancarParaEliminatorias: () => void;
  aoReiniciar: () => void;
}

export default function CopaGruposView({
  grupos,
  partidas,
  participantes,
  setPartidas,
  aoAvancarParaEliminatorias,
  aoReiniciar
}: CopaGruposViewProps) {
  const [grupoAtivo, setGrupoAtivo] = useState<string>('TODOS');
  const [animandoPartidaId, setAnimandoPartidaId] = useState<string | null>(null);

  // Mapeia participante ID para objeto rápido
  const getParticipante = (id: string | null): Participante | null => {
    if (!id) return null;
    return participantes.find(p => p.id === id) || null;
  };

  // Atualizar placar de uma partida
  const atualizarPlacar = (partidaId: string, golsMandante: number | null, golsVisitante: number | null, concluida: boolean = true) => {
    setPartidas(prev =>
      prev.map(p => {
        if (p.id !== partidaId) return p;

        let vencedorId: string | null = null;
        if (golsMandante !== null && golsVisitante !== null) {
          if (golsMandante > golsVisitante) {
            vencedorId = p.mandanteId;
          } else if (golsVisitante > golsMandante) {
            vencedorId = p.visitanteId;
          }
        }

        return {
          ...p,
          golsMandante,
          golsVisitante,
          vencedorId,
          concluida
        };
      })
    );
  };

  // Atribuir resultado aleatório com animação de dado
  const simularPartidaAleatoria = (partidaId: string) => {
    setAnimandoPartidaId(partidaId);
    setTimeout(() => {
      // Sorteia placares plausíveis (pesando a favor de mais gols mas não exagerado)
      const gM = Math.floor(Math.random() * 4);
      const gV = Math.floor(Math.random() * 4);
      atualizarPlacar(partidaId, gM, gV, true);
      setAnimandoPartidaId(null);
    }, 450);
  };

  // Simular todas as partidas pendentes da fase de grupos
  const simularTodasGruposRestantes = () => {
    setPartidas(prev =>
      prev.map(p => {
        if (p.fase !== 'grupos' || p.concluida) return p;

        const gM = Math.floor(Math.random() * 4);
        const gV = Math.floor(Math.random() * 4);
        
        let vencedorId: string | null = null;
        if (gM > gV) {
          vencedorId = p.mandanteId;
        } else if (gV > gM) {
          vencedorId = p.visitanteId;
        }

        return {
          ...p,
          golsMandante: gM,
          golsVisitante: gV,
          vencedorId,
          concluida: true
        };
      })
    );
  };

  // Incrementar ou decrementar gols manualmente
  const alterarGols = (partidaId: string, tipo: 'mandante' | 'visitante', valor: number) => {
    const partida = partidas.find(p => p.id === partidaId);
    if (!partida) return;

    let golsM = partida.golsMandante ?? 0;
    let golsV = partida.golsVisitante ?? 0;

    if (tipo === 'mandante') {
      golsM = Math.max(0, golsM + valor);
    } else {
      golsV = Math.max(0, golsV + valor);
    }

    atualizarPlacar(partidaId, golsM, golsV, true);
  };

  // Atribuição de vitória direta sem fazer gols complexos
  const definirVitoriaDireta = (partidaId: string, vencedor: 'mandante' | 'visitante' | 'empate') => {
    if (vencedor === 'mandante') {
      atualizarPlacar(partidaId, 2, 0, true);
    } else if (vencedor === 'visitante') {
      atualizarPlacar(partidaId, 0, 2, true);
    } else {
      atualizarPlacar(partidaId, 1, 1, true);
    }
  };

  // Limpar jogo de volta à estaca zero
  const limparPartida = (partidaId: string) => {
    setPartidas(prev => prev.map(p => p.id === partidaId ? { ...p, golsMandante: null, golsVisitante: null, vencedorId: null, concluida: false } : p));
  };

  const partidasGrupoFiltro = partidas.filter(p => p.fase === 'grupos');
  const totalPartidasGrupo = partidasGrupoFiltro.length;
  const partidasGrupoConcluidas = partidasGrupoFiltro.filter(p => p.concluida).length;
  const porcentagemAndamento = Math.round((partidasGrupoConcluidas / totalPartidasGrupo) * 100) || 0;
  const faseDeGruposPronta = todasPartidasGruposConcluidas(partidas);

  return (
    <div id="copa-grupos-container" className="space-y-8 max-w-6xl mx-auto px-4 pb-12">
      {/* Barra de Status e Simulações */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left w-full md:w-auto">
          <h2 className="text-sm font-bold font-display uppercase tracking-widest text-slate-400 flex items-center justify-center md:justify-start gap-2">
            <span>📅 FASE DE GRUPOS</span>
            <span className="text-xs font-mono font-normal text-slate-505 text-slate-400 lowercase pr-1 whitespace-nowrap">
              ({partidasGrupoConcluidas} de {totalPartidasGrupo} jogos)
            </span>
          </h2>
          <div className="w-full bg-slate-950 rounded-full h-2 mt-2 overflow-hidden border border-slate-850">
            <div
              id="progress-bar-grupos"
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${porcentagemAndamento}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 shrink-0 justify-center w-full md:w-auto">
          <button
            id="btn-simular-todos-grupos"
            onClick={simularTodasGruposRestantes}
            disabled={faseDeGruposPronta}
            className={`flex items-center gap-1.5 text-xs font-bold font-display uppercase tracking-widest px-4 py-2.5 rounded transition border cursor-pointer active:scale-95
              ${
                faseDeGruposPronta
                  ? 'bg-slate-950 text-slate-600 border-slate-850 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-transparent shadow-md shadow-amber-500/10'
              }
            `}
          >
            <FastForward className="w-3.5 h-3.5" />
            SORTEAR RESTANTES 🎲
          </button>
          
          <button
            id="btn-reiniciar-grupo-view"
            onClick={aoReiniciar}
            className="flex items-center gap-1.5 text-xs font-bold font-display uppercase tracking-widest text-slate-300 bg-slate-950 hover:bg-slate-900 border border-slate-800 px-4 py-2.5 rounded cursor-pointer transition active:scale-95 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
            RECOMEÇAR TUDO
          </button>
        </div>
      </div>

      {/* Tabs de Filtro de Grupo - Geometric Sharp Design */}
      {grupos.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-display">
          <button
            id="btn-tab-todos"
            onClick={() => setGrupoAtivo('TODOS')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition shrink-0 cursor-pointer border ${
              grupoAtivo === 'TODOS'
                ? 'bg-amber-500 border-amber-600 text-slate-950 font-black font-semibold'
                : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            TODOS OS GRUPOS
          </button>
          {grupos.map(g => (
            <button
              key={g.id}
              id={`btn-tab-grupo-${g.id}`}
              onClick={() => setGrupoAtivo(g.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition shrink-0 cursor-pointer border ${
                grupoAtivo === g.id
                  ? 'bg-amber-500 border-amber-600 text-slate-950 font-black font-semibold'
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              GRUPO {g.id}
            </button>
          ))}
        </div>
      )}

      {/* Grid de Grupos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {grupos
          .filter(g => grupoAtivo === 'TODOS' || g.id === grupoAtivo)
          .map(grupo => {
            const classificacao = calcularClassificacao(grupo.id, grupo.participantesIds, partidas);
            const matchesDoGrupo = partidas.filter(p => p.fase === 'grupos' && p.grupoId === grupo.id);

            return (
              <div
                key={grupo.id}
                id={`card-grupo-layout-${grupo.id}`}
                className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col"
              >
                {/* Cabeçalho do Grupo */}
                <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-white font-display">
                  <h3 className="font-bold text-sm tracking-widest uppercase">Grupo {grupo.id}</h3>
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                    {grupos.length > 8 ? 'AVANÇA APENAS O 1º LUGAR' : 'AVANÇA 1º E 2º LUGAR'}
                  </span>
                </div>

                {/* Tabela de Classificação do Grupo */}
                <div className="overflow-x-auto border-b border-slate-850">
                  <table className="w-full text-left text-xs text-slate-300 min-w-[340px]">
                    <thead>
                      <tr className="border-b border-slate-850 bg-slate-950/60 text-slate-400 font-bold uppercase text-[9px] font-display">
                        <th className="px-4 py-2.5 text-center w-10">#</th>
                        <th className="px-2 py-2.5">Competidor</th>
                        <th className="px-2 py-2.5 text-center w-8" title="Pontos">P</th>
                        <th className="px-2 py-2.5 text-center w-8" title="Jogos Realizados">J</th>
                        <th className="px-2 py-2.5 text-center w-8" title="Vitórias">V</th>
                        <th className="px-2 py-2.5 text-center w-8" title="Empates">E</th>
                        <th className="px-2 py-2.5 text-center w-8" title="Derrotas">D</th>
                        <th className="px-2 py-2.5 text-center w-12" title="Gols Marcados : Gols Sofridos">Plac</th>
                        <th className="px-4 py-2.5 text-center w-10" title="Saldo de Gols">SG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classificacao.map((item, index) => {
                        const original = getParticipante(item.participanteId);

                        return (
                          <tr
                            key={item.participanteId}
                            id={`row-classificacao-${grupo.id}-${index}`}
                            className={`border-b border-slate-850/65 transition last:border-0 hover:bg-slate-950/30 ${
                              index === 0 ? 'bg-amber-500/5 font-semibold text-amber-100' :
                              index === 1 && grupos.length <= 8 ? 'bg-slate-950/20 font-semibold' : ''
                            }`}
                          >
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center mx-auto font-mono
                                  ${
                                    index === 0 ? 'bg-amber-500 text-slate-950 font-bold' :
                                    index === 1 && grupos.length <= 8 ? 'bg-slate-800 text-slate-200' :
                                    'bg-slate-950 text-slate-500'
                                  }
                                `}
                              >
                                {index + 1}
                              </span>
                            </td>
                            <td className="px-2 py-3">
                              <CartaoParticipante participante={original} tamanho="xs" />
                            </td>
                            <td className="px-2 py-3 text-center font-bold text-white bg-slate-950/60 font-mono">
                              {item.pontos}
                            </td>
                            <td className="px-2 py-3 text-center text-slate-400">{item.jogos}</td>
                            <td className="px-2 py-3 text-center text-slate-300">{item.vitorias}</td>
                            <td className="px-2 py-3 text-center text-slate-300">{item.empates}</td>
                            <td className="px-2 py-3 text-center text-slate-300">{item.derrotas}</td>
                            <td className="px-2 py-3 text-center font-mono text-slate-400">
                              {item.golsPro}:{item.golsContra}
                            </td>
                            <td className={`px-4 py-3 text-center font-bold font-mono ${
                              item.saldoGols > 0 ? 'text-[#eab308] text-amber-400' :
                              item.saldoGols < 0 ? 'text-rose-500' : 'text-slate-500'
                            }`}>
                              {item.saldoGols > 0 ? `+${item.saldoGols}` : item.saldoGols}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Partidas do Grupo */}
                <div className="p-4 bg-slate-950/25 border-t border-slate-800/80 space-y-3 flex-1">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-display mb-2">Confrontos do Grupo:</div>
                  
                  {matchesDoGrupo.map((partida, pIdx) => {
                    const mandante = getParticipante(partida.mandanteId);
                    const visitante = getParticipante(partida.visitanteId);
                    const isAnimando = animandoPartidaId === partida.id;

                    const rodadaLabel = pIdx < 2 ? 'Rodada 1' : pIdx < 4 ? 'Rodada 2' : 'Rodada 3';

                    return (
                      <div
                        key={partida.id}
                        id={`card-confronto-${partida.id}`}
                        className={`p-3 bg-slate-950 rounded border border-slate-850/70 transition space-y-2 relative shadow-xs ${
                          partida.concluida ? 'bg-slate-900/30 opacity-90' : 'hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-bold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-sm border border-amber-500/15 font-mono tracking-wider">
                            {rodadaLabel.toUpperCase()}
                          </span>
                          {partida.concluida && (
                            <button
                              id={`btn-limpar-partida-${partida.id}`}
                              onClick={() => limparPartida(partida.id)}
                              className="text-[9px] font-bold font-mono tracking-wider text-slate-500 hover:text-rose-500 transition-colors uppercase cursor-pointer"
                              title="Zerar placar"
                            >
                              Zerar
                            </button>
                          )}
                        </div>

                        {/* Linha Principal de Placar */}
                        <div id={`match-flex-container-${partida.id}`} className="flex items-center justify-between gap-2.5">
                          {/* Mandante */}
                          <div className="flex items-center justify-end gap-2 text-right flex-1 min-w-0 pr-1">
                            <span className="font-bold text-slate-200 text-xs sm:text-sm truncate leading-tight">
                              {mandante?.nome}
                            </span>
                            <div className="shrink-0 scale-90 sm:scale-100">
                              <CartaoParticipante participante={mandante} mostrarNome={false} tamanho="sm" />
                            </div>
                          </div>

                          {/* Placar Real */}
                          <div className={`flex items-center gap-1 shrink-0 px-2 py-1 rounded ${isAnimando ? 'animate-pulse bg-amber-500/10' : ''}`}>
                            {partida.concluida ? (
                              <div className="flex items-center gap-1">
                                <button
                                  id={`btn-gols-mandante-dec-${partida.id}`}
                                  onClick={() => alterarGols(partida.id, 'mandante', -1)}
                                  className="w-5 h-5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold rounded-sm flex items-center justify-center text-xs active:scale-90 border border-slate-800 transition cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-mono font-black text-sm px-2 bg-slate-900 py-0.5 rounded-sm text-white border border-slate-800 min-w-8 text-center shadow-xs">
                                  {partida.golsMandante}
                                </span>
                                <button
                                  id={`btn-gols-mandante-inc-${partida.id}`}
                                  onClick={() => alterarGols(partida.id, 'mandante', 1)}
                                  className="w-5 h-5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold rounded-sm flex items-center justify-center text-xs active:scale-90 border border-slate-800 transition cursor-pointer"
                                >
                                  +
                                </button>
                                
                                <span className="text-amber-500 font-black text-xs font-mono tracking-widest px-1">X</span>

                                <button
                                  id={`btn-gols-visitante-dec-${partida.id}`}
                                  onClick={() => alterarGols(partida.id, 'visitante', -1)}
                                  className="w-5 h-5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold rounded-sm flex items-center justify-center text-xs active:scale-90 border border-slate-800 transition cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-mono font-black text-sm px-2 bg-slate-900 py-0.5 rounded-sm text-white border border-slate-800 min-w-8 text-center shadow-xs">
                                  {partida.golsVisitante}
                                </span>
                                <button
                                  id={`btn-gols-visitante-inc-${partida.id}`}
                                  onClick={() => alterarGols(partida.id, 'visitante', 1)}
                                  className="w-5 h-5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold rounded-sm flex items-center justify-center text-xs active:scale-90 border border-slate-800 transition cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <div className="text-amber-500 font-black text-xs font-mono tracking-widest px-1">
                                VS
                              </div>
                            )}
                          </div>

                          {/* Visitante */}
                          <div className="flex items-center justify-start gap-2 text-left flex-1 min-w-0 pl-1">
                            <div className="shrink-0 scale-90 sm:scale-100">
                              <CartaoParticipante participante={visitante} mostrarNome={false} tamanho="sm" />
                            </div>
                            <span className="font-bold text-slate-200 text-xs sm:text-sm truncate leading-tight">
                              {visitante?.nome}
                            </span>
                          </div>
                        </div>

                        {/* Botões rápidos de controle do jogo */}
                        {!partida.concluida && (
                          <div className="grid grid-cols-4 gap-1 pt-1.5 border-t border-slate-850 bg-slate-950/40 p-1">
                            <button
                              id={`btn-vit-mandante-${partida.id}`}
                              onClick={() => definirVitoriaDireta(partida.id, 'mandante')}
                              className="text-[9px] font-bold bg-slate-900 text-slate-300 hover:bg-slate-850 py-1.5 rounded-sm transition text-center overflow-hidden truncate leading-none border border-slate-800 cursor-pointer"
                              title={`Vitória do ${mandante?.nome}`}
                            >
                              Vitória {mandante?.nome?.split(' ')?.[0]}
                            </button>
                            <button
                              id={`btn-vit-empate-${partida.id}`}
                              onClick={() => definirVitoriaDireta(partida.id, 'empate')}
                              className="text-[9px] font-bold bg-slate-900 text-slate-300 hover:bg-slate-850 py-1.5 rounded-sm transition text-center overflow-hidden truncate leading-none border border-slate-800 cursor-pointer"
                            >
                              Empate
                            </button>
                            <button
                              id={`btn-vit-visitante-${partida.id}`}
                              onClick={() => definirVitoriaDireta(partida.id, 'visitante')}
                              className="text-[9px] font-bold bg-slate-900 text-slate-300 hover:bg-slate-850 py-1.5 rounded-sm transition text-center overflow-hidden truncate leading-none border border-slate-800 cursor-pointer"
                              title={`Vitória do ${visitante?.nome}`}
                            >
                              Vitória {visitante?.nome?.split(' ')?.[0]}
                            </button>
                            <button
                              id={`btn-vit-aleatorio-${partida.id}`}
                              onClick={() => simularPartidaAleatoria(partida.id)}
                              className="text-[9px] font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 py-1.5 rounded-sm transition flex items-center justify-center gap-0.5 leading-none font-display uppercase tracking-wider cursor-pointer font-black"
                            >
                              Sortear
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Banner de Avanço de Fase */}
      {faseDeGruposPronta && (
        <div id="banner-avanco-mata-mata" className="bg-slate-900 rounded-xl overflow-hidden flex flex-col md:flex-row border border-slate-700 shadow-2xl animate-fade-in">
          {/* Lado Esquerdo Amarelo */}
          <div className="w-full md:w-1/4 bg-amber-500 flex flex-col items-center justify-center p-6 text-center text-slate-950 shrink-0">
            <p className="font-bold text-xs uppercase tracking-widest font-mono">Próxima Fase</p>
            <p className="font-black font-display text-2xl leading-none mt-1">MATA-MATA</p>
            <div className="mt-4 h-1 w-12 bg-slate-950"></div>
          </div>
          
          {/* Lado Direito Radial */}
          <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900">
            <div className="space-y-1 relative z-10 w-full md:w-auto text-left">
              <h4 className="text-base font-bold font-display text-white uppercase tracking-widest flex items-center gap-2">
                <span>FASE DE GRUPOS CONCLUÍDA!</span>
              </h4>
              <p className="text-slate-300 text-xs max-w-lg">
                Definimos as melhores equipes de cada grupo. Chegou a hora do mata-mata decisivo de partida única. Vamos sortear as chaves!
              </p>
            </div>

            <button
              id="btn-avancar-eliminatorias"
              onClick={aoAvancarParaEliminatorias}
              className="relative z-10 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display tracking-widest text-xs font-bold uppercase shadow-lg transition duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              Avançar para o Mata-Mata 🏆 ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
