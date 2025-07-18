import { createContext, useState, ReactNode } from 'react';
import { GlobalStateContextType } from '../types';

export const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GlobalStateContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
