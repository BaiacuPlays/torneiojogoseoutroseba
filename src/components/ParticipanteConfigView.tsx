/*
 * Copyright 2026 Google LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Plus, Trash, Shuffle, FileImage, Sparkles, Trophy, RotateCcw, Upload, HelpCircle } from 'lucide-react';
import { Participante } from '../types';
import { TEMAS, gerarListaParticipantes, shuffleArray } from '../utils';
import CartaoParticipante from './CartaoParticipante';

interface ParticipanteConfigViewProps {
  participantes: Participante[];
  setParticipantes: React.Dispatch<React.SetStateAction<Participante[]>>;
  aoIniciarCopa: (participantesProntos: Participante[]) => void;
}

const OPCOES_TAMANHO = [
  { valor: 4, label: '4 Jogadores', desc: '1 Grupo de 4 (Mata-mata começa na grande Final!)' },
  { valor: 8, label: '8 Jogadores', desc: '2 Grupos de 4 (Mata-mata começa na Semifinal!)' },
  { valor: 16, label: '16 Jogadores', desc: '4 Grupos de 4 (Mata-mata começa nas Quartas de Final!)' },
  { valor: 32, label: '32 Jogadores', desc: '8 Grupos de 4 (Copa Oficial - Começa nas Oitavas de Final!)' },
  { valor: 64, label: '64 Jogadores', desc: '16 Grupos de 4 (Copa de Elite - As 16 melhores campanhas de grupo avançam!)' },
  { valor: 100, label: '100 Jogadores', desc: '25 Grupos de 4 (Copa Centenária - As 16 melhores campanhas de grupo avançam!)' },
  { valor: 128, label: '128 Jogadores', desc: '32 Grupos de 4 (Copa Suprema - As 16 melhores campanhas de grupo avançam!)' }
];

export default function ParticipanteConfigView({
  participantes,
  setParticipantes,
  aoIniciarCopa
}: ParticipanteConfigViewProps) {
  const [tamanhoComp, setTamanhoComp] = useState<number>(16);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [linhaNomesMassa, setLinhaNomesMassa] = useState<string>('');
  
  // Sincroniza participantes com o tamanho escolhido
  useEffect(() => {
    if (participantes.length === 0) {
      // Inicializa com tema de países por padrão
      const listaOriginal = gerarListaParticipantes('paises', tamanhoComp);
      setParticipantes(listaOriginal);
    } else if (participantes.length !== tamanhoComp) {
      if (participantes.length < tamanhoComp) {
        // Acrescenta itens usando o tema países por padrão
        const adicionaisNecessarios = tamanhoComp - participantes.length;
        const listaExtra = gerarListaParticipantes('paises', adicionaisNecessarios);
        
        // Evita colisões de ids e nomes
        const listaSincronizada = [...participantes];
        listaExtra.forEach((item, index) => {
          const numSeq = participantes.length + index + 1;
          item.nome = `Competidor ${numSeq}`;
          listaSincronizada.push(item);
        });
        
        setParticipantes(listaSincronizada);
      } else {
        // Reduz mantendo os primeiros
        setParticipantes(participantes.slice(0, tamanhoComp));
      }
    }
  }, [tamanhoComp]);

  // Função para colar nomes em lote
  const importarNomesMassa = () => {
    const nomesFiltrados = linhaNomesMassa
      .split(/[\n,;]+/)
      .map(n => n.trim())
      .filter(n => n !== '');
    
    if (nomesFiltrados.length === 0) return;

    setParticipantes(prev => {
      return prev.map((part, index) => {
        if (index < nomesFiltrados.length) {
          return { ...part, nome: nomesFiltrados[index] };
        }
        return part;
      });
    });

    // Limpa o textarea e avisa
    setLinhaNomesMassa('');
  };

  // Atualizar campo de nome
  const atualizarNome = (id: string, novoNome: string) => {
    setParticipantes(prev => prev.map(p => p.id === id ? { ...p, nome: novoNome } : p));
  };

  // Upload por botão
  const processarArquivoImagem = (id: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie apenas arquivos de imagem.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result;
        setParticipantes(prev => prev.map(p => p.id === id ? { ...p, imagem: base64 } : p));
      }
    };
    reader.readAsDataURL(file);
  };

  const lidarComSelecaoImagem = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      processarArquivoImagem(id, file);
    }
  };

  // Drag and drop handlers
  const lidarComDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const lidarComDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processarArquivoImagem(id, file);
    }
  };

  // Embaralhar
  const embaralharTudo = () => {
    setParticipantes(prev => shuffleArray([...prev]));
  };

  // Trocar por um emoji aleatório
  const aplicarEmojiAleatorio = (id: string) => {
    const emojisMap = ['🍕', '🍔', '🥟', '🍗', '🍬', '🥑', '🏆', '🥇', '⚽', '🎯', '🐱', '🐼', '🐺', '🦁', '🌟', '💥', '🍀', '💎', '🔥', '💧', '⚡', '🎮', '🚗', '🚀', '🎸', '🎨', '🍿', '🍣', '🤖', '💀', '🐊', '🍕'];
    const grads = [
      'from-red-400 to-red-650',
      'from-orange-400 to-amber-600',
      'from-amber-400 to-yellow-600',
      'from-green-400 to-emerald-600',
      'from-teal-400 to-cyan-600',
      'from-blue-400 to-indigo-600',
      'from-purple-400 to-fuchsia-600',
      'from-pink-400 to-rose-600',
      'from-zinc-400 to-neutral-700'
    ];
    const itemEmoji = emojisMap[Math.floor(Math.random() * emojisMap.length)];
    const itemGrad = grads[Math.floor(Math.random() * grads.length)];
    
    setParticipantes(prev => prev.map(p => p.id === id ? { ...p, imagem: `emoji:${itemEmoji}:${itemGrad}` } : p));
  };

  // Verifica se todos estão com nomes preenchidos
  const todosNomesPreenchidos = participantes.every(p => p.nome.trim() !== '');

  return (
    <div id="participante-config-container" className="space-y-8 max-w-5xl mx-auto px-4 pb-12 pt-6">
      {/* Opções de Tamanho do Torneio */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-display flex items-center gap-2">
          <span>1. DEFINIR QUANTIDADE DE COMPETIDORES</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OPCOES_TAMANHO.map(op => {
            const selecionado = tamanhoComp === op.valor;
            return (
              <button
                key={op.valor}
                id={`btn-tamanho-${op.valor}`}
                onClick={() => {
                  setTamanhoComp(op.valor);
                  setEditandoId(null);
                }}
                className={`text-left p-4 rounded border transition-all duration-205 cursor-pointer flex flex-col justify-between h-28 ${
                  selecionado
                    ? 'border-amber-500 bg-amber-500/10 ring-4 ring-amber-500/10'
                    : 'border-slate-850 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-950 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-bold font-display text-sm ${selecionado ? 'text-amber-400' : 'text-slate-100'}`}>
                    {op.label}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      selecionado ? 'border-amber-500 bg-amber-500 text-slate-950' : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {selecionado && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-snug">{op.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preenchimento Rápido em Massa */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl space-y-4 text-left">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-display flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>2. IMPORTAR NOMES EM MASSA</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Coloque todos os nomes juntos (um por linha ou separados por vírgula) para distribuí-los instantaneamente entre os competidores!
          </p>
        </div>

        <div className="space-y-3">
          <textarea
            id="textarea-nomes-massa"
            rows={4}
            value={linhaNomesMassa}
            onChange={(e) => setLinhaNomesMassa(e.target.value)}
            placeholder="Cole sua lista de nomes aqui..."
            className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-3 text-xs md:text-sm font-sans placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-y"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-400 font-sans">
              Competidores detectados no lote: <strong className="text-amber-400 font-mono text-xs">{linhaNomesMassa.split(/[\n,;]+/).map(n => n.trim()).filter(n => n !== '').length}</strong>
            </span>
            <button
              id="btn-confirmar-nomes-massa"
              onClick={importarNomesMassa}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded uppercase transition-all tracking-wider font-display cursor-pointer shadow-md shadow-amber-500/10 active:scale-95 shrink-0"
            >
              Distribuir Nomes nos Times
            </button>
          </div>
        </div>
      </div>

      {/* Participantes Manual Edit */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-display">
              3. AJUSTAR COMPETIDORES ({participantes.length} NO TOTAL)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Personalize nomes individualmente ou mude as suas fotos de apresentação.
            </p>
          </div>
          <button
            id="btn-embaralhar"
            onClick={embaralharTudo}
            title="Sorteia a ordem inicial dos itens"
            className="flex items-center justify-center gap-1.5 text-xs text-slate-300 hover:text-amber-400 transition font-black bg-slate-950 px-4 py-2 rounded-sm border border-slate-800 cursor-pointer self-stretch sm:self-auto font-display"
          >
            <Shuffle className="w-3.5 h-3.5" />
            ORDENAR ALEATÓRIO
          </button>
        </div>

        {/* Grid de Itens */}
        <div id="participantes-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {participantes.map((p, index) => {
            const estaSendoEditado = editandoId === p.id;
            return (
              <div
                key={p.id}
                id={`competitor-card-wrapper-${p.id}`}
                className={`p-3.5 rounded-lg border transition-all duration-200 flex flex-col ${
                  estaSendoEditado
                    ? 'border-amber-500 bg-amber-500/5 shadow-lg'
                    : 'border-slate-850 hover:border-slate-700 bg-slate-950/40'
                }`}
              >
                {/* Visualização Simplificada */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden w-full">
                    <span className="text-xs font-mono text-slate-500 select-none shrink-0 w-5 font-bold">
                      {index + 1}
                    </span>
                    <button
                      id={`btn-editar-foto-${p.id}`}
                      onClick={() => setEditandoId(estaSendoEditado ? null : p.id)}
                      className="cursor-pointer shrink-0"
                      title="Mudar Imagem"
                    >
                      <CartaoParticipante participante={p} mostrarNome={false} tamanho="sm" />
                    </button>
                    <input
                      id={`input-nome-part-${p.id}`}
                      type="text"
                      value={p.nome}
                      onChange={(e) => atualizarNome(p.id, e.target.value)}
                      placeholder={`Competidor ${index + 1}`}
                      className="bg-transparent text-sm font-bold text-white border-b border-dashed border-slate-800 focus:border-amber-500 focus:outline-none w-full pb-0.5 font-sans text-ellipsis overflow-hidden"
                    />
                  </div>
                  
                  {/* Botões de Ação Rápida */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      id={`btn-expandir-editar-${p.id}`}
                      onClick={() => setEditandoId(estaSendoEditado ? null : p.id)}
                      className={`p-1.5 rounded transition cursor-pointer border ${
                        estaSendoEditado 
                          ? 'border-amber-500 bg-amber-500/20 text-amber-400' 
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-amber-400'
                      }`}
                      title="Customizar Imagem"
                    >
                      <FileImage className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-Form de Imagem Expandido */}
                {estaSendoEditado && (
                  <div id={`subform-editar-${p.id}`} className="mt-3 p-3 bg-slate-950 rounded-md border border-slate-850 space-y-3">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-display">
                      ALTERAR FOTO/IMAGEM:
                    </div>
                    
                    {/* Linha com Drag 'n Drop e Picker */}
                    <div
                      onDragOver={lidarComDragOver}
                      onDrop={(e) => lidarComDrop(e, p.id)}
                      className="border-2 border-dashed border-slate-800 hover:border-amber-550 hover:border-amber-500/50 rounded-lg p-3 text-center transition bg-slate-900/60 group relative cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Upload className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition" />
                        <span className="text-[10px] text-slate-400 font-sans">
                          Arraste para cá ou
                        </span>
                        <label className="text-[10px] font-bold text-amber-550 text-amber-400 cursor-pointer hover:underline">
                          Selecione um Arquivo
                          <input
                            id={`file-input-${p.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => lidarComSelecaoImagem(e, p.id)}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Botões de fallback */}
                    <div className="flex items-center justify-between gap-2 border-t border-slate-850 pt-2.5">
                      <span className="text-[9px] text-slate-500 font-sans">Sem foto local?</span>
                      <button
                        id={`btn-emoji-alt-${p.id}`}
                        onClick={() => aplicarEmojiAleatorio(p.id)}
                        className="flex items-center gap-1 text-[10px] font-bold text-slate-200 bg-slate-900 hover:bg-slate-850 px-2 py-1.5 rounded-sm transition border border-slate-800 cursor-pointer font-display"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Emoji Sorteado
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interface de Fechamento / Iniciar Torneio em formato de card Geometricamente Balanceado */}
      <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-800">
        {/* Lado Esquerdo Amarelo Sólido */}
        <div className="w-full md:w-1/4 bg-amber-500 flex flex-col items-center justify-center p-6 text-center text-slate-950 shrink-0">
          <p className="font-bold text-xs uppercase tracking-widest font-mono">Chave de Ouro</p>
          <p className="font-black font-display text-2xl leading-none mt-1">TORNEIO TOTAL</p>
          <div className="mt-4 h-1 w-12 bg-slate-950"></div>
        </div>
        
        {/* Lado Direito Radial de Alta Fidelidade */}
        <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-950/80">
          <div className="space-y-1 relative z-10 w-full md:w-auto text-left">
            <h4 className="text-base font-bold font-display text-white uppercase tracking-widest flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-450 text-amber-400" />
              <span>Deseja começar o duelo?</span>
            </h4>
            <p className="text-slate-400 text-xs max-w-lg font-sans">
              Você configurou {participantes.length} competidores. Sortearemos seus grupos para dar início à fase eliminatória!
            </p>
          </div>

          <button
            id="btn-iniciar-copa"
            disabled={!todosNomesPreenchidos}
            onClick={() => aoIniciarCopa(participantes)}
            className={`relative z-10 w-full md:w-auto px-8 py-3.5 rounded font-display tracking-widest text-xs font-bold uppercase shadow-lg transition duration-300 flex items-center justify-center gap-2 cursor-pointer
              ${
                todosNomesPreenchidos
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
              }
            `}
          >
            Iniciar Competição 🏆
          </button>
        </div>
      </div>

      {!todosNomesPreenchidos && (
        <div id="aviso-nomes-vazios" className="p-3 bg-red-950/20 border border-red-900 text-xs text-red-400 font-bold font-display tracking-wider text-center uppercase rounded">
          * Certifique-se de que todos os competidores possuem nomes válidos antes de iniciar o torneio.
        </div>
      )}
    </div>
  );
}
