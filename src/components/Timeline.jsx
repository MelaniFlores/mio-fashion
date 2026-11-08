// Línea de tiempo vertical (estilo "nuestra historia"): una línea central con
// capítulos que se alternan izquierda/derecha en pantallas grandes.
export default function Timeline({ capitulos }) {
  return (
    <ol className="relative">
      {/* Línea central (solo en pantallas medianas y grandes) */}
      <span aria-hidden="true" className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-neutral-200" />

      {capitulos.map((capitulo, i) => {
        const invertido = i % 2 === 1;
        return (
          <li key={capitulo.titulo} className="relative grid md:grid-cols-2 gap-6 md:gap-16 items-center mb-14 last:mb-0">
            {/* Punto sobre la línea */}
            <span
              aria-hidden="true"
              className="hidden md:block absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-600 ring-4 ring-pink-100"
            />

            <div className={invertido ? "md:order-2" : ""}>
              {capitulo.imagen ? (
                <img
                  src={capitulo.imagen}
                  alt=""
                  loading="lazy"
                  className="w-full h-56 object-contain rounded-2xl bg-neutral-100 p-4"
                />
              ) : (
                <div className="w-full h-56 rounded-2xl bg-gradient-to-br from-pink-200 to-pink-50" aria-hidden="true" />
              )}
            </div>

            <div className={invertido ? "md:order-1 md:text-right" : ""}>
              <p className="text-xs uppercase tracking-widest text-pink-600 mb-2">
                <span className="text-neutral-400 mr-2">{String(i + 1).padStart(2, "0")}</span>
                {capitulo.etiqueta}
              </p>
              <h3 className="text-2xl font-semibold mb-3">{capitulo.titulo}</h3>
              <p className="text-neutral-700 leading-relaxed">{capitulo.texto}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
