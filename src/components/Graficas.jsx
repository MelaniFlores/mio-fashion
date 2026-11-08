import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useColoresGrafica } from "../hooks/useColoresGrafica";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Tarjeta({ titulo, descripcion, children }) {
  return (
    <section className="border border-neutral-200 rounded-xl p-6">
      <h2 className="font-semibold">{titulo}</h2>
      {descripcion && <p className="text-xs text-neutral-500 mb-4">{descripcion}</p>}
      {!descripcion && <div className="mb-4" />}
      {children}
    </section>
  );
}

function Vacio({ mensaje }) {
  return <p className="text-sm text-neutral-500 py-10 text-center">{mensaje}</p>;
}

function opciones(colores, { horizontal = false, leyenda = false } = {}) {
  const ejeCantidad = {
    beginAtZero: true,
    ticks: { color: colores.texto, precision: 0 }, // sin decimales: no existen "medio pedido"
    grid: { color: colores.rejilla },
  };
  const ejeCategorias = { ticks: { color: colores.texto }, grid: { display: false } };
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? "y" : "x",
    plugins: { legend: { display: leyenda, labels: { color: colores.texto } } },
    scales: horizontal ? { x: ejeCantidad, y: ejeCategorias } : { x: ejeCategorias, y: ejeCantidad },
  };
}

// 1) Pedidos y solicitudes por mes (respeta año y trimestre)
export function GraficaMensual({ etiquetas, pedidos, solicitudes, periodo }) {
  const colores = useColoresGrafica();
  const hayDatos = pedidos.some(Boolean) || solicitudes.some(Boolean);
  return (
    <Tarjeta titulo="Pedidos y solicitudes por mes" descripcion={`${periodo}. No incluye pedidos cancelados.`}>
      {hayDatos ? (
        <div className="h-64">
          <Bar
            role="img"
            aria-label={`Barras de pedidos y solicitudes por mes. ${periodo}.`}
            options={opciones(colores, { leyenda: true })}
            data={{
              labels: etiquetas,
              datasets: [
                { label: "Pedidos", data: pedidos, backgroundColor: colores.primario, borderRadius: 4 },
                { label: "Solicitudes", data: solicitudes, backgroundColor: colores.secundario, borderRadius: 4 },
              ],
            }}
          />
        </div>
      ) : (
        <Vacio mensaje="No hay pedidos ni solicitudes en este período." />
      )}
    </Tarjeta>
  );
}

// 2) Productos más vendidos (top 5 por unidades)
export function GraficaMasVendidos({ ranking, periodo }) {
  const colores = useColoresGrafica();
  return (
    <Tarjeta titulo="Productos más vendidos" descripcion={`Unidades vendidas. ${periodo}.`}>
      {ranking.length ? (
        <div className="h-64">
          <Bar
            role="img"
            aria-label={`Productos más vendidos: ${ranking.map((r) => `${r.nombre} ${r.unidades}`).join(", ")}.`}
            options={opciones(colores, { horizontal: true })}
            data={{
              labels: ranking.map((r) => r.nombre),
              datasets: [{ label: "Unidades", data: ranking.map((r) => r.unidades), backgroundColor: colores.secundario, borderRadius: 4 }],
            }}
          />
        </div>
      ) : (
        <Vacio mensaje="Aún no hay ventas en este período." />
      )}
    </Tarjeta>
  );
}

// 3) Total de pedidos por año (largo plazo, ignora los filtros)
export function GraficaAnual({ etiquetas, datos }) {
  const colores = useColoresGrafica();
  return (
    <Tarjeta titulo="Pedidos por año" descripcion="Visión de largo plazo. No incluye pedidos cancelados.">
      {datos.length ? (
        <div className="h-64">
          <Bar
            role="img"
            aria-label={`Pedidos por año: ${etiquetas.map((e, i) => `${e}: ${datos[i]}`).join(", ")}.`}
            options={opciones(colores)}
            data={{
              labels: etiquetas,
              datasets: [{ label: "Pedidos", data: datos, backgroundColor: colores.primario, borderRadius: 4 }],
            }}
          />
        </div>
      ) : (
        <Vacio mensaje="Todavía no hay pedidos registrados." />
      )}
    </Tarjeta>
  );
}
