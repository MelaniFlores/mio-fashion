import { useMemo, useState } from "react";
import { useOrders } from "../context/OrdersContext";
import { ESTADOS_PEDIDO } from "../data/config";
import { confirmar, toast } from "../lib/alertas";
import { formatearFecha, obtenerFecha } from "../lib/fechas";
import { formatearPrecio } from "../lib/formato";
import EstadoBadge from "./EstadoBadge";

const POR_PAGINA = 10;

// Consulta de pedidos y cambio de estado (pendiente, pagado o cancelado)
export default function PedidosAdmin() {
  const { pedidos, cambiarEstado } = useOrders();
  const [filtro, setFiltro] = useState("todos");
  const [limite, setLimite] = useState(POR_PAGINA);

  const ordenados = useMemo(
    () => [...pedidos].sort((a, b) => obtenerFecha(b) - obtenerFecha(a) || b.id - a.id),
    [pedidos]
  );
  const visibles = ordenados.filter((p) => filtro === "todos" || p.estado === filtro);

  const cambiar = async (pedido, nuevo) => {
    if (nuevo === "cancelado") {
      const acepto = await confirmar({
        titulo: "¿Cancelar este pedido?",
        texto: "Se devolverán las existencias al inventario y dejará de contarse en las métricas y gráficas.",
        textoConfirmar: "Sí, cancelar pedido",
        peligro: true,
      });
      if (!acepto) return;
    }
    cambiarEstado(pedido.id, nuevo);
    toast("success", `Pedido marcado como ${ESTADOS_PEDIDO.find((e) => e.valor === nuevo).etiqueta.toLowerCase()}`);
  };

  const opciones = [{ valor: "todos", etiqueta: "Todos" }, ...ESTADOS_PEDIDO];

  return (
    <section className="border border-neutral-200 rounded-xl p-6" aria-labelledby="titulo-pedidos">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 id="titulo-pedidos" className="font-semibold">Pedidos</h2>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filtrar por estado">
          {opciones.map((o) => (
            <button
              key={o.valor}
              type="button"
              aria-pressed={filtro === o.valor}
              onClick={() => {
                setFiltro(o.valor);
                setLimite(POR_PAGINA);
              }}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                filtro === o.valor ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300 hover:border-neutral-900"
              }`}
            >
              {o.etiqueta}
            </button>
          ))}
        </div>
      </div>

      {visibles.length === 0 ? (
        <p className="text-sm text-neutral-500">No hay pedidos {filtro === "todos" ? "registrados" : "con este estado"}.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b border-neutral-200">
                  <th className="pb-2 pr-3">Fecha</th>
                  <th className="pb-2 pr-3">Cliente</th>
                  <th className="pb-2 pr-3">Productos</th>
                  <th className="pb-2 pr-3">Total</th>
                  <th className="pb-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {visibles.slice(0, limite).map((pedido) => (
                  <tr key={pedido.id} className="border-b border-neutral-100 align-top">
                    <td className="py-3 pr-3 whitespace-nowrap">{formatearFecha(pedido)}</td>
                    <td className="py-3 pr-3">
                      <p>{pedido.cliente}</p>
                      <p className="text-xs text-neutral-500">{pedido.telefono}</p>
                      {pedido.demo && <p className="text-xs text-pink-600">Ejemplo</p>}
                    </td>
                    <td className="py-3 pr-3 max-w-xs">
                      {pedido.productos.map((item) => `${item.nombre} x${item.cantidad}`).join(", ")}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap font-medium">{formatearPrecio(pedido.total)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <EstadoBadge estado={pedido.estado} />
                        <select
                          aria-label={`Cambiar estado del pedido del ${formatearFecha(pedido)}`}
                          value={pedido.estado}
                          onChange={(e) => cambiar(pedido, e.target.value)}
                          className="border border-neutral-300 rounded-lg px-2 py-1 text-xs"
                        >
                          {ESTADOS_PEDIDO.map((e) => (
                            <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {visibles.length > limite && (
            <button
              type="button"
              onClick={() => setLimite(limite + POR_PAGINA)}
              className="mt-4 text-sm border border-neutral-300 px-4 py-2 rounded-full hover:border-neutral-900"
            >
              Ver más ({visibles.length - limite} restantes)
            </button>
          )}
        </>
      )}
    </section>
  );
}
