import { Currency, Theme } from "@utils/Types";
import { createContext, useContext, useEffect, useState } from "react";

export interface UsePreferencesProps {
  defaultCurrency: Currency;
  theme: Theme;
  setDefaultCurrency: (currency: Currency) => void;
  setSuspend: (suspend: boolean) => void;
  setTheme: (theme: Theme) => void;
}

const PreferencesContext = createContext<UsePreferencesProps>({
  defaultCurrency: "USD",
  theme: "light",
  setDefaultCurrency: () => undefined,
  setSuspend: () => undefined,
  setTheme: () => undefined,
});

export const usePreferences = () => useContext<UsePreferencesProps>(PreferencesContext);

export function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState<Theme>((localStorage?.getItem("theme") || "light") as Theme);
  const [suspend, setSuspend] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState<Currency>((localStorage?.getItem("defaultCurrency") || "USD") as Currency);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = "";
    document.body.classList.add("theme", "theme--" + (suspend ? "light" : theme));
  }, [theme, suspend]);

  useEffect(() => {
    localStorage.setItem("defaultCurrency", defaultCurrency);
  }, [defaultCurrency]);

  return (
    <PreferencesContext.Provider value={{ theme, setTheme, setSuspend, defaultCurrency, setDefaultCurrency }}>
      {children}
    </PreferencesContext.Provider>
  );
}
