import { useMemo } from "react";
import { Link } from "react-router-dom";
import EstadoBadge from "../components/EstadoBadge";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { formatearFecha } from "../lib/fechas";
import { formatearPrecio } from "../lib/formato";

export default function MisPedidos() {
  const { sesion } = useAuth();
  const { pedidos } = useOrders();

  // Solo los pedidos de este cliente (comparando su correo), el más reciente primero
  const misPedidos = useMemo(
    () => pedidos.filter((p) => p.cliente === sesion.correo).slice().reverse(),
    [pedidos, sesion.correo]
  );

  // Los cancelados no cuentan en el total acumulado
  const totalGastado = misPedidos.filter((p) => p.estado !== "cancelado").reduce((suma, p) => suma + p.total, 0);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">Mis pedidos</h1>
      <p className="text-sm text-neutral-500 mb-6">
        {misPedidos.length} {misPedidos.length === 1 ? "pedido" : "pedidos"} · Total acumulado: {formatearPrecio(totalGastado)}
      </p>

      {misPedidos.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Aún no tienes pedidos.{" "}
          <Link to="/catalogo" className="text-pink-600 hover:underline">
            Ir al catálogo
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {misPedidos.map((pedido) => (
            <article key={pedido.id} className="border border-neutral-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2 gap-3">
                <span className="text-sm text-neutral-500">{formatearFecha(pedido)}</span>
                <div className="flex items-center gap-3">
                  <EstadoBadge estado={pedido.estado} />
                  <span className="text-sm font-semibold">{formatearPrecio(pedido.total)}</span>
                </div>
              </div>
              <p className="text-sm">{pedido.productos.map((item) => `${item.nombre} x${item.cantidad}`).join(", ")}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
