// src/context/AppContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

type AppContextType = {
  projectId: string | null;
  setProjectId: (id: string) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [projectId, setProjectIdState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("projectId");
    if (stored) setProjectIdState(stored);
  }, []);

  const setProjectId = (id: string) => {
    localStorage.setItem("projectId", id);
    setProjectIdState(id);
  };

  return (
    <AppContext.Provider value={{ projectId, setProjectId }}>
      {children}
    </AppContext.Provider>
  );
};
