import React, { useState } from "react";
import { TournamentStage, type Match } from "../types/tournament";
import { KnockoutMatchCard } from "./knockout-match-card";
import { MatchResultModal } from "./match-result-modal";

interface KnockoutBracketProps {
  matches: Match[];
}

export const KnockoutBracket: React.FC<KnockoutBracketProps> = ({
  matches,
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  const r32 = matches
    .filter((m) => m.stage === TournamentStage.ROUND_OF_32)
    .sort((a, b) => a.id - b.id);
  const r16 = matches
    .filter((m) => m.stage === TournamentStage.ROUND_OF_16)
    .sort((a, b) => a.id - b.id);
  const qf = matches
    .filter((m) => m.stage === TournamentStage.QUARTER_FINALS)
    .sort((a, b) => a.id - b.id);
  const sf = matches
    .filter((m) => m.stage === TournamentStage.SEMI_FINALS)
    .sort((a, b) => a.id - b.id);
  const tp = matches
    .find((m) => m.stage === TournamentStage.THIRD_PLACE)
  const final = matches.find((m) => m.stage === TournamentStage.FINAL);

  return (
    <>
      <div className="w-75 md:w-full mt-12 bg-slate-800 rounded-3xl p-8 overflow-x-auto shadow-inner relative custom-scrollbar">
        
        <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 sticky left-0 w-max">
          <span className="text-2xl">🏆</span>
          <span className="bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent italic tracking-tighter">
            CHAVEAMENTO OFICIAL
          </span>
        </h2>


        <div className="flex gap-8 md:gap-10 min-w-max pb-8 items-start">
          
  
  
          <div className="flex flex-col gap-4 w-60 shrink-0">
            <h3 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              16-Avos
            </h3>
            {Array.from({ length: 16 }).map((_, i) => (
              <KnockoutMatchCard
                key={`r32-${i}`}
                title={`Jogo ${i + 1}`}
                match={r32[i]}
                onClick={setSelectedMatchId}
              />
            ))}
          </div>

  
          <div className="flex flex-col gap-4 w-60 shrink-0">
            <h3 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Oitavas
            </h3>
            {Array.from({ length: 8 }).map((_, i) => (
              <KnockoutMatchCard
                key={`r16-${i}`}
                title={`Oitava ${i + 1}`}
                match={r16[i]}
                onClick={setSelectedMatchId}
              />
            ))}
          </div>

  
          <div className="flex flex-col gap-4 w-60 shrink-0">
            <h3 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Quartas
            </h3>
            {Array.from({ length: 4 }).map((_, i) => (
              <KnockoutMatchCard
                key={`qf-${i}`}
                title={`Quarta ${i + 1}`}
                match={qf[i]}
                onClick={setSelectedMatchId}
              />
            ))}
          </div>

  
          <div className="flex flex-col gap-4 w-60 shrink-0">
            <h3 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Semifinais
            </h3>
            {Array.from({ length: 2 }).map((_, i) => (
              <KnockoutMatchCard
                key={`sf-${i}`}
                title={`Semi ${i + 1}`}
                match={sf[i]}
                onClick={setSelectedMatchId}
              />
            ))}
          </div>

  
          <div className="flex flex-col gap-8 w-60 shrink-0">
            <div>
              <h3 className="text-center text-xs font-black text-amber-400 uppercase tracking-widest mb-2">
                Grande Final
              </h3>
              <KnockoutMatchCard
                key="final"
                title="Final"
                match={final}
                onClick={setSelectedMatchId}
              />
            </div>

    
            <div className="border-t border-slate-700/50 pt-4">
              <h3 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Disputa de 3º Lugar
              </h3>
              <KnockoutMatchCard
                key="third-place"
                title="3º Lugar"
                match={tp}
                onClick={setSelectedMatchId}
              />
            </div>
          </div>

        </div>
      </div>

      {selectedMatchId && (
        <MatchResultModal
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
        />
      )}
    </>
  );
};
