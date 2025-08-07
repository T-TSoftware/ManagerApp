import { SelectInputProps } from "../../types/inputs/BaseInputProps";
import FormFieldWrapper from "../layout/FormFieldWrapper";

export default function SelectInput({
  name,
  label,
  register,
  required,
  error,
  className,
  options,
  hidden,
  editable = true,
  placeholder,
}: SelectInputProps) {
  return (
    <FormFieldWrapper
      label={label}
      required={required}
      error={error}
      hidden={hidden}
    >
      <select
        {...register(name)}
        id={name}
        disabled={!editable}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black ${className}`}
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.name}
          </option>
        ))}
      </select>
    </FormFieldWrapper>
  );
}