import React, { forwardRef } from 'react';


type ScoreInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const ScoreInput = forwardRef<HTMLInputElement, ScoreInputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        type="number"
        min="0"
        max="99"
        ref={ref}
        placeholder="-"
        className={`w-10 h-10 text-center font-black text-slate-800 text-lg bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:bg-slate-100 ${className}`}
        {...props}
      />
    );
  }
);


ScoreInput.displayName = 'ScoreInput';