import { useMemo } from "react";
import { useOrders } from "../context/OrdersContext";
import { useProducts } from "../context/ProductsContext";
import { STOCK_BAJO } from "../data/config";
import { toast } from "../lib/alertas";

// Consejos automáticos para la administradora a partir de sus propios datos
export default function Recomendaciones({ estadisticas }) {
  const { productos, alternarDestacado } = useProducts();
  const { pedidos } = useOrders();
  const { unidadesPorProducto, masVendidos, pedidosPeriodo, canceladosPeriodo } = estadisticas;

  const consejos = useMemo(() => {
    const lista = [];

    const agotados = productos.filter((p) => p.stock <= 0);
    const bajos = productos.filter((p) => p.stock > 0 && p.stock <= STOCK_BAJO);
    if (agotados.length || bajos.length) {
      const partes = [];
      if (agotados.length) partes.push(`Agotados: ${agotados.map((p) => p.nombre).join(", ")}`);
      if (bajos.length) partes.push(`Quedan ${STOCK_BAJO} o menos de: ${bajos.map((p) => `${p.nombre} (${p.stock})`).join(", ")}`);
      lista.push({ id: "stock", tono: "rojo", titulo: "Revisa tu inventario", detalle: partes.join(". ") + "." });
    }

    const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;
    if (pendientes > 0) {
      lista.push({
        id: "pendientes",
        tono: "ambar",
        titulo: `${pendientes} ${pendientes === 1 ? "pedido pendiente" : "pedidos pendientes"}`,
        detalle: "Confirma el pago o cancélalos para mantener tus finanzas al día.",
      });
    }

    if (masVendidos[0]) {
      lista.push({
        id: "top",
        tono: "verde",
        titulo: `${masVendidos[0].nombre} es lo más vendido`,
        detalle: `${masVendidos[0].unidades} unidades en este período. Asegúrate de tener existencias suficientes.`,
      });
    }

    // Productos con stock que casi no se mueven: candidatos a destacar en el carrusel del inicio
    if (pedidosPeriodo.length > 0) {
      const sinVentas = productos
        .filter((p) => p.stock > 0 && !unidadesPorProducto[p.id] && !p.destacado)
        .slice(0, 3);
      if (sinVentas.length) {
        lista.push({
          id: "sinVentas",
          tono: "rosa",
          titulo: "Productos sin ventas en este período",
          detalle: "Destácalos en el carrusel del inicio para darles más visibilidad:",
          acciones: sinVentas,
        });
      }
    }

    const totalConCancelados = pedidosPeriodo.length + canceladosPeriodo;
    if (totalConCancelados >= 5 && canceladosPeriodo / totalConCancelados >= 0.2) {
      lista.push({
        id: "cancelados",
        tono: "ambar",
        titulo: "Muchas cancelaciones",
        detalle: `${canceladosPeriodo} de ${totalConCancelados} pedidos se cancelaron en este período. Vale la pena revisar el motivo.`,
      });
    }

    return lista;
  }, [productos, pedidos, unidadesPorProducto, masVendidos, pedidosPeriodo, canceladosPeriodo]);

  const colores = {
    rojo: "border-red-200",
    ambar: "border-amber-200",
    verde: "border-green-200",
    rosa: "border-pink-200",
  };

  return (
    <section className="border border-neutral-200 rounded-xl p-6" aria-labelledby="titulo-recomendaciones">
      <h2 id="titulo-recomendaciones" className="font-semibold mb-4">Recomendaciones para tu negocio</h2>
      {consejos.length === 0 ? (
        <p className="text-sm text-neutral-500">Todo en orden por ahora. 🎉</p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-3">
          {consejos.map((c) => (
            <li key={c.id} className={`border-l-4 ${colores[c.tono]} bg-neutral-50 rounded-lg p-4`}>
              <p className="text-sm font-medium">{c.titulo}</p>
              <p className="text-xs text-neutral-600 mt-1">{c.detalle}</p>
              {c.acciones && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {c.acciones.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        alternarDestacado(p.id);
                        toast("success", `${p.nombre} ahora aparece en el carrusel`);
                      }}
                      className="text-xs border border-neutral-300 px-3 py-1.5 rounded-full hover:border-pink-600 hover:text-pink-600"
                    >
                      ★ Destacar {p.nombre}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
