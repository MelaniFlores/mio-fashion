import { useTheme } from "../context/ThemeContext";

// Colores de las gráficas según el tema (en modo oscuro las barras negras no se verían)
export function useColoresGrafica() {
  const { oscuro } = useTheme();
  return {
    texto: oscuro ? "#d4d4d4" : "#525252",
    rejilla: oscuro ? "#404040" : "#e5e5e5",
    primario: oscuro ? "#f5f5f5" : "#171717",
    secundario: "#ec4899",
    acento: oscuro ? "#f9a8d4" : "#be185d",
  };
}
