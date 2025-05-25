export type AlertMessage = {
  id: string;
  message: string;
  type?: "warning" | "info" | "success" | "error";
};

export type AlertContextType = {
  messages: AlertMessage[];
  addMessage: (message: AlertMessage) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
};
