import { createContext, useContext, useEffect, useState } from "react";
import classNames from "classnames";

type Theme = "light" | "dark";

export interface UseThemeProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setSuspend: (suspend: boolean) => void;
}

const ThemeContext = createContext<UseThemeProps>({
  theme: "light",
  setTheme: () => undefined,
  setSuspend: () => undefined,
});

export const useTheme = () => useContext<UseThemeProps>(ThemeContext);

export function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState<Theme>((localStorage.getItem("theme") || "light") as Theme);
  const [suspend, setSuspend] = useState(false);
  const classes = classNames("theme", "theme--" + theme);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setSuspend }}>
      <div className={suspend ? undefined : classes}>{children}</div>
    </ThemeContext.Provider>
  );
}
