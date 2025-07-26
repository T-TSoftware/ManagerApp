"use client";
import { useState, useEffect } from "react";
import FormFieldWrapper from "../layout/FormFieldWrapper";


type Option = {
  code: string;
  name: string;
};

type AutocompleteProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
};

const AutoComplete = ({
  options,
  value,
  onChange,
  label,
  placeholder = "",
  className = "",
  required = false,
  error,
}: AutocompleteProps) => {
  const [inputValue, setInputValue] = useState("");
  const [filtered, setFiltered] = useState<Option[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const selected = options.find((opt) => opt.code === value);
    if (selected) setInputValue(selected.name);
  }, [value, options]);

  useEffect(() => {
    setFiltered(
      inputValue
        ? options.filter((opt) =>
            opt.name.toLowerCase().includes(inputValue.toLowerCase())
          )
        : options
    );
  }, [inputValue, options]);

  const handleSelect = (option: Option) => {
    setInputValue(option.name);
    onChange(option.code);
    setShowDropdown(false);
  };

  return (
    <FormFieldWrapper
      label={label}
      required={required}
      error={error}
    >
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black ${className}`}
        />

        {showDropdown && filtered.length > 0 && (
          <ul className="absolute z-10 bg-white dark:bg-secondary mt-1 w-full border rounded-md max-h-60 overflow-y-auto shadow">
            {filtered.map((opt) => (
              <li
                key={opt.code}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-light_primary cursor-pointer"
                onMouseDown={() => handleSelect(opt)}
              >
                {opt.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormFieldWrapper>
  );
};

export default AutoComplete;
