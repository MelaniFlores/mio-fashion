import { useMemo } from "react";
import { useOrders } from "../context/OrdersContext";
import { NOMBRES_MESES, obtenerFecha } from "../lib/fechas";

// Calcula TODAS las estadísticas del panel a partir de los pedidos y el período elegido.
// Así cada gráfica y cada métrica lee de la misma fuente y los filtros afectan a todas por igual.
//  - Los pedidos cancelados nunca se cuentan.
//  - anio: "todos" o un año (2026). trimestre: "todos" o 1, 2, 3, 4.
export function usePedidosFiltrados(anio = "todos", trimestre = "todos") {
  const { pedidos, solicitudes } = useOrders();

  return useMemo(() => {
    const dentroDelPeriodo = (registro) => {
      const fecha = obtenerFecha(registro);
      if (anio !== "todos" && fecha.getFullYear() !== Number(anio)) return false;
      if (trimestre !== "todos" && Math.floor(fecha.getMonth() / 3) + 1 !== Number(trimestre)) return false;
      return true;
    };

    const validos = pedidos.filter((p) => p.estado !== "cancelado");
    const pedidosPeriodo = validos.filter(dentroDelPeriodo);
    const canceladosPeriodo = pedidos.filter((p) => p.estado === "cancelado" && dentroDelPeriodo(p)).length;
    const solicitudesPeriodo = solicitudes.filter(dentroDelPeriodo);

    // Años que tienen datos (más el actual) para el selector
    const anios = new Set([new Date().getFullYear()]);
    [...pedidos, ...solicitudes].forEach((r) => {
      const a = obtenerFecha(r).getFullYear();
      if (!isNaN(a)) anios.add(a);
    });
    const aniosDisponibles = [...anios].sort((a, b) => b - a);

    // Meses que se muestran en la gráfica: los 12 o solo los 3 del trimestre
    const mesesVisibles =
      trimestre === "todos"
        ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        : [0, 1, 2].map((i) => (Number(trimestre) - 1) * 3 + i);

    const contarPorMes = (lista) => {
      const conteo = Array(12).fill(0);
      lista.forEach((r) => {
        const mes = obtenerFecha(r).getMonth();
        if (!isNaN(mes)) conteo[mes]++;
      });
      return mesesVisibles.map((m) => conteo[m]);
    };

    // Unidades vendidas por producto en el período
    const ventas = new Map();
    pedidosPeriodo.forEach((pedido) =>
      pedido.productos.forEach((linea) => {
        const actual = ventas.get(linea.id) ?? { id: linea.id, nombre: linea.nombre, unidades: 0 };
        actual.unidades += linea.cantidad;
        ventas.set(linea.id, actual);
      })
    );
    const ranking = [...ventas.values()].sort((a, b) => b.unidades - a.unidades);

    // Total de pedidos por año (visión de largo plazo: ignora el filtro)
    const porAnioMapa = {};
    validos.forEach((p) => {
      const a = obtenerFecha(p).getFullYear();
      if (!isNaN(a)) porAnioMapa[a] = (porAnioMapa[a] ?? 0) + 1;
    });
    const aniosConPedidos = Object.keys(porAnioMapa).sort();

    const sumar = (lista) => lista.reduce((suma, p) => suma + p.total, 0);

    return {
      aniosDisponibles,
      pedidosPeriodo,
      canceladosPeriodo,
      solicitudesPeriodo,
      etiquetasMeses: mesesVisibles.map((m) => NOMBRES_MESES[m]),
      pedidosPorMes: contarPorMes(pedidosPeriodo),
      solicitudesPorMes: contarPorMes(solicitudesPeriodo),
      masVendidos: ranking.slice(0, 5),
      unidadesPorProducto: Object.fromEntries(ranking.map((r) => [r.id, r.unidades])),
      pedidosPorAnio: { etiquetas: aniosConPedidos, datos: aniosConPedidos.map((a) => porAnioMapa[a]) },
      ingresosCobrados: sumar(pedidosPeriodo.filter((p) => p.estado === "pagado")),
      porCobrar: sumar(pedidosPeriodo.filter((p) => p.estado === "pendiente")),
    };
  }, [pedidos, solicitudes, anio, trimestre]);
}
