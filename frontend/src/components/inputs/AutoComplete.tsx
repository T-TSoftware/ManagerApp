"use client";
import { useState, useEffect, useMemo } from "react";
import FormFieldWrapper from "../layout/FormFieldWrapper";

/** Option: code ve/veya id içerebilir */
type Option = {
  id?: string;
  code?: string;
  name: string;
};

type KeyField = "code" | "id";

type AutocompleteProps = {
  options: Option[];
  /** Dışarıda tutulan kimlik değeri (code veya id) */
  value: string;
  /** Dışarıya seçilen kimlik (code veya id) gönderilir */
  onChange: (value: string) => void;
  /** Kimlik alanı: "code" (varsayılan) veya "id" */
  valueKey?: KeyField;

  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
  /** serbest yazımı kimlik olarak kabul et (default: true) */
  allowFreeText?: boolean;
};

const AutoComplete = ({
  options,
  value,
  onChange,
  valueKey = "code",
  label,
  placeholder = "",
  className = "",
  required = false,
  error,
  allowFreeText = true,
}: AutocompleteProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Bir option için "anahtar" değerini (code/id) güvenle üret
  const getKey = (opt: Option): string =>
    (valueKey === "code" ? opt.code : opt.id) ?? opt.code ?? opt.id ?? "";

  // value -> inputValue senkronizasyonu
  useEffect(() => {
    const selected = options.find((opt) => getKey(opt) === value);
    if (selected) {
      setInputValue(selected.name);
    } else {
      // eşleşme yoksa serbest yazımı göster
      setInputValue(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options, valueKey]);

  // filtre (name veya key alanında arama)
  const filtered = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => {
      const key = getKey(opt).toLowerCase();
      return opt.name.toLowerCase().includes(q) || key.includes(q);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, options, valueKey]);

  const handleSelect = (option: Option) => {
    setInputValue(option.name);
    onChange(getKey(option)); // dışarıya kimlik (code/id) gönder
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputValue(v);
    setShowDropdown(true);
    if (!v) onChange(""); // temizleniyorsa dışarıyı da temizle
  };

  const handleBlur = () => {
    // kısa gecikme: onMouseDown ile çakışmasın
    setTimeout(() => setShowDropdown(false), 150);

    if (allowFreeText) {
      const trimmed = inputValue.trim();

      // İsimle birebir eşleşme varsa seç
      const byName = options.find((opt) => opt.name === trimmed);
      if (byName) {
        const k = getKey(byName);
        if (k !== value) onChange(k);
        return;
      }

      // isim eşleşmiyorsa yazılanı kimlik olarak kabul et
      if (trimmed && trimmed !== value) onChange(trimmed);
    } else {
      // serbest yazım kapalıysa ve seçim yoksa inputu mevcut değere geri döndür
      const selected = options.find((o) => getKey(o) === value);
      setInputValue(selected ? selected.name : "");
    }
  };

  return (
    <FormFieldWrapper label={label} required={required} error={error}>
      <div className="relative">
        <input
          type="text"
          autoComplete="off"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black ${className}`}
        />

        {showDropdown && filtered.length > 0 && (
          <ul className="absolute z-10 bg-white dark:bg-secondary mt-1 w-full border rounded-md max-h-60 overflow-y-auto shadow">
            {filtered.map((opt) => {
              const k = getKey(opt);
              return (
                <li
                  key={k || opt.name}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-light_primary cursor-pointer"
                  onMouseDown={() => handleSelect(opt)}
                  title={k}
                >
                  {opt.name}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </FormFieldWrapper>
  );
};

export default AutoComplete;
