"use client";

import { ReactNode, useState } from "react";

type DropdownOption = {
  label: string;
  onClick: () => void;
};

type ActionButtonProps = {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  isDropdown?: boolean;
  options?: DropdownOption[];
};

const ActionButton = ({
  icon,
  label,
  onClick,
  isDropdown = false,
  options = [],
}: ActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block text-left z-50">
      <button
        onClick={isDropdown ? toggleDropdown : onClick}
        className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-3xl transition-all duration-200 ease-in-out shadow-lg text-white bg-light_fourth dark:bg-fourth dark:text-white"
      >
        <span className="size-5 text-white">{icon}</span>
        <span className="max-lg:hidden">{label}</span>
      </button>

      {isDropdown && isOpen && (
        <div className="absolute left-0 mt-2 w-48 origin-top-right rounded-md shadow-lg  ring-opacity-5 focus:outline-none z-50 dark:bg-white ring-1 dark:ring-black">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-sm text-left shadow-lg dark:text-gray-700 dark:hover:bg-gray-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButton;
