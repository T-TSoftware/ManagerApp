import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { myQuartzDarkTheme, myQuartzLightTheme } from "../tableThemes/quartzTheme"; 

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  agGridThemeClass: string;
  agGridThemeObject: any;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  agGridThemeClass: "ag-theme-quartz",
  agGridThemeObject: myQuartzLightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "light"
  );

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const agGridThemeClass =
    theme === "dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz";
  const agGridThemeObject =
    theme === "dark" ? myQuartzDarkTheme : myQuartzLightTheme;

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, agGridThemeClass, agGridThemeObject }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
