import { SelectInputProps } from "../../types/inputs/BaseInputProps";
import FormFieldWrapper from "../layout/FormFieldWrapper";

export default function Dropdown({
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
  valueKey, 
}: SelectInputProps) {
  const getKeyFor = (opt: any) => {
    if (valueKey) return valueKey;
    return "code" in opt ? "code" : "id";
  };

  const getVal = (opt: any) => {
    const k = getKeyFor(opt);
    return opt[k] ?? "";
  };

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
        {options.map((option, idx) => {
          const val = getVal(option);
          const key =
            val ||
            `${("code" in option ? option.code : option.id) || "opt"}-${idx}`;
          return (
            <option key={key} value={val}>
              {option.name}
            </option>
          );
        })}
      </select>
    </FormFieldWrapper>
  );
}
