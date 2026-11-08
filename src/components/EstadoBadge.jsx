import { ESTADOS_PEDIDO } from "../data/config";

export default function EstadoBadge({ estado }) {
  const datos = ESTADOS_PEDIDO.find((e) => e.valor === estado) ?? ESTADOS_PEDIDO[0];
  return <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${datos.clases}`}>{datos.etiqueta}</span>;
}
