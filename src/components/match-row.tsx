import React, { useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import type { Match } from "../types/tournament";
import { SimulatorService } from "../services/simulator-service";

interface MatchRowProps {
  match: Match;
}

export const MatchRow: React.FC<MatchRowProps> = ({ match }) => {
  // Vamos buscar as equipes à base de dados através dos IDs guardados na partida
  const homeTeam = useLiveQuery(
    () => db.teams.get(match.homeTeamId),
    [match.homeTeamId],
  );
  const awayTeam = useLiveQuery(
    () => db.teams.get(match.awayTeamId),
    [match.awayTeamId],
  );

  // Usamos Refs para os inputs para evitar re-renderizações desnecessárias enquanto o utilizador digita
  const homeInputRef = useRef<HTMLInputElement>(null);
  const awayInputRef = useRef<HTMLInputElement>(null);

  const handleScoreUpdate = async () => {
    const homeVal = homeInputRef.current?.value;
    const awayVal = awayInputRef.current?.value;

    if (
      homeVal === "" ||
      awayVal === "" ||
      homeVal === undefined ||
      awayVal === undefined
    )
      return;

    // Converte para número e garante que nunca é menor que 0
    const newHomeScore = Math.max(0, parseInt(homeVal, 10));
    const newAwayScore = Math.max(0, parseInt(awayVal, 10));

    // Feedback Visual: Se o utilizador digitou -2, o input volta a mostrar 0
    if (homeInputRef.current)
      homeInputRef.current.value = newHomeScore.toString();
    if (awayInputRef.current)
      awayInputRef.current.value = newAwayScore.toString();

    if (
      newHomeScore === match.homeTeamGoals &&
      newAwayScore === match.awayTeamGoals
    )
      return;

    try {
      await SimulatorService.updateMatchScore(
        match.id,
        newHomeScore,
        newAwayScore,
      );
    } catch (error) {
      console.error("Erro ao atualizar o placar:", error);
    }
  };

  // Previne a renderização se os dados das equipes ainda não tiverem sido carregados do Dexie
  if (!homeTeam || !awayTeam) return null;

  // Formatação profissional da Data e Hora
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
  });
  const formattedTime = matchDate.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-lg border border-slate-100 p-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Cabeçalho da Partida (Data e Hora) */}
      <div className="flex justify-center mb-3">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">
          {formattedDate} • {formattedTime}
        </span>
      </div>

      {/* Grid do Placar */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
        {/* Equipe Mandante (Esquerda) */}
        <div className="flex items-center justify-end gap-3">
          <span className="font-semibold text-slate-700 text-sm hidden sm:block truncate max-w-[120px]">
            {homeTeam.name}
          </span>
          <img
            src={homeTeam.logoUrl}
            alt={homeTeam.name}
            className="w-8 h-8 object-contain"
          />
        </div>

        {/* Inputs de Gol (Centro) */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="99"
            ref={homeInputRef}
            defaultValue={match.homeTeamGoals ?? ""} // Usa defaultValue em vez de value (Uncontrolled Component)
            onBlur={handleScoreUpdate}
            className="w-10 h-10 text-center font-black text-slate-800 text-lg bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <span className="text-slate-300 font-bold text-sm">X</span>
          <input
            type="number"
            min="0"
            max="99"
            ref={awayInputRef}
            defaultValue={match.awayTeamGoals ?? ""}
            onBlur={handleScoreUpdate}
            className="w-10 h-10 text-center font-black text-slate-800 text-lg bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Equipe Visitante (Direita) */}
        <div className="flex items-center justify-start gap-3">
          <img
            src={awayTeam.logoUrl}
            alt={awayTeam.name}
            className="w-8 h-8 object-contain"
          />
          <span className="font-semibold text-slate-700 text-sm hidden sm:block truncate max-w-[120px]">
            {awayTeam.name}
          </span>
        </div>
      </div>
    </div>
  );
};
