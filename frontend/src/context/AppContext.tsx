// src/context/AppContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

type AppContextType = {
  companyId: string | null;
  setCompanyId: (id: string) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [companyId, setCompanyIdState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("companyId");
    if (stored) setCompanyIdState(stored);
  }, []);

  const setCompanyId = (id: string) => {
    localStorage.setItem("companyId", id);
    setCompanyIdState(id);
  };

  return (
    <AppContext.Provider value={{ companyId, setCompanyId }}>
      {children}
    </AppContext.Provider>
  );
};
