/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Participante } from '../types';

interface CartaoParticipanteProps {
  participante: Participante | null;
  className?: string;
  tamanho?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  mostrarNome?: boolean;
}

export default function CartaoParticipante({
  participante,
  className = '',
  tamanho = 'md',
  mostrarNome = true
}: CartaoParticipanteProps) {
  if (!participante) {
    return (
      <div id="participante-vazio" className={`flex items-center gap-3 ${className}`}>
        <div
          className={`rounded-full border border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center text-zinc-400 font-mono select-none shrink-0
            ${tamanho === 'xs' ? 'w-6 h-6 text-[10px]' : ''}
            ${tamanho === 'sm' ? 'w-8 h-8 text-xs' : ''}
            ${tamanho === 'md' ? 'w-12 h-12 text-sm' : ''}
            ${tamanho === 'lg' ? 'w-16 h-16 text-lg' : ''}
            ${tamanho === 'xl' ? 'w-24 h-24 text-2xl' : ''}
          `}
        >
          ?
        </div>
        {mostrarNome && (
          <span className="text-zinc-400 font-medium italic text-sm">A definir...</span>
        )}
      </div>
    );
  }

  const { nome, imagem } = participante;
  const isEmoji = imagem.startsWith('emoji:');

  const renderFoto = () => {
    if (isEmoji) {
      const parts = imagem.split(':');
      const emoji = parts[1] || '⚽';
      const gradiente = parts[2] || 'from-zinc-400 to-zinc-600';

      return (
        <div
          id={`avatar-emoji-${participante.id}`}
          className={`rounded-full bg-gradient-to-br ${gradiente} flex items-center justify-center text-white font-sans shrink-0 border border-black/10 shadow-sm transition-transform hover:scale-105 duration-200
            ${tamanho === 'xs' ? 'w-6 h-6 text-xs' : ''}
            ${tamanho === 'sm' ? 'w-8 h-8 text-sm' : ''}
            ${tamanho === 'md' ? 'w-12 h-12 text-2xl' : ''}
            ${tamanho === 'lg' ? 'w-16 h-16 text-3xl' : ''}
            ${tamanho === 'xl' ? 'w-20 h-20 text-4xl' : ''}
          `}
        >
          <span className="leading-none drop-shadow-sm">{emoji}</span>
        </div>
      );
    }

    return (
      <img
        id={`avatar-img-${participante.id}`}
        src={imagem}
        alt={nome}
        referrerPolicy="no-referrer"
        className={`rounded-full object-cover shrink-0 border border-zinc-200 shadow-sm transition-transform hover:scale-105 duration-200
          ${tamanho === 'xs' ? 'w-6 h-6' : ''}
          ${tamanho === 'sm' ? 'w-8 h-8' : ''}
          ${tamanho === 'md' ? 'w-12 h-12' : ''}
          ${tamanho === 'lg' ? 'w-16 h-16' : ''}
          ${tamanho === 'xl' ? 'w-20 h-20' : ''}
        `}
      />
    );
  };

  return (
    <div
      id={`participante-card-${participante.id}`}
      className={`flex items-center gap-3 ${className}`}
    >
      {renderFoto()}
      {mostrarNome && (
        <span
          className={`font-medium text-zinc-100 truncate
            ${tamanho === 'xs' ? 'text-xs' : ''}
            ${tamanho === 'sm' ? 'text-xs md:text-sm' : ''}
            ${tamanho === 'md' ? 'text-sm md:text-base font-semibold' : ''}
            ${tamanho === 'lg' ? 'text-lg font-bold' : ''}
            ${tamanho === 'xl' ? 'text-xl font-extrabold' : ''}
          `}
        >
          {nome}
        </span>
      )}
    </div>
  );
}
