import React, { useState } from 'react';
import { type Team } from '../../types/tournament';

interface TeamDisplayProps {
  team?: Team | null;
  isVertical?: boolean;
  imageClassName?: string;
  textClassName?: string;
  className?: string;
  showOnlyAbbreviation?: boolean;
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({
  team,
  isVertical = false,
  imageClassName = "w-8 h-8",
  // 🚀 ATUALIZADO: Padronizamos com whitespace-normal (permite quebra) e break-words (evita estourar o layout)
  textClassName = "text-xs font-bold text-slate-700 whitespace-normal break-words",
  className = "",
  showOnlyAbbreviation = false
}) => {
  const [showFullName, setShowFullName] = useState(false);

  if (!team) {
    return (
      <div className={`flex ${isVertical ? 'flex-col justify-center' : 'items-center gap-2'} text-slate-300 h-full ${className}`}>
        {isVertical && (
          <div className={`flex items-center justify-center mb-2 shrink-0 ${imageClassName}`}>
            <span className="text-2xl">🛡️</span>
          </div>
        )}
        <span className="text-[10px] font-medium text-center italic">A definir</span>
      </div>
    );
  }

  return (
    <div 
      className={`flex ${isVertical ? 'flex-col items-center text-center' : 'items-center gap-2'} cursor-pointer transition-transform active:scale-95 ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        setShowFullName(!showFullName);
      }}
    >
      <div className={`shrink-0 flex items-center justify-center ${isVertical ? 'mb-2' : ''} ${imageClassName}`}>
        <img 
          src={team.logoUrl} 
          alt={team.name} 
          title={team.name} 
          className="w-full h-full object-contain drop-shadow-sm" 
        />
      </div>
      
      {/* Adicionado w-full para o container do texto entender os limites do flexbox */}
      <div className={`flex flex-col justify-center min-w-0 w-full ${isVertical ? 'items-center' : ''}`}>
        {showOnlyAbbreviation ? (
          /* 🚀 CORREÇÃO: Ignoramos as classes de quebra de linha e forçamos a sigla a ficar numa linha só (whitespace-nowrap) */
          <span className="text-xs font-black text-slate-700 whitespace-nowrap uppercase tracking-widest" title={team.name}>
            {team.abbreviation}
          </span>
        ) : (
          /* MODO PADRÃO: Comportamento responsivo/quebra de linha das tabelas */
          <>
            <span className={`${textClassName} hidden sm:block`} title={team.name}>
              {team.name}
            </span>
            <span className={`${textClassName} block sm:hidden`} title={team.name}>
              {showFullName ? team.name : team.abbreviation}
            </span>
          </>
        )}
      </div>
    </div>
  );
};