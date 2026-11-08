export const NOMBRES_MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// Las fechas del proyecto original vienen como "dd/mm/aaaa" (toLocaleDateString es-SV)
export function parseFechaLocal(texto) {
  const [dia, mes, anio] = String(texto ?? "").split("/").map(Number);
  if (!dia || !mes || !anio) return new Date(NaN);
  return new Date(anio, mes - 1, dia, 12);
}

// Convierte una fecha "dd/mm/aaaa" a ISO. Si no se puede leer, usa la fecha de hoy.
export function aISO(texto) {
  const fecha = parseFechaLocal(texto);
  return isNaN(fecha) ? new Date().toISOString() : fecha.toISOString();
}

// Devuelve un objeto Date para pedidos y solicitudes (nuevos o antiguos)
export function obtenerFecha(registro) {
  if (registro.fechaISO) return new Date(registro.fechaISO);
  return parseFechaLocal(registro.fecha);
}

export function formatearFecha(registro) {
  const fecha = obtenerFecha(registro);
  return isNaN(fecha) ? registro.fecha ?? "" : fecha.toLocaleDateString("es-SV");
}
