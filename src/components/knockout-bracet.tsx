import React, { useState } from "react";
import { TournamentStage, type Match } from "../types/tournament";
import { KnockoutMatchCard } from "./knockout-match-card";
import { MatchResultModal } from "./match-result-modal";

const MatchSkeleton = ({
  title,
  isFinal = false,
}: {
  title: string;
  isFinal?: boolean;
}) => (
  <div
    className={`w-48 bg-white border rounded-lg shadow-sm flex flex-col overflow-hidden opacity-80 transition-all ${
      isFinal ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-200"
    }`}
  >
    <div
      className={`text-[10px] font-black px-2 py-1 uppercase text-center border-b ${
        isFinal
          ? "bg-amber-100 text-amber-600 border-amber-200"
          : "bg-slate-100 text-slate-400 border-slate-200"
      }`}
    >
      {title}
    </div>

    <div className="flex flex-col">
      <div className="flex justify-between items-center px-3 py-2 border-b border-slate-50 h-10">
        <span className="text-sm font-medium text-slate-400">A definir</span>
        <span className="text-xs font-bold text-slate-200">-</span>
      </div>
      <div className="flex justify-between items-center px-3 py-2 h-10">
        <span className="text-sm font-medium text-slate-400">A definir</span>
        <span className="text-xs font-bold text-slate-200">-</span>
      </div>
    </div>
  </div>
);

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
  const final = matches.find((m) => m.stage === TournamentStage.FINAL);

  return (
    <>
      <div className="mt-12 bg-slate-800 rounded-3xl p-8 overflow-x-auto shadow-inner relative">
        <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 sticky left-0">
          <span className="text-2xl">🏆</span>
          <span className="bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent italic tracking-tighter">
            CHAVEAMENTO OFICIAL
          </span>
        </h2>

        {/* Container principal */}
        <div className="flex gap-10 min-w-max pb-8 items-start">
          {/* Coluna 1: 16-Avos de Final (16 Jogos) */}
          <div className="flex flex-col gap-4">
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

          {/* Coluna 2: Oitavas de Final (8 Jogos) */}
          <div className="flex flex-col gap-4">
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

          {/* Coluna 3: Quartos de Final (4 Jogos) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Quartos
            </h3>
            {Array.from({ length: 4 }).map((_, i) => (
              <KnockoutMatchCard
                key={`qf-${i}`}
                title={`Quarto ${i + 1}`}
                match={qf[i]}
                onClick={setSelectedMatchId}
              />
            ))}
          </div>

          {/* Coluna 4: Semifinais (2 Jogos) */}
          <div className="flex flex-col gap-4">
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

          {/* Coluna 5: Grande Final (1 Jogo) */}
          <div className="flex flex-col gap-4">
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
