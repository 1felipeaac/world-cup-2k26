import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { GroupTable } from '../components/group-table';

export function Dashboard() {

  const groups = useLiveQuery(() => db.groups.toArray());
  const allTeams = useLiveQuery(() => db.teams.toArray());

  if (!groups || !allTeams) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">
          Copa do Mundo 2026 <span className="text-blue-600">Dashboard</span>
        </h1>
        <p className="text-slate-500">Acompanhe a classificação em tempo real dos grupos.</p>
      </header>

      {/* Grid responsivo para os 12 grupos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {groups.map((group) => {
          // Filtra os times que pertencem a este grupo
          const groupTeams = allTeams.filter(team => 
            group.teams.some(gt => gt?.id === team.id)
          );

          return (
            <GroupTable 
              key={group.id} 
              groupName={group.name} 
              teams={groupTeams} 
            />
          );
        })}
      </div>
    </div>
  );
}