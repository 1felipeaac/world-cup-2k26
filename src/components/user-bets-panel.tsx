import React, { useState } from "react";
import type { SweepstakesUser } from "../types/bet";
import { db } from "../db/database";
import { useLiveQuery } from "dexie-react-hooks";
import { TournamentStage, type Match } from "../types/tournament";
import { MatchBetCard } from "./match-bet-card";

interface UserBetsPanelProps {
  user: SweepstakesUser;
  onClose: () => void;
}

export const UserBetsPanel: React.FC<UserBetsPanelProps> = ({
  user,
  onClose,
}) => {
  // O estado inicial agora começa focado na primeira rodada dos grupos
  const [activeTab, setActiveTab] = useState<string>("group_stage_r1");

  // Busca todos os jogos do banco de dados
  const allMatches = useLiveQuery(() => db.matches.toArray());

  if (!allMatches) {
    return (
      <div className="p-8 text-center text-slate-400">
        A carregar palpites...
      </div>
    );
  }

  // 🧠 MAPEAMENTO GRANULAR: Separamos a Fase de Grupos por Rodadas (usando roundId)
  const matchesByTab: Record<string, Match[]> = {
    group_stage_r1: allMatches.filter(
      (m) => m.stage === TournamentStage.GROUP_STAGE && m.roundId === 1,
    ),
    group_stage_r2: allMatches.filter(
      (m) => m.stage === TournamentStage.GROUP_STAGE && m.roundId === 2,
    ),
    group_stage_r3: allMatches.filter(
      (m) => m.stage === TournamentStage.GROUP_STAGE && m.roundId === 3,
    ),
    [TournamentStage.ROUND_OF_32]: allMatches.filter(
      (m) => m.stage === TournamentStage.ROUND_OF_32,
    ),
    [TournamentStage.ROUND_OF_16]: allMatches.filter(
      (m) => m.stage === TournamentStage.ROUND_OF_16,
    ),
    [TournamentStage.QUARTER_FINALS]: allMatches.filter(
      (m) => m.stage === TournamentStage.QUARTER_FINALS,
    ),
    [TournamentStage.SEMI_FINALS]: allMatches.filter(
      (m) => m.stage === TournamentStage.SEMI_FINALS,
    ),
    [TournamentStage.FINAL]: allMatches.filter(
      (m) => m.stage === TournamentStage.FINAL,
    ),
  };

  // Nomes amigáveis e organizados para a barra de navegação
  const tabNames: Record<string, string> = {
    group_stage_r1: "Grupos - 1ª Rodada",
    group_stage_r2: "Grupos - 2ª Rodada",
    group_stage_r3: "Grupos - 3ª Rodada",
    [TournamentStage.ROUND_OF_32]: "16-Avos",
    [TournamentStage.ROUND_OF_16]: "Oitavas",
    [TournamentStage.QUARTER_FINALS]: "Quartos",
    [TournamentStage.SEMI_FINALS]: "Semifinais",
    [TournamentStage.FINAL]: "Final",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col md:min-w-xl">
      
      <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-black text-xl">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <span className="text-blue-300 text-sm font-semibold">
              {user.totalPoints} Pontos no Ranking
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>

      
      <div className="flex overflow-x-auto bg-slate-50 border-b border-slate-200 p-2 gap-2 shrink-0 hide-scrollbar">
        {Object.entries(matchesByTab).map(([tabId, matches]) => {
          // Condição de ouro: Se for mata-mata e ainda não foi gerado, não mostra a aba.
          // Se for fase de grupos, mostra sempre (mesmo vazia por algum motivo).
          if (matches.length === 0 && !tabId.startsWith("group_stage"))
            return null;

          return (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tabId
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200"
              }`}
            >
              {tabNames[tabId]}
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tabId
                    ? "bg-blue-800/50 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {matches.length}
              </span>
            </button>
          );
        })}
      </div>

      
      <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchesByTab[activeTab]?.map((match) => (
            <MatchBetCard key={match.id} match={match} userId={user.id!} />
          ))}
        </div>

        {matchesByTab[activeTab]?.length === 0 && (
          <div className="text-center text-slate-400 py-12 font-medium bg-white rounded-2xl border border-dashed border-slate-200">
            Nenhum jogo disponível nesta fase de momento.
          </div>
        )}
      </div>
    </div>
  );
};
