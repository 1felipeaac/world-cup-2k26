import React from 'react';


type ScoreInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const ScoreInput: React.FC<ScoreInputProps> = ({ className = '', ...props }) => {
  return (
    <input
      type="number"
      min="0"
      placeholder="-"
      className={`w-12 h-14 text-center font-black text-2xl bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:bg-slate-50 transition-all ${className}`}
      {...props}
    />
  );
};
