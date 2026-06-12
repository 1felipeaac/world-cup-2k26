import React from 'react';
import { type Team } from '../../types/tournament';
import { TeamDisplay } from './team-display';


interface QualifiedTeamCardProps {
  team: Team;
  index: number;
  variant: 'direct' | 'third';
}

const QualifiedTeamCard: React.FC<QualifiedTeamCardProps> = ({ team, index, variant }) => {
  const isDirect = variant === 'direct';

 
  const containerClass = isDirect
    ? "bg-white border-slate-200 hover:shadow-md"
    : "bg-linear-to-b from-white to-amber-50/30 border-amber-200 hover:border-amber-400";
    
  const topBarClass = isDirect ? "bg-blue-500" : "bg-amber-500";
  const indexClass = isDirect ? "text-slate-300" : "text-amber-300";
  const statsClass = isDirect ? "text-slate-400" : "text-amber-600/70";

  return (
  <div className={`border rounded-xl p-3 flex flex-col items-center justify-start shadow-sm transition-all relative overflow-hidden min-h-35 ${containerClass}`}>
    
    
    <div className={`absolute top-0 w-full h-1 ${topBarClass}`}></div>
    
  
    <span className={`absolute top-2 left-2 text-[10px] font-black ${indexClass}`}>
      {index + 1}
    </span>

  
    <div className="w-full mt-4">
      <TeamDisplay 
        team={team} 
        isVertical={true}
        imageClassName={isDirect ? "w-10 h-10" : "w-8 h-8"}
        textClassName={`font-bold text-slate-700 text-center whitespace-normal break-words ${isDirect ? 'text-xs' : 'text-[10px]'}`}
      />
    </div>

   
    <span className={`text-[10px] font-medium mt-auto mb-2 ${statsClass}`}>
      {team.stats.points} PTS {isDirect && `• SG: ${team.stats.goalDifference}`}
    </span>
  </div>
);
};



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

}) => {
  const isDirect = variant === 'direct';
  
  const barClass = isDirect ? "bg-blue-500" : "bg-amber-500";
  const pillClass = isDirect ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";

  return (
    <section className="mb-10 w-75 md:w-full">
      
      <div className="flex items-center gap-3 mb-6">
        <div className={`h-8 w-2 rounded-full ${barClass}`}></div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ml-auto ${pillClass}`}>
          {teams.length}/{maxTeams} Equipes
        </span>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
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