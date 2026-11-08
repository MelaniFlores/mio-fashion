import { useState } from "react";
import { useCart } from "../context/CartContext";
import { aviso, toast } from "../lib/alertas";
import { formatearPrecio } from "../lib/formato";

// Imagen del producto con respaldo si el enlace está roto
export function ImagenProducto({ producto, className }) {
  const [rota, setRota] = useState(false);
  if (!producto.imagen || rota) {
    return (
      <div className={`${className} flex items-center justify-center bg-neutral-100 text-xs text-neutral-500`}>
        Sin imagen
      </div>
    );
  }
  return <img src={producto.imagen} alt={producto.nombre} className={className} loading="lazy" onError={() => setRota(true)} />;
}

export default function ProductCard({ producto }) {
  const { agregar, cantidadDe } = useCart();
  const agotado = producto.stock <= 0;

  const alAgregar = () => {
    if (cantidadDe(producto.id) >= producto.stock) {
      aviso("Sin existencias", `Solo quedan ${producto.stock} unidades de ${producto.nombre}.`);
      return;
    }
    agregar(producto);
    toast("success", "Agregado a tu pedido");
  };

  return (
    <article className="border border-neutral-200 rounded-xl p-4">
      <ImagenProducto producto={producto} className="w-full h-40 object-contain rounded-lg mb-3 bg-white" />
      <p className="text-xs text-neutral-500">{producto.marca}</p>
      <h3 className="text-sm font-medium">{producto.nombre}</h3>
      <p className={`text-xs mt-1 ${agotado ? "text-red-600 font-semibold" : "text-neutral-500"}`}>
        {agotado ? "Agotado" : `${producto.stock} disponibles`}
      </p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-semibold">{formatearPrecio(producto.precio)}</span>
        <button
          type="button"
          onClick={alAgregar}
          disabled={agotado}
          className="text-xs border border-neutral-300 px-3 py-1.5 rounded-full hover:bg-neutral-900 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit"
        >
          Agregar
        </button>
      </div>
    </article>
  );
}
