import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SimulatorService } from '../services/simulator-service';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  // Estado que controla se a barra está recolhida ou não
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleResetTournament = async () => {
    const confirm = window.confirm(
      "Atenção: Isto apagará TODOS os resultados e placares oficiais do simulador. O histórico do Bolão não será afetado. Deseja continuar?"
    );
    if (confirm) {
      try {
        await SimulatorService.resetTournament();
      } catch (error) {
        console.error("Erro ao resetar o torneio:", error);
      }
    }
  };

  const navItems = [
    { name: 'Simulador Oficial', path: '/', icon: '🏆' },
    { name: 'Fase Final (16-avos)', path: '/mata-mata', icon: '🔥' }, 
    { name: 'Modo Bolão', path: '/bolao', icon: '🎯' },
  ];

  return (
    <aside 
      className={`bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 min-h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-15' : 'w-64'
      }`}
    >
      {/* Cabeçalho & Botão de Toggle */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {/* Logótipo - Oculto quando recolhido */}
        <div className={`transition-opacity duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
          <h2 className="text-2xl font-black text-white italic tracking-tighter">
            Copa<span className="text-blue-500">2026</span>
          </h2>
        </div>

        {/* Botão de Expandir/Recolher */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
          title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
        >
          <svg 
            className={`w-6 h-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Título de Seção - Oculto quando recolhido */}
      {!isCollapsed && (
        <div className="px-6 mb-2">
          <p className="text-xs text-slate-500 uppercase tracking-widest whitespace-nowrap">Painel de Controle</p>
        </div>
      )}

      {/* Links de Navegação */}
      <nav className="flex-1 md:px-4 px-2 space-y-2 mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.name : ""} // Mostra o nome ao passar o mouse se estiver recolhido
              className={`flex items-center rounded-xl transition-all font-medium overflow-hidden ${
                isCollapsed ? 'justify-center px-0 py-3' : 'justify-start gap-3 px-4 py-3'
              } ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              
              <span className={`whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Zona de Perigo (Rodapé da Sidebar) */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleResetTournament}
          title="Zerar Simulador"
          className={`flex items-center justify-center gap-2 py-3 text-sm font-bold text-rose-400 bg-slate-800/50 hover:bg-rose-500 hover:text-white rounded-xl transition-colors w-full overflow-hidden ${
            isCollapsed ? 'px-0' : 'px-4'
          }`}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          
          <span className={`whitespace-nowrap transition-all duration-300 ${
            isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
          }`}>
            Zerar Simulador
          </span>
        </button>
      </div>
    </aside>
  );
};