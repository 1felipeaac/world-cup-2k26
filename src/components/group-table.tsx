import React from "react";
import { type Team } from "../model/tournament";
import { TeamForm } from "./team-form";

interface GroupTableProps {
  groupName: string;
  teams: Team[];
}

export const GroupTable: React.FC<GroupTableProps> = ({ groupName, teams }) => {
 
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.stats.points !== a.stats.points)
      return b.stats.points - a.stats.points;
    if (b.stats.goalDifference !== a.stats.goalDifference)
      return b.stats.goalDifference - a.stats.goalDifference;
    return b.stats.goalsFor - a.stats.goalsFor;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-700">{groupName}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-400 uppercase bg-slate-50/50">
            <tr>
              <th className="px-4 py-2 font-medium">Pos</th>
              <th className="px-2 py-2 font-medium">Seleção</th>
              <th className="px-2 py-2 font-medium text-center">P</th>
              <th className="px-2 py-2 font-medium text-center">SG</th>
              <th className="px-4 py-2 font-medium text-right">Forma</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedTeams.map((team, index) => (
              <tr
                key={team.id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-4 py-3 font-bold">
                  <span
                    className={index < 2 ? "text-green-600" : "text-slate-400"}
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
                <td className="px-4 py-3 text-right">
                  <TeamForm form={team.stats.recentForm || []} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
