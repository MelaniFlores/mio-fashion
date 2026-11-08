import { useRef, useState } from "react";
import FiltrosPeriodo from "../components/FiltrosPeriodo";
import { GraficaAnual, GraficaMasVendidos, GraficaMensual } from "../components/Graficas";
import MetricCard from "../components/MetricCard";
import PedidosAdmin from "../components/PedidosAdmin";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import Recomendaciones from "../components/Recomendaciones";
import SolicitudesList from "../components/SolicitudesList";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useProducts } from "../context/ProductsContext";
import { usePedidosFiltrados } from "../hooks/usePedidosFiltrados";
import { confirmar, toast } from "../lib/alertas";
import { formatearPrecio } from "../lib/formato";

const NOMBRES_TRIMESTRE = { 1: "Ene–Mar", 2: "Abr–Jun", 3: "Jul–Sep", 4: "Oct–Dic" };

export default function Dashboard() {
  const { sesion } = useAuth();
  const { productos } = useProducts();
  const { cargarDemo, quitarDemo, hayDemo } = useOrders();

  const [anio, setAnio] = useState("todos");
  const [trimestre, setTrimestre] = useState("todos");
  const [editando, setEditando] = useState(null);
  const formularioRef = useRef(null);

  const estadisticas = usePedidosFiltrados(anio, trimestre);

  const periodo =
    anio === "todos" && trimestre === "todos"
      ? "Todo el historial"
      : [anio !== "todos" ? anio : "Todos los años", trimestre !== "todos" ? NOMBRES_TRIMESTRE[trimestre] : null]
          .filter(Boolean)
          .join(" · ");

  const valorInventario = productos.reduce((suma, p) => suma + p.precio * p.stock, 0);

  const empezarEdicion = (producto) => {
    setEditando(producto);
    formularioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const alternarDemo = async () => {
    if (hayDemo) {
      const acepto = await confirmar({
        titulo: "¿Borrar los datos de ejemplo?",
        texto: "Solo se borran los pedidos de ejemplo. Tus pedidos reales no se tocan.",
        textoConfirmar: "Sí, borrar ejemplos",
        peligro: true,
      });
      if (!acepto) return;
      quitarDemo();
      toast("success", "Datos de ejemplo borrados");
    } else {
      cargarDemo();
      toast("success", "Datos de ejemplo cargados");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Panel de administración</h1>
          {sesion?.nombre && <p className="text-sm text-neutral-500 mt-1">Hola, {sesion.nombre}</p>}
        </div>
        <FiltrosPeriodo
          anio={anio}
          trimestre={trimestre}
          anios={estadisticas.aniosDisponibles}
          alCambiarAnio={setAnio}
          alCambiarTrimestre={setTrimestre}
        />
      </div>

      <section aria-label="Métricas" className="grid grid-cols-2 md:grid-cols-5 gap-4 -mt-4">
        <MetricCard titulo="Productos" valor={productos.length} />
        <MetricCard titulo="Solicitudes" valor={estadisticas.solicitudesPeriodo.length} nota={periodo} />
        <MetricCard
          titulo="Pedidos"
          valor={estadisticas.pedidosPeriodo.length}
          nota={estadisticas.canceladosPeriodo ? `${estadisticas.canceladosPeriodo} cancelados (no cuentan)` : periodo}
        />
        <MetricCard
          titulo="Ingresos cobrados"
          valor={formatearPrecio(estadisticas.ingresosCobrados)}
          nota={estadisticas.porCobrar ? `+ ${formatearPrecio(estadisticas.porCobrar)} por cobrar` : "Solo pedidos pagados"}
        />
        <MetricCard titulo="Valor inventario" valor={formatearPrecio(valorInventario)} />
      </section>

      <Recomendaciones estadisticas={estadisticas} />

      <GraficaMensual
        etiquetas={estadisticas.etiquetasMeses}
        pedidos={estadisticas.pedidosPorMes}
        solicitudes={estadisticas.solicitudesPorMes}
        periodo={periodo}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <GraficaMasVendidos ranking={estadisticas.masVendidos} periodo={periodo} />
        <GraficaAnual etiquetas={estadisticas.pedidosPorAnio.etiquetas} datos={estadisticas.pedidosPorAnio.datos} />
      </div>

      <PedidosAdmin />

      <section ref={formularioRef} className="border border-neutral-200 rounded-xl p-6 scroll-mt-24" aria-labelledby="titulo-formulario">
        <h2 id="titulo-formulario" className="font-semibold mb-4">
          {editando ? `Editar producto: ${editando.nombre}` : "Agregar producto"}
        </h2>
        <ProductForm key={editando?.id ?? "nuevo"} editando={editando} alTerminar={() => setEditando(null)} />
      </section>

      <section className="border border-neutral-200 rounded-xl p-6" aria-labelledby="titulo-catalogo">
        <h2 id="titulo-catalogo" className="font-semibold mb-4">Catálogo</h2>
        <ProductTable alEditar={empezarEdicion} editandoId={editando?.id} />
      </section>

      <section className="border border-neutral-200 rounded-xl p-6" aria-labelledby="titulo-solicitudes">
        <h2 id="titulo-solicitudes" className="font-semibold mb-4">Solicitudes especiales</h2>
        <SolicitudesList />
      </section>

      <section className="border border-dashed border-neutral-300 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-sm">Datos de ejemplo</h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            Agrega pedidos ficticios de los últimos meses para ver cómo se ven las gráficas y los filtros (por ejemplo, para la
            demostración). Se pueden borrar con un clic sin afectar los pedidos reales.
          </p>
        </div>
        <button
          type="button"
          onClick={alternarDemo}
          className="text-sm border border-neutral-300 px-5 py-2.5 rounded-full hover:border-neutral-900"
        >
          {hayDemo ? "Borrar datos de ejemplo" : "Cargar datos de ejemplo"}
        </button>
      </section>
    </main>
  );
}
