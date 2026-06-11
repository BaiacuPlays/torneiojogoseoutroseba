/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Participante, Partida, Grupo, ClassificacaoGrupo, SiglaFase } from './types';

// Temas divertidos para preenchimento rápido
export const TEMAS = [
  { id: 'comidas', nome: '🍕 Doces, Comidas & Salgados' },
  { id: 'paises', nome: '🇧🇷 Países de Futebol' },
  { id: 'animais', nome: '🐱 Animais Silvestres & Silenciosos' },
  { id: 'jogos', nome: '🎮 Jogos, Aplicativos & Tech' },
  { id: 'cores', nome: '🎨 Cores & Elementos Místicos' }
];

const ITENS_TEMAS: Record<string, { nome: string; emoji: string; cor: string }[]> = {
  comidas: [
    { nome: 'Coxinha', emoji: '🍗', cor: 'from-amber-400 to-orange-500' },
    { nome: 'Pizza de Calabresa', emoji: '🍕', cor: 'from-red-400 to-red-600' },
    { nome: 'Brigadeiro', emoji: '🍫', cor: 'from-amber-800 to-yellow-950' },
    { nome: 'Hambúrguer Triplo', emoji: '🍔', cor: 'from-yellow-500 to-amber-700' },
    { nome: 'Pastel de Feira', emoji: '🥟', cor: 'from-yellow-300 to-amber-500' },
    { nome: 'Açaí Completo', emoji: '🍧', cor: 'from-purple-800 to-indigo-950' },
    { nome: 'Pão de Queijo', emoji: '🧀', cor: 'from-yellow-100 to-yellow-400' },
    { nome: 'Sushi Roll', emoji: '🍣', cor: 'from-rose-400 to-slate-700' },
    { nome: 'Churrasco Nobre', emoji: '🥩', cor: 'from-red-500 to-amber-800' },
    { nome: 'Lasagna Bolonhesa', emoji: '🍝', cor: 'from-orange-400 to-red-600' },
    { nome: 'Sorvete de Pistache', emoji: '🍦', cor: 'from-emerald-300 to-green-500' },
    { nome: 'Batata Frita', emoji: '🍟', cor: 'from-yellow-400 to-yellow-600' },
    { nome: 'Pudim de Leite', emoji: '🍮', cor: 'from-amber-300 to-yellow-600' },
    { nome: 'Coxinha de Jaca', emoji: '🥑', cor: 'from-lime-400 to-green-600' },
    { nome: 'Bolo de Cenoura', emoji: '🍰', cor: 'from-orange-400 to-amber-650' },
    { nome: 'Guaraná Gelado', emoji: '🥤', cor: 'from-green-500 to-red-600' },
    { nome: 'Caldo de Cana', emoji: '🥤', cor: 'from-green-300 to-yellow-400' },
    { nome: 'Yakisoba', emoji: '🍜', cor: 'from-amber-600 to-red-700' },
    { nome: 'Torta de Limão', emoji: '🍋', cor: 'from-lime-300 to-emerald-500' },
    { nome: 'Waffle com Nutella', emoji: '🧇', cor: 'from-amber-500 to-amber-900' },
    { nome: 'Donut Rosa', emoji: '🍩', cor: 'from-pink-400 to-purple-500' },
    { nome: 'Picolé de Coco', emoji: '🍢', cor: 'from-slate-100 to-slate-300' },
    { nome: 'Pipoca de Cinema', emoji: '🍿', cor: 'from-yellow-200 to-amber-500' },
    { nome: 'Feijoada Completa', emoji: '🍲', cor: 'from-stone-800 to-neutral-950' },
    { nome: 'Brigadeiro Branco', emoji: '🍬', cor: 'from-yellow-50 to-amber-100' },
    { nome: 'Chocolate Amargo', emoji: '🍫', cor: 'from-neutral-800 to-amber-950' },
    { nome: 'Empadinha de Palmito', emoji: '🥧', cor: 'from-amber-200 to-amber-400' },
    { nome: 'Suco de Laranja', emoji: '🍊', cor: 'from-orange-300 to-orange-500' },
    { nome: 'Pão Italiano', emoji: '🥖', cor: 'from-amber-300 to-neutral-500' },
    { nome: 'Milho Verde', emoji: '🌽', cor: 'from-yellow-300 to-green-500' },
    { nome: 'Tapioca de Queijo', emoji: '🌮', cor: 'from-slate-100 to-yellow-200' },
    { nome: 'Crepe Suíço', emoji: '🧇', cor: 'from-amber-400 to-orange-400' }
  ],
  paises: [
    { nome: 'Brasil', emoji: '🇧🇷', cor: 'from-green-500 to-yellow-400' },
    { nome: 'Argentina', emoji: '🇦🇷', cor: 'from-sky-300 to-sky-100' },
    { nome: 'Alemanha', emoji: '🇩🇪', cor: 'from-yellow-500 via-red-500 to-stone-900' },
    { nome: 'França', emoji: '🇫🇷', cor: 'from-blue-600 via-slate-100 to-red-600' },
    { nome: 'Japão', emoji: '🇯🇵', cor: 'from-red-500 to-slate-100' },
    { nome: 'Itália', emoji: '🇮🇹', cor: 'from-green-600 via-white to-red-600' },
    { nome: 'Andorra', emoji: '🇦🇩', cor: 'from-blue-500 to-red-500' },
    { nome: 'Espanha', emoji: '🇪🇸', cor: 'from-red-600 via-yellow-400 to-red-600' },
    { nome: 'Marrocos', emoji: '🇲🇦', cor: 'from-red-700 to-emerald-700' },
    { nome: 'Senegal', emoji: '🇸🇳', cor: 'from-green-600 via-yellow-400 to-red-600' },
    { nome: 'Portugal', emoji: '🇵🇹', cor: 'from-green-700 to-red-600' },
    { nome: 'Inglaterra', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', cor: 'from-red-500 to-slate-100' },
    { nome: 'Uruguai', emoji: '🇺🇾', cor: 'from-sky-400 to-yellow-400' },
    { nome: 'Bélgica', emoji: '🇧🇪', cor: 'from-yellow-500 via-red-500 to-neutral-900' },
    { nome: 'Croácia', emoji: '🇭🇷', cor: 'from-red-500 to-blue-700' },
    { nome: 'Holanda', emoji: '🇳🇱', cor: 'from-orange-500 to-orange-700' },
    { nome: 'Canadá', emoji: '🇨🇦', cor: 'from-red-600 to-slate-100' },
    { nome: 'Estados Unidos', emoji: '🇺🇸', cor: 'from-blue-800 to-red-600' },
    { nome: 'México', emoji: '🇲🇽', cor: 'from-green-700 via-white to-red-600' },
    { nome: 'Camarões', emoji: '🇨🇲', cor: 'from-green-600 via-red-600 to-yellow-400' },
    { nome: 'Gana', emoji: '🇬🇭', cor: 'from-red-600 via-yellow-400 to-green-600' },
    { nome: 'Coreia do Sul', emoji: '🇰🇷', cor: 'from-slate-100 to-blue-700' },
    { nome: 'Suíça', emoji: '🇨🇭', cor: 'from-red-500 to-red-700' },
    { nome: 'Suécia', emoji: '🇸🇪', cor: 'from-blue-500 to-yellow-400' },
    { nome: 'Austrália', emoji: '🇦🇺', cor: 'from-blue-900 to-red-600' },
    { nome: 'Equador', emoji: '🇪🇨', cor: 'from-yellow-400 via-blue-700 to-red-600' },
    { nome: 'Arábia Saudita', emoji: '🇸🇦', cor: 'from-green-700 to-green-900' },
    { nome: 'Costa Rica', emoji: '🇨🇷', cor: 'from-blue-800 via-white to-red-600' },
    { nome: 'Polônia', emoji: '🇵🇱', cor: 'from-red-500 to-slate-100' },
    { nome: 'Dinamarca', emoji: '🇩🇰', cor: 'from-red-600 to-slate-50' },
    { nome: 'Irã', emoji: '🇮🇷', cor: 'from-green-500 via-white to-red-500' },
    { nome: 'Colômbia', emoji: '🇨🇴', cor: 'from-yellow-400 via-blue-600 to-red-600' }
  ],
  animais: [
    { nome: 'Gato Siamês', emoji: '🐱', cor: 'from-amber-200 to-amber-400' },
    { nome: 'Cão Golden Retr.', emoji: '🐶', cor: 'from-yellow-300 to-amber-500' },
    { nome: 'Leão Africano', emoji: '🦁', cor: 'from-amber-500 to-yellow-600' },
    { nome: 'Panda Gigante', emoji: '🐼', cor: 'from-neutral-700 to-neutral-900' },
    { nome: 'Lobo Cinzento', emoji: '🐺', cor: 'from-slate-400 to-slate-600' },
    { nome: 'Urso Polar', emoji: '🐻', cor: 'from-slate-100 to-slate-300' },
    { nome: 'Tigre das Selvas', emoji: '🐯', cor: 'from-orange-500 to-neutral-950' },
    { nome: 'Golfinho Azul', emoji: '🐬', cor: 'from-cyan-400 to-blue-500' },
    { nome: 'Águia Real', emoji: '🦅', cor: 'from-amber-700 to-yellow-950' },
    { nome: 'Coruja Esbelta', emoji: '🦉', cor: 'from-amber-600 to-zinc-700' },
    { nome: 'Pinguim Imperador', emoji: '🐧', cor: 'from-sky-900 to-slate-900' },
    { nome: 'Capivara Pacífica', emoji: '🦦', cor: 'from-amber-700 to-amber-900' },
    { nome: 'Elefante Gigante', emoji: '🐘', cor: 'from-neutral-400 to-neutral-600' },
    { nome: 'Girafa Alta', emoji: '🦒', cor: 'from-yellow-400 to-amber-600' },
    { nome: 'Coelho Saltitador', emoji: '🐰', cor: 'from-pink-100 to-slate-300' },
    { nome: 'Raposa Veloz', emoji: '🦊', cor: 'from-orange-400 to-red-500' },
    { nome: 'Preguiça de Árvore', emoji: '🦥', cor: 'from-amber-600 to-amber-850' },
    { nome: 'Gorila de Costas Pr.', emoji: '🦍', cor: 'from-zinc-800 to-zinc-950' },
    { nome: 'Ovelha Lanuda', emoji: '🐑', cor: 'from-stone-100 to-orange-100' },
    { nome: 'Cavalinho Corredor', emoji: '🐴', cor: 'from-amber-600 to-amber-800' },
    { nome: 'Jacaré do Papo Am.', emoji: '🐊', cor: 'from-emerald-600 to-emerald-950' },
    { nome: 'Tubarão Branco', emoji: '🦈', cor: 'from-slate-500 to-sky-700' },
    { nome: 'Polvo Inteligente', emoji: '🐙', cor: 'from-rose-500 to-purple-600' },
    { nome: 'Pavão Elegante', emoji: '🦚', cor: 'from-teal-500 to-blue-700' },
    { nome: 'Koala Calmante', emoji: '🐨', cor: 'from-slate-300 to-slate-500' },
    { nome: 'Canguru Boxeador', emoji: '🦘', cor: 'from-amber-500 to-amber-700' },
    { nome: 'Flamingo Cor-de-Rosa', emoji: '🦩', cor: 'from-pink-300 to-pink-500' },
    { nome: 'Camelo do Deserto', emoji: '🐪', cor: 'from-amber-300 to-amber-600' },
    { nome: 'Esquilo Coletor', emoji: '🐿️', cor: 'from-amber-400 to-amber-700' },
    { nome: 'Tartaruga Marinha', emoji: '🐢', cor: 'from-lime-600 to-green-800' },
    { nome: 'Vaca Pintada', emoji: '🐄', cor: 'from-stone-100 to-stone-800' },
    { nome: 'Leopardo Ágil', emoji: '🐆', cor: 'from-yellow-500 to-neutral-900' }
  ],
  jogos: [
    { nome: 'Minecraft', emoji: '⛏️', cor: 'from-green-600 to-amber-800' },
    { nome: 'Super Mario', emoji: '🍄', cor: 'from-red-500 to-blue-600' },
    { nome: 'Tetris', emoji: '🧱', cor: 'from-indigo-600 to-purple-600' },
    { nome: 'Zelda Link', emoji: '🛡️', cor: 'from-emerald-500 to-yellow-600' },
    { nome: 'Fortnite', emoji: '🏹', cor: 'from-purple-500 to-sky-400' },
    { nome: 'GTA V', emoji: '🚗', cor: 'from-emerald-800 to-zinc-900' },
    { nome: 'Counter-Strike', emoji: '🎯', cor: 'from-yellow-600 to-slate-800' },
    { nome: 'League of Legends', emoji: '⚔️', cor: 'from-blue-700 to-yellow-700' },
    { nome: 'Sonic The Hedgehog', emoji: '🦔', cor: 'from-blue-500 to-cyan-400' },
    { nome: 'FIFA / EA FC', emoji: '⚽', cor: 'from-emerald-500 to-indigo-800' },
    { nome: 'Pokemon Red', emoji: '🔥', cor: 'from-red-600 to-amber-500' },
    { nome: 'Among Us', emoji: '🚀', cor: 'from-red-500 to-rose-700' },
    { nome: 'Chess.com', emoji: '♟️', cor: 'from-stone-500 to-zinc-800' },
    { nome: 'Valorant', emoji: '🔫', cor: 'from-rose-600 to-slate-950' },
    { nome: 'Clash Royale', emoji: '👑', cor: 'from-blue-500 to-amber-500' },
    { nome: 'Angry Birds', emoji: '🐦', cor: 'from-red-500 to-yellow-500' },
    { nome: 'Pac-Man', emoji: '🕹️', cor: 'from-yellow-400 to-yellow-600' },
    { nome: 'Rocket League', emoji: '🏎️', cor: 'from-blue-600 to-orange-500' },
    { nome: 'Stardew Valley', emoji: '🧑‍🌾', cor: 'from-green-400 to-sky-400' },
    { nome: 'God of War', emoji: '🪓', cor: 'from-red-800 to-slate-800' },
    { nome: 'Street Fighter', emoji: '🥊', cor: 'from-red-500 to-indigo-900' },
    { nome: 'Guitar Hero', emoji: '🎸', cor: 'from-red-600 to-purple-950' },
    { nome: 'Subway Surfers', emoji: '🛹', cor: 'from-orange-500 to-yellow-400' },
    { nome: 'The Sims', emoji: '💎', cor: 'from-emerald-400 to-teal-600' },
    { nome: 'Cyberpunk 2077', emoji: '🦾', cor: 'from-yellow-300 to-indigo-900' },
    { nome: 'Dota 2', emoji: '👹', cor: 'from-red-700 to-stone-900' },
    { nome: 'Crash Bandicoot', emoji: '🦊', cor: 'from-orange-500 to-sky-500' },
    { nome: 'Elden Ring', emoji: '💍', cor: 'from-yellow-600 to-neutral-950' },
    { nome: 'Flappy Bird', emoji: '🐣', cor: 'from-yellow-300 to-green-400' },
    { nome: 'Slay the Spire', emoji: '🃏', cor: 'from-indigo-900 to-neutral-950' },
    { nome: 'Candy Crush', emoji: '🍬', cor: 'from-pink-500 to-yellow-400' },
    { nome: 'Fall Guys', emoji: '👑', cor: 'from-pink-400 to-cyan-400' }
  ],
  cores: [
    { nome: 'Fogo Escarlate', emoji: '🔥', cor: 'from-red-500 to-orange-600' },
    { nome: 'Gelo Glacial', emoji: '❄️', cor: 'from-sky-100 to-blue-400' },
    { nome: 'Relâmpago Dourado', emoji: '⚡', cor: 'from-yellow-300 to-amber-500' },
    { nome: 'Floresta Profunda', emoji: '🌲', cor: 'from-emerald-700 to-green-900' },
    { nome: 'Espaço Cósmico', emoji: '🌌', cor: 'from-indigo-600 to-purple-900' },
    { nome: 'Sol Radiante', emoji: '☀️', cor: 'from-yellow-400 to-orange-500' },
    { nome: 'Terra Fértil', emoji: '🪵', cor: 'from-amber-700 to-stone-900' },
    { nome: 'Vento Furioso', emoji: '💨', cor: 'from-slate-200 to-slate-400' },
    { nome: 'Oceano Índico', emoji: '🌊', cor: 'from-blue-500 to-teal-500' },
    { nome: 'Sombra da Noite', emoji: '🌙', cor: 'from-neutral-700 to-neutral-950' },
    { nome: 'Neon Cintilante', emoji: '✨', cor: 'from-pink-500 to-violet-600' },
    { nome: 'Esmeralda Vital', emoji: '💚', cor: 'from-green-400 to-emerald-600' },
    { nome: 'Safira Celeste', emoji: '💙', cor: 'from-sky-500 to-indigo-700' },
    { nome: 'Ametista Oculta', emoji: '💜', cor: 'from-purple-500 to-fuchsia-800' },
    { nome: 'Obsidiana Negra', emoji: '⬛', cor: 'from-stone-800 to-stone-950' },
    { nome: 'Rubi Carmesim', emoji: '❤️', cor: 'from-rose-500 to-red-800' },
    { nome: 'Pérola Rara', emoji: '⚪', cor: 'from-stone-50 to-orange-100' },
    { nome: 'Cobre Vulcanizado', emoji: '🧱', cor: 'from-orange-600 to-amber-800' },
    { nome: 'Metal Escovado', emoji: '⚙️', cor: 'from-zinc-400 to-stone-600' },
    { nome: 'Aura Violeta', emoji: '👾', cor: 'from-purple-600 to-pink-600' },
    { nome: 'Pôr do Sol', emoji: '🌇', cor: 'from-rose-400 to-orange-500' },
    { nome: 'Madrugada', emoji: '🌆', cor: 'from-slate-800 to-indigo-950' },
    { nome: 'Ouro Puro', emoji: '🪙', cor: 'from-yellow-400 via-amber-200 to-yellow-600' },
    { nome: 'Jade Imperial', emoji: '🟢', cor: 'from-emerald-400 to-teal-700' },
    { nome: 'Cactus Árido', emoji: '🌵', cor: 'from-lime-500 to-green-700' },
    { nome: 'Cinza Neblina', emoji: '🌫️', cor: 'from-slate-350 to-slate-500' },
    { nome: 'Abóbora de Halloween', emoji: '🎃', cor: 'from-orange-500 to-red-600' },
    { nome: 'Cerejeiras em Flor', emoji: '🌸', cor: 'from-pink-200 to-rose-400' },
    { nome: 'Marshmallow Azul', emoji: '🍬', cor: 'from-sky-200 to-pink-250' },
    { nome: 'Cyber Punk', emoji: '☣️', cor: 'from-yellow-400 to-fuchsia-600' },
    { nome: 'Glitch Cibernético', emoji: '🤖', cor: 'from-emerald-500 to-purple-800' },
    { nome: 'Menta Fresca', emoji: '🌿', cor: 'from-teal-300 to-emerald-500' }
  ]
};

// Gera participantes baseados em temas
export function gerarListaParticipantes(slugTema: string, quantidade: number): Participante[] {
  const listaPreset = ITENS_TEMAS[slugTema] || ITENS_TEMAS.comidas;
  const resultado: Participante[] = [];

  for (let i = 0; i < quantidade; i++) {
    const item = listaPreset[i % listaPreset.length];
    // Se estourar a lista, muda levemente o nome para não duplicar exatamente
    const sufixo = i >= listaPreset.length ? ` (${Math.floor(i / listaPreset.length) + 1})` : '';
    resultado.push({
      id: `p-${i + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      nome: `${item.nome}${sufixo}`,
      imagem: `emoji:${item.emoji}:${item.cor}` // Armazena info do emoji e sua cor de fundo para renderização no app
    });
  }

  return resultado;
}

// Sorteia aleatoriamente um array
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Cria os Grupos da Copa
export function criarGrupos(participantes: Participante[]): Grupo[] {
  const participantesEmbaralhados = shuffleArray(participantes);
  const quantidadeGrupos = participantes.length / 4;
  const grupos: Grupo[] = [];

  const letras = 'ABCDEFGHIJKLMNOPQRSTUV'.split('');

  for (let i = 0; i < quantidadeGrupos; i++) {
    const letra = letras[i] || `${i + 1}`;
    const inicio = i * 4;
    const participantesIds = participantesEmbaralhados.slice(inicio, inicio + 4).map(p => p.id);
    grupos.push({
      id: letra,
      nome: `Grupo ${letra}`,
      participantesIds
    });
  }

  return grupos;
}

// Cria as partidas da rodada de grupos (6 partidas por grupo de 4)
export function criarPartidasGrupo(grupos: Grupo[]): Partida[] {
  const partidas: Partida[] = [];

  grupos.forEach(grupo => {
    const ids = grupo.participantesIds;
    if (ids.length !== 4) return;

    // Standard Round Robin para grupo de 4:
    // Rodada 1
    partidas.push(criarPartidaVazia('grupos', ids[0], ids[1], grupo.id, 'Rodada 1'));
    partidas.push(criarPartidaVazia('grupos', ids[2], ids[3], grupo.id, 'Rodada 1'));

    // Rodada 2
    partidas.push(criarPartidaVazia('grupos', ids[0], ids[2], grupo.id, 'Rodada 2'));
    partidas.push(criarPartidaVazia('grupos', ids[1], ids[3], grupo.id, 'Rodada 2'));

    // Rodada 3
    partidas.push(criarPartidaVazia('grupos', ids[0], ids[3], grupo.id, 'Rodada 3'));
    partidas.push(criarPartidaVazia('grupos', ids[1], ids[2], grupo.id, 'Rodada 3'));
  });

  return partidas;
}

function criarPartidaVazia(
  fase: SiglaFase,
  mandanteId: string | null,
  visitanteId: string | null,
  grupoId?: string,
  rotulo?: string,
  posicaoChave?: number,
  origemMandante?: string,
  origemVisitante?: string
): Partida {
  return {
    id: `m-${fase}-${grupoId || ''}-${posicaoChave !== undefined ? 'pos' + posicaoChave : ''}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    fase,
    grupoId,
    posicaoChave,
    mandanteId,
    visitanteId,
    golsMandante: null,
    golsVisitante: null,
    penaltisMandante: null,
    penaltisVisitante: null,
    vencedorId: null,
    concluida: false,
    descricaoOrigemMandante: origemMandante,
    descricaoOrigemVisitante: origemVisitante
  };
}

// Calcula classificação de um determinado grupo
export function calcularClassificacao(grupoId: string, participantesIds: string[], partidas: Partida[]): ClassificacaoGrupo[] {
  // Inicializa a tabela
  const tabela: Record<string, ClassificacaoGrupo> = {};
  participantesIds.forEach(id => {
    tabela[id] = {
      participanteId: id,
      pontos: 0,
      jogos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      golsPro: 0,
      golsContra: 0,
      saldoGols: 0
    };
  });

  // Filtra partidas concluídas deste grupo
  const partidasGrupo = partidas.filter(p => p.fase === 'grupos' && p.grupoId === grupoId && p.concluida);

  partidasGrupo.forEach(p => {
    if (!p.mandanteId || !p.visitanteId) return;

    const tM = tabela[p.mandanteId];
    const tV = tabela[p.visitanteId];

    if (!tM || !tV) return;

    const gM = p.golsMandante ?? 0;
    const gV = p.golsVisitante ?? 0;

    tM.jogos += 1;
    tV.jogos += 1;

    tM.golsPro += gM;
    tM.golsContra += gV;
    tM.saldoGols = tM.golsPro - tM.golsContra;

    tV.golsPro += gV;
    tV.golsContra += gM;
    tV.saldoGols = tV.golsPro - tV.golsContra;

    if (gM > gV) {
      tM.pontos += 3;
      tM.vitorias += 1;
      tV.derrotas += 1;
    } else if (gV > gM) {
      tV.pontos += 3;
      tV.vitorias += 1;
      tM.derrotas += 1;
    } else {
      tM.pontos += 1;
      tV.pontos += 1;
      tM.empates += 1;
      tV.empates += 1;
    }
  });

  // Ordena segundo os critérios: Pontos > Saldo Gols > Gols Pró > Alfabético (Id)
  return Object.values(tabela).sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
    if (b.golsPro !== a.golsPro) return b.golsPro - a.golsPro;
    return a.participanteId.localeCompare(b.participanteId); // desempate fallback consistente
  });
}

// Retorna se todas as partidas da fase de grupos foram concluídas
export function todasPartidasGruposConcluidas(partidas: Partida[]): boolean {
  return partidas.filter(p => p.fase === 'grupos').every(p => p.concluida);
}

// Cria a chave (bracket) do mata-mata baseado nas posições da fase de grupos
export function gerarConfrontosIniciaisEliminatorias(grupos: Grupo[], partidas: Partida[]): Partida[] {
  const classificacoesPorGrupo: Record<string, ClassificacaoGrupo[]> = {};

  grupos.forEach(g => {
    classificacoesPorGrupo[g.id] = calcularClassificacao(g.id, g.participantesIds, partidas);
  });

  const quantidadeGrupos = grupos.length;
  const faseInicial: SiglaFase = 
    quantidadeGrupos === 1 ? 'final' :
    quantidadeGrupos === 2 ? 'semifinal' :
    quantidadeGrupos === 4 ? 'quartas' :
    'oitavas'; // Se quantidade de grupos for 8

  const partidasEliminatorias: Partida[] = [];

  if (faseInicial === 'final') {
    const classA = classificacoesPorGrupo['A'];
    partidasEliminatorias.push(
      criarPartidaVazia('final', classA[0].participanteId, classA[1].participanteId, undefined, 'Final', 0, '1º Grupo A', '2º Grupo A')
    );
  } 
  else if (faseInicial === 'semifinal') {
    // 2 grupos: Cruzamento olímpico
    // Semi 1: 1A x 2B
    // Semi 2: 1B x 2A
    const classA = classificacoesPorGrupo['A'];
    const classB = classificacoesPorGrupo['B'];

    partidasEliminatorias.push(
      criarPartidaVazia('semifinal', classA[0].participanteId, classB[1].participanteId, undefined, 'Semifinal 1', 0, '1º Grupo A', '2º Grupo B')
    );
    partidasEliminatorias.push(
      criarPartidaVazia('semifinal', classB[0].participanteId, classA[1].participanteId, undefined, 'Semifinal 2', 1, '1º Grupo B', '2º Grupo A')
    );
  } 
  else if (faseInicial === 'quartas') {
    // 4 grupos:
    // Q1: 1A x 2B
    // Q2: 1C x 2D
    // Q3: 1B x 2A
    // Q4: 1D x 2C
    const cA = classificacoesPorGrupo['A'];
    const cB = classificacoesPorGrupo['B'];
    const cC = classificacoesPorGrupo['C'];
    const cD = classificacoesPorGrupo['D'];

    partidasEliminatorias.push(criarPartidaVazia('quartas', cA[0].participanteId, cB[1].participanteId, undefined, 'Quartas de Final 1', 0, '1º Grupo A', '2º Grupo B'));
    partidasEliminatorias.push(criarPartidaVazia('quartas', cC[0].participanteId, cD[1].participanteId, undefined, 'Quartas de Final 2', 1, '1º Grupo C', '2º Grupo D'));
    partidasEliminatorias.push(criarPartidaVazia('quartas', cB[0].participanteId, cA[1].participanteId, undefined, 'Quartas de Final 3', 2, '1º Grupo B', '2º Grupo A'));
    partidasEliminatorias.push(criarPartidaVazia('quartas', cD[0].participanteId, cC[1].participanteId, undefined, 'Quartas de Final 4', 3, '1º Grupo D', '2º Grupo C'));
  } 
  else if (quantidadeGrupos === 8) {
    // Caso clássico do torneio de 8 grupos -> 16 classificados
    const c = classificacoesPorGrupo;

    partidasEliminatorias.push(criarPartidaVazia('oitavas', c['A'][0].participanteId, c['B'][1].participanteId, undefined, 'Oitavas 1', 0, '1º Grupo A', '2º Grupo B'));
    partidasEliminatorias.push(criarPartidaVazia('oitavas', c['C'][0].participanteId, c['D'][1].participanteId, undefined, 'Oitavas 2', 1, '1º Grupo C', '2º Grupo D'));
    partidasEliminatorias.push(criarPartidaVazia('oitavas', c['E'][0].participanteId, c['F'][1].participanteId, undefined, 'Oitavas 3', 2, '1º Grupo E', '2º Grupo F'));
    partidasEliminatorias.push(criarPartidaVazia('oitavas', c['G'][0].participanteId, c['H'][1].participanteId, undefined, 'Oitavas 4', 3, '1º Grupo G', '2º Grupo H'));
    partidasEliminatorias.push(criarPartidaVazia('oitavas', c['B'][0].participanteId, c['A'][1].participanteId, undefined, 'Oitavas 5', 4, '1º Grupo B', '2º Grupo A'));
    partidasEliminatorias.push(criarPartidaVazia('oitavas', c['D'][0].participanteId, c['C'][1].participanteId, undefined, 'Oitavas 6', 5, '1º Grupo D', '2º Grupo C'));
    partidasEliminatorias.push(criarPartidaVazia('oitavas', c['F'][0].participanteId, c['E'][1].participanteId, undefined, 'Oitavas 7', 6, '1º Grupo F', '2º Grupo E'));
    partidasEliminatorias.push(criarPartidaVazia('oitavas', c['H'][0].participanteId, c['G'][1].participanteId, undefined, 'Oitavas 8', 7, '1º Grupo H', '2º Grupo G'));
  } 
  else {
    // Torneios maiores (16, 25, 32 grupos, etc.)
    // Coleta o primeiro lugar de todos os grupos
    const vencedoresGrupo: { participanteId: string; pontos: number; saldoGols: number; golsPro: number; grupoNome: string }[] = [];
    
    grupos.forEach(g => {
      const cls = classificacoesPorGrupo[g.id];
      if (cls && cls.length > 0) {
        vencedoresGrupo.push({
          participanteId: cls[0].participanteId,
          pontos: cls[0].pontos,
          saldoGols: cls[0].saldoGols,
          golsPro: cls[0].golsPro,
          grupoNome: g.nome
        });
      }
    });

    // Ordena todos os vencedores de grupo pela performance geral para definir as 16 melhores posições
    const vencedoresOrdenados = vencedoresGrupo.sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
      if (b.golsPro !== a.golsPro) return b.golsPro - a.golsPro;
      return a.participanteId.localeCompare(b.participanteId);
    });

    // Pega as 16 melhores campanhas que avançaram
    const top16 = vencedoresOrdenados.slice(0, 16);

    // Se houver menos de 16 por algum caso extremo, preenchemos com segurança
    while (top16.length < 16) {
      top16.push({
        participanteId: '',
        pontos: 0,
        saldoGols: 0,
        golsPro: 0,
        grupoNome: 'N/A'
      });
    }

    // Cria os confrontos baseados no chaveamento de sementes (1º vs 16º, 2º vs 15º, etc.)
    const sementesCruzo = [
      { m: 0, v: 15 }, // 1 vs 16
      { m: 7, v: 8 },  // 8 vs 9
      { m: 4, v: 11 }, // 5 vs 12
      { m: 3, v: 10 }, // 4 vs 11 (corrigido índice)
      { m: 2, v: 13 }, // 3 vs 14
      { m: 5, v: 12 }, // 6 vs 13
      { m: 6, v: 9 },  // 7 vs 10
      { m: 1, v: 14 }  // 2 vs 15
    ];

    sementesCruzo.forEach((cruz, index) => {
      const pM = top16[cruz.m];
      const pV = top16[cruz.v];
      
      const mandId = pM.participanteId || null;
      const visitId = pV.participanteId || null;

      const descM = pM.participanteId ? `1º ${pM.grupoNome} (#${cruz.m + 1})` : 'A definir...';
      const descV = pV.participanteId ? `1º ${pV.grupoNome} (#${cruz.v + 1})` : 'A definir...';

      partidasEliminatorias.push(
        criarPartidaVazia('oitavas', mandId, visitId, undefined, `Oitavas ${index + 1}`, index, descM, descV)
      );
    });
  }

  return partidasEliminatorias;
}

// Avança um vencedor do mata-mata para a próxima fase, calculando os chaveamentos seguintes
export function recriarOuAtualizarMataMata(
  partidasAtuais: Partida[],
  faseEmAtualizacao: SiglaFase
): Partida[] {
  const novasPartidas = [...partidasAtuais];

  // Se for oitavas, verifica se todas estão prontas para criar as quartas
  if (faseEmAtualizacao === 'oitavas') {
    const oitavas = novasPartidas.filter(p => p.fase === 'oitavas');
    const todasOitavasConcluidas = oitavas.length === 8 && oitavas.every(o => o.concluida && o.vencedorId);
    
    // Lista de quartas atuais
    const quartasAtuais = novasPartidas.filter(p => p.fase === 'quartas');

    if (todasOitavasConcluidas && quartasAtuais.length === 0) {
      // Cria quartas de final:
      // Q1: Vencedor O1 x Vencedor O2
      // Q2: Vencedor O3 x Vencedor O4
      // Q3: Vencedor O5 x Vencedor O6
      // Q4: Vencedor O7 x Vencedor O8
      novasPartidas.push(criarPartidaVazia('quartas', oitavas[0].vencedorId, oitavas[1].vencedorId, undefined, 'Quartas 1', 0, 'Vencedor Oitavas 1', 'Vencedor Oitavas 2'));
      novasPartidas.push(criarPartidaVazia('quartas', oitavas[2].vencedorId, oitavas[3].vencedorId, undefined, 'Quartas 2', 1, 'Vencedor Oitavas 3', 'Vencedor Oitavas 4'));
      novasPartidas.push(criarPartidaVazia('quartas', oitavas[4].vencedorId, oitavas[5].vencedorId, undefined, 'Quartas 3', 2, 'Vencedor Oitavas 5', 'Vencedor Oitavas 6'));
      novasPartidas.push(criarPartidaVazia('quartas', oitavas[6].vencedorId, oitavas[7].vencedorId, undefined, 'Quartas 4', 3, 'Vencedor Oitavas 7', 'Vencedor Oitavas 8'));
    } else {
      // Atualiza os mandantes/visitantes das quartas com base nas oitavas
      const quartas = novasPartidas.filter(p => p.fase === 'quartas');
      if (quartas.length === 4 && oitavas.length === 8) {
        quartas[0].mandanteId = oitavas[0].vencedorId;
        quartas[0].visitanteId = oitavas[1].vencedorId;
        quartas[1].mandanteId = oitavas[2].vencedorId;
        quartas[1].visitanteId = oitavas[3].vencedorId;
        quartas[2].mandanteId = oitavas[4].vencedorId;
        quartas[2].visitanteId = oitavas[5].vencedorId;
        quartas[3].mandanteId = oitavas[6].vencedorId;
        quartas[3].visitanteId = oitavas[7].vencedorId;
      }
    }
  }

  // Se for quartas, atualiza as semifinais
  const quartas = novasPartidas.filter(p => p.fase === 'quartas');
  const todasQuartasConcluidas = quartas.length === 4 && quartas.every(q => q.concluida && q.vencedorId);
  const semisAtuais = novasPartidas.filter(p => p.fase === 'semifinal');

  if (faseEmAtualizacao === 'quartas' || faseEmAtualizacao === 'oitavas') {
    if (todasQuartasConcluidas && semisAtuais.length === 0) {
      // Cria Semifinais:
      // S1: Vencedor Q1 x Vencedor Q2
      // S2: Vencedor Q3 x Vencedor Q4
      novasPartidas.push(criarPartidaVazia('semifinal', quartas[0].vencedorId, quartas[1].vencedorId, undefined, 'Semifinal 1', 0, 'Vencedor Quartas 1', 'Vencedor Quartas 2'));
      novasPartidas.push(criarPartidaVazia('semifinal', quartas[2].vencedorId, quartas[3].vencedorId, undefined, 'Semifinal 2', 1, 'Vencedor Quartas 3', 'Vencedor Quartas 4'));
    } else if (quartas.length === 4 && semisAtuais.length === 2) {
      semisAtuais[0].mandanteId = quartas[0].vencedorId;
      semisAtuais[0].visitanteId = quartas[1].vencedorId;
      semisAtuais[1].mandanteId = quartas[2].vencedorId;
      semisAtuais[1].visitanteId = quartas[3].vencedorId;
    }
  }

  // Se for Semifinal, atualiza Final e Disputa de 3º Lugar
  const semis = novasPartidas.filter(p => p.fase === 'semifinal');
  const todasSemisConcluidas = semis.length === 2 && semis.every(s => s.concluida && s.vencedorId);
  const finalE3oAtuais = novasPartidas.filter(p => p.fase === 'final' || p.fase === 'terceiro_lugar');

  if (faseEmAtualizacao === 'semifinal' || faseEmAtualizacao === 'quartas' || faseEmAtualizacao === 'oitavas') {
    if (todasSemisConcluidas && finalE3oAtuais.length === 0) {
      // Encontra perdedores das semis para terceiro lugar
      const perdedorS1 = semis[0].mandanteId === semis[0].vencedorId ? semis[0].visitanteId : semis[0].mandanteId;
      const perdedorS2 = semis[1].mandanteId === semis[1].vencedorId ? semis[1].visitanteId : semis[1].mandanteId;

      // Disputa terceiro lugar
      novasPartidas.push(criarPartidaVazia('terceiro_lugar', perdedorS1, perdedorS2, undefined, 'Terceiro Lugar', 0, 'Perdedor Semifinal 1', 'Perdedor Semifinal 2'));

      // Final
      novasPartidas.push(criarPartidaVazia('final', semis[0].vencedorId, semis[1].vencedorId, undefined, 'Final', 0, 'Vencedor Semifinal 1', 'Vencedor Semifinal 2'));
    } else if (semis.length === 2 && finalE3oAtuais.length > 0) {
      const perdedorS1 = semis[0].mandanteId === semis[0].vencedorId ? semis[0].visitanteId : semis[0].mandanteId;
      const perdedorS2 = semis[1].mandanteId === semis[1].vencedorId ? semis[1].visitanteId : semis[1].mandanteId;

      const terceiro = novasPartidas.find(p => p.fase === 'terceiro_lugar');
      if (terceiro) {
        terceiro.mandanteId = perdedorS1;
        terceiro.visitanteId = perdedorS2;
      }

      const final = novasPartidas.find(p => p.fase === 'final');
      if (final) {
        final.mandanteId = semis[0].vencedorId;
        final.visitanteId = semis[1].vencedorId;
      }
    }
  }

  return novasPartidas;
}
