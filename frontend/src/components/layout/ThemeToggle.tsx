import { useTheme } from "../../themes/appThemes/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="grid grid-cols-[auto_1fr] gap-x-2 items-center px-4 py-2 text-sm rounded-md text-black hover:bg-light_primary dark:text-white dark:hover:bg-secondary"
    >
      {theme === "light" ? (
        <>
          <SunIcon className="h-4 w-4 text-black" />
          <p className="text-black">Light</p>
        </>
      ) : (
        <>
          <MoonIcon className="h-4 w-4 text-white" />
          <p className="text-white">Dark</p>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
