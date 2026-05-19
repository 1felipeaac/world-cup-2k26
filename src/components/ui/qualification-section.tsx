import React from 'react';
import { type Team } from '../../types/tournament';
import { TeamDisplay } from './team-display';

// --- COMPONENTE DO CARTÃO (Interno) ---
interface QualifiedTeamCardProps {
  team: Team;
  index: number;
  variant: 'direct' | 'third';
}

const QualifiedTeamCard: React.FC<QualifiedTeamCardProps> = ({ team, index, variant }) => {
  const isDirect = variant === 'direct';

  // Dicionários de classes baseados na variante (Azul vs Amarelo)
  const containerClass = isDirect
    ? "bg-white border-slate-200 hover:shadow-md"
    : "bg-linear-to-b from-white to-amber-50/30 border-amber-200 hover:border-amber-400";
    
  const topBarClass = isDirect ? "bg-blue-500" : "bg-amber-500";
  const indexClass = isDirect ? "text-slate-300" : "text-amber-300";
  const statsClass = isDirect ? "text-slate-400" : "text-amber-600/70";

  return (
    <div className={`border rounded-xl p-4 flex flex-col items-center justify-center shadow-sm transition-all relative overflow-hidden ${containerClass}`}>
      {/* Barra colorida no topo */}
      <div className={`absolute top-0 w-full h-1 ${topBarClass}`}></div>
      
      {/* Número da Posição */}
      <span className={`absolute top-2 left-2 text-[10px] font-black ${indexClass}`}>
        {index + 1}
      </span>

      {/* Reaproveitando nosso TeamDisplay para ter o clique no mobile! */}
      <TeamDisplay 
        team={team} 
        isVertical={true}
        imageClassName={isDirect ? "w-12 h-12" : "w-10 h-10"}
        textClassName={`font-bold text-slate-700 text-center whitespace-normal break-words ${isDirect ? 'text-sm' : 'text-xs'}`}
      />

      {/* Estatísticas */}
      <span className={`text-[10px] font-medium mt-1 ${statsClass}`}>
        {team.stats.points} PTS {isDirect && `• SG: ${team.stats.goalDifference}`}
      </span>
    </div>
  );
};


// --- COMPONENTE DA SEÇÃO (Exportado) ---
interface QualificationSectionProps {
  title: string;
  teams: Team[];
  maxTeams: number;
  variant?: 'direct' | 'third';
  gridCols?: string;
}

export const QualificationSection: React.FC<QualificationSectionProps> = ({
  title,
  teams,
  maxTeams,
  variant = 'direct',
  gridCols = "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
}) => {
  const isDirect = variant === 'direct';
  
  const barClass = isDirect ? "bg-blue-500" : "bg-amber-500";
  const pillClass = isDirect ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";

  return (
    <section className="mb-10">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`h-8 w-2 rounded-full ${barClass}`}></div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ml-auto ${pillClass}`}>
          {teams.length}/{maxTeams} Equipes
        </span>
      </div>

      {/* Grid de Times */}
      <div className={`grid gap-4 ${gridCols}`}>
        {teams.map((team, index) => (
          <QualifiedTeamCard 
            key={team.id} 
            team={team} 
            index={index} 
            variant={variant} 
          />
        ))}
      </div>
    </section>
  );
};