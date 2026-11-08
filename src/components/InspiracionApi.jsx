import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

// API externa con datos reales: Makeup API (https://makeup-api.herokuapp.com)
// Muestra productos internacionales y permite pedirlos por encargo.
const URL_API = "https://makeup-api.herokuapp.com/api/v1/products.json?brand=nyx&product_type=lipstick";

function transformar(json) {
  if (!Array.isArray(json)) return [];
  return json
    .filter((p) => p.name && (p.image_link || p.api_featured_image))
    .slice(0, 12)
    .map((p) => {
      const imagen = p.api_featured_image?.startsWith("//") ? `https:${p.api_featured_image}` : p.image_link;
      const precio = parseFloat(p.price);
      return {
        id: p.id,
        nombre: p.name.trim(),
        marca: p.brand ? p.brand.charAt(0).toUpperCase() + p.brand.slice(1) : "",
        precio: precio > 0 ? precio : null,
        imagen,
      };
    });
}

function Tarjeta({ producto, alFallar }) {
  const parametros = new URLSearchParams({ producto: producto.nombre, marca: producto.marca });
  return (
    <article className="border border-neutral-200 rounded-xl p-4 flex flex-col">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        loading="lazy"
        onError={() => alFallar(producto.id)}
        className="w-full h-36 object-contain mb-3 bg-white rounded-lg"
      />
      <p className="text-xs text-neutral-500">{producto.marca}</p>
      <h3 className="text-sm font-medium line-clamp-2 flex-1">{producto.nombre}</h3>
      {producto.precio && <p className="text-xs text-neutral-500 mt-1">Referencia: USD ${producto.precio.toFixed(2)}</p>}
      <Link
        to={`/solicitudes?${parametros.toString()}`}
        className="mt-3 text-xs text-center border border-neutral-300 px-3 py-1.5 rounded-full hover:border-pink-600 hover:text-pink-600"
      >
        Pedir por encargo
      </Link>
    </article>
  );
}

export default function InspiracionApi() {
  const { datos, cargando, error, reintentar } = useFetch(URL_API, { transformar });
  const [rotas, setRotas] = useState([]);

  const visibles = (datos ?? []).filter((p) => !rotas.includes(p.id)).slice(0, 4);

  return (
    <section className="border-t border-neutral-200" aria-labelledby="titulo-inspiracion">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-2">
          <h2 id="titulo-inspiracion" className="text-sm uppercase tracking-widest text-neutral-500">
            Inspiración internacional
          </h2>
        </div>
        <p className="text-sm text-neutral-600 mb-6">
          Tendencias de maquillaje de todo el mundo. Si algo te encanta, pídelo por encargo.
        </p>

        {cargando && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6" role="status" aria-label="Cargando productos">
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className="h-60 rounded-xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div role="alert" className="border border-neutral-200 rounded-xl p-5 text-sm flex flex-wrap items-center gap-3">
            <span className="text-neutral-600">{error} Mientras tanto, puedes explorar nuestro catálogo.</span>
            <button type="button" onClick={reintentar} className="border border-neutral-300 px-4 py-1.5 rounded-full hover:border-pink-600">
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && visibles.length === 0 && (
          <p className="text-sm text-neutral-500">Por ahora no hay productos para mostrar.</p>
        )}

        {visibles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {visibles.map((p) => (
              <Tarjeta key={p.id} producto={p} alFallar={(id) => setRotas((lista) => [...lista, id])} />
            ))}
          </div>
        )}

        <p className="text-xs text-neutral-400 mt-4">
          Datos de{" "}
          <a href="https://makeup-api.herokuapp.com" target="_blank" rel="noreferrer" className="underline">
            Makeup API
          </a>
          . Los precios son de referencia internacional.
        </p>
      </div>
    </section>
  );
}
