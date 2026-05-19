import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/sidebar";

export const MainLayout: React.FC = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Injeção da nossa Sidebar isolada */}
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Área do Conteúdo Dinâmico */}
      <main className={`
        pb-20 md:pb-0 transition-all duration-300 ease-in-out flex-1 bg-slate-100
        ${isCollapsed ? 'md:ml-20' : 'lg:ml-64'}
      `}>
        <div className="md:p-8 p-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
