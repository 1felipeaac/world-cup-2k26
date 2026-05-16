import React, { useState } from "react";
import type { SweepstakesUser } from "../types/bet";
import { db } from "../db/database";
import { useLiveQuery } from "dexie-react-hooks";
import { BetRow } from "./bet-row";

interface UserBetsPanelProps {
  user: SweepstakesUser;
  onClose: () => void;
}

export const UserBetsPanel: React.FC<UserBetsPanelProps> = ({
  user,
  onClose,
}) => {
  // Estado para controlar qual aba (rodada) está ativa. Começamos na Rodada 1.
  const [activeRound, setActiveRound] = useState(1);

  // Busca todas as rodadas disponíveis no banco para desenhar as abas dinamicamente
  const rounds = useLiveQuery(() => db.rounds.toArray()) || [];

  // Busca APENAS os jogos que pertencem à rodada ativa (Performance ++)
  const roundMatches =
    useLiveQuery(
      () => db.matches.where("roundId").equals(activeRound).toArray(),
      [activeRound],
    ) || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* --- CABEÇALHO --- */}
      <div className="bg-slate-900 px-5 py-4 flex items-center justify-between shadow-md z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm uppercase shadow-inner border-2 border-slate-800">
            {user.name.substring(0, 2)}
          </div>
          <div>
            <h3 className="font-bold text-white leading-tight">
              Palpites de {user.name}
            </h3>
            <p className="text-xs text-indigo-300 font-medium">
              Preencha os resultados por rodada
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors"
          title="Fechar Painel"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* --- BARRA DE NAVEGAÇÃO DE RODADAS (TABS) --- */}
      <div className="bg-slate-800 border-b border-slate-700 overflow-x-auto custom-scrollbar z-10">
        <div className="flex px-4 py-2 gap-2 min-w-max">
          {rounds.map((round) => {
            const isActive = activeRound === round.id;
            return (
              <button
                key={round.id}
                onClick={() => setActiveRound(round.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-md"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                Rodada {round.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- ÁREA DE PALPITES (CONTEÚDO) --- */}
      <div className="p-4 flex-1 overflow-y-auto bg-slate-50 relative">
        {roundMatches.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-slate-400 font-medium">
              Nenhum jogo encontrado para esta rodada.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-8">
            {roundMatches.map((match) => (
              <BetRow
                key={`${user.id}-${match.id}`}
                match={match}
                userId={user.id!}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
