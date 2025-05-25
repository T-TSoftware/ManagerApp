import { createContext, useContext, useState, ReactNode } from "react";
import { AlertMessage, AlertContextType } from "../types/alert/AlertTypes";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<AlertMessage[]>([]);

  const addMessage = (message: AlertMessage) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === message.id);
      return exists ? prev : [...prev, message];
    });
  };

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <AlertContext.Provider
      value={{ messages, addMessage, removeMessage, clearMessages }}
    >
      {children}
    </AlertContext.Provider>
  );
};


export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};
