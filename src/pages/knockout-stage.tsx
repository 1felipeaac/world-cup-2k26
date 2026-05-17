import { useLiveQuery } from "dexie-react-hooks";
import { SimulatorService } from "../services/simulator-service";
import { KnockoutBracket } from "../components/knockout-bracet";
import { useState } from "react";
import { db } from "../db/database";
import { TournamentStage } from "../types/tournament";

export function KnockoutStage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const classification = useLiveQuery(() =>
    SimulatorService.getClassifiedTeams(),
  );

  const allMatches = useLiveQuery(() => db.matches.toArray());

  if (allMatches === undefined || classification === undefined) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3 text-slate-400">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium text-sm">Acessando banco de dados local...</p>
      </div>
    );
  }

  const groupMatches = allMatches.filter(
    (m) => m.stage === TournamentStage.GROUP_STAGE,
  );

  const hasStarted = groupMatches.some((m) => m.homeTeamGoals !== null);

  const isGroupStageFinished =
    groupMatches.length === 72 &&
    groupMatches.every((m) => m.homeTeamGoals !== null);

  if (!hasStarted) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
        <span className="text-6xl mb-6 drop-shadow-md">⚽</span>
        <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tight">
          Torneio <span className="text-rose-600">Zerado</span>
        </h2>
        <p className="text-slate-500 mt-4 max-w-md text-lg">
          Nenhum jogo foi realizado ainda. Simule os resultados na Fase de
          Grupos para ver as seleções apuradas aqui!
        </p>
      </div>
    );
  }

  if (!classification) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400 font-medium">
        Apurando resultados oficiais...
      </div>
    );
  }

  const { directlyClassified, bestThirds } = classification;

  const handleGenerateBracket = async () => {
    setIsGenerating(true);
    try {
      await SimulatorService.generateKnockoutMatches();
    } catch (error) {
      console.error("Erro ao gerar chaveamento:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8 border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">
            Fase <span className="text-rose-600">Final</span> (16-avos)
          </h1>
          <p className="text-slate-500 mt-2">
            As 32 seleções apuradas para o mata-mata, baseadas nos resultados da
            fase de grupos.
          </p>
        </div>

        {/* O Botão agora verifica o tamanho real do array desembrulhado */}
        {allMatches.length <= 72 && (
          <button
            onClick={handleGenerateBracket}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-600 to-rose-500 text-white font-bold rounded-xl hover:from-rose-500 hover:to-rose-400 transition-all shadow-md hover:shadow-lg disabled:opacity-50 whitespace-nowrap"
          >
            {isGenerating ? "A Processar..." : "Gerar Chaveamento Oficial"}
            <span className="text-xl">🏆</span>
          </button>
        )}

        {isGroupStageFinished && allMatches.length <= 72 && (
          <button
            onClick={handleGenerateBracket}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-600 to-rose-500 text-white font-bold rounded-xl hover:from-rose-500 hover:to-rose-400 transition-all shadow-md hover:shadow-lg disabled:opacity-50 whitespace-nowrap"
          >
            {isGenerating ? "A Processar..." : "Gerar Chaveamento Oficial"}
            <span className="text-xl">🏆</span>
          </button>
        )}
      </header>

      {allMatches.length <= 72 ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-5 mb-6 text-sm font-medium flex items-center gap-3">
          <span>💡</span>
          <span>
            A fase de grupos está concluída! Clique no botão acima para gerar os
            16 confrontos do mata-mata.
          </span>
        </div>
      ) : null}

      {/* SEÇÃO 1: Classificados Diretos (1º e 2º de cada grupo) */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-2 bg-blue-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-800">
            Classificação Direta (1º e 2º lugares)
          </h2>
          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full ml-auto">
            {directlyClassified.length}/24 Equipes
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {directlyClassified.map((team, index) => (
            <div
              key={team.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 w-full h-1 bg-blue-500"></div>
              <span className="absolute top-2 left-2 text-[10px] font-black text-slate-300">
                {index + 1}
              </span>
              <img
                src={team.logoUrl}
                alt={team.name}
                className="w-12 h-12 object-contain mb-3 drop-shadow-sm"
              />
              <span
                className="font-bold text-slate-700 text-sm text-center line-clamp-1"
                title={team.name}
              >
                {team.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                {team.stats.points} PTS • SG: {team.stats.goalDifference}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 2: A Repescagem (Os 8 melhores 3º colocados) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-2 bg-amber-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-800">
            Melhores Terceiros Colocados
          </h2>
          <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full ml-auto">
            {bestThirds.length}/8 Equipes
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {bestThirds.map((team, index) => (
            <div
              key={team.id}
              className="bg-linear-to-b from-white to-amber-50/30 border border-amber-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:border-amber-400 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 w-full h-1 bg-amber-500"></div>
              <span className="absolute top-2 left-2 text-[10px] font-black text-amber-300">
                {index + 1}
              </span>
              <img
                src={team.logoUrl}
                alt={team.name}
                className="w-10 h-10 object-contain mb-3 drop-shadow-sm"
              />
              <span
                className="font-bold text-slate-700 text-xs text-center line-clamp-1"
                title={team.name}
              >
                {team.name}
              </span>
              <span className="text-[10px] text-amber-600/70 font-bold mt-1">
                {team.stats.points} PTS
              </span>
            </div>
          ))}
        </div>
      </section>

      <KnockoutBracket matches={allMatches || []} />
    </div>
  );
}
