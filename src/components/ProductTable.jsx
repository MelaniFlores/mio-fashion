import { useProducts } from "../context/ProductsContext";
import { STOCK_BAJO } from "../data/config";
import { confirmar, toast } from "../lib/alertas";
import { formatearPrecio } from "../lib/formato";
import { ImagenProducto } from "./ProductCard";

export default function ProductTable({ alEditar, editandoId }) {
  const { productos, eliminarProducto, alternarDestacado } = useProducts();

  const eliminar = async (producto) => {
    const acepto = await confirmar({
      titulo: `¿Eliminar "${producto.nombre}"?`,
      texto: "Saldrá del catálogo. Esta acción no se puede deshacer.",
      textoConfirmar: "Sí, eliminar",
      peligro: true,
    });
    if (!acepto) return;
    eliminarProducto(producto.id);
    toast("success", "Producto eliminado");
  };

  if (productos.length === 0) return <p className="text-sm text-neutral-500">No hay productos.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500 border-b border-neutral-200">
            <th className="pb-2 pr-3">Producto</th>
            <th className="pb-2 pr-3">Marca</th>
            <th className="pb-2 pr-3">Categoría</th>
            <th className="pb-2 pr-3">Precio</th>
            <th className="pb-2 pr-3">Stock</th>
            <th className="pb-2 pr-3">Inicio</th>
            <th className="pb-2" />
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} className={`border-b border-neutral-100 ${editandoId === p.id ? "bg-neutral-50" : ""}`}>
              <td className="py-3 pr-3">
                <div className="flex items-center gap-3">
                  <ImagenProducto producto={p} className="w-10 h-10 object-cover rounded bg-neutral-100 shrink-0 text-[9px]" />
                  <span>{p.nombre}</span>
                </div>
              </td>
              <td className="pr-3">{p.marca}</td>
              <td className="pr-3">{p.categoria}</td>
              <td className="pr-3">{formatearPrecio(p.precio)}</td>
              <td className={`pr-3 ${p.stock <= STOCK_BAJO ? "text-red-600 font-semibold" : ""}`}>{p.stock}</td>
              <td className="pr-3">
                <button
                  type="button"
                  aria-pressed={p.destacado}
                  aria-label={p.destacado ? `Quitar ${p.nombre} del carrusel` : `Destacar ${p.nombre} en el carrusel`}
                  onClick={() => alternarDestacado(p.id)}
                  className={`text-lg leading-none ${p.destacado ? "text-pink-600" : "text-neutral-300 hover:text-pink-400"}`}
                >
                  ★
                </button>
              </td>
              <td className="text-right whitespace-nowrap">
                <button type="button" onClick={() => alEditar(p)} className="text-xs border border-neutral-300 px-3 py-1 rounded-full mr-1">
                  Editar
                </button>
                <button type="button" onClick={() => eliminar(p)} className="text-xs border border-red-200 text-red-600 px-3 py-1 rounded-full">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
