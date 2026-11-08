import { createContext, useCallback, useContext, useMemo } from "react";
import { usePersistedReducer, useLocalStorage } from "../hooks/useLocalStorage";
import { useProducts } from "./ProductsContext";
import { aISO } from "../lib/fechas";
import { generarPedidosDemo } from "../lib/demo";

const OrdersContext = createContext(null);

// Pedidos guardados por la versión anterior no tenían estado ni fecha ISO
function normalizarPedidos(lista) {
  if (!Array.isArray(lista)) return [];
  return lista.map((p) => ({
    ...p,
    productos: Array.isArray(p.productos) ? p.productos : [],
    estado: p.estado || "pendiente",
    fechaISO: p.fechaISO || aISO(p.fecha),
  }));
}

function pedidosReducer(estado, accion) {
  switch (accion.tipo) {
    case "registrar":
      return [...estado, accion.pedido];
    case "cambiarEstado":
      return estado.map((p) => (p.id === accion.id ? { ...p, estado: accion.estado } : p));
    case "agregarDemo":
      return [...estado, ...accion.pedidos];
    case "quitarDemo":
      return estado.filter((p) => !p.demo);
    default:
      return estado;
  }
}

export function OrdersProvider({ children }) {
  const { productos, descontarStock, reponerStock } = useProducts();
  const [pedidos, dispatch] = usePersistedReducer("pedidos", pedidosReducer, [], normalizarPedidos);
  const [solicitudes, setSolicitudes] = useLocalStorage("solicitudes", []);

  // Guarda el pedido y descuenta las existencias
  const registrarPedido = useCallback(
    ({ cliente, items, telefono }) => {
      const ahora = new Date();
      dispatch({
        tipo: "registrar",
        pedido: {
          id: Date.now(),
          cliente,
          productos: items.map(({ id, nombre, precio, cantidad }) => ({ id, nombre, precio, cantidad })),
          total: items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
          telefono,
          estado: "pendiente",
          fecha: ahora.toLocaleDateString("es-SV"),
          fechaISO: ahora.toISOString(),
        },
      });
      descontarStock(items);
    },
    [dispatch, descontarStock]
  );

  // Al cancelar un pedido se devuelven las existencias; si se reactiva, se vuelven a descontar.
  // Los pedidos de ejemplo no tocan el inventario.
  const cambiarEstado = useCallback(
    (id, nuevo) => {
      const pedido = pedidos.find((p) => p.id === id);
      if (!pedido || pedido.estado === nuevo) return;
      if (!pedido.demo) {
        if (nuevo === "cancelado") reponerStock(pedido.productos);
        else if (pedido.estado === "cancelado") descontarStock(pedido.productos);
      }
      dispatch({ tipo: "cambiarEstado", id, estado: nuevo });
    },
    [pedidos, dispatch, reponerStock, descontarStock]
  );

  const agregarSolicitud = useCallback(
    (datos) => {
      const ahora = new Date();
      setSolicitudes((lista) => [
        ...lista,
        { id: Date.now(), ...datos, fecha: ahora.toLocaleDateString("es-SV"), fechaISO: ahora.toISOString() },
      ]);
    },
    [setSolicitudes]
  );

  const cargarDemo = useCallback(
    () => dispatch({ tipo: "agregarDemo", pedidos: generarPedidosDemo(productos) }),
    [dispatch, productos]
  );
  const quitarDemo = useCallback(() => dispatch({ tipo: "quitarDemo" }), [dispatch]);
  const hayDemo = useMemo(() => pedidos.some((p) => p.demo), [pedidos]);

  const valor = useMemo(
    () => ({ pedidos, solicitudes, registrarPedido, cambiarEstado, agregarSolicitud, cargarDemo, quitarDemo, hayDemo }),
    [pedidos, solicitudes, registrarPedido, cambiarEstado, agregarSolicitud, cargarDemo, quitarDemo, hayDemo]
  );

  return <OrdersContext.Provider value={valor}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const contexto = useContext(OrdersContext);
  if (!contexto) throw new Error("useOrders debe usarse dentro de OrdersProvider");
  return contexto;
}
