import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart3, TrendingUp, ShieldAlert, Swords } from 'lucide-react';
import Container from '../components/container';
import { db } from '../db/database';
import { TeamDisplay } from '../components/ui/team-display';

export const Stats: React.FC = () => {
  // Puxa todos os times e já ordena pelos critérios oficiais da FIFA
  const rankedTeams = useLiveQuery(async () => {
    const teams = await db.teams.toArray();
    
    return teams.sort((a, b) => {
      // 1. Mais Pontos
      if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
      // 2. Melhor Saldo de Gols
      if (b.stats.goalDifference !== a.stats.goalDifference) return b.stats.goalDifference - a.stats.goalDifference;
      // 3. Mais Gols Pró (Marcados)
      return b.stats.goalsFor - a.stats.goalsFor;
    });
  });

  if (!rankedTeams) return <div className="p-8 text-center text-slate-500">Carregando estatísticas...</div>;

  return (
    <Container className="pb-16 animate-in fade-in duration-500">
      
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter italic flex items-center justify-center md:justify-start gap-3">
          <BarChart3 className="text-blue-600" size={32} />
          Estatísticas <span className="text-blue-600">Globais</span>
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Ranking geral de desempenho de todas as 48 seleções do torneio.
        </p>
      </header>

      {/* ===== CARDS DE DESTAQUE ===== */}
      {rankedTeams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Líder Geral (TrendingUp) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Líder Geral</p>
              <div className="flex items-center gap-2">
                <TeamDisplay team={rankedTeams[0]} imageClassName="w-5 h-5" textClassName="font-black text-slate-800" />
                <span className="text-sm font-bold text-slate-500">({rankedTeams[0].stats.points} pts)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Melhor Ataque (Swords) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
              <Swords size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Melhor Ataque</p>
              {(() => {
                const bestAttack = [...rankedTeams].sort((a, b) => b.stats.goalsFor - a.stats.goalsFor)[0];
                return (
                  <div className="flex items-center gap-2">
                    <TeamDisplay team={bestAttack} imageClassName="w-5 h-5" textClassName="font-black text-slate-800" />
                    <span className="text-sm font-bold text-emerald-600">({bestAttack.stats.goalsFor} gols)</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Card 3: Melhor Defesa (ShieldAlert) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Melhor Defesa</p>
              {(() => {
                // Filtra para pegar apenas times que já jogaram pelo menos 1 partida, 
                // para não dar prêmio de melhor defesa pra quem tem 0 jogos.
                const teamsWithGames = rankedTeams.filter(t => (t.stats.wins + t.stats.draws + t.stats.losses) > 0);
                const bestDefense = teamsWithGames.length > 0 
                  ? teamsWithGames.sort((a, b) => a.stats.goalsAgainst - b.stats.goalsAgainst)[0]
                  : rankedTeams[0]; // Fallback se ninguém jogou

                return (
                  <div className="flex items-center gap-2">
                    <TeamDisplay team={bestDefense} imageClassName="w-5 h-5" textClassName="font-black text-slate-800" />
                    <span className="text-sm font-bold text-blue-600">({bestDefense.stats.goalsAgainst} sofridos)</span>
                  </div>
                );
              })()}
            </div>
          </div>

        </div>
      )}
      {/* =============================== */}


      {/* A TABELA DE CLASSIFICAÇÃO GERAL */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
        
        <div className="overflow-auto max-h-[65vh] md:max-h-[70vh] custom-scrollbar md:w-full relative">
          
          {/* 🚀 whitespace-nowrap impede que as colunas se espremam, forçando o scroll horizontal */}
          <table className="md:w-full text-sm text-left border-collapse whitespace-nowrap">
            
            <thead className="sticky top-0 z-20 bg-slate-100 text-slate-500 font-bold uppercase tracking-wider text-xs shadow-sm">
              <tr>
                {/* 🚀 COLUNA CONGELADA (Cabeçalho): sticky left-0 e z-30 (acima do top-0) */}
                <th className="sticky left-0 z-30 bg-slate-100 px-6 py-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  Classificação
                </th>
                <th className="px-4 py-4 text-center" title="Pontos">PTS</th>
                <th className="px-4 py-4 text-center" title="Jogos">J</th>
                <th className="px-4 py-4 text-center text-emerald-600" title="Vitórias">V</th>
                <th className="px-4 py-4 text-center text-amber-500" title="Empates">E</th>
                <th className="px-4 py-4 text-center text-rose-500" title="Derrotas">D</th>
                <th className="px-4 py-4 text-center" title="Gols Pró (Marcados)">GP</th>
                <th className="px-4 py-4 text-center" title="Gols Contra (Sofridos)">GC</th>
                <th className="px-4 py-4 text-center font-black text-blue-600" title="Saldo de Gols">SG</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {rankedTeams.map((team, index) => {
                const gamesPlayed = team.stats.wins + team.stats.draws + team.stats.losses;
                
                let rankClass = "text-slate-400 font-bold";
                if (index === 0) rankClass = "text-amber-500 font-black text-lg";
                else if (index === 1) rankClass = "text-slate-400 font-black text-lg";
                else if (index === 2) rankClass = "text-amber-700 font-black text-lg";

                // 🚀 Usamos 'group' na linha para não quebrar o efeito de hover na coluna fixada
                return (
                  <tr key={team.id} className="group hover:bg-slate-50 transition-colors">
                    
                    {/* 🚀 COLUNA CONGELADA (Corpo): bg-white para cobrir os dados passando por baixo */}
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 px-6 py-3 min-w-[180px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-right shrink-0 ${rankClass}`}>
                          {index + 1}º
                        </span>
                        <TeamDisplay team={team} imageClassName="w-6 h-6" textClassName="font-bold text-slate-700" />
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center font-black text-slate-800 text-base bg-slate-50/50">
                      {team.stats.points}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-slate-500">{gamesPlayed}</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-600">{team.stats.wins}</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-500">{team.stats.draws}</td>
                    <td className="px-4 py-3 text-center font-bold text-rose-500">{team.stats.losses}</td>
                    <td className="px-4 py-3 text-center font-medium text-slate-600">{team.stats.goalsFor}</td>
                    <td className="px-4 py-3 text-center font-medium text-slate-600">{team.stats.goalsAgainst}</td>
                    <td className="px-4 py-3 text-center font-black text-blue-600 bg-blue-50/30">
                      {team.stats.goalDifference > 0 ? `+${team.stats.goalDifference}` : team.stats.goalDifference}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
      </div>

      
    </Container>
  );
};