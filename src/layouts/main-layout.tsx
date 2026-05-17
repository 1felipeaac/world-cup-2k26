import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/sidebar";

export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Injeção da nossa Sidebar isolada */}
      <Sidebar />

      {/* Área do Conteúdo Dinâmico */}
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="md:p-8 p-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
