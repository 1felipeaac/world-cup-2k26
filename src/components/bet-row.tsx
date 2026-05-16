import React, { useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import type { Match } from "../types/tournament";
import { SweepstakesService } from "../services/sweepstakes-service";
interface BetRowProps {
  match: Match;
  userId: number; // Precisamos saber de quem é o palpite!
}

export const BetRow: React.FC<BetRowProps> = ({ match, userId }) => {
  // Busca as equipas para desenhar as bandeiras
  const homeTeam = useLiveQuery(
    () => db.teams.get(match.homeTeamId),
    [match.homeTeamId],
  );
  const awayTeam = useLiveQuery(
    () => db.teams.get(match.awayTeamId),
    [match.awayTeamId],
  );

  // Busca se já existe um palpite salvo para este utilizador e este jogo
  const existingBet = useLiveQuery(
    () =>
      db.sweepstakesBets
        .where("[userId+matchId]")
        .equals([userId, match.id])
        .first(),
    [userId, match.id],
  );

  const homeInputRef = useRef<HTMLInputElement>(null);
  const awayInputRef = useRef<HTMLInputElement>(null);

  const isMatchLocked =
    match.homeTeamGoals !== null && match.awayTeamGoals !== null;

  const handleBetSave = async () => {
    if (isMatchLocked) return;

    const homeVal = homeInputRef.current?.value;
    const awayVal = awayInputRef.current?.value;

    if (
      homeVal === "" ||
      awayVal === "" ||
      homeVal === undefined ||
      awayVal === undefined
    )
      return;

    const newHomeScore = Math.max(0, parseInt(homeVal, 10));
    const newAwayScore = Math.max(0, parseInt(awayVal, 10));

    // Feedback visual imediato se o utilizador digitou números negativos
    if (homeInputRef.current)
      homeInputRef.current.value = newHomeScore.toString();
    if (awayInputRef.current)
      awayInputRef.current.value = newAwayScore.toString();

    // Evita chamadas desnecessárias se o valor não mudou
    if (
      existingBet &&
      existingBet.homeTeamGoals === newHomeScore &&
      existingBet.awayTeamGoals === newAwayScore
    ) {
      return;
    }

    try {
      await SweepstakesService.saveBet(
        userId,
        match.id,
        newHomeScore,
        newAwayScore,
      );
    } catch (error) {
      console.error("Erro ao salvar palpite:", error);
    }
  };

  if (!homeTeam || !awayTeam) return null;

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
    <div
      className={`bg-white rounded-xl border p-3.5 shadow-sm transition-all relative overflow-hidden ${
        isMatchLocked
          ? "border-slate-200 bg-slate-50/60 opacity-75"
          : "border-indigo-100 hover:shadow-md"
      }`}
    >
      {/* Indicador lateral roxo para palpite ativo OU cinza para bloqueado */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${isMatchLocked ? "bg-slate-300" : "bg-indigo-500"}`}
      ></div>

      {/* ⌚ Cabeçalho Estético: Dia e Hora do Jogo */}
      <div className="flex justify-center mb-2.5">
        <span
          className={`text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
            isMatchLocked
              ? "bg-slate-200 text-slate-500"
              : "bg-indigo-50 text-indigo-600 border border-indigo-100"
          }`}
        >
          {formattedDate} • {formattedTime} {isMatchLocked && "🔒 ENCERRADO"}
        </span>
      </div>

      {/* Grid do Placar */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center pl-2">
        {/* Equipa Mandante */}
        <div className="flex items-center justify-end gap-3">
          <span className="font-semibold text-slate-700 text-sm hidden sm:block truncate max-w-[120px]">
            {homeTeam.name}
          </span>
          <img
            src={homeTeam.logoUrl}
            alt={homeTeam.name}
            className="w-6 h-6 object-contain"
          />
        </div>

        {/* Inputs de Palpite */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            ref={homeInputRef}
            defaultValue={existingBet?.homeTeamGoals ?? ""}
            onBlur={handleBetSave}
            disabled={isMatchLocked} // 🚫 Bloqueia o input nativamente
            className={`w-10 h-10 text-center font-black text-lg rounded-md outline-none transition-all ${
              isMatchLocked
                ? "bg-slate-150 border-slate-300 text-slate-400 cursor-not-allowed"
                : "bg-indigo-50 border border-indigo-200 text-indigo-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            }`}
            placeholder="-"
          />
          <span className="text-slate-300 font-bold text-xs uppercase tracking-widest">
            vs
          </span>
          <input
            type="number"
            min="0"
            ref={awayInputRef}
            defaultValue={existingBet?.awayTeamGoals ?? ""}
            onBlur={handleBetSave}
            disabled={isMatchLocked} // 🚫 Bloqueia o input nativamente
            className={`w-10 h-10 text-center font-black text-lg rounded-md outline-none transition-all ${
              isMatchLocked
                ? "bg-slate-150 border-slate-300 text-slate-400 cursor-not-allowed"
                : "bg-indigo-50 border border-indigo-200 text-indigo-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            }`}
            placeholder="-"
          />
        </div>

        {/* Equipa Visitante */}
        <div className="flex items-center justify-start gap-3">
          <img
            src={awayTeam.logoUrl}
            alt={awayTeam.name}
            className="w-6 h-6 object-contain"
          />
          <span className="font-semibold text-slate-700 text-sm hidden sm:block truncate max-w-[120px]">
            {awayTeam.name}
          </span>
        </div>
      </div>

      {/* 🎉 Badge opcional de feedback se o usuário ganhou pontos nesse jogo */}
      {isMatchLocked && existingBet && existingBet.pointsEarned > 0 && (
        <div className="absolute right-2 bottom-1">
          <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded">
            +{existingBet.pointsEarned} PTS
          </span>
        </div>
      )}
    </div>
  );
};
