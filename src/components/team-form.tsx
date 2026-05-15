import React from 'react';
import { MatchResult } from '../model/tournament';


interface TeamFormProps {
  form: MatchResult[];
}

export const TeamForm: React.FC<TeamFormProps> = ({ form }) => {
 
  const recentResults = form.slice(-3);

  const displayForm = [...recentResults];
  while (displayForm.length < 3) {
    displayForm.unshift(MatchResult.NOT_PLAYED);
  }

 
  const getStyle = (result: MatchResult) => {
    switch (result) {
      case MatchResult.WIN:
        return { bg: 'bg-emerald-500', text: 'text-white', label: 'V' };
      case MatchResult.DRAW:
        return { bg: 'bg-slate-400', text: 'text-white', label: 'E' };
      case MatchResult.LOSS:
        return { bg: 'bg-rose-500', text: 'text-white', label: 'D' };
      default:
        return { bg: 'bg-slate-100', text: 'text-transparent', label: '-' };
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {displayForm.map((result, index) => {
        const style = getStyle(result);
        return (
          <div
            key={index}
            title={result}
            className={`flex items-center justify-center w-3 h-3 md:w-6 md:h-6 rounded-full text-[9px] md:text-[10px] font-bold shadow-sm transition-all ${style.bg} ${style.text}`}
          >
            {style.label}
          </div>
        );
      })}
    </div>
  );
};