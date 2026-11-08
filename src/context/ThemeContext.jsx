import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

function temaGuardado() {
  try {
    return localStorage.getItem("tema") === "oscuro";
  } catch (e) {
    return false;
  }
}

export function ThemeProvider({ children }) {
  const [oscuro, setOscuro] = useState(temaGuardado);

  // Aplica la clase en <html> y guarda la preferencia
  useEffect(() => {
    document.documentElement.classList.toggle("modo-oscuro", oscuro);
    try {
      localStorage.setItem("tema", oscuro ? "oscuro" : "claro");
    } catch (e) {
      /* sin almacenamiento, el tema solo dura esta visita */
    }
  }, [oscuro]);

  const alternar = useCallback(() => setOscuro((valor) => !valor), []);
  const valor = useMemo(() => ({ oscuro, alternar }), [oscuro, alternar]);

  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const contexto = useContext(ThemeContext);
  if (!contexto) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return contexto;
}
