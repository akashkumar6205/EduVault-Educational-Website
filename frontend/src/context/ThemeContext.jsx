import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("eduvault_theme") || "light";
  });

  const isDarkMode = theme === "dark";

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("eduvault_theme", newTheme);
  };

  const toggleTheme = () => {
    const next = isDarkMode ? "light" : "dark";
    setTheme(next);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const themeClasses = [
      "dark",
      "theme-cosmic-gold",
      "theme-emerald-sage",
      "theme-crimson-velvet",
      "theme-ocean-cyan",
    ];
    themeClasses.forEach((cls) => document.documentElement.classList.remove(cls));

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "cosmic-gold") {
      document.documentElement.classList.add("theme-cosmic-gold");
    } else if (theme === "emerald-sage") {
      document.documentElement.classList.add("theme-emerald-sage");
    } else if (theme === "crimson-velvet") {
      document.documentElement.classList.add("theme-crimson-velvet");
    } else if (theme === "ocean-cyan") {
      document.documentElement.classList.add("theme-ocean-cyan");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    const local = localStorage.getItem("eduvault_theme") || "light";
    return {
      theme: local,
      isDarkMode: local === "dark",
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
