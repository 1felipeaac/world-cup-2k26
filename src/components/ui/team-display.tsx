import React, { useState } from 'react';
import { type Team } from '../../types/tournament';

interface TeamDisplayProps {
  team?: Team | null;
  isVertical?: boolean;
  imageClassName?: string;
  textClassName?: string;
  className?: string;
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({
  team,
  isVertical = false,
  imageClassName = "w-8 h-8",
  textClassName = "text-xs font-bold text-slate-700",
  className = ""
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
      // Removemos o overflow-hidden para evitar que o mobile corte os elementos sem querer
      className={`flex ${isVertical ? 'flex-col items-center text-center' : 'items-center gap-2'} cursor-pointer transition-transform active:scale-95 ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        setShowFullName(!showFullName);
      }}
    >
      {/* 🛡️ A ARMADURA DO FLEXBOX: Container rígido que segura o tamanho da imagem */}
      <div className={`shrink-0 flex items-center justify-center ${isVertical ? 'mb-2' : ''} ${imageClassName}`}>
        <img 
          src={team.logoUrl} 
          alt={team.name} 
          title={team.name} 
          className="w-full h-full object-contain drop-shadow-sm" 
        />
      </div>
      
      {/* min-w-0 é essencial aqui para o texto não estourar a tela no mobile! */}
      <div className="flex flex-col justify-center min-w-0">
        <span className={`${textClassName} truncate hidden sm:block`} title={team.name}>
          {team.name}
        </span>
        
        <span className={`${textClassName} block sm:hidden`} title={team.name}>
          {showFullName ? team.name : team.abbreviation}
        </span>
      </div>
    </div>
  );
};