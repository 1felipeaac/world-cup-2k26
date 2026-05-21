import React from 'react';
import { GitBranch, Link2, Mail, Code2, Database, Monitor, Flame, Terminal, ArrowUpRight } from 'lucide-react';

export const About: React.FC = () => {
  // Ajuste com os seus dados reais de contato
  const contacts = {
    github: "https://github.com/1felipeaac", // Atualizado com o padrão do seu usuário
    linkedin: "https://linkedin.com/in/1felipeaac",
    email: "felipeaacoelho@gmail.com" 
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 animate-in fade-in duration-500">
      
      {/* Cabeçalho */}
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter italic">
          Sobre o <span className="text-blue-600">Projeto</span>
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Conheça os bastidores, a arquitetura e o desenvolvedor por trás deste simulador.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* COLUNA 1 & 2: O Projeto e a Engenharia (Ocupa mais espaço) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card da História */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 leading-relaxed text-slate-600 text-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Flame size={20} className="text-amber-500" />
              A História do Remake
            </h2>
            <p className="mb-3">
              Este simulador nasceu de um desejo de revisitar e reconstruir do zero um dos projetos mais sentimentais da minha trajetória: um simulador de torneios antigo, desenvolvido originalmente em JavaScript puro "no braço". 
            </p>
            <p>
              Como estamos em ano de Copa do Mundo, decidi aplicar os meus <strong>3 anos de evolução contínua na engenharia de software</strong> para transformar aquela ideia original em um produto moderno, tipado, reativo, persistente no cliente e focado em uma experiência mobile de alta fidelidade.
            </p>
          </div>

          {/* Card da Stack e Decisões Técnicas */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Code2 size={20} className="text-blue-600" />
              Arquitetura & Stack Técnica
            </h2>
            
            <div className="space-y-4">
              
              {/* Item Dexie */}
              <div className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                  <Database size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Dexie.js (IndexedDB)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Banco de dados transacional no lado do cliente. Utilizado para persistir estados complexos de grupos, estatísticas de seleções e histórico de palpites do bolão diretamente no navegador do usuário, com transações ACID robustas.
                  </p>
                </div>
              </div>

              {/* Item React + TS */}
              <div className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <Terminal size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">React.js & TypeScript</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Componentização focada na reutilização e imutabilidade dos dados. O TypeScript garante segurança de tipos em contratos complexos (como estruturas de chaves dinâmicas do mata-mata baseado em fórmulas matemáticas).
                  </p>
                </div>
              </div>

              {/* Item Tailwind */}
              <div className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl shrink-0">
                  <Monitor size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Tailwind CSS (Mobile-First UX)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Design responsivo adaptável. O menu lateral expande/recolhe dinamicamente em desktops e se transforma perfeitamente em uma barra de navegação inferior (Bottom Bar) em celulares, maximizando o espaço útil para os cards de jogos.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* COLUNA 3: O Desenvolvedor & Contatos (Perfil) */}
        <div className="lg:col-span-1 sticky top-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            
            {/* Avatar improvisado com as suas iniciais */}
            <div className="w-20 h-20 bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/10 uppercase">
              FA
            </div>

            <h3 className="text-white font-bold text-lg">Felipe Augusto</h3>
            <p className="text-slate-400 text-xs font-semibold uppercase mt-1 tracking-wider">
              Dev FullStack
            </p>

            <p className="text-slate-400 text-xs mt-4 leading-relaxed px-2">
              Desenvolvedor com foco em construir ecossistemas robustos. Experiência que transita entre backend escalável (Java/Spring Boot/Node.js) e interfaces modernas e performáticas com React.
            </p>

            {/* Divisor */}
            <div className="border-t border-slate-800 my-6"></div>

            {/* CTAs de Contato */}
            <div className="space-y-3">
              
              {/* LinkedIn */}
              <a 
                href={contacts.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-slate-800/60 hover:bg-blue-600 hover:text-white text-slate-300 rounded-xl font-bold text-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Link2 size={18} className="text-blue-400 group-hover:text-white transition-colors" />
                  <span>LinkedIn</span>
                </div>
                <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* GitHub */}
              <a 
                href={contacts.github} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 text-slate-300 rounded-xl font-bold text-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <GitBranch size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                  <span>GitHub</span>
                </div>
                <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* E-mail */}
              <a 
                href={`mailto:${contacts.email}`}
                className="flex items-center justify-between p-3 bg-slate-800/60 hover:bg-amber-600 hover:text-white text-slate-300 rounded-xl font-bold text-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-amber-400 group-hover:text-white transition-colors" />
                  <span>E-mail</span>
                </div>
                <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};