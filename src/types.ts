/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Participante {
  id: string;
  nome: string;
  imagem: string; // Base64 dataURL, URL, ou cor/gradiente
}

export type FaseTorneio = 'config' | 'grupos' | 'fases_eliminares';

export type SiglaFase = 'grupos' | 'dezesseisavos' | 'oitavas' | 'quartas' | 'semifinal' | 'terceiro_lugar' | 'final';

export interface Partida {
  id: string;
  fase: SiglaFase;
  grupoId?: string; // Se for fase de grupos (A, B, C...)
  posicaoChave?: number; // Para posicionamento no bracket (0, 1, 2...)
  mandanteId: string | null; // ID do participante ou null se ainda não definido
  visitanteId: string | null;
  golsMandante: number | null;
  golsVisitante: number | null;
  penaltisMandante?: number | null;
  penaltisVisitante?: number | null;
  vencedorId: string | null;
  concluida: boolean;
  descricaoOrigemMandante?: string; // Ex: "1º Grupo A" ou "Vencedor Jogo 1"
  descricaoOrigemVisitante?: string; // Ex: "2º Grupo B" ou "Vencedor Jogo 2"
}

export interface Grupo {
  id: string; // "A", "B", "C"...
  nome: string; // "Grupo A", "Grupo B"...
  participantesIds: string[];
}

export interface ClassificacaoGrupo {
  participanteId: string;
  pontos: number;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
  saldoGols: number;
}
