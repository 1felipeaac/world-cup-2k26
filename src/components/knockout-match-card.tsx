import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import type { Match, Team } from "../types/tournament";

interface KnockoutMatchCardProps {
  match?: Match; 
  title: string;
  isFinal?: boolean;
  onClick?: (matchId: number) => void;
}

export const KnockoutMatchCard: React.FC<KnockoutMatchCardProps> = ({
  match,
  title,
  isFinal,
  onClick,
}) => {
  const [showHomeName, setShowHomeName] = useState(false);
  const [showAwayName, setShowAwayName] = useState(false);

  
  const homeTeam = useLiveQuery<Team | undefined>(() => {
    if (!match?.homeTeamId) return undefined;
    return db.teams.get(match.homeTeamId);
  }, [match?.homeTeamId]);

  const awayTeam = useLiveQuery<Team | undefined>(() => {
    if (!match?.awayTeamId) return undefined;
    return db.teams.get(match.awayTeamId);
  }, [match?.awayTeamId]);

  const isLocked =
    match?.homeTeamGoals !== null && match?.awayTeamGoals !== null;

  return (
    <div
      onClick={() => {
        if (match && homeTeam && awayTeam && onClick) onClick(match.id);
      }}
      className={`w-52 bg-white border rounded-xl shadow-sm flex flex-col overflow-hidden transition-all duration-500 ${
        isFinal
          ? "border-amber-300 ring-2 ring-amber-100 scale-105 my-2"
          : "border-slate-200"
      } ${!match ? "opacity-40" : "hover:border-blue-400 hover:shadow-md cursor-pointer"}`}
    >
      
      <div
        className={`text-[9px] font-black px-2 py-1 uppercase text-center border-b tracking-tighter ${
          isFinal
            ? "bg-amber-100 text-amber-700 border-amber-200"
            : "bg-slate-50 text-slate-400 border-slate-200"
        }`}
      >
        {title} {match && `• #${match.id}`}
      </div>

      <div className="flex flex-col bg-white">
        
        <div className="flex justify-between items-center px-3 py-2.5 border-b border-slate-50">
          <div
            className="flex items-center gap-2 overflow-hidden cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); 
              setShowHomeName(!showHomeName);
            }}
          >
            {homeTeam ? (
              <>
                <img
                  src={homeTeam.logoUrl}
                  className="w-5 h-5 object-contain shrink-0"
                  alt={homeTeam.name}
                />
                <span
                  className="text-xs font-bold text-slate-700 truncate hidden sm:block"
                  title={homeTeam.name}
                >
                  {homeTeam.name}
                </span>
                
                <span
                  className="text-xs font-bold text-slate-700 block sm:hidden"
                  title={homeTeam.name}
                >
                  {showHomeName ? homeTeam.name : homeTeam.abbreviation}
                </span>
              </>
            ) : (
              <span className="text-xs font-medium text-slate-300 italic">
                A definir
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {match?.homeTeamPenalties != null && (
              <span className="text-[10px] font-black text-amber-500">
                ({match.homeTeamPenalties})
              </span>
            )}
            <span
              className={`text-xs font-black ${isLocked ? "text-slate-800" : "text-slate-200"}`}
            >
              {match?.homeTeamGoals ?? "-"}
            </span>
          </div>
        </div>

        
        <div className="flex justify-between items-center px-3 py-2.5">
          <div
            className="flex items-center gap-2 overflow-hidden cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); 
              setShowAwayName(!showAwayName);
            }}
          >
            {awayTeam ? (
              <>
                <img
                  src={awayTeam.logoUrl}
                  className="w-5 h-5 object-contain shrink-0"
                  alt={awayTeam.name}
                />
                <span
                  className="text-xs font-bold text-slate-700 truncate hidden sm:block"
                  title={awayTeam.name}
                >
                  {awayTeam.name}
                </span>
                <span
                  className="text-xs font-bold text-slate-700 block sm:hidden"
                  title={awayTeam.name}
                >
                  {showAwayName ? awayTeam.name : awayTeam.abbreviation}
                </span>
              </>
            ) : (
              <span className="text-xs font-medium text-slate-300 italic">
                A definir
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {match?.awayTeamPenalties != null && (
              <span className="text-[10px] font-black text-amber-500">
                ({match.awayTeamPenalties})
              </span>
            )}
            <span
              className={`text-xs font-black ${isLocked ? "text-slate-800" : "text-slate-200"}`}
            >
              {match?.awayTeamGoals ?? "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
