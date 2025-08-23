"use client";
import { useState, useMemo } from "react";

type Option = {
  code: string;
  name: string;
};

type MultiSelectProps = {
  options: Option[];
  value: string[]; // seçilmiş kodlar
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
};

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = "Seçiniz",
  label,
  required,
  error,
}: MultiSelectProps) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  // filtreleme
  const filtered = useMemo(() => {
    const q = inputValue.toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.name.toLowerCase().includes(q) || opt.code.toLowerCase().includes(q)
    );
  }, [inputValue, options]);

  const handleSelect = (opt: Option) => {
    if (!value.includes(opt.code)) {
      onChange([...value, opt.code]);
    }
    setInputValue("");
  };

  const handleRemove = (code: string) => {
    onChange(value.filter((c) => c !== code));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {/* Seçilmiş etiketler */}
        <div className="flex flex-wrap gap-2 p-2 border rounded-lg dark:bg-secondary dark:border-black">
          {value.map((code) => {
            const opt = options.find((o) => o.code === code);
            return (
              <span
                key={code}
                className="flex items-center bg-light_primary text-sm px-2 py-1 rounded-md"
              >
                {opt?.name ?? code}
                <button
                  type="button"
                  className="ml-1 text-xs text-red-600"
                  onClick={() => handleRemove(code)}
                >
                  ✕
                </button>
              </span>
            );
          })}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="flex-1 outline-none bg-transparent"
          />
        </div>

        {/* Dropdown */}
        {open && filtered.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white dark:bg-secondary border rounded-lg mt-1 max-h-60 overflow-y-auto shadow">
            {filtered.map((opt) => (
              <li
                key={opt.code}
                onMouseDown={() => handleSelect(opt)}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-light_primary cursor-pointer"
              >
                {opt.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default MultiSelect;
