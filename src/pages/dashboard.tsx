import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import { GroupTable } from "../components/group-table";
import Container from "../components/container";
import { useState } from "react";
import { SimulatorService } from "../services/simulator-service";
import { ConfirmModal } from "../components/confirm-modal";
import { RotateCcw } from "lucide-react";

export function Dashboard() {
  const groups = useLiveQuery(() => db.groups.toArray());
  const allTeams = useLiveQuery(() => db.teams.toArray());

  const [showResetModal, setShowResetModal] = useState(false);

  if (!groups || !allTeams) return null;

  const executeReset = async () => {
    try {
      await SimulatorService.resetTournament();
      window.location.reload(); 
    } catch (error) {
      console.error("Erro ao resetar o torneio:", error);
    }
  };

  return (
    <Container>
      <header className="mb-8">

        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">
          Simulador <span className="text-blue-600">Fase de Grupos</span>
        </h1>
        <p className="text-slate-500 mt-2">
          Preencha os resultados reais para atualizar a classificação.
        </p>

        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm font-bold text-sm shrink-0 active:scale-95"
        >
          <RotateCcw size={18} />
          Zerar Torneio
        </button>
       
      </header>

      <div className="flex flex-col gap-8">
        {groups.map((group) => {
          const groupTeams = allTeams.filter((team) =>
            group.teams.some((gt) => gt?.id === team.id),
          );

          return (
            <GroupTable
              key={group.id}
              groupId={group.id}
              groupName={group.name}
              teams={groupTeams}
            />
          );
        })}
      </div>

      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={executeReset}
        title="Zerar Simulador"
        message="Atenção: Isto apagará TODOS os resultados e placares oficiais do simulador. O histórico do Bolão não será afetado. Deseja continuar?"
        confirmText="Sim, zerar tudo"
        variant="danger"
      />
    </Container>
  );
}
