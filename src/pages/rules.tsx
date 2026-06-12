import React from 'react';
import { Trophy, Target, Calculator, AlertCircle, CheckCircle2, Swords } from 'lucide-react';
import Container from '../components/container';

export const Rules: React.FC = () => {
  return (
    <Container className="pb-12 animate-in fade-in duration-500">
      
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter italic">
          Como <span className="text-blue-600">Jogar</span>
        </h1>
        <p className="text-slate-500 mt-3 text-lg">
          Entenda como funciona o Simulador Oficial da Copa 2026 e o sistema de pontuação do Bolão.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Trophy size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">1. O Simulador Oficial</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 text-sm leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Fase de Grupos
              </h3>
              <p>
                Preencha os placares dos 12 grupos. O simulador calcula automaticamente os classificados baseado nos critérios reais da FIFA: <strong>Pontos {'>'} Saldo de Gols {'>'} Gols Pró</strong>. Os 2 primeiros de cada grupo e os 8 melhores terceiros colocados avançam.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Swords size={16} className="text-rose-500" />
                Mata-Mata
              </h3>
              <p>
                O chaveamento a partir dos 16-avos de final é montado automaticamente com base no desempenho. Em caso de empate no tempo normal, uma caixa para <strong>Cobrança de Pênaltis</strong> aparecerá para definir quem avança.
              </p>
            </div>
          </div>
        </div>


        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 md:col-span-2 text-slate-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
            <Calculator size={200} />
          </div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">2. Regras de Pontuação do Bolão</h2>
          </div>
          
          <p className="mb-4 text-sm">
            O nosso bolão utiliza um sistema de <strong className="text-amber-400">Pontuação Base × Multiplicador de Fase</strong>. Quanto mais o torneio avança, mais os jogos valem!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
    
            <div className="space-y-4">
              <h3 className="text-white font-bold mb-3 border-b border-slate-700 pb-2">Pontuação Base</h3>
              
              <div className="bg-slate-800/50 rounded-2xl p-4 flex justify-between items-center border border-slate-700/50">
                <div>
                  <span className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-black rounded mb-1 uppercase">Na Mosca!</span>
                  <p className="text-sm font-bold text-white">Acertar o Placar Exato</p>
                </div>
                <div className="text-xl font-black text-emerald-400">3 PTS</div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-4 flex justify-between items-center border border-slate-700/50">
                <div>
                  <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-black rounded mb-1 uppercase">O Básico</span>
                  <p className="text-sm font-bold text-white">Acertar apenas Vencedor/Empate</p>
                </div>
                <div className="text-xl font-black text-blue-400">1 PT</div>
              </div>
            </div>

    
            <div>
              <h3 className="text-white font-bold mb-3 border-b border-slate-700 pb-2">Multiplicadores por Fase</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between p-2 rounded hover:bg-slate-800/50">
                  <span className="text-slate-400">Fase de Grupos</span>
                  <strong className="text-white">1x</strong>
                </li>
                <li className="flex justify-between p-2 rounded hover:bg-slate-800/50">
                  <span className="text-slate-400">16-Avos de Final</span>
                  <strong className="text-white">2x</strong>
                </li>
                <li className="flex justify-between p-2 rounded bg-slate-800/30">
                  <span className="text-slate-400">Oitavas de Final</span>
                  <strong className="text-white">3x</strong>
                </li>
                <li className="flex justify-between p-2 rounded hover:bg-slate-800/50">
                  <span className="text-slate-400">Quartas de Final</span>
                  <strong className="text-white">4x</strong>
                </li>
                <li className="flex justify-between p-2 rounded hover:bg-slate-800/50">
                  <span className="text-slate-400">Semifinal e 3º Lugar</span>
                  <strong className="text-white">5x</strong>
                </li>
                <li className="flex justify-between p-2 rounded bg-amber-500/10 border border-amber-500/20">
                  <span className="text-amber-400 font-bold">Grande Final</span>
                  <strong className="text-amber-400 font-black text-lg">10x</strong>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs text-slate-400 text-center relative z-10">
            Exemplo: Acertar na mosca um jogo das Oitavas de Final rende <strong>9 pontos</strong> (3 pontos base × Multiplicador 3x).
          </div>
        </div>


        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 shadow-sm md:col-span-2 flex items-start gap-4">
          <AlertCircle className="text-rose-500 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-rose-900 mb-1">Atenção aos Pênaltis</h3>
            <p className="text-rose-700 text-sm leading-relaxed">
              No mata-mata, os palpites do Bolão são validados com base no <strong>resultado do tempo normal (regulamentar)</strong>. Se um jogo terminar 1x1 e for para os pênaltis, quem apostou 1x1 ganha os pontos de "Placar Exato", independente de quem vença nos pênaltis.
            </p>
          </div>
        </div>

      </div>
    </Container>
  );
};