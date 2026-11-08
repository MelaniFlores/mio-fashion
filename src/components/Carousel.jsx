import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatearPrecio } from "../lib/formato";

const INTERVALO_MS = 5000; // cambia de imagen cada 5 segundos

// Carrusel de productos. Se mueve solo, pero se detiene al pasar el mouse, al enfocarlo con
// el teclado o con el botón de pausa (así no molesta a quien necesita más tiempo para leer).
export default function Carousel({ items, etiqueta = "Destacado" }) {
  const [actual, setActual] = useState(0);
  const [pausadoPorUsuario, setPausadoPorUsuario] = useState(false);
  const [pausadoPorHover, setPausadoPorHover] = useState(false);

  const total = items.length;
  const enMovimiento = total > 1 && !pausadoPorUsuario && !pausadoPorHover;

  // Si cambia la cantidad de productos, el índice no puede quedar fuera de rango
  useEffect(() => {
    if (actual >= total) setActual(0);
  }, [actual, total]);

  // "actual" está en las dependencias: al cambiar manualmente, el reloj de 5 s empieza de nuevo
  useEffect(() => {
    if (!enMovimiento) return;
    const reloj = setTimeout(() => setActual((i) => (i + 1) % total), INTERVALO_MS);
    return () => clearTimeout(reloj);
  }, [actual, enMovimiento, total]);

  if (total === 0) {
    return <div className="bg-neutral-100 rounded-2xl h-80 md:h-96" aria-hidden="true" />;
  }

  const ir = (indice) => setActual((indice + total) % total);

  return (
    <section
      className="relative bg-neutral-100 rounded-2xl h-80 md:h-96 overflow-hidden"
      aria-roledescription="carrusel"
      aria-label="Productos destacados"
      onMouseEnter={() => setPausadoPorHover(true)}
      onMouseLeave={() => setPausadoPorHover(false)}
      onFocus={() => setPausadoPorHover(true)}
      onBlur={() => setPausadoPorHover(false)}
    >
      <div aria-live={enMovimiento ? "off" : "polite"}>
        {items.map((producto, i) => (
          <Link
            key={producto.id}
            to="/catalogo"
            aria-hidden={i !== actual}
            tabIndex={i === actual ? 0 : -1}
            aria-label={`${producto.nombre}, ${formatearPrecio(producto.precio)}. Ver en el catálogo`}
            className={`absolute inset-0 transition-opacity duration-700 ${i === actual ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img src={producto.imagen} alt="" className="w-full h-full object-contain p-6 pb-24" />
            <div className="absolute inset-x-0 bottom-0 p-5 pt-12 bg-gradient-to-t from-black/70 to-transparent text-[#ffffff]">
              <span className="inline-block text-[11px] uppercase tracking-widest bg-pink-600 rounded-full px-2.5 py-0.5 mb-2">
                {etiqueta}
              </span>
              <p className="text-xs opacity-80">{producto.marca}</p>
              <p className="font-semibold leading-tight">{producto.nombre}</p>
              <p className="text-sm mt-0.5">{formatearPrecio(producto.precio)}</p>
            </div>
          </Link>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => ir(actual - 1)}
            aria-label="Producto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#ffffff]/80 text-[#171717] shadow hover:bg-[#ffffff]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => ir(actual + 1)}
            aria-label="Producto siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#ffffff]/80 text-[#171717] shadow hover:bg-[#ffffff]"
          >
            ›
          </button>

          <div className="absolute top-3 left-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPausadoPorUsuario((p) => !p)}
              aria-label={pausadoPorUsuario ? "Reanudar carrusel" : "Pausar carrusel"}
              className="h-8 w-8 rounded-full bg-[#ffffff]/80 text-[#171717] text-xs shadow hover:bg-[#ffffff]"
            >
              {pausadoPorUsuario ? "▶" : "❚❚"}
            </button>
          </div>

          <div className="absolute top-4 right-4 flex gap-1.5" role="tablist" aria-label="Elegir producto">
            {items.map((producto, i) => (
              <button
                key={producto.id}
                type="button"
                role="tab"
                aria-selected={i === actual}
                aria-label={`Ir a ${producto.nombre}`}
                onClick={() => ir(i)}
                className={`h-2 rounded-full transition-all ${i === actual ? "w-6 bg-pink-600" : "w-2 bg-neutral-400"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
