import { useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useAlertContext } from "../../context/AlertContext";

const typeClasses = {
  warning: {
    bg: "bg-yellow-50",
    icon: "text-yellow-400",
    text: "text-yellow-800",
  },
  info: {
    bg: "bg-blue-50",
    icon: "text-blue-400",
    text: "text-blue-800",
  },
  success: {
    bg: "bg-green-50",
    icon: "text-green-400",
    text: "text-green-800",
  },
  error: {
    bg: "bg-red-50",
    icon: "text-red-400",
    text: "text-red-800",
  },
};

const Alert = () => {
  const { messages, removeMessage } = useAlertContext();

  if (messages.length === 0) return null;

  // İlk mesajın tipi tüm kutuya stil verir
  const primaryType = messages[0].type || "warning";
  const classes = typeClasses[primaryType];

  return (
    <div className={`rounded-md p-4 flex mb-4 shadow-md ${classes.bg}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className={`h-5 w-5 ${classes.icon}`} />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${classes.text}`}>
          </h3>
          <div className="mt-2 text-sm">
            <ul className={`list-disc pl-5 space-y-1 ${classes.text}`}>
              {messages.map((msg) => (
                <li key={msg.id}>
                  {msg.message}
                  <button
                    onClick={() => removeMessage(msg.id)}
                    className="ml-2 text-xs underline text-gray-500 hover:text-gray-800"
                  >
                    Kapat
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
