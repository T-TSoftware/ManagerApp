import { useTheme } from "../../themes/appThemes/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? "🌞 Light" : "🌚 Dark"}
    </button>
  );
};

export default ThemeToggle;
