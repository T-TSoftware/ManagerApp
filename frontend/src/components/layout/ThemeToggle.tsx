import { useTheme } from "../../themes/appThemes/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="grid w-full grid-cols-[auto_1fr] items-center px-4 py-2 text-sm rounded-md text-black hover:bg-light_primary dark:text-white dark:hover:bg-secondary"
    >
      {theme === "light" ? (
        <>
          <SunIcon className="size-4 text-black" />
          <p className="text-black">Light</p>
        </>
      ) : (
        <>
          <MoonIcon className="size-4 text-white" />
          <p className="text-white">Dark</p>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
