import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { TournamentStage, type Team } from '../types/tournament';

export const ChampionCelebration: React.FC = () => {
  // Estado apenas para registrar qual campeão o usuário já "fechou" a tela, 
  // para não ficar abrindo toda hora que ele navegar pelo app.
  const [closedForChampId, setClosedForChampId] = useState<number | null>(null);

  const finalMatch = useLiveQuery(async () => {
    const matches = await db.matches.where('stage').equals(TournamentStage.FINAL).toArray();
    return matches[0];
  });

  const homeTeam = useLiveQuery(
    () => finalMatch?.homeTeamId ? db.teams.get(finalMatch.homeTeamId) : undefined,
    [finalMatch?.homeTeamId]
  );
  
  const awayTeam = useLiveQuery(
    () => finalMatch?.awayTeamId ? db.teams.get(finalMatch.awayTeamId) : undefined,
    [finalMatch?.awayTeamId]
  );

  const confettiArray = useMemo(() => {
    const emojis = ['✨', '🎉', '🎊', '🏆', '⭐'];
    const generateConfetti = () => Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    return generateConfetti();
  }, []);

  // 🧠 1. CÁLCULO DIRETO (Sem useEffect):
  // O React calcula isso em tempo real toda vez que o banco de dados atualiza.
  let champ: Team | null = null;

  if (finalMatch && homeTeam && awayTeam) {
    const { homeTeamGoals, awayTeamGoals, homeTeamPenalties, awayTeamPenalties } = finalMatch;

    if (homeTeamGoals !== null && awayTeamGoals !== null) {
      if (homeTeamGoals > awayTeamGoals) {
        champ = homeTeam;
      } else if (awayTeamGoals > homeTeamGoals) {
        champ = awayTeam;
      } else {
        const hPen = homeTeamPenalties ?? 0;
        const aPen = awayTeamPenalties ?? 0;
        champ = hPen > aPen ? homeTeam : awayTeam;
      }
    }
  }

  // 🧠 2. DERIVANDO A VISIBILIDADE:
  // Só mostra se houver um campeão E o usuário ainda não tiver fechado a tela para este campeão.
  const isVisible = champ !== null && closedForChampId !== champ.id;

  if (!isVisible || !champ) return null;

  const imageName = champ.logoUrl.split('/').pop();
  
  // Montamos o novo caminho apontando para a sua pasta de imagens 256x256
  const highResLogoUrl = `/plus-size/${imageName}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-1000">
      
      {/* Efeito de Raios de Luz Dourados no fundo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 animate-spin-slow">
        <div className="w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg,transparent_0deg,#eab308_20deg,transparent_40deg,#eab308_60deg,transparent_80deg,#eab308_100deg,transparent_120deg,#eab308_140deg,transparent_160deg,#eab308_180deg,transparent_200deg,#eab308_220deg,transparent_240deg,#eab308_260deg,transparent_280deg,#eab308_300deg,transparent_320deg,#eab308_340deg,transparent_360deg)]"></div>
      </div>

      {/* Partículas caindo simulando Confetes */}
      <div className="absolute inset-0 pointer-events-none flex justify-around overflow-hidden">
        {confettiArray.map((confetti) => (
          <div 
            key={confetti.id} 
            className="text-4xl animate-bounce" 
            style={{ 
              animationDelay: `${confetti.delay}s`,
              animationDuration: `${confetti.duration}s`,
              transform: `translateY(-100vh)`
            }}
          >
            {confetti.emoji}
          </div>
        ))}
      </div>

      {/* Cartão Central do Campeão */}
      <div className="relative z-10 flex flex-col items-center transform transition-all duration-1000 scale-100 hover:scale-105">
        <span className="text-8xl drop-shadow-[0_0_30px_rgba(234,179,8,0.8)] mb-4">🏆</span>
        
        <h2 className="text-2xl font-black text-amber-400 uppercase tracking-[0.3em] mb-8 text-center drop-shadow-lg">
          Campeão do Mundo
        </h2>

        <div className="relative flex flex-col items-center bg-gradient-to-b from-white to-slate-100 p-12 rounded-full border-8 border-amber-400 shadow-[0_0_100px_rgba(234,179,8,0.5)]">
          <img 
            src={highResLogoUrl} 
            alt={champ.name} 
            className="w-48 h-48 object-contain drop-shadow-2xl animate-pulse" 
          />
        </div>

        <h1 className="mt-8 text-6xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-2xl text-center">
          {champ.name}
        </h1>

        <button 
          // Quando clica em fechar, salvamos o ID do campeão para não mostrar a tela de novo à toa
          onClick={() => setClosedForChampId(champ!.id)}
          className="mt-12 px-8 py-3 bg-amber-500 text-slate-900 font-bold uppercase tracking-widest rounded-full hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.4)]"
        >
          Ver Chaveamento
        </button>
      </div>
    </div>
  );
};