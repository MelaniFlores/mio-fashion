import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CartPanel from "../components/CartPanel";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";
import { CATEGORIAS } from "../data/productosIniciales";

export default function Catalogo() {
  const { productos } = useProducts();
  const [parametros] = useSearchParams();

  // Si llegas desde el inicio con ?categoria=Labios, el filtro ya viene activo
  const categoriaInicial = CATEGORIAS.includes(parametros.get("categoria")) ? parametros.get("categoria") : "Todos";
  const [categoriaActiva, setCategoriaActiva] = useState(categoriaInicial);
  const [busqueda, setBusqueda] = useState("");

  const filtrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return productos.filter((p) => {
      const coincideCategoria = categoriaActiva === "Todos" || p.categoria === categoriaActiva;
      const coincideBusqueda = p.nombre.toLowerCase().includes(texto) || p.marca.toLowerCase().includes(texto);
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, categoriaActiva, busqueda]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[200px_1fr_300px] gap-8">
      <aside>
        <label htmlFor="buscador" className="sr-only">
          Buscar producto
        </label>
        <input
          id="buscador"
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full text-sm border border-neutral-300 rounded-lg px-3 py-2 mb-6"
        />
        <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Categorías</h3>
        <div className="flex flex-row lg:flex-col flex-wrap gap-1">
          {CATEGORIAS.map((categoria) => (
            <button
              key={categoria}
              type="button"
              aria-pressed={categoria === categoriaActiva}
              onClick={() => setCategoriaActiva(categoria)}
              className={`text-left text-sm px-3 py-2 rounded-lg ${
                categoria === categoriaActiva ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </aside>

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="text-2xl font-semibold">Catálogo</h1>
          <span className="text-sm text-neutral-500" aria-live="polite">
            {filtrados.length} {filtrados.length === 1 ? "producto" : "productos"}
          </span>
        </div>
        {filtrados.length === 0 ? (
          <p className="text-sm text-neutral-500">No se encontraron productos.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {filtrados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </section>

      <CartPanel />
    </main>
  );
}
