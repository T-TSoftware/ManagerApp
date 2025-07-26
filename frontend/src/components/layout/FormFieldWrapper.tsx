type Props = {
  label?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  classes?: string;
};

export default function FormFieldWrapper({
  label,
  required,
  error,
  children,
  classes = "",
}: Props) {
  return (
    <div className={`${classes}`}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
          {label}
          {required && <span className="text-red-500 text-sm">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

