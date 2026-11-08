import { createContext, useCallback, useContext, useMemo } from "react";
import { usePersistedReducer } from "../hooks/useLocalStorage";
import { PRODUCTOS_INICIALES } from "../data/productosIniciales";
import { normalizarImagen } from "../lib/formato";

const ProductsContext = createContext(null);

// Datos guardados por la versión anterior (JS vanilla): rutas "img/..." y sin "destacado"
function normalizar(lista) {
  if (!Array.isArray(lista)) return PRODUCTOS_INICIALES;
  return lista.map((p) => ({ destacado: false, ...p, imagen: normalizarImagen(p.imagen) }));
}

function reducer(estado, accion) {
  switch (accion.tipo) {
    case "agregar": {
      const id = estado.length ? Math.max(...estado.map((p) => p.id)) + 1 : 1;
      return [...estado, { ...accion.producto, id }];
    }
    case "actualizar":
      return estado.map((p) => (p.id === accion.producto.id ? { ...p, ...accion.producto } : p));
    case "eliminar":
      return estado.filter((p) => p.id !== accion.id);
    case "alternarDestacado":
      return estado.map((p) => (p.id === accion.id ? { ...p, destacado: !p.destacado } : p));
    case "ajustarStock":
      // signo = -1 al vender, +1 al devolver existencias
      return estado.map((p) => {
        const linea = accion.items.find((i) => i.id === p.id);
        return linea ? { ...p, stock: Math.max(0, p.stock + accion.signo * linea.cantidad) } : p;
      });
    default:
      return estado;
  }
}

export function ProductsProvider({ children }) {
  const [productos, dispatch] = usePersistedReducer("productos", reducer, PRODUCTOS_INICIALES, normalizar);

  const agregarProducto = useCallback((producto) => dispatch({ tipo: "agregar", producto }), [dispatch]);
  const actualizarProducto = useCallback((producto) => dispatch({ tipo: "actualizar", producto }), [dispatch]);
  const eliminarProducto = useCallback((id) => dispatch({ tipo: "eliminar", id }), [dispatch]);
  const alternarDestacado = useCallback((id) => dispatch({ tipo: "alternarDestacado", id }), [dispatch]);
  const descontarStock = useCallback((items) => dispatch({ tipo: "ajustarStock", items, signo: -1 }), [dispatch]);
  const reponerStock = useCallback((items) => dispatch({ tipo: "ajustarStock", items, signo: 1 }), [dispatch]);

  const valor = useMemo(
    () => ({
      productos,
      agregarProducto,
      actualizarProducto,
      eliminarProducto,
      alternarDestacado,
      descontarStock,
      reponerStock,
    }),
    [productos, agregarProducto, actualizarProducto, eliminarProducto, alternarDestacado, descontarStock, reponerStock]
  );

  return <ProductsContext.Provider value={valor}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const contexto = useContext(ProductsContext);
  if (!contexto) throw new Error("useProducts debe usarse dentro de ProductsProvider");
  return contexto;
}
