/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { TeamDisplay } from '../components/ui/team-display';
import { db } from '../db/database';
import { MatchScheduleModal } from '../components/match-schedule-modal';

export const Schedule: React.FC = () => {
  const [filterOnlyPlayed, setFilterOnlyPlayed] = useState<boolean>(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  
  const scheduleData = useLiveQuery(async () => {
    const matches = await db.matches.toArray();
    const teams = await db.teams.toArray();
    const groups = await db.groups.toArray();

    const teamsMap = new Map(teams.map((t) => [t.id, t]));
    const groupsMap = new Map(groups.map((g) => [g.id, g.name]));

    const sortedMatches = matches.sort((a, b) => {
      if (a.date && b.date) return new Date(a.date).getTime() - new Date(b.date).getTime();
      return a.id - b.id;
    });

    const groupsByDate: { [key: string]: any[] } = {};

    sortedMatches.forEach((match) => {
      
      if (filterOnlyPlayed && (match.homeTeamGoals === null || match.awayTeamGoals === null)) {
        return;
      }

      let dateLabel = "Datas a Definir";
      let timeLabel = "--:--";
      if (match.date) {
        const d = new Date(match.date);
        dateLabel = d.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
        timeLabel = d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
      }

      const homeTeam = teamsMap.get(match.homeTeamId);
      const awayTeam = teamsMap.get(match.awayTeamId);
      const groupName = match.groupId ? `Grupo ${groupsMap.get(match.groupId)}` : match.stage;

      if (!groupsByDate[dateLabel]) {
        groupsByDate[dateLabel] = [];
      }

      groupsByDate[dateLabel].push({
        ...match,
        timeLabel,
        homeTeam,
        awayTeam,
        groupName
      });
    });

    return groupsByDate;
  }, [filterOnlyPlayed]);

  if (!scheduleData) return <div className="p-8 text-center text-slate-500">A carregar calendário...</div>;
  return (
    <div className="max-w-4xl mx-auto pb-16 animate-in fade-in duration-500">
      
      
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter italic flex items-center gap-3">
            <CalendarIcon className="text-blue-600" size={32} />
            Agenda de <span className="text-blue-600">Jogos</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Cronograma completo de partidas da Copa do Mundo ordenado por dia.
          </p>
        </div>

       
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setFilterOnlyPlayed(false)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              !filterOnlyPlayed 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todos os Jogos
          </button>
          <button
            onClick={() => setFilterOnlyPlayed(true)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              filterOnlyPlayed 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Apenas Ocorridos
          </button>
        </div>
      </header>

      
      {Object.keys(scheduleData).length === 0 && (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-500">
          Nenhum jogo ocorrido ou registado até ao momento.
        </div>
      )}

     
      <div className="space-y-10">
        {Object.entries(scheduleData).map(([date, matches]) => (
          <div key={date} className="space-y-4">
            
           
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
              📅 {date}
            </h3>

            
            <div className="grid grid-cols-1 gap-3">
              {matches.map((match) => {
                const hasPlayed = match.homeTeamGoals !== null && match.awayTeamGoals !== null;

                return (
                  <div
                    key={match.id}
                    onClick={() => setSelectedMatchId(match.id)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer group shadow-xs"
                  >
                    
                    <div className="flex flex-col gap-1 min-w-20">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm">
                        <Clock size={14} className="text-slate-400" />
                        {match.timeLabel}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {match.groupName}
                      </span>
                    </div>

                    
                    <div className="flex-1 flex items-center justify-center gap-4 sm:gap-6">
                      
                      <div className="flex-1 flex items-center justify-end gap-3 text-right">
                                           
                        <TeamDisplay isVertical team={match.homeTeam} imageClassName="w-7 h-7" showOnlyAbbreviation={true} textClassName="hidden" />
                      </div>

                     
                      <div className="flex items-center gap-1.5 bg-slate-50 group-hover:bg-blue-50 px-4 py-1.5 rounded-xl border border-slate-100 transition-colors shrink-0 font-black text-sm text-slate-800">
                        {hasPlayed ? (
                          <>
                            <span>{match.homeTeamGoals}</span>
                            <span className="text-slate-300 font-normal">x</span>
                            <span>{match.awayTeamGoals}</span>
                          </>
                        ) : (
                          <span className="text-slate-300 font-medium px-2 text-xs group-hover:text-blue-600 transition-colors">
                            x
                          </span>
                        )}
                      </div>

                     
                      <div className="flex-1 flex items-center justify-start gap-3 text-left">
                        <TeamDisplay 
                            isVertical 
                            team={match.awayTeam} 
                            imageClassName="w-7 h-7" 
                            showOnlyAbbreviation={true} textClassName="hidden" 
                        />
                                           
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

     {selectedMatchId && (
        <MatchScheduleModal
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
        />
      )}
    </div>
  );
};