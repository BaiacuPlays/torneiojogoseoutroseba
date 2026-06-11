/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, Medal, RotateCcw, FastForward, Check, Sparkles } from 'lucide-react';
import { Partida, Participante, SiglaFase } from '../types';
import { recriarOuAtualizarMataMata } from '../utils';
import CartaoParticipante from './CartaoParticipante';

interface BracketsPlayoffsProps {
  partidas: Partida[];
  participantes: Participante[];
  setPartidas: React.Dispatch<React.SetStateAction<Partida[]>>;
  aoRestart: () => void;
}

const FAZES_ORDEM: { id: SiglaFase; nome: string }[] = [
  { id: 'oitavas', nome: 'Oitavas de Final' },
  { id: 'quartas', nome: 'Quartas de Final' },
  { id: 'semifinal', nome: 'Semifinais' },
  { id: 'terceiro_lugar', nome: 'Decisão do 3º Lugar' },
  { id: 'final', nome: 'Grande Final' }
];

export default function BracketsPlayoffs({
  partidas,
  participantes,
  setPartidas,
  aoRestart
}: BracketsPlayoffsProps) {
  const [faseAtivaMobile, setFaseAtivaMobile] = useState<string>('AUTO');
  const [animandoPartidaId, setAnimandoPartidaId] = useState<string | null>(null);

  // Mapeamento participante
  const getParticipante = (id: string | null): Participante | null => {
    if (!id) return null;
    return participantes.find(p => p.id === id) || null;
  };

  // Coleta as fases que realmente têm partidas neste mata-mata
  const partidasMataMata = partidas.filter(p => p.fase !== 'grupos');
  
  const fasesExistentes = FAZES_ORDEM.filter(f => 
    partidasMataMata.some(p => p.fase === f.id)
  );

  // Determina qual a fase ativa ideal para o mobile
  const getFaseAtivaPadraoMobile = () => {
    if (faseAtivaMobile !== 'AUTO') return faseAtivaMobile;

    // Encontra a primeira fase que ainda tem partidas pendentes
    for (const f of fasesExistentes) {
      const partidasFase = partidasMataMata.filter(p => p.fase === f.id);
      if (partidasFase.some(p => !p.concluida)) {
        return f.id;
      }
    }
    return 'final'; // Todas resolvidas ou fallback
  };

  const faseLidaMobile = getFaseAtivaPadraoMobile();

  // Atualizar placar de mata-mata
  const atualizarPlacarEliminatoria = (
    partidaId: string,
    gM: number | null,
    gV: number | null,
    penM?: number | null,
    penV?: number | null,
    vencedorForcadoId?: string | null
  ) => {
    setPartidas(prev => {
      // 1. Atualizar a partida em si
      const partidasAtualizadas = prev.map(p => {
        if (p.id !== partidaId) return p;

        let vencedorId = vencedorForcadoId;

        // Se não foi forçado, descobre matematicamente
        if (!vencedorId && gM !== null && gV !== null) {
          if (gM > gV) {
            vencedorId = p.mandanteId;
          } else if (gV > gM) {
            vencedorId = p.visitanteId;
          } else {
            // Empate em mata-mata exige pênaltis
            if (penM !== undefined && penV !== undefined && penM !== null && penV !== null) {
              if (penM > penV) vencedorId = p.mandanteId;
              if (penV > penM) vencedorId = p.visitanteId;
            }
          }
        }

        const concluida = vencedorId !== null && vencedorId !== undefined;

        return {
          ...p,
          golsMandante: gM,
          golsVisitante: gV,
          penaltisMandante: penM ?? null,
          penaltisVisitante: penV ?? null,
          vencedorId: vencedorId ?? null,
          concluida
        };
      });

      // 2. Transmitir o avanço para as próximas fases!
      // Encontra a fase que acabamos de alterar
      const partidaEditada = prev.find(p => p.id === partidaId);
      if (!partidaEditada) return prev;

      return recriarOuAtualizarMataMata(partidasAtualizadas, partidaEditada.fase);
    });
  };

  // Simular confrontos por sorteio
  const simularMataMataAleatorio = (partidaId: string) => {
    const partida = partidasMataMata.find(p => p.id === partidaId);
    if (!partida || !partida.mandanteId || !partida.visitanteId) return;

    setAnimandoPartidaId(partidaId);

    setTimeout(() => {
      // Sorteia gols normais
      const gM = Math.floor(Math.random() * 4);
      const gV = Math.floor(Math.random() * 4);

      if (gM !== gV) {
        atualizarPlacarEliminatoria(partidaId, gM, gV, null, null);
      } else {
        // Empate -> Simula pênaltis
        let penM = 0;
        let penV = 0;
        while (penM === penV) {
          penM = 5 + Math.floor(Math.random() * 5);
          penV = 5 + Math.floor(Math.random() * 5);
        }
        atualizarPlacarEliminatoria(partidaId, gM, gV, penM, penV);
      }
      setAnimandoPartidaId(null);
    }, 450);
  };

  // Forçar vencedor clicando no participante diretamente (ótimo para decisão imediata)
  const definirVencedorImediato = (partidaId: string, vencedorOpcao: 'mandante' | 'visitante') => {
    const partida = partidasMataMata.find(p => p.id === partidaId);
    if (!partida) return;

    const vencId = vencedorOpcao === 'mandante' ? partida.mandanteId : partida.visitanteId;
    if (vencId === partida.mandanteId) {
      atualizarPlacarEliminatoria(partidaId, 2, 1, null, null, vencId);
    } else {
      atualizarPlacarEliminatoria(partidaId, 1, 2, null, null, vencId);
    }
  };

  // Incrementar/Decrementar Gols no Mata-mata
  const alterarGolsMataMata = (partidaId: string, lado: 'mandante' | 'visitante', num: number) => {
    const partida = partidasMataMata.find(p => p.id === partidaId);
    if (!partida) return;

    let gM = partida.golsMandante ?? 0;
    let gV = partida.golsVisitante ?? 0;

    if (lado === 'mandante') {
      gM = Math.max(0, gM + num);
    } else {
      gV = Math.max(0, gV + num);
    }

    // Se mudou gols e continuou empatado ou era empatado, reseta pênaltis se não combinarem mais
    let penM = partida.penaltisMandante;
    let penV = partida.penaltisVisitante;

    if (gM !== gV) {
      penM = null;
      penV = null;
    } else {
      // Se empatou de novo e antes não tinha pênaltis salvos, pode inicializar
      if (penM === null || penV === null) {
        penM = 5;
        penV = 4;
      }
    }

    atualizarPlacarEliminatoria(partidaId, gM, gV, penM, penV);
  };

  // Alterar penaltis individualmente
  const alterarPenaltis = (partidaId: string, lado: 'mandante' | 'visitante', num: number) => {
    const partida = partidasMataMata.find(p => p.id === partidaId);
    if (!partida) return;

    let penM = partida.penaltisMandante ?? 5;
    let penV = partida.penaltisVisitante ?? 4;

    if (lado === 'mandante') {
      penM = Math.max(0, penM + num);
    } else {
      penV = Math.max(0, penV + num);
    }

    // Evita pênaltis empatados
    if (penM === penV) {
      if (lado === 'mandante') penM += 1;
      else penV += 1;
    }

    atualizarPlacarEliminatoria(partidaId, partida.golsMandante, partida.golsVisitante, penM, penV);
  };

  // Simular todo o mata-mata restante automaticamente (até o fim!)
  const simularMataMataAteOFim = () => {
    let partidasMod = [...partidas];

    const fasesChave = ['oitavas', 'quartas', 'semifinal', 'terceiro_lugar', 'final'] as const;

    fasesChave.forEach(fase => {
      // Roda a re-atualização interna iterativa
      partidasMod = partidasMod.map(p => {
        if (p.fase !== fase || p.concluida) return p;
        if (!p.mandanteId || !p.visitanteId) return p;

        const gM = Math.floor(Math.random() * 4);
        const gV = Math.floor(Math.random() * 4);

        let vencedorId = '';
        let penM = null;
        let penV = null;

        if (gM > gV) {
          vencedorId = p.mandanteId;
        } else if (gV > gM) {
          vencedorId = p.visitanteId;
        } else {
          // empate -> resolvido nos pênaltis
          const pM = 5 + Math.floor(Math.random() * 3);
          const pV = pM === 5 ? 3 + Math.floor(Math.random() * 2) : 5 + Math.ceil(Math.random() * 2);
          penM = pM;
          penV = pV;
          vencedorId = pM > pV ? p.mandanteId : p.visitanteId;
        }

        return {
          ...p,
          golsMandante: gM,
          golsVisitante: gV,
          penaltisMandante: penM,
          penaltisVisitante: penV,
          vencedorId,
          concluida: true
        };
      });

      // Aplica lógica de propagação do vencedor para alimentar a próxima fase
      partidasMod = recriarOuAktualizarMataMataGeral(partidasMod, fase);
    });

    setPartidas(partidasMod);
  };

  // Helper local similar de utils, mas rodável puro dentro do loop síncrono
  const recriarOuAktualizarMataMataGeral = (partidasLista: Partida[], faseL: SiglaFase): Partida[] => {
    let novas = [...partidasLista];
    if (faseL === 'oitavas') {
      const oitavas = novas.filter(p => p.fase === 'oitavas');
      const quartas = novas.filter(p => p.fase === 'quartas');
      if (oitavas.length === 8 && quartas.length === 0 && oitavas.every(o => o.concluida)) {
        novas.push({ id: 'm-q1', fase: 'quartas', mandanteId: oitavas[0].vencedorId, visitanteId: oitavas[1].vencedorId, golsMandante: null, golsVisitante: null, vencedorId: null, concluida: false, descricaoOrigemMandante: 'Vencedor Oitavas 1', descricaoOrigemVisitante: 'Vencedor Oitavas 2' });
        novas.push({ id: 'm-q2', fase: 'quartas', mandanteId: oitavas[2].vencedorId, visitanteId: oitavas[3].vencedorId, golsMandante: null, golsVisitante: null, vencedorId: null, concluida: false, descricaoOrigemMandante: 'Vencedor Oitavas 3', descricaoOrigemVisitante: 'Vencedor Oitavas 4' });
        novas.push({ id: 'm-q3', fase: 'quartas', mandanteId: oitavas[4].vencedorId, visitanteId: oitavas[5].vencedorId, golsMandante: null, golsVisitante: null, vencedorId: null, concluida: false, descricaoOrigemMandante: 'Vencedor Oitavas 5', descricaoOrigemVisitante: 'Vencedor Oitavas 6' });
        novas.push({ id: 'm-q4', fase: 'quartas', mandanteId: oitavas[6].vencedorId, visitanteId: oitavas[7].vencedorId, golsMandante: null, golsVisitante: null, vencedorId: null, concluida: false, descricaoOrigemMandante: 'Vencedor Oitavas 7', descricaoOrigemVisitante: 'Vencedor Oitavas 8' });
      } else {
        const q = novas.filter(p => p.fase === 'quartas');
        if (q.length === 4 && oitavas.length === 8) {
          q[0].mandanteId = oitavas[0].vencedorId; q[0].visitanteId = oitavas[1].vencedorId;
          q[1].mandanteId = oitavas[2].vencedorId; q[1].visitanteId = oitavas[3].vencedorId;
          q[2].mandanteId = oitavas[4].vencedorId; q[2].visitanteId = oitavas[5].vencedorId;
          q[3].mandanteId = oitavas[6].vencedorId; q[3].visitanteId = oitavas[7].vencedorId;
        }
      }
    }

    const qts = novas.filter(p => p.fase === 'quartas');
    const sms = novas.filter(p => p.fase === 'semifinal');
    if (qts.length === 4 && qts.every(q => q.concluida)) {
      if (sms.length === 0) {
        novas.push({ id: 'm-s1', fase: 'semifinal', mandanteId: qts[0].vencedorId, visitanteId: qts[1].vencedorId, golsMandante: null, golsVisitante: null, vencedorId: null, concluida: false, descricaoOrigemMandante: 'Vencedor Quartas 1', descricaoOrigemVisitante: 'Vencedor Quartas 2' });
        novas.push({ id: 'm-s2', fase: 'semifinal', mandanteId: qts[2].vencedorId, visitanteId: qts[3].vencedorId, golsMandante: null, golsVisitante: null, vencedorId: null, concluida: false, descricaoOrigemMandante: 'Vencedor Quartas 3', descricaoOrigemVisitante: 'Vencedor Quartas 4' });
      } else if (sms.length === 2) {
        sms[0].mandanteId = qts[0].vencedorId; sms[0].visitanteId = qts[1].vencedorId;
        sms[1].mandanteId = qts[2].vencedorId; sms[1].visitanteId = qts[3].vencedorId;
      }
    }

    const semis = novas.filter(p => p.fase === 'semifinal');
    const finE3 = novas.filter(p => p.fase === 'final' || p.fase === 'terceiro_lugar');
    if (semis.length === 2 && semis.every(s => s.concluida)) {
      const pS1 = semis[0].mandanteId === semis[0].vencedorId ? semis[0].visitanteId : semis[0].mandanteId;
      const pS2 = semis[1].mandanteId === semis[1].vencedorId ? semis[1].visitanteId : semis[1].mandanteId;

      if (finE3.length === 0) {
        novas.push({ id: 'm-t3', fase: 'terceiro_lugar', mandanteId: pS1, visitanteId: pS2, golsMandante: null, golsVisitante: null, vencedorId: null, concluida: false, descricaoOrigemMandante: 'Perdedor Semis 1', descricaoOrigemVisitante: 'Perdedor Semis 2' });
        novas.push({ id: 'm-f1', fase: 'final', mandanteId: semis[0].vencedorId, visitanteId: semis[1].vencedorId, golsMandante: null, golsVisitante: null, vencedorId: null, concluida: false, descricaoOrigemMandante: 'Vencedor Semis 1', descricaoOrigemVisitante: 'Vencedor Semis 2' });
      } else {
        const t = novas.find(p => p.fase === 'terceiro_lugar'); if (t) { t.mandanteId = pS1; t.visitanteId = pS2; }
        const f = novas.find(p => p.fase === 'final'); if (f) { f.mandanteId = semis[0].vencedorId; f.visitanteId = semis[1].vencedorId; }
      }
    }

    return novas;
  };

  const finalConcluidaObj = partidasMataMata.find(p => p.fase === 'final' && p.concluida);
  const disputaBronzeConcluidaObj = partidasMataMata.find(p => p.fase === 'terceiro_lugar' && p.concluida);

  // Renderizador do card de cada partida singular do mata-mata
  const renderizarCardPartidaMataMata = (partida: Partida) => {
    const mandante = getParticipante(partida.mandanteId);
    const visitante = getParticipante(partida.visitanteId);
    const isAnimando = animandoPartidaId === partida.id;

    // Se houver empate, precisa de exibir pênaltis para que o usuário resolva
    const empateExigePenaltis = partida.golsMandante !== null && partida.golsVisitante !== null && partida.golsMandante === partida.golsVisitante;

    return (
      <div
        key={partida.id}
        id={`eliminatoria-card-${partida.id}`}
        className={`bg-slate-900 rounded-xl border p-4 shadow-xl relative space-y-3 transition-all ${
          partida.concluida ? 'border-slate-800 bg-slate-950/40 opacity-90' : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider font-display border-b border-slate-850 pb-2">
          <span>{partida.descricaoOrigemMandante && partida.descricaoOrigemVisitante ? `${partida.descricaoOrigemMandante} vs ${partida.descricaoOrigemVisitante}` : 'Mata-mata'}</span>
          {partida && partida.concluida && (
            <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase font-mono tracking-wider flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> FIM
            </span>
          )}
        </div>

        {/* Mandante Row */}
        <div id={`mandante-row-${partida.id}`} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <CartaoParticipante participante={mandante} tamanho="sm" mostrarNome={false} />
            <span className={`text-xs md:text-sm truncate font-display ${partida.concluida && partida.vencedorId !== partida.mandanteId ? 'text-slate-400/50 line-through font-normal' : 'font-bold text-slate-200'}`}>
              {mandante ? mandante.nome : partida.descricaoOrigemMandante || 'A definir...'}
            </span>
          </div>

          {/* Placar Mandante */}
          {partida.mandanteId && partida.visitanteId && (
            <div className="flex items-center gap-1 shrink-0">
              {/* Controles de Gols se estiver ativo */}
              <button
                id={`btn-mata-md-dec-${partida.id}`}
                onClick={() => alterarGolsMataMata(partida.id, 'mandante', -1)}
                className="w-4 h-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-sm flex items-center justify-center text-[10px] border border-slate-750 cursor-pointer"
              >
                -
              </button>
              <span className="font-mono font-black text-xs bg-slate-950 px-2 py-0.5 rounded-sm text-white border border-slate-800 min-w-[24px] text-center shadow-inner">
                {partida.golsMandante ?? 0}
              </span>
              <button
                id={`btn-mata-md-inc-${partida.id}`}
                onClick={() => alterarGolsMataMata(partida.id, 'mandante', 1)}
                className="w-4 h-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-sm flex items-center justify-center text-[10px] border border-slate-750 cursor-pointer"
              >
                +
              </button>

              {/* Pênalti Mandante */}
              {empateExigePenaltis && (
                <div className="flex items-center gap-0.5 ml-2 border-l border-slate-800 pl-2">
                  <span className="text-[9px] text-slate-400 font-bold mr-1 font-display tracking-widest uppercase">PÊN</span>
                  <button
                    id={`btn-mata-pen-md-dec-${partida.id}`}
                    onClick={() => alterarPenaltis(partida.id, 'mandante', -1)}
                    className="w-4 h-4 bg-amber-500/20 text-amber-400 font-semibold rounded-sm flex items-center justify-center text-[9px] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-xs bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-sm min-w-[16px] text-center font-black">
                    {partida.penaltisMandante ?? 5}
                  </span>
                  <button
                    id={`btn-mata-pen-md-inc-${partida.id}`}
                    onClick={() => alterarPenaltis(partida.id, 'mandante', 1)}
                    className="w-4 h-4 bg-amber-500/20 text-amber-400 font-semibold rounded-sm flex items-center justify-center text-[9px] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visitante Row */}
        <div id={`visitante-row-${partida.id}`} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <CartaoParticipante participante={visitante} tamanho="sm" mostrarNome={false} />
            <span className={`text-xs md:text-sm truncate font-display ${partida.concluida && partida.vencedorId !== partida.visitanteId ? 'text-slate-400/50 line-through font-normal' : 'font-bold text-slate-200'}`}>
              {visitante ? visitante.nome : partida.descricaoOrigemVisitante || 'A definir...'}
            </span>
          </div>

          {/* Placar Visitante */}
          {partida.mandanteId && partida.visitanteId && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                id={`btn-mata-vs-dec-${partida.id}`}
                onClick={() => alterarGolsMataMata(partida.id, 'visitante', -1)}
                className="w-4 h-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-sm flex items-center justify-center text-[10px] border border-slate-750 cursor-pointer"
              >
                -
              </button>
              <span className="font-mono font-black text-xs bg-slate-950 px-2 py-0.5 rounded-sm text-white border border-slate-800 min-w-[24px] text-center shadow-inner">
                {partida.golsVisitante ?? 0}
              </span>
              <button
                id={`btn-mata-vs-inc-${partida.id}`}
                onClick={() => alterarGolsMataMata(partida.id, 'visitante', 1)}
                className="w-4 h-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-sm flex items-center justify-center text-[10px] border border-slate-750 cursor-pointer"
              >
                +
              </button>

              {/* Pênalti Visitante */}
              {empateExigePenaltis && (
                <div className="flex items-center gap-0.5 ml-2 border-l border-slate-800 pl-2">
                  <span className="text-[9px] text-slate-400 font-bold mr-1 font-display tracking-widest uppercase">PÊN</span>
                  <button
                    id={`btn-mata-pen-vs-dec-${partida.id}`}
                    onClick={() => alterarPenaltis(partida.id, 'visitante', -1)}
                    className="w-4 h-4 bg-amber-500/20 text-amber-400 font-semibold rounded-sm flex items-center justify-center text-[9px] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-xs bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-sm min-w-[16px] text-center font-black">
                    {partida.penaltisVisitante ?? 4}
                  </span>
                  <button
                    id={`btn-mata-pen-vs-inc-${partida.id}`}
                    onClick={() => alterarPenaltis(partida.id, 'visitante', 1)}
                    className="w-4 h-4 bg-amber-500/20 text-amber-400 font-semibold rounded-sm flex items-center justify-center text-[9px] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Escolha rápida de vencedor por clique direto se o confrontation estiver configurado */}
        {partida.mandanteId && partida.visitanteId && !partida.vencedorId && (
          <div className="grid grid-cols-3 gap-1 pt-2.5 border-t border-slate-850">
            <button
              id={`btn-vit-rap-${partida.mandanteId}-${partida.id}`}
              onClick={() => definirVencedorImediato(partida.id, 'mandante')}
              className="text-[9px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded-sm transition overflow-hidden text-ellipsis whitespace-nowrap px-1 border border-slate-750 cursor-pointer"
              title={`Avança ${mandante?.nome}`}
            >
              Vence {mandante?.nome?.split(' ')?.[0]}
            </button>
            <button
              id={`btn-vit-rap-${partida.visitanteId}-${partida.id}`}
              onClick={() => definirVencedorImediato(partida.id, 'visitante')}
              className="text-[9px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded-sm transition overflow-hidden text-ellipsis whitespace-nowrap px-1 border border-slate-750 cursor-pointer"
              title={`Avança ${visitante?.nome}`}
            >
              Vence {visitante?.nome?.split(' ')?.[0]}
            </button>
            <button
              id={`btn-sim-indiv-${partida.id}`}
              onClick={() => simularMataMataAleatorio(partida.id)}
              className="text-[9px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 py-1.5 rounded-sm transition flex items-center justify-center gap-0.5 shadow-sm font-display uppercase tracking-wider cursor-pointer font-black"
            >
              Sortear
            </button>
          </div>
        )}

        {/* Informações Auxiliares (como quem o vencedor enfrentará) */}
        {partida.mandanteId && partida.visitanteId && partida.vencedorId && (
          <div className="pt-2 text-[9px] font-bold text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20 flex items-center justify-between font-display uppercase tracking-wider">
            <span>AVANÇOU: <strong className="font-extrabold text-amber-200">{getParticipante(partida.vencedorId)?.nome}</strong></span>
            <button
              id={`btn-refazer-elimin-card-${partida.id}`}
              onClick={() => atualizarPlacarEliminatoria(partida.id, null, null, null, null, null)}
              className="text-slate-300 hover:text-red-400 transition-colors cursor-pointer uppercase font-mono border-b border-dashed border-slate-700 hover:border-red-400/50"
            >
              Refazer
            </button>
          </div>
        )}
      </div>
    );
  };

  // Coleta dados dos vencedores do pódio caso a final termine
  const getPodio = () => {
    if (!finalConcluidaObj) return null;

    const campeao = getParticipante(finalConcluidaObj.vencedorId);
    const vice = getParticipante(finalConcluidaObj.vencedorId === finalConcluidaObj.mandanteId ? finalConcluidaObj.visitanteId : finalConcluidaObj.mandanteId);
    
    // Calcula o bronze
    let bronze = null;
    if (disputaBronzeConcluidaObj) {
      bronze = getParticipante(disputaBronzeConcluidaObj.vencedorId);
    }

    return { campeao, vice, bronze };
  };

  const podio = getPodio();

  return (
    <div id="brackets-playoffs-container" className="space-y-8 max-w-7xl mx-auto px-4 pb-16">
      
      {/* Painel de Controle Superior */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold tracking-tight text-white font-display flex items-center justify-center md:justify-start gap-1.5 uppercase">
            <span>🏆 Mata-Mata da Copa</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Partidas eliminatórias diretas. Em caso de empate nos gols regulamentares, a disputa será resolvida na marca do pênalti!
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0 justify-center w-full md:w-auto">
          {!finalConcluidaObj && (
            <button
              id="btn-simular-todo-mata-mata"
              onClick={simularMataMataAteOFim}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded border border-amber-600/10 flex items-center gap-1 cursor-pointer transition uppercase tracking-wider font-display font-black shadow-md shadow-amber-500/10"
            >
              <FastForward className="w-3.5 h-3.5 text-slate-950" />
              Simular Todo o Mata-Mata
            </button>
          )}
          
          <button
            id="btn-reiniciar-mata-mata-view"
            onClick={aoRestart}
            className="text-slate-300 bg-slate-800 hover:bg-slate-755 hover:bg-slate-700 border border-slate-750 border-slate-700 font-bold text-xs px-4 py-2.5 rounded cursor-pointer transition uppercase tracking-wider font-display font-black"
          >
            Novo Torneio
          </button>
        </div>
      </div>

      {/* Tabs Simplificadoras no Mobile */}
      {fasesExistentes.length > 1 && (
        <div className="flex sm:hidden overflow-x-auto gap-1 pb-1 scrollbar-none">
          {fasesExistentes.map(f => {
            const ativa = faseLidaMobile === f.id;
            return (
              <button
                key={f.id}
                id={`btn-tab-mobile-playoff-${f.id}`}
                onClick={() => setFaseAtivaMobile(f.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-sm border whitespace-nowrap tracking-wider font-display uppercase transition cursor-pointer ${
                  ativa ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-md shadow-amber-500/10' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f.nome.split(' ')?.[0] || f.nome}
              </button>
            );
          })}
        </div>
      )}

      {/* Exibição do Pódio / Coroação Final */}
      {podio && (
        <div id="coronation-stage" className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-3xl p-6 md:p-10 border border-zinc-800 text-center shadow-2xl space-y-8 relative overflow-hidden">
          {/* Confetti decorativo simples de css */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
          
          <div className="space-y-3 relative z-10">
            <span className="text-[10px] sm:text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
              🎉 TORNEIO CONCLUÍDO COM SUCESSO! 🎉
            </span>
            <h3 className="text-3xl font-black uppercase tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
              Temos um Campeão!
            </h3>
          </div>

          {/* Estrutura Visual do Pódio 3D Simples */}
          <div id="visual-podium-3d" className="flex items-end justify-center gap-2 sm:gap-6 pt-16 max-w-2xl mx-auto min-h-[280px]">
            
            {/* Vice-Campeão (2º Lugar) */}
            <div className="flex flex-col items-center w-24 sm:w-32">
              <div className="relative mb-2">
                <CartaoParticipante participante={podio.vice} mostrarNome={false} tamanho="lg" />
                <div className="absolute -top-3 -right-2 bg-slate-300 text-slate-800 font-extrabold w-6 h-6 rounded-full flex items-center justify-center text-xs shadow border border-white">
                  2
                </div>
              </div>
              <span className="text-xs font-bold truncate max-w-full text-zinc-300 mb-1">{podio.vice?.nome}</span>
              <div className="w-full bg-gradient-to-b from-stone-400 to-stone-600 h-20 rounded-t-xl flex flex-col items-center justify-center shadow-inner pt-2 border border-stone-500/20">
                <Medal className="w-6 h-6 text-slate-200" />
                <span className="text-[10px] font-extrabold text-stone-200 tracking-wider">PRATA</span>
              </div>
            </div>

            {/* Campeão (1º Lugar) */}
            <div className="flex flex-col items-center w-28 sm:w-36 -translate-y-4">
              <div className="relative mb-3.5">
                <CartaoParticipante participante={podio.campeao} mostrarNome={false} tamanho="xl" />
                <div className="absolute -top-4 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-black w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg border-2 border-white animate-bounce">
                  1
                </div>
              </div>
              <span className="text-sm font-black truncate max-w-full text-amber-300 mb-1 leading-none">{podio.campeao?.nome}</span>
              <div className="w-full bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 h-28 rounded-t-2xl flex flex-col items-center justify-center shadow-lg relative border border-amber-400/40">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <Trophy className="w-9 h-9 text-slate-900 drop-shadow animate-pulse" />
                <span className="text-[11px] font-black text-slate-950 tracking-widest mt-1">CAMPEÃO</span>
              </div>
            </div>

            {/* Terceiro Lugar (3º Bronze) */}
            {podio.bronze && (
              <div className="flex flex-col items-center w-24 sm:w-32">
                <div className="relative mb-2">
                  <CartaoParticipante participante={podio.bronze} mostrarNome={false} tamanho="lg" />
                  <div className="absolute -top-3 -right-2 bg-amber-700 text-amber-100 font-extrabold w-6 h-6 rounded-full flex items-center justify-center text-xs shadow border border-white">
                    3
                  </div>
                </div>
                <span className="text-xs font-bold truncate max-w-full text-zinc-300 mb-1">{podio.bronze?.nome}</span>
                <div className="w-full bg-gradient-to-b from-amber-700 to-amber-900 h-14 rounded-t-xl flex flex-col items-center justify-center shadow-inner pt-1 border border-amber-800/20">
                  <Medal className="w-5 h-5 text-amber-300" />
                  <span className="text-[10px] font-extrabold text-amber-200 tracking-wider">BRONZE</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-6 border-t border-zinc-800/60 max-w-md mx-auto">
            <p className="text-zinc-400 text-xs">
              E assim termina essa espetacular disputa! Quem será que levará no próximo campeonato?
            </p>
            <button
              id="btn-jogar-novamente"
              onClick={aoRestart}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold px-8 py-3 rounded-full shadow-lg transition duration-200 scale-100 hover:scale-105 cursor-pointer block w-full text-center"
            >
              🔄 Criar Nova Copa do Mundo
            </button>
          </div>
        </div>
      )}

      {/* Visual das Chaves (Playoff Bracket) */}
      <div id="visual-bracket-viewport" className="overflow-x-auto pb-6 select-none bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
        
        {/* Layout Flex para Lado-a-lado no Desktop, Ocultando colunas inativas no mobile */}
        <div className="flex gap-4 md:gap-8 justify-around min-w-[620px]">
          
          {fasesExistentes.map(faseInfo => {
            const partidasDaFase = partidasMataMata.filter(p => p.fase === faseInfo.id);
            const isFaseAtivaMobileLocal = faseLidaMobile === faseInfo.id;

            return (
              <div
                key={faseInfo.id}
                id={`coluna-fase-${faseInfo.id}`}
                className={`flex-1 flex flex-col justify-around gap-4 min-w-[200px] transition-all duration-300
                  ${isFaseAtivaMobileLocal ? 'block' : 'hidden sm:flex'}
                `}
              >
                {/* Cabeçalho de Rondada */}
                <div className="text-center pb-2 border-b border-slate-800 mb-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-200">
                    {faseInfo.nome}
                  </h4>
                  <span className="text-[9px] font-bold text-zinc-400">
                    {partidasDaFase.filter(p => p.concluida).length} de {partidasDaFase.length} concluídos
                  </span>
                </div>

                {/* Lista de Partidas Empilhadas */}
                <div className="space-y-4 md:space-y-8 flex-1 flex flex-col justify-around">
                  {partidasDaFase.map(partida => renderizarCardPartidaMataMata(partida))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
