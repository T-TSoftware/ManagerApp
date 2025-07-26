import { BaseInputProps } from "../../types/inputs/BaseInputProps";
import FormFieldWrapper from "../layout/FormFieldWrapper";

type DatePickerProps = {
  label?: string;
  value: Date | undefined;
  onChange: (val: Date | undefined) => void;
  error?: string;
  required?: boolean;
  className?: string;
};

const formatDate = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
};

const DatePicker = ({
  label,
  value,
  onChange,
  className,
  error,
  required,
}: DatePickerProps) => {
  return (
    <FormFieldWrapper
      label={label}
      required={required}
      error={error}
    >
      <input
        type="datetime-local"
        value={value ? formatDate(value) : ""}
        onChange={(e) => {
          const val = e.target.value;
          const parsedDate = new Date(val);
          onChange(isNaN(parsedDate.getTime()) ? undefined : parsedDate);
        }}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black ${className}`}
      />
    </FormFieldWrapper>
  );
};

export default DatePicker;