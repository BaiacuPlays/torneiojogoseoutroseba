/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trophy, Users, Award, ShieldAlert } from 'lucide-react';
import { Participante, Grupo, Partida, FaseTorneio } from './types';
import { criarGrupos, criarPartidasGrupo, gerarConfrontosIniciaisEliminatorias } from './utils';
import ParticipanteConfigView from './components/ParticipanteConfigView';
import CopaGruposView from './components/CopaGruposView';
import BracketsPlayoffs from './components/BracketsPlayoffs';

export default function App() {
  const [fase, setFase] = useState<FaseTorneio>('config');
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);

  // Carrega estado inicial do localStorage se disponível
  useEffect(() => {
    try {
      const savedFase = localStorage.getItem('copa_fase');
      const savedParticipantes = localStorage.getItem('copa_participantes');
      const savedGrupos = localStorage.getItem('copa_grupos');
      const savedPartidas = localStorage.getItem('copa_partidas');

      if (savedParticipantes) {
        setParticipantes(JSON.parse(savedParticipantes));
      }
      if (savedFase) {
        setFase(savedFase as FaseTorneio);
      }
      if (savedGrupos) {
        setGrupos(JSON.parse(savedGrupos));
      }
      if (savedPartidas) {
        setPartidas(JSON.parse(savedPartidas));
      }
    } catch (e) {
      console.error('Erro ao ler dados do localStorage', e);
    }
  }, []);

  // Persiste alterações no localStorage conforme elas ocorrem
  useEffect(() => {
    if (participantes.length > 0) {
      localStorage.setItem('copa_participantes', JSON.stringify(participantes));
    }
  }, [participantes]);

  useEffect(() => {
    localStorage.setItem('copa_fase', fase);
  }, [fase]);

  useEffect(() => {
    if (grupos.length > 0) {
      localStorage.setItem('copa_grupos', JSON.stringify(grupos));
    } else {
      localStorage.removeItem('copa_grupos');
    }
  }, [grupos]);

  useEffect(() => {
    if (partidas.length > 0) {
      localStorage.setItem('copa_partidas', JSON.stringify(partidas));
    } else {
      localStorage.removeItem('copa_partidas');
    }
  }, [partidas]);

  // Ação de iniciar a competição!
  const lidarComInicioCopa = (participantesProntos: Participante[]) => {
    const novosGrupos = criarGrupos(participantesProntos);
    const novasPartidas = criarPartidasGrupo(novosGrupos);

    setGrupos(novosGrupos);
    setPartidas(novasPartidas);
    setFase('grupos');
  };

  // Avançar da fase de grupos para as oitavas/quartas (playoffs)
  const lidarComAvancoEliminatorias = () => {
    const partidasDificuldade = gerarConfrontosIniciaisEliminatorias(grupos, partidas);
    setPartidas(prev => [...prev, ...partidasDificuldade]);
    setFase('fases_eliminares');
  };

  // Reiniciar tudo de volta para a configuração
  const lidarComReinclusaoOuReset = () => {
    if (window.confirm('Tem certeza de que deseja apagar a copa atual e iniciar uma nova do zero?')) {
      setFase('config');
      setGrupos([]);
      setPartidas([]);
      localStorage.removeItem('copa_fase');
      localStorage.removeItem('copa_grupos');
      localStorage.removeItem('copa_partidas');
    }
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* Barra de Navegação / Header Superior */}
      <header id="app-main-header" className="h-20 bg-slate-900 text-white flex items-center border-b border-slate-700 shadow-lg shrink-0 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-amber-500 rounded-sm rotate-45 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Trophy className="-rotate-45 w-4.5 h-4.5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight uppercase text-white leading-none">Arena de Competição</h1>
              <span className="text-[10px] font-bold text-amber-400 tracking-widest font-mono">CHAVEAMENTO GEOMÉTRICO</span>
            </div>
          </div>

          {/* Abas Superiores de Chaveamento - Geometric Navigation */}
          <div className="hidden md:flex gap-6 text-xs sm:text-xs font-bold tracking-widest font-display shrink-0 items-center">
            <span className={`pb-1 transition-all duration-300 ${fase === 'config' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 opacity-50'}`}>CONFIGURAÇÃO</span>
            <span className={`pb-1 transition-all duration-300 ${fase === 'grupos' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 opacity-50'}`}>FASE DE GRUPOS</span>
            <span className={`pb-1 transition-all duration-300 ${fase === 'fases_eliminares' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 opacity-50'}`}>MATA-MATA</span>
          </div>

          {/* Indicador de Status do Torneio */}
          <div className="flex items-center gap-4 text-right shrink-0">
            <div>
              <p className="text-[10px] uppercase font-mono opacity-50 text-slate-300">Status do Torneio</p>
              <p className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                {fase === 'config' && 'AGUARDANDO INÍCIO'}
                {fase === 'grupos' && 'JOGOS EM ANDAMENTO'}
                {fase === 'fases_eliminares' && 'EM CLÍMAX'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal de Acordo com a Fase */}
      <main id="app-main-content" className="flex-1 py-8">
        {fase === 'config' && (
          <ParticipanteConfigView
            participantes={participantes}
            setParticipantes={setParticipantes}
            aoIniciarCopa={lidarComInicioCopa}
          />
        )}

        {fase === 'grupos' && (
          <CopaGruposView
            grupos={grupos}
            partidas={partidas}
            participantes={participantes}
            setPartidas={setPartidas}
            aoAvancarParaEliminatorias={lidarComAvancoEliminatorias}
            aoReiniciar={lidarComReinclusaoOuReset}
          />
        )}

        {fase === 'fases_eliminares' && (
          <BracketsPlayoffs
            partidas={partidas}
            participantes={participantes}
            setPartidas={setPartidas}
            aoRestart={lidarComReinclusaoOuReset}
          />
        )}
      </main>

      {/* Rodapé Humilde (Sem referências de IA como instruído) */}
      <footer id="app-main-footer" className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium">Copa Personalizada — Monte torneios e jogue com amigos de forma local.</p>
          <span className="text-[10px] mt-1 block">Todos os direitos reservados à sua diversão.</span>
        </div>
      </footer>
    </div>
  );
}
