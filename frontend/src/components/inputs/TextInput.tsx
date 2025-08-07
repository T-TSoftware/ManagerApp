import { BaseInputProps } from "../../types/inputs/BaseInputProps";
import FormFieldWrapper from "../layout/FormFieldWrapper";

export default function TextInput({
  name,
  label,
  register,
  required,
  className,
  hidden,
  editable = true,
  error,
  placeholder,
}: BaseInputProps) {
  return (
    <FormFieldWrapper
      label={label}
      required={required}
      error={error}
      hidden={hidden}
    >
      <input
        {...register(name)}
        id={name}
        readOnly={!editable}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black ${className}`}
      />
    </FormFieldWrapper>
  );
}
