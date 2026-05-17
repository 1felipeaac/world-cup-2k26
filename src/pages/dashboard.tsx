import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import { GroupTable } from "../components/group-table";

export function Dashboard() {
  const groups = useLiveQuery(() => db.groups.toArray());
  const allTeams = useLiveQuery(() => db.teams.toArray());

  if (!groups || !allTeams) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">
          Simulador <span className="text-blue-600">Fase de Grupos</span>
        </h1>
        <p className="text-slate-500 mt-2">
          Preencha os resultados reais para atualizar a classificação.
        </p>
       
      </header>

      {/* Layout de 1 Card por linha, sem barra de rolagem! */}
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
    </div>
  );
}
