/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Team } from '../types/tournament';
import { SimulatorService } from '../services/simulator-service';

interface MatchResultModalProps {
  matchId: number;
  onClose: () => void;
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({ matchId, onClose }) => {
  const match = useLiveQuery(() => db.matches.get(matchId), [matchId]);
  
  const homeTeam = useLiveQuery<Team | undefined>(
    () => match?.homeTeamId ? db.teams.get(match.homeTeamId) : undefined,
    [match?.homeTeamId]
  );
  
  const awayTeam = useLiveQuery<Team | undefined>(
    () => match?.awayTeamId ? db.teams.get(match.awayTeamId) : undefined,
    [match?.awayTeamId]
  );

  
  const [homeGoals, setHomeGoals] = useState<string>('');
  const [awayGoals, setAwayGoals] = useState<string>('');
  const [homePen, setHomePen] = useState<string>('');
  const [awayPen, setAwayPen] = useState<string>('');

  
  useEffect(() => {
    if (match) {
      setHomeGoals(match.homeTeamGoals !== null ? String(match.homeTeamGoals) : '');
      setAwayGoals(match.awayTeamGoals !== null ? String(match.awayTeamGoals) : '');
      setHomePen(match.homeTeamPenalties != null ? String(match.homeTeamPenalties) : '');
      setAwayPen(match.awayTeamPenalties != null ? String(match.awayTeamPenalties) : '');
    }
  }, [match]);

  
  const isDraw = homeGoals !== '' && awayGoals !== '' && homeGoals === awayGoals;

  const handleSave = async () => {
    if (!match) return;
    
    
    const hGoals = parseInt(homeGoals, 10);
    const aGoals = parseInt(awayGoals, 10);
    const hPen = isDraw ? parseInt(homePen, 10) : null;
    const aPen = isDraw ? parseInt(awayPen, 10) : null;

    try {
      await SimulatorService.updateKnockoutMatchScore(match.id, hGoals, aGoals, hPen, aPen);
      onClose(); 
    } catch (error) {
      console.error("Erro ao salvar resultado:", error);
    }
  };

  if (!match || !homeTeam || !awayTeam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-fade-in-up">
        
        
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-slate-800 uppercase tracking-tight">Resultado Oficial</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors p-1">
            ✕
          </button>
        </div>

        
        <div className="p-8">
          <div className="flex justify-between items-center gap-4">
            
            <div className="flex flex-col items-center flex-1">
              <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-16 h-16 object-contain drop-shadow-md mb-3" />
              <span className="font-bold text-slate-700 text-center text-sm">{homeTeam.name}</span>
            </div>

            
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={homeGoals}
                onChange={(e) => setHomeGoals(e.target.value)}
                className="w-14 h-16 text-center font-black text-3xl bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <span className="text-slate-300 font-bold">X</span>
              <input
                type="number"
                min="0"
                value={awayGoals}
                onChange={(e) => setAwayGoals(e.target.value)}
                className="w-14 h-16 text-center font-black text-3xl bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            
            <div className="flex flex-col items-center flex-1">
              <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-16 h-16 object-contain drop-shadow-md mb-3" />
              <span className="font-bold text-slate-700 text-center text-sm">{awayTeam.name}</span>
            </div>
          </div>

          
          {isDraw && (
            <div className="mt-8 pt-6 border-t border-dashed border-slate-200 animate-fade-in-up">
              <h4 className="text-center text-xs font-black text-amber-500 uppercase tracking-widest mb-4">
                Desempate por Penáltis
              </h4>
              <div className="flex justify-center items-center gap-6">
                <input
                  type="number"
                  min="0"
                  value={homePen}
                  onChange={(e) => setHomePen(e.target.value)}
                  placeholder="0"
                  className="w-12 h-12 text-center font-bold text-xl text-amber-700 bg-amber-50 border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-amber-300 text-xs font-bold">PÊN</span>
                <input
                  type="number"
                  min="0"
                  value={awayPen}
                  onChange={(e) => setAwayPen(e.target.value)}
                  placeholder="0"
                  className="w-12 h-12 text-center font-bold text-xl text-amber-700 bg-amber-50 border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleSave}
            disabled={homeGoals === '' || awayGoals === '' || (isDraw && (homePen === '' || awayPen === '' || homePen === awayPen))}
            className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Resultado
          </button>
        </div>
      </div>
    </div>
  );
};