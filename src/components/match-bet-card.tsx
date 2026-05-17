import React, { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import type { Match, Team } from "../types/tournament";

interface MatchBetCardProps {
  match: Match;
  userId: number;
}

export const MatchBetCard: React.FC<MatchBetCardProps> = ({
  match,
  userId,
}) => {
  const [homeBet, setHomeBet] = useState<string>("");
  const [awayBet, setAwayBet] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showHomeName, setShowHomeName] = useState(false);
  const [showAwayName, setShowAwayName] = useState(false);

  // Busca as Equipes da partida
  const homeTeam = useLiveQuery<Team | undefined>(
    () => (match.homeTeamId ? db.teams.get(match.homeTeamId) : undefined),
    [match.homeTeamId],
  );
  const awayTeam = useLiveQuery<Team | undefined>(
    () => (match.awayTeamId ? db.teams.get(match.awayTeamId) : undefined),
    [match.awayTeamId],
  );

  // Busca o palpite que o utilizador já fez para este jogo (se existir)
  const existingBet = useLiveQuery(async () => {
    // Busca todos os palpites do utilizador e filtra pelo jogo atual
    const bets = await db.sweepstakesBets
      .where("userId")
      .equals(userId)
      .toArray();
    return bets.find((b) => b.matchId === match.id);
  }, [userId, match.id]);

  // Se já houver um palpite no banco, preenche os inputs
  useEffect(() => {
    if (existingBet) {
      setHomeBet(String(existingBet.homeTeamGoals));
      setAwayBet(String(existingBet.awayTeamGoals));
    }
  }, [existingBet]);

  // Função para salvar o palpite no banco
  const handleSaveBet = async () => {
    if (homeBet === "" || awayBet === "") return;
    setIsSaving(true);

    try {
      if (existingBet?.id) {
        // Atualiza palpite existente
        await db.sweepstakesBets.update(existingBet.id, {
          homeTeamGoals: parseInt(homeBet, 10),
          awayTeamGoals: parseInt(awayBet, 10),
        });
      } else {
        // Cria novo palpite
        await db.sweepstakesBets.add({
          userId,
          matchId: match.id,
          homeTeamGoals: parseInt(homeBet, 10),
          awayTeamGoals: parseInt(awayBet, 10),
          pointsEarned: 0, // Começa a 0. Será calculado quando o jogo oficial acabar!
        });
      }
    } catch (error) {
      console.error("Erro ao salvar palpite:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Estados Lógicos do Jogo
  const isMatchFinished =
    match.homeTeamGoals !== null && match.awayTeamGoals !== null;
  const isTeamsDefined = match.homeTeamId !== 0 && match.awayTeamId !== 0;
  const canBet = !isMatchFinished && isTeamsDefined;

  return (
    <div
      className={`bg-white border rounded-2xl p-4 flex flex-col relative transition-all ${
        !isTeamsDefined
          ? "opacity-60 bg-slate-50"
          : "hover:shadow-md border-slate-200"
      }`}
    >
      {/* Etiqueta de Jogo Encerrado */}
      {isMatchFinished && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
          Encerrado: {match.homeTeamGoals} x {match.awayTeamGoals}
        </div>
      )}

      {/* Identificador do Jogo */}
      <div className="text-center text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-wider">
        Jogo #{match.id} • {match.stage.replace(/_/g, " ")}
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* Equipe Casa */}
        <div className="flex flex-col items-center flex-1 w-1/3cursor-pointer"
          onClick={() => setShowHomeName(!showHomeName)}>
          {homeTeam ? (
            <>
              <img
                src={homeTeam.logoUrl}
                alt={homeTeam.name}
                className="w-10 h-10 object-contain mb-2 drop-shadow-sm"
              />
              <span
                className="text-xs font-bold text-slate-700 truncate hidden sm:block"
                title={homeTeam.name}
              >
                {homeTeam.name}
              </span>
              {/* Aparece só em telas pequenas (mobile) */}
              <span
                className="text-xs font-bold text-slate-700 block sm:hidden"
                title={homeTeam.name}
              >
                {showHomeName ? homeTeam.name : homeTeam.abbreviation}
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300 h-full">
              <span className="text-2xl mb-1">🛡️</span>
              <span className="text-[10px] font-medium text-center">
                A definir
              </span>
            </div>
          )}
        </div>

        {/* Área de Inputs do Palpite */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={homeBet}
              onChange={(e) => setHomeBet(e.target.value)}
              disabled={!canBet}
              placeholder="-"
              className="w-12 h-14 text-center font-black text-2xl bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:bg-slate-50 transition-all"
            />
            <span className="text-slate-300 font-bold text-sm">X</span>
            <input
              type="number"
              min="0"
              value={awayBet}
              onChange={(e) => setAwayBet(e.target.value)}
              disabled={!canBet}
              placeholder="-"
              className="w-12 h-14 text-center font-black text-2xl bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:bg-slate-50 transition-all"
            />
          </div>
        </div>

        {/* Equipe Fora */}
        <div className="flex flex-col items-center flex-1 w-1/3cursor-pointer"
          onClick={() => setShowAwayName(!showAwayName)}>
          {awayTeam ? (
            <>
              <img
                src={awayTeam.logoUrl}
                alt={awayTeam.name}
                className="w-10 h-10 object-contain mb-2 drop-shadow-sm"
              />
              <span
                className="text-xs font-bold text-slate-700 truncate hidden sm:block"
                title={awayTeam.name}
              >
                {awayTeam.name}
              </span>
              {/* Aparece só em telas pequenas (mobile) */}
              <span
                className="text-xs font-bold text-slate-700 block sm:hidden"
                title={awayTeam.name}
              >
                {showAwayName ? awayTeam.name : awayTeam.abbreviation}
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300 h-full">
              <span className="text-2xl mb-1">🛡️</span>
              <span className="text-[10px] font-medium text-center">
                A definir
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Botão de Salvar (Só aparece se puder apostar) */}
      {canBet && (
        <button
          onClick={handleSaveBet}
          disabled={homeBet === "" || awayBet === "" || isSaving}
          className={`mt-4 w-full py-2 rounded-lg text-xs font-bold transition-colors ${
            homeBet !== "" && awayBet !== ""
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {isSaving
            ? "A guardar..."
            : existingBet
              ? "Atualizar Palpite"
              : "Salvar Palpite"}
        </button>
      )}
    </div>
  );
};
