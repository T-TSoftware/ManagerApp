// components/buttons/ActionButton.tsx

type Variant = "primary" | "secondary";

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: Variant;
  loading?: boolean;
}

export default function Button({
  label,
  variant = "primary",
  loading = false,
  ...props
}: ActionButtonProps) {
  const baseStyle =
    "px-5 py-2 rounded-lg transition focus:outline-none focus:ring-2";
  const variants: Record<Variant, string> = {
    primary:
      "text-white bg-light_fourth hover:shadow-sm hover:shadow-light_fourth dark:bg-fourth",
    secondary:
      "border-light_primary bg-red-500 text-white hover:shadow-sm hover:shadow-red-300 dark:bg-red-900 dark:hover:shadow-red-300 dark:text-white dark:border-red-900",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]}`} {...props}>
      {loading ? "Güncelleniyor..." : label}
    </button>
  );
}
