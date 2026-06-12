import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import { SweepstakesService } from "../services/sweepstakes-service";
import type { SweepstakesUser } from "../types/bet";
import { UserBetsPanel } from "../components/user-bets-panel";

import { Trash2 } from 'lucide-react';
import { ConfirmModal } from "../components/confirm-modal";
import Container from "../components/container";

export function Sweepstakes() {
  const [newUserName, setNewUserName] = useState("");
  const [selectedUser, setSelectedUser] = useState<SweepstakesUser | null>(
    null,
  );

  const [participantToDelete, setParticipantToDelete] = useState<{ id: number; name: string } | null>(null);

  
  const participants = useLiveQuery(() =>
    db.sweepstakesUsers.orderBy("totalPoints").reverse().toArray(),
  );

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault(); 

    try {
      await SweepstakesService.addParticipant(newUserName);
      setNewUserName(""); 
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar participante.");
    }
  };

  const handleRemoveClick = (
    userId: number,
    userName: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation(); 
    setParticipantToDelete({ id: userId, name: userName });
  };

  const executeRemove = async () => {
    if (!participantToDelete) return;

    try {
      await SweepstakesService.removeParticipant(participantToDelete.id);

      
      if (selectedUser?.id === participantToDelete.id) {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Erro ao remover participante:", error);
    } finally {
      
      setParticipantToDelete(null); 
    }
  };

  return (
    <Container className="md:max-w-5xl">
      
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">
          Modo <span className="text-blue-600">Bolão</span>
        </h1>
        <p className="text-slate-500 mt-2">
          Gira os participantes e acompanhe o ranking de palpites.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {!selectedUser && (
          <div className="lg:col-span-1 sticky top-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                  👤
                </span>
                Novo Participante
              </h3>

              <form
                onSubmit={handleAddParticipant}
                className="flex flex-col gap-3"
              >
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Nome do amigo (ex: João)"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={!newUserName.trim()}
                  className="w-full px-4 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  Adicionar ao Bolão
                </button>
              </form>
            </div>
          </div>
        )}

  
        <div
          className={`transition-all duration-500 ${selectedUser ? "lg:col-span-1" : "lg:col-span-2"}`}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Ranking</h3>
              <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                {participants?.length || 0} Participantes
              </span>
            </div>

            <ul className="divide-y divide-slate-100">
              {participants?.map((user, index) => (
                <li
                  key={user.id}
                  className={`flex items-center justify-between px-5 py-4 transition-colors cursor-pointer group ${
                    selectedUser?.id === user.id
                      ? "bg-indigo-50 border-l-4 border-indigo-500"
                      : "hover:bg-slate-50/50 border-l-4 border-transparent"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm w-4 text-center text-slate-400">
                      {index + 1}º
                    </span>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                      {user.name.substring(0, 2)}
                    </div>
                    <span className="font-semibold text-slate-700 text-sm">
                      {user.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block font-black text-lg text-slate-800 leading-none">
                        {user.totalPoints}
                      </span>
                    </div>

                    
                    <button
                      onClick={(e) => handleRemoveClick(user.id!, user.name, e)
                      }
                      className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                      title={`Remover ${user.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

  
        {selectedUser && (
          <div className="lg:col-span-2 h-200">
            {" "}
            
            <UserBetsPanel
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={participantToDelete !== null}
        onClose={() => setParticipantToDelete(null)}
        onConfirm={executeRemove}
        title="Remover Participante"
        message={`Atenção: Deseja realmente remover "${participantToDelete?.name}" do bolão? Isso apagará TODOS os palpites dessa pessoa e não pode ser desfeito.`}
        confirmText="Sim, remover"
        variant="danger"
      />
    </Container>
  );
}
