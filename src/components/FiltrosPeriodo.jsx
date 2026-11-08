const TRIMESTRES = [
  { valor: "todos", etiqueta: "Todo el año" },
  { valor: "1", etiqueta: "Trimestre 1 (Ene–Mar)" },
  { valor: "2", etiqueta: "Trimestre 2 (Abr–Jun)" },
  { valor: "3", etiqueta: "Trimestre 3 (Jul–Sep)" },
  { valor: "4", etiqueta: "Trimestre 4 (Oct–Dic)" },
];

// Selector de año y de trimestre para analizar un período específico
export default function FiltrosPeriodo({ anio, trimestre, anios, alCambiarAnio, alCambiarTrimestre }) {
  const clase = "border border-neutral-300 rounded-lg px-3 py-2 text-sm";
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="filtro-anio" className="block text-xs text-neutral-500 mb-1">Año</label>
        <select id="filtro-anio" value={anio} onChange={(e) => alCambiarAnio(e.target.value)} className={clase}>
          <option value="todos">Todos los años</option>
          {anios.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filtro-trimestre" className="block text-xs text-neutral-500 mb-1">Período</label>
        <select id="filtro-trimestre" value={trimestre} onChange={(e) => alCambiarTrimestre(e.target.value)} className={clase}>
          {TRIMESTRES.map((t) => (
            <option key={t.valor} value={t.valor}>{t.etiqueta}</option>
          ))}
        </select>
      </div>
      {(anio !== "todos" || trimestre !== "todos") && (
        <button
          type="button"
          onClick={() => {
            alCambiarAnio("todos");
            alCambiarTrimestre("todos");
          }}
          className="text-sm text-pink-600 hover:underline pb-2"
        >
          Quitar filtros
        </button>
      )}
    </div>
  );
}
