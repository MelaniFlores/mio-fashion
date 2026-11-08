// Genera pedidos de ejemplo para que las gráficas se vean completas en la demostración.
// Todos llevan demo: true para poder borrarlos con un clic sin tocar los pedidos reales.

// Generador pseudoaleatorio con semilla fija: siempre produce los mismos datos
function mulberry32(semilla) {
  return function () {
    semilla |= 0;
    semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generarPedidosDemo(productos, cantidad = 40) {
  const aleatorio = mulberry32(2026);
  const disponibles = productos.filter((p) => p.precio > 0);
  if (disponibles.length === 0) return [];

  const hoy = new Date();
  const pedidos = [];

  for (let i = 0; i < cantidad; i++) {
    // Fecha dentro de los últimos ~20 meses
    const diasAtras = Math.floor(aleatorio() * 600);
    const fecha = new Date(hoy.getTime() - diasAtras * 86400000);
    fecha.setHours(12, 0, 0, 0);

    // Los primeros productos se venden más (para que el ranking tenga sentido)
    const lineas = 1 + Math.floor(aleatorio() * 3);
    const items = [];
    for (let j = 0; j < lineas; j++) {
      const indice = Math.floor(Math.pow(aleatorio(), 1.8) * disponibles.length);
      const producto = disponibles[indice];
      if (items.some((x) => x.id === producto.id)) continue;
      items.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1 + Math.floor(aleatorio() * 3),
      });
    }

    const azar = aleatorio();
    const estado = azar < 0.7 ? "pagado" : azar < 0.92 ? "pendiente" : "cancelado";

    pedidos.push({
      id: Date.now() + i,
      cliente: "cliente.demo@ejemplo.com",
      productos: items,
      total: items.reduce((suma, x) => suma + x.precio * x.cantidad, 0),
      telefono: "7777-0000",
      estado,
      fecha: fecha.toLocaleDateString("es-SV"),
      fechaISO: fecha.toISOString(),
      demo: true,
    });
  }
  return pedidos;
}
