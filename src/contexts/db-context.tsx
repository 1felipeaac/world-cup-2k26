/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeDatabase } from '../db/seed';

interface DatabaseContextData {
  isDbReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextData>({} as DatabaseContextData);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        await initializeDatabase();
        setIsDbReady(true);
      } catch (error) {
        console.error("Erro ao inicializar banco:", error);
      }
    };

    setup();
  }, []);

  return (
    <DatabaseContext.Provider value={{ isDbReady }}>
      
      {isDbReady ? children : (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-blue-900 text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400 mb-4"></div>
          <h1 className="text-xl font-bold tracking-widest uppercase">Preparando a Copa...</h1>
        </div>
      )}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);