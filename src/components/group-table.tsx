import React, { useState } from "react";
import { type Team } from "../types/tournament";
import { TeamForm } from "./team-form";
import { useLiveQuery } from "dexie-react-hooks";
import { MatchRow } from "./match-row";
import { MatchRepository } from "../repositories/match-repository";
import { SimulatorService } from "../services/simulator-service";

interface GroupTableProps {
  groupId: number;
  groupName: string;
  teams: Team[];
}

export const GroupTable: React.FC<GroupTableProps> = ({
  groupId,
  groupName,
  teams,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeRound, setActiveRound] = useState(1);

  const matches =
    useLiveQuery(
      () => MatchRepository.getByGroupAndRound(groupId, activeRound),
      [groupId, activeRound],
    ) || [];

  const sortedTeams = [...teams].sort((a, b) => {
    if (b.stats.points !== a.stats.points)
      return b.stats.points - a.stats.points;
    if (b.stats.goalDifference !== a.stats.goalDifference)
      return b.stats.goalDifference - a.stats.goalDifference;
    return b.stats.goalsFor - a.stats.goalsFor;
  });

  const handleResetGroup = async () => {
    if (
      window.confirm(
        `Tem certeza que deseja zerar os placares do ${groupName}?`,
      )
    ) {
      try {
        await SimulatorService.resetGroup(groupId);
      } catch (error) {
        console.error("Erro ao resetar o grupo:", error);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* --- CABEÇALHO --- */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">{groupName}</h3>
        <div className="flex items-center gap-4">
          {/* Botão de Resetar o Grupo */}
          <button
            onClick={handleResetGroup}
            title="Limpar placares deste grupo"
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="hidden sm:inline">Limpar</span>
          </button>

          {/* Botão de Expandir/Simular (que já tínhamos) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            {isExpanded ? "Ocultar Jogos" : "Simular Jogos"}
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* --- TABELA DE CLASSIFICAÇÃO --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/50">
            <tr>
              <th className="px-4 py-2 font-medium">Pos</th>
              <th className="px-2 py-2 font-medium">Seleção</th>
              <th className="px-2 py-2 font-medium text-center">P</th>
              <th className="px-2 py-2 font-medium text-center">SG</th>
              <th className="px-4 py-2 font-medium text-right">Resultados</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTeams.map((team, index) => (
              <tr
                key={team.id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-4 py-3 font-bold">
                  <span
                    className={
                      index < 2 ? "text-emerald-600" : "text-slate-400"
                    }
                  >
                    {index + 1}º
                  </span>
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={team.logoUrl}
                      alt=""
                      className="w-5 h-5 object-contain"
                    />
                    <span className="font-semibold text-slate-800 truncate max-w-25">
                      {team.name}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-3 text-center font-bold text-slate-900">
                  {team.stats.points}
                </td>
                <td className="px-2 py-3 text-center font-medium">
                  {team.stats.goalDifference}
                </td>
                <td className="px-4 py-3">
                  <TeamForm form={team.stats.recentForm || []} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ACCORDION DE JOGOS (Oculto por defeito) --- */}
      <div
        className={`bg-slate-50 transition-all duration-500 ease-in-out overflow-hidden border-t border-slate-200 ${
          isExpanded
            ? "max-h-125 opacity-100"
            : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <div className="p-4">
          {/* Navegação de Rodadas (Carrossel simplificado) */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((round) => (
              <button
                key={round}
                onClick={() => setActiveRound(round)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  activeRound === round
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                }`}
              >
                Rodada {round}
              </button>
            ))}
          </div>

          {/* Lista de Jogos da Rodada Selecionada */}
          <div className="flex flex-col gap-2">
            {matches.length > 0 ? (
              matches.map((match) => <MatchRow key={match.id} match={match} />)
            ) : (
              <p className="text-center text-xs text-slate-400 py-4">
                A carregar jogos...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
