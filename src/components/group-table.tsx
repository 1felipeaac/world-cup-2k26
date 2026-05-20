import React, { useState } from "react";
import { type Team } from "../types/tournament";
import { TeamForm } from "./team-form";
import { useLiveQuery } from "dexie-react-hooks";
import { MatchRow } from "./match-row";
import { MatchRepository } from "../repositories/match-repository";
import { SimulatorService } from "../services/simulator-service";
import { TeamDisplay } from "./ui/team-display";
import { Trash2 } from 'lucide-react';
import { ConfirmModal } from "./confirm-modal";

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
  const [showGroupResetModal, setShowGroupResetModal] = useState(false);

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
    setShowGroupResetModal(false)
    
      try {
        await SimulatorService.resetGroup(groupId);

        window.location.reload()
         
      } catch (error) {
        console.error("Erro ao resetar o grupo:", error);
      }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* --- CABEÇALHO --- */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">{groupName}</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowGroupResetModal(true)}
            title="Limpar placares deste grupo"
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"
          >
            <Trash2 size={16}/>
            <span className="hidden sm:inline">Limpar</span>
          </button>

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
              <th className="px-4 py-2 font-medium md:max-w-4 w-8">Pos</th>
              <th className="px-2 py-2 font-medium min-w-16">Seleção</th>
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
                {/* POSIÇÃO */}
                <td className="px-4 py-3 font-bold">
                  <span
                    className={
                      index < 2 ? "text-emerald-600" : "text-slate-400"
                    }
                  >
                    {index + 1}º
                  </span>
                </td>

                <td className="px-2 py-3 max-w-40">
                  <TeamDisplay 
                    team={team}
                    imageClassName="w-7 h-7"
                    className="justify-start" 
                  />
                </td>

                <td className="px-2 py-3 text-center font-bold text-slate-900">
                  {team.stats.points}
                </td>

                {/* SALDO DE GOLS */}
                <td className="px-2 py-3 text-center font-medium">
                  {team.stats.goalDifference}
                </td>

                {/* FORM (RESULTADOS) */}
                <td className="px-4 py-3">
                  <TeamForm form={team.stats.recentForm || []} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={`bg-slate-50 transition-all duration-500 ease-in-out overflow-hidden border-t border-slate-200 ${
          isExpanded
            ? "max-h-125 opacity-100"
            : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <div className="p-4">
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
      <ConfirmModal
    isOpen={showGroupResetModal}
    onClose={handleResetGroup}
    onConfirm={() => SimulatorService.resetGroup(groupId)}
    title="Zerar Grupo"
    message={`Tem certeza que deseja apagar todos os resultados do Grupo ${groupName}? Os times voltarão a ter zero pontos.`}
    confirmText="Zerar Grupo"
    variant="warning" // Podemos usar warning (laranja) por ser menos destrutivo que o geral
  />
    </div>
  );
};
