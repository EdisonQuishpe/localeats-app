"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../lib/translations";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  locale: "es",
  toggleLocale: () => {},
  t: (key) => key,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [locale, setLocale] = useState("es");

  useEffect(() => {
    const saved = localStorage.getItem("localeats-theme");
    if (saved) setTheme(saved);
    const savedLocale = localStorage.getItem("localeats-locale");
    if (savedLocale) setLocale(savedLocale);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("localeats-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("localeats-locale", locale);
  }, [locale]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleLocale = () => setLocale((l) => (l === "es" ? "en" : "es"));
  const t = (key) => translations[locale]?.[key] || key;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, locale, toggleLocale, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
