import { BaseInputProps } from "../../types/inputs/BaseInputProps";
import FormFieldWrapper from "../layout/FormFieldWrapper";

export default function TextAreaInput({
  name,
  label,
  register,
  required,
  className,
  error,
  classes,
  placeholder,
}: BaseInputProps) {
  return (
    <FormFieldWrapper
      label={label}
      required={required}
      error={error}
      classes={classes}
    >
      <textarea
        {...register(name)}
        id={name}
        placeholder={placeholder}
        rows={4}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black ${className}`}
      />
    </FormFieldWrapper>
  );
}