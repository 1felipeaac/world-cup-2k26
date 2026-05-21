import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SimulatorService } from '../services/simulator-service';
import { Home, Trophy, Target, Settings, RotateCcw, UserCircle, HelpCircle } from 'lucide-react';
import { ConfirmModal } from './confirm-modal';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  // Estado que controla se a barra está recolhida ou não (apenas Desktop)

  const [showResetModal, setShowResetModal] = useState(false);

  const executeReset = async () => {
    try {
      await SimulatorService.resetTournament();
      // Dica: Como você resetou o banco, é uma boa prática forçar um reload 
      // ou atualizar o estado global para a tela refletir a mudança imediatamente:
      window.location.reload(); 
    } catch (error) {
      console.error("Erro ao resetar o torneio:", error);
    }
  };


  const navItems = [
    { name: 'Simulador Oficial', path: '/', icon: <Home size={20} /> },
    { name: 'Fase Final', path: '/mata-mata', icon: <Trophy size={20} /> }, 
    { name: 'Modo Bolão', path: '/bolao', icon: <Target size={20} /> },
    { name: 'Como Jogar', path: '/regras', icon: <HelpCircle size={20} /> },
    { name: 'Desenvolvedor', path: '/sobre', icon: <UserCircle size={20} /> },
  ];

  return (
    <>
    <aside 
      className={`
        fixed z-50 bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out
        /* Mobile: Bottom Bar */
        bottom-0 left-0 w-full h-16 flex flex-row items-center justify-around px-2 border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]
        /* Desktop: Sidebar */
        md:top-0 md:h-screen md:flex-col md:border-t-0 md:border-r md:justify-start
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}
      `}
    >
      {/* Cabeçalho Desktop */}
      <div className={`hidden md:flex p-6 items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`transition-opacity duration-300 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <h2 className="text-xl font-black text-white italic tracking-tighter">COPA<span className="text-blue-500">2026</span></h2>
        </div>
        <button onClick={onToggle} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded">
          <Settings size={20} className={isCollapsed ? 'rotate-90 transition-transform' : ''} />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex flex-row md:flex-col w-full md:flex-1 md:px-4 px-1 gap-1 md:gap-2 justify-around md:justify-start items-center md:items-stretch">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center justify-center rounded-xl transition-all font-medium overflow-hidden
                h-12 w-12 md:h-auto md:w-auto
                ${isCollapsed ? 'md:justify-center md:px-0 md:py-3' : 'md:justify-start md:gap-3 md:px-4 md:py-3'}
                ${isActive ? 'text-white bg-blue-600' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className={`hidden md:block transition-all ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Botão Reset */}
      <button
        onClick={() => setShowResetModal(true)}
        className="
          flex items-center justify-center
          h-12 w-12 md:w-full rounded-xl
          text-rose-400 hover:bg-rose-500 hover:text-white
          transition-all md:gap-2
        "
      >
        <span className='hidden md:block'>Reset</span>
        <RotateCcw size={20}/>
      </button>
    </aside>
    <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={executeReset}
        title="Zerar Simulador"
        message="Atenção: Isto apagará TODOS os resultados e placares oficiais do simulador. O histórico do Bolão não será afetado. Deseja continuar?"
        confirmText="Sim, zerar tudo"
        variant="danger"
      />
    </>
  );
};