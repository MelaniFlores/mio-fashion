import { useMemo } from "react";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";
import InspiracionApi from "../components/InspiracionApi";
import { ImagenProducto } from "../components/ProductCard";
import { useOrders } from "../context/OrdersContext";
import { useProducts } from "../context/ProductsContext";
import { CATEGORIAS } from "../data/productosIniciales";
import { formatearPrecio } from "../lib/formato";

export default function Inicio() {
  const { productos } = useProducts();
  const { pedidos } = useOrders();

  // Carrusel: primero los productos que la administradora marcó como "Destacado".
  // Si no marcó ninguno, se muestran los de menos ventas para darles más visibilidad.
  const { itemsCarrusel, etiqueta } = useMemo(() => {
    const conImagen = productos.filter((p) => p.imagen && p.stock > 0);
    const destacados = conImagen.filter((p) => p.destacado);
    if (destacados.length > 0) return { itemsCarrusel: destacados, etiqueta: "Destacado" };

    const vendidas = {};
    pedidos
      .filter((p) => p.estado !== "cancelado")
      .forEach((p) => p.productos.forEach((l) => (vendidas[l.id] = (vendidas[l.id] ?? 0) + l.cantidad)));
    const menosVendidos = [...conImagen]
      .sort((a, b) => (vendidas[a.id] ?? 0) - (vendidas[b.id] ?? 0) || b.stock - a.stock)
      .slice(0, 5);
    return { itemsCarrusel: menosVendidos, etiqueta: "Descúbrelo" };
  }, [productos, pedidos]);

  // "Lo más nuevo": los últimos 4 productos agregados
  const nuevos = useMemo(() => [...productos].sort((a, b) => b.id - a.id).slice(0, 4), [productos]);

  return (
    <main>
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            Todo tu maquillaje
            <br />
            favorito en un solo lugar.
          </h1>
          <p className="mt-6 text-neutral-600 leading-relaxed">
            Encuentra tus productos favoritos 100% originales en un solo lugar. Explora por categoría, arma tu pedido
            fácilmente y mándanoslo directamente por WhatsApp para coordinar tu entrega rápida.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/catalogo" className="bg-neutral-900 text-white px-6 py-3 rounded-full text-sm hover:bg-neutral-700">
              Ver catálogo
            </Link>
            <Link to="/solicitudes" className="border border-neutral-300 px-6 py-3 rounded-full text-sm hover:border-neutral-900">
              Solicitar producto especial
            </Link>
          </div>
        </div>

        <Carousel items={itemsCarrusel} etiqueta={etiqueta} />
      </section>

      <section className="border-t border-neutral-200" aria-label="Categorías">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
            {CATEGORIAS.filter((c) => c !== "Todos").map((categoria) => (
              <Link
                key={categoria}
                to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                className="py-3 text-center border border-neutral-200 rounded-lg hover:border-pink-600 hover:text-pink-600"
              >
                {categoria}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12" aria-labelledby="titulo-nuevos">
        <div className="flex items-center justify-between mb-6">
          <h2 id="titulo-nuevos" className="text-sm uppercase tracking-widest text-neutral-500">
            Lo más nuevo
          </h2>
          <Link to="/catalogo" className="text-sm text-pink-600 hover:underline">
            Ver todo
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {nuevos.map((producto) => (
            <article key={producto.id}>
              <ImagenProducto producto={producto} className="w-full h-48 object-cover rounded-xl mb-3 bg-neutral-100" />
              <p className="text-xs text-neutral-500">{producto.marca}</p>
              <h3 className="text-sm font-medium">{producto.nombre}</h3>
              <p className="text-sm mt-1">{formatearPrecio(producto.precio)}</p>
            </article>
          ))}
        </div>
      </section>

      <InspiracionApi />
    </main>
  );
}
