import { createContext, useCallback, useContext, useMemo } from "react";
import { usePersistedReducer } from "../hooks/useLocalStorage";
import { normalizarImagen } from "../lib/formato";

const CartContext = createContext(null);

function normalizar(lista) {
  if (!Array.isArray(lista)) return [];
  return lista
    .filter((item) => item && item.id != null && item.cantidad > 0)
    .map((item) => ({ ...item, imagen: normalizarImagen(item.imagen) }));
}

function reducer(estado, accion) {
  switch (accion.tipo) {
    case "agregar": {
      const { id, nombre, precio, imagen, marca } = accion.producto;
      const existe = estado.some((item) => item.id === id);
      if (existe) return estado.map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item));
      return [...estado, { id, nombre, precio, imagen, marca, cantidad: 1 }];
    }
    case "cambiar":
      // Si la cantidad llega a 0, el producto sale del carrito
      return estado
        .map((item) => (item.id === accion.id ? { ...item, cantidad: item.cantidad + accion.delta } : item))
        .filter((item) => item.cantidad > 0);
    case "vaciar":
      return [];
    default:
      return estado;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = usePersistedReducer("carrito", reducer, [], normalizar);

  const agregar = useCallback((producto) => dispatch({ tipo: "agregar", producto }), [dispatch]);
  const cambiar = useCallback((id, delta) => dispatch({ tipo: "cambiar", id, delta }), [dispatch]);
  const vaciar = useCallback(() => dispatch({ tipo: "vaciar" }), [dispatch]);
  const cantidadDe = useCallback((id) => items.find((item) => item.id === id)?.cantidad ?? 0, [items]);

  const total = useMemo(() => items.reduce((suma, item) => suma + item.precio * item.cantidad, 0), [items]);
  const unidades = useMemo(() => items.reduce((suma, item) => suma + item.cantidad, 0), [items]);

  const valor = useMemo(
    () => ({ items, total, unidades, agregar, cambiar, vaciar, cantidadDe }),
    [items, total, unidades, agregar, cambiar, vaciar, cantidadDe]
  );

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error("useCart debe usarse dentro de CartProvider");
  return contexto;
}
