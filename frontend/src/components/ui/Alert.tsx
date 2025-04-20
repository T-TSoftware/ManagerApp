import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

type AlertProps = {
  title: string;
  message: string;
  type?: "warning" | "info" | "success" | "error";
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

const Alert = ({ title, message, type = "warning" }: AlertProps) => {
  const classes = typeClasses[type];

  return (
    <div className={`rounded-md p-4 flex mb-4 shadow-md ${classes.bg}`}>
      <div className="flex ">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className={`h-5 w-5 ${classes.icon}`}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${classes.text}`}>{title}</h3>
          <div className={`mt-2 text-sm text-wrap ${classes.text}`}>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
