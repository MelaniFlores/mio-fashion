import { useOrders } from "../context/OrdersContext";
import { formatearFecha } from "../lib/fechas";

export default function SolicitudesList() {
  const { solicitudes } = useOrders();

  if (solicitudes.length === 0) return <p className="text-sm text-neutral-500">No hay solicitudes registradas.</p>;

  return (
    <div className="flex flex-col gap-3">
      {solicitudes
        .slice()
        .reverse()
        .map((s) => (
          <div key={s.id} className="border border-neutral-200 rounded-lg p-4">
            <div className="flex justify-between mb-1 gap-3">
              <p className="font-medium text-sm">
                {s.producto}
                {s.marca && s.marca !== "Sin especificar" && <span className="text-neutral-500 font-normal"> · {s.marca}</span>}
              </p>
              <span className="text-xs text-neutral-500 whitespace-nowrap">{formatearFecha(s)}</span>
            </div>
            <p className="text-xs text-neutral-500">
              {s.nombre} · {s.telefono}
            </p>
            <p className="text-sm mt-2">{s.detalle}</p>
          </div>
        ))}
    </div>
  );
}
