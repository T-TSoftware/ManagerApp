type Props = {
  label?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  classes?: string;
  hidden? : boolean;
};

export default function FormFieldWrapper({
  label,
  required,
  error,
  children,
  hidden,
  classes = "",
}: Props) {
  return (
    <div className={`${classes}`} hidden={hidden}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
          {label}
          {required && <span className="text-error text-sm">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-error text-sm">{error}</p>}
    </div>
  );
}

