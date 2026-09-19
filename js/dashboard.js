// ===== PROTECCIÓN DE RUTA =====
// Si no hay sesión o no es admin, lo sacamos de aquí.
const sesion = obtenerSesion();
if (!sesion || sesion.rol !== "admin") {
  window.location.href = "login.html";
}

document.getElementById("nombre-usuario").textContent = sesion ? sesion.nombre : "";

document.getElementById("btn-salir").addEventListener("click", () => {
  localStorage.removeItem("sesion");
  window.location.href = "index.html";
});

// ===== ESTADO =====
let productos = obtenerProductos();
let editandoId = null;

// ===== ELEMENTOS =====
const tabla = document.getElementById("tabla-productos");
const form = document.getElementById("form-producto");
const selectCategoria = document.getElementById("producto-categoria");
const tituloFormulario = document.getElementById("titulo-formulario");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");

// Llenamos el select con las categorías (sin "Todos")
selectCategoria.innerHTML = CATEGORIAS.filter((c) => c !== "Todos")
  .map((c) => `<option value="${c}">${c}</option>`)
  .join("");

function mostrarErrorCampo(id, mensaje) {
  const elemento = document.getElementById(id);
  if (mensaje) {
    elemento.textContent = mensaje;
    elemento.classList.remove("hidden");
  } else {
    elemento.classList.add("hidden");
  }
}

// ===== LISTAR (READ) =====
function pintarTabla() {
  if (productos.length === 0) {
    tabla.innerHTML = '<tr><td colspan="6" class="py-4 text-neutral-500">No hay productos.</td></tr>';
    return;
  }

  tabla.innerHTML = productos
    .map(
      (producto) => `
    <tr class="border-b border-neutral-100">
      <td class="py-3">${producto.nombre}</td>
      <td>${producto.marca}</td>
      <td>${producto.categoria}</td>
      <td>${formatearPrecio(producto.precio)}</td>
      <td>${producto.stock}</td>
      <td class="text-right">
        <button data-id="${producto.id}" class="btn-editar text-xs border border-neutral-300 px-3 py-1 rounded-full mr-1">Editar</button>
        <button data-id="${producto.id}" class="btn-borrar text-xs border border-red-200 text-red-600 px-3 py-1 rounded-full">Eliminar</button>
      </td>
    </tr>
  `
    )
    .join("");

  tabla.querySelectorAll(".btn-editar").forEach((boton) => {
    boton.addEventListener("click", () => empezarEdicion(Number(boton.dataset.id)));
  });

  tabla.querySelectorAll(".btn-borrar").forEach((boton) => {
    boton.addEventListener("click", () => eliminarProducto(Number(boton.dataset.id)));
  });
}

// ===== CREAR y ACTUALIZAR =====
form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById("producto-nombre").value.trim();
  const marca = document.getElementById("producto-marca").value.trim();
  const categoria = selectCategoria.value;
  const precio = parseFloat(document.getElementById("producto-precio").value);
  const stock = parseInt(document.getElementById("producto-stock").value);

  let hayErrores = false;

  if (nombre.length < 3) {
    mostrarErrorCampo("error-nombre", "Mínimo 3 caracteres.");
    hayErrores = true;
  } else {
    mostrarErrorCampo("error-nombre", "");
  }

  if (marca.length < 2) {
    mostrarErrorCampo("error-marca", "Mínimo 2 caracteres.");
    hayErrores = true;
  } else {
    mostrarErrorCampo("error-marca", "");
  }

  if (isNaN(precio) || precio <= 0) {
    mostrarErrorCampo("error-precio", "Debe ser mayor que 0.");
    hayErrores = true;
  } else {
    mostrarErrorCampo("error-precio", "");
  }

  if (isNaN(stock) || stock < 0) {
    mostrarErrorCampo("error-stock", "No puede ser negativo.");
    hayErrores = true;
  } else {
    mostrarErrorCampo("error-stock", "");
  }

  if (hayErrores) return;

  if (editandoId) {
    // ACTUALIZAR
    productos = productos.map((p) =>
      p.id === editandoId ? { ...p, nombre, marca, categoria, precio, stock } : p
    );
    cancelarEdicion();
  } else {
    // CREAR: el id es el mayor existente + 1
    const nuevoId = productos.length
      ? Math.max(...productos.map((p) => p.id)) + 1
      : 1;
    productos.push({ id: nuevoId, nombre, marca, categoria, precio, stock });
    form.reset();
  }

  guardarProductos(productos);
  pintarTabla();
  pintarMetricas();
});

// ===== EDITAR =====
function empezarEdicion(id) {
  const producto = productos.find((p) => p.id === id);
  editandoId = id;

  document.getElementById("producto-nombre").value = producto.nombre;
  document.getElementById("producto-marca").value = producto.marca;
  selectCategoria.value = producto.categoria;
  document.getElementById("producto-precio").value = producto.precio;
  document.getElementById("producto-stock").value = producto.stock;

  tituloFormulario.textContent = "Editar producto";
  btnGuardar.textContent = "Guardar cambios";
  btnCancelar.classList.remove("hidden");
  window.scrollTo({ top: 300, behavior: "smooth" });
}

function cancelarEdicion() {
  editandoId = null;
  form.reset();
  tituloFormulario.textContent = "Agregar producto";
  btnGuardar.textContent = "Agregar producto";
  btnCancelar.classList.add("hidden");
}

btnCancelar.addEventListener("click", cancelarEdicion);

// ===== ELIMINAR =====
function eliminarProducto(id) {
  const producto = productos.find((p) => p.id === id);
  if (!confirm(`¿Eliminar "${producto.nombre}" del catálogo?`)) return;

  productos = productos.filter((p) => p.id !== id);
  guardarProductos(productos);
  pintarTabla();
  pintarMetricas();
}

// ===== SOLICITUDES =====
function obtenerSolicitudes() {
  const guardadas = localStorage.getItem("solicitudes");
  return guardadas ? JSON.parse(guardadas) : [];
}

function pintarSolicitudes() {
  const solicitudes = obtenerSolicitudes();
  const contenedor = document.getElementById("lista-solicitudes");

  if (solicitudes.length === 0) {
    contenedor.innerHTML = '<p class="text-sm text-neutral-500">No hay solicitudes registradas.</p>';
    return;
  }

  contenedor.innerHTML = solicitudes
    .map(
      (s) => `
    <div class="border border-neutral-200 rounded-lg p-4">
      <div class="flex justify-between mb-1">
        <p class="font-medium text-sm">${s.producto}</p>
        <span class="text-xs text-neutral-500">${s.fecha}</span>
      </div>
      <p class="text-xs text-neutral-500">${s.nombre} · ${s.telefono}</p>
      <p class="text-sm mt-2">${s.detalle}</p>
    </div>
  `
    )
    .join("");
}

// ===== MÉTRICAS =====
function pintarMetricas() {
  const solicitudes = obtenerSolicitudes();
  const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");

  document.getElementById("metrica-productos").textContent = productos.length;
  document.getElementById("metrica-solicitudes").textContent = solicitudes.length;
  document.getElementById("metrica-pedidos").textContent = pedidos.length;

  const valor = productos.reduce((suma, p) => suma + p.precio * p.stock, 0);
  document.getElementById("metrica-valor").textContent = formatearPrecio(valor);
}

// ===== GRÁFICA =====
function pintarGrafica() {
  const meses = ["Abr", "May", "Jun", "Jul", "Ago", "Sep"];
  const solicitudes = obtenerSolicitudes();
  const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");

  // Datos de ejemplo para los meses anteriores + los reales en septiembre
  const datosPedidos = [8, 12, 9, 15, 18, pedidos.length];
  const datosSolicitudes = [3, 5, 4, 7, 6, solicitudes.length];

  new Chart(document.getElementById("grafica"), {
    type: "bar",
    data: {
      labels: meses,
      datasets: [
        { label: "Pedidos", data: datosPedidos, backgroundColor: "#171717" },
        { label: "Solicitudes", data: datosSolicitudes, backgroundColor: "#ec4899" },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  });
}

// ===== ARRANQUE =====
pintarTabla();
pintarSolicitudes();
pintarMetricas();
pintarGrafica();