import { useTheme } from "../context/ThemeContext";

// Interruptor (switch) de modo oscuro, accesible con teclado y lector de pantalla
export default function ThemeSwitch() {
  const { oscuro, alternar } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={oscuro}
      aria-label="Modo oscuro"
      title={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={alternar}
      className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border transition-colors ${
        oscuro ? "bg-pink-600 border-pink-600" : "bg-neutral-200 border-neutral-300"
      }`}
    >
      <span aria-hidden="true" className="absolute left-1.5 text-xs leading-none">☀️</span>
      <span aria-hidden="true" className="absolute right-1.5 text-xs leading-none">🌙</span>
      {/* bg-[#ffffff] (y no bg-white) para que el modo oscuro no pinte la perilla de negro */}
      <span
        aria-hidden="true"
        className={`relative z-10 inline-block h-5 w-5 rounded-full bg-[#ffffff] shadow transition-transform duration-200 ${
          oscuro ? "translate-x-8" : "translate-x-1"
        }`}
      />
    </button>
  );
}
