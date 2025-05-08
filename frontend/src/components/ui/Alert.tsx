import { useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export type AlertProps = {
  title: string;
  message: string;
  type?: "warning" | "info" | "success" | "error";
  autoClose?: boolean;
  onClose?: () => void;
};

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

const Alert = ({
  title,
  message,
  type = "warning",
  autoClose = false,
  onClose,
}: AlertProps) => {
  const classes = typeClasses[type];

  useEffect(() => {
    if (!autoClose || !onClose) return;
    const timer = setTimeout(() => onClose(), 10000);
    return () => clearTimeout(timer);
  }, [autoClose, onClose]);

  return (
    <div className={`rounded-md p-4 flex mb-4 shadow-md ${classes.bg}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className={`h-5 w-5 ${classes.icon}`} />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${classes.text}`}>{title}</h3>
          <p className={`mt-2 text-sm ${classes.text}`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
