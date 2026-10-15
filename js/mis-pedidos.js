// ===== PROTECCIÓN DE RUTA =====
// Solo los clientes con sesión pueden ver esta página
const sesion = obtenerSesion();

// ===== DATOS =====
// Solo tomamos los pedidos que hizo este cliente, comparando su correo
function obtenerMisPedidos() {
  const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
  return pedidos.filter((pedido) => pedido.cliente === sesion.correo);
}

// ===== PINTAR =====
function pintarMisPedidos() {
  const misPedidos = obtenerMisPedidos();
  const lista = document.getElementById("lista-pedidos");
  const resumen = document.getElementById("resumen");

  // Suma el total de todas las compras del cliente
  const totalGastado = misPedidos.reduce((suma, pedido) => suma + pedido.total, 0);
    resumen.textContent = `${misPedidos.length} ${misPedidos.length === 1 ? "pedido" : "pedidos"} · Total acumulado: ${formatearPrecio(totalGastado)}`;

  if (misPedidos.length === 0) {
    lista.innerHTML = '<p class="text-sm text-neutral-500">Aún no tienes pedidos.</p>';
    return;
  }

  // slice() copia la lista y reverse() la invierte, para mostrar el más reciente primero
  lista.innerHTML = misPedidos
    .slice()
    .reverse()
    .map((pedido) => {
      const detalle = pedido.productos
        .map((item) => `${item.nombre} x${item.cantidad}`)
        .join(", ");

      return `
      <article class="border border-neutral-200 rounded-xl p-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm text-neutral-500">${pedido.fecha}</span>
          <span class="text-sm font-semibold">${formatearPrecio(pedido.total)}</span>
        </div>
        <p class="text-sm">${detalle}</p>
      </article>
    `;
    })
    .join("");
}

// ===== ARRANQUE =====
// Si no hay sesión de cliente, lo mandamos al login. Si sí hay, mostramos sus pedidos.
if (!sesion || sesion.rol !== "cliente") {
  window.location.href = "login.html";
} else {
  pintarMisPedidos();
}