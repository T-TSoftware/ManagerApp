import { UseFormRegister } from "react-hook-form";

export interface BaseInputProps {
  name: string;
  label?: string;
  required?: boolean;
  editable?: boolean;
  error?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  className?: string;
  classes?: string;
  hidden? : boolean;
}

export interface SelectInputProps extends BaseInputProps {
  options: { code: string; name: string }[];
}
