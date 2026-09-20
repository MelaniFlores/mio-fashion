// ===== ESTADO =====
let categoriaActiva = "Todos";
let busqueda = "";
let carrito = obtenerCarrito();

const productos = obtenerProductos();

// ===== ELEMENTOS DEL HTML =====
const contenedorFiltros = document.getElementById("filtros-categoria");
const contenedorProductos = document.getElementById("lista-productos");
const contenedorCarrito = document.getElementById("lista-carrito");
const elementoTotal = document.getElementById("total-carrito");
const elementoContador = document.getElementById("contador");
const inputBuscador = document.getElementById("buscador");

// ===== FILTROS DE CATEGORÍA =====
function pintarFiltros() {
  contenedorFiltros.innerHTML = CATEGORIAS.map(
    (categoria) => `
    <button
      data-categoria="${categoria}"
      class="text-left text-sm px-3 py-2 rounded-lg ${
        categoria === categoriaActiva
          ? "bg-neutral-900 text-white"
          : "hover:bg-neutral-100"
      }">
      ${categoria}
    </button>
  `
  ).join("");

  // Le damos su evento de clic a cada botón recién creado
  contenedorFiltros.querySelectorAll("button").forEach((boton) => {
    boton.addEventListener("click", () => {
      categoriaActiva = boton.dataset.categoria;
      pintarFiltros();
      pintarProductos();
    });
  });
}

// ===== PRODUCTOS =====
function pintarProductos() {
  const filtrados = productos.filter((producto) => {
    const coincideCategoria =
      categoriaActiva === "Todos" || producto.categoria === categoriaActiva;
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.marca.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  elementoContador.textContent = `${filtrados.length} productos`;

  if (filtrados.length === 0) {
    contenedorProductos.innerHTML =
      '<p class="text-sm text-neutral-500">No se encontraron productos.</p>';
    return;
  }

  contenedorProductos.innerHTML = filtrados
    .map(
      (producto) => `
    <article class="border border-neutral-200 rounded-xl p-4">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-40 object-cover rounded-lg mb-3 bg-neutral-100">
      <p class="text-xs text-neutral-500">${producto.marca}</p>
      <h3 class="text-sm font-medium">${producto.nombre}</h3>
      <div class="flex items-center justify-between mt-2">
        <span class="text-sm font-semibold">${formatearPrecio(producto.precio)}</span>
        <button
          data-id="${producto.id}"
          class="btn-agregar text-xs border border-neutral-300 px-3 py-1.5 rounded-full hover:bg-neutral-900 hover:text-white">
          Agregar
        </button>
      </div>
    </article>
  `
    )
    .join("");

  contenedorProductos.querySelectorAll(".btn-agregar").forEach((boton) => {
    boton.addEventListener("click", () => {
      agregarAlCarrito(Number(boton.dataset.id));
    });
  });
}

// ===== CARRITO =====
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const existente = carrito.find((item) => item.id === id);

  if (existente) {
    existente.cantidad = existente.cantidad + 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito(carrito);
  pintarCarrito();
}

function cambiarCantidad(id, delta) {
  const item = carrito.find((item) => item.id === id);
  item.cantidad = item.cantidad + delta;
  // Si la cantidad llega a 0, lo quitamos del carrito
  carrito = carrito.filter((item) => item.cantidad > 0);
  guardarCarrito(carrito);
  pintarCarrito();
}

function pintarCarrito() {
  if (carrito.length === 0) {
    contenedorCarrito.innerHTML =
      '<p class="text-sm text-neutral-500">Tu carrito está vacío.</p>';
    elementoTotal.textContent = "$0.00";
    return;
  }

  contenedorCarrito.innerHTML = carrito
    .map(
      (item) => `
    <div class="flex items-center gap-2">
      <div class="flex-1">
        <p class="text-sm">${item.nombre}</p>
        <p class="text-xs text-neutral-500">${formatearPrecio(item.precio * item.cantidad)}</p>
      </div>
      <button data-id="${item.id}" data-delta="-1" class="btn-cantidad w-6 h-6 border border-neutral-300 rounded text-sm">−</button>
      <span class="text-sm w-4 text-center">${item.cantidad}</span>
      <button data-id="${item.id}" data-delta="1" class="btn-cantidad w-6 h-6 border border-neutral-300 rounded text-sm">+</button>
    </div>
  `
    )
    .join("");

  // reduce suma precio × cantidad de todo el carrito
  const total = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );
  elementoTotal.textContent = formatearPrecio(total);

  contenedorCarrito.querySelectorAll(".btn-cantidad").forEach((boton) => {
    boton.addEventListener("click", () => {
      cambiarCantidad(Number(boton.dataset.id), Number(boton.dataset.delta));
    });
  });
}

// ===== BUSCADOR =====
inputBuscador.addEventListener("input", (evento) => {
  busqueda = evento.target.value;
  pintarProductos();
});

// ===== ARRANQUE =====
pintarFiltros();
pintarProductos();
pintarCarrito();
// ===== VALIDACIÓN DE TELÉFONO CON API EXTERNA =====
const inputTelefono = document.getElementById("telefono");
const errorTelefono = document.getElementById("error-telefono");
const btnWhatsapp = document.getElementById("btn-whatsapp");
const btnCopiar = document.getElementById("btn-copiar");

// Número de WhatsApp del negocio (formato internacional sin +)
const NUMERO_NEGOCIO = "50377777777";

function mostrarErrorTelefono(mensaje) {
  if (mensaje) {
    errorTelefono.textContent = mensaje;
    errorTelefono.classList.remove("hidden");
  } else {
    errorTelefono.classList.add("hidden");
  }
}

// Validación local: 8 dígitos que empiezan con 6 o 7 (formato salvadoreño)
function validarFormatoLocal(telefono) {
  const soloNumeros = telefono.replace(/\D/g, "");
  return /^[67]\d{7}$/.test(soloNumeros);
}

// Validación con API externa. Si la API falla, usamos la validación local
// para que el usuario no se quede bloqueado.
async function validarTelefonoConAPI(telefono) {
  const soloNumeros = telefono.replace(/\D/g, "");
  try {
    const respuesta = await fetch(
      `https://api.core-api.net/v1/phone/validate?phone=503${soloNumeros}`
    );
    if (!respuesta.ok) throw new Error("API no disponible");
    const datos = await respuesta.json();
    return datos.valid !== false;
  } catch (error) {
    console.warn("API de validación no disponible, se usa validación local.", error);
    return validarFormatoLocal(telefono);
  }
}

// Arma el texto del pedido
function construirMensajePedido() {
  let texto = "¡Hola Mío Fashion! Quiero hacer este pedido:\n\n";

  carrito.forEach((item) => {
    texto += `• ${item.nombre} x${item.cantidad} — ${formatearPrecio(item.precio * item.cantidad)}\n`;
  });

  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  texto += `\nTotal: ${formatearPrecio(total)}`;
  texto += `\nMi número: ${inputTelefono.value}`;

  return texto;
}

// Guarda el pedido para que aparezca en las métricas del dashboard
function registrarPedido() {
  const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  pedidos.push({
    id: Date.now(),
    productos: carrito,
    total,
    telefono: inputTelefono.value,
    fecha: new Date().toLocaleDateString("es-SV"),
  });

  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

btnWhatsapp.addEventListener("click", async () => {
  if (carrito.length === 0) {
    mostrarErrorTelefono("Agrega productos al carrito antes de enviar.");
    return;
  }

  const telefono = inputTelefono.value.trim();

  if (!telefono) {
    mostrarErrorTelefono("Ingresa tu número de WhatsApp.");
    return;
  }

  if (!validarFormatoLocal(telefono)) {
    mostrarErrorTelefono("Debe ser un número de 8 dígitos que inicie con 6 o 7.");
    return;
  }

  btnWhatsapp.textContent = "Validando número...";
  btnWhatsapp.disabled = true;

  const esValido = await validarTelefonoConAPI(telefono);

  btnWhatsapp.textContent = "Enviar pedido por WhatsApp";
  btnWhatsapp.disabled = false;

  if (!esValido) {
    mostrarErrorTelefono("El número no parece válido. Revísalo por favor.");
    return;
  }

  mostrarErrorTelefono("");
  registrarPedido();

  // encodeURIComponent convierte el texto a formato seguro para URL
  const mensaje = encodeURIComponent(construirMensajePedido());
  window.open(`https://wa.me/${NUMERO_NEGOCIO}?text=${mensaje}`, "_blank");

  // Vaciamos el carrito después de enviar
  carrito = [];
  guardarCarrito(carrito);
  pintarCarrito();
});

btnCopiar.addEventListener("click", async () => {
  if (carrito.length === 0) {
    mostrarErrorTelefono("Agrega productos al carrito antes de copiar.");
    return;
  }

  try {
    await navigator.clipboard.writeText(construirMensajePedido());
    btnCopiar.textContent = "¡Pedido copiado!";
    setTimeout(() => {
      btnCopiar.textContent = "Copiar pedido";
    }, 2000);
  } catch (error) {
    mostrarErrorTelefono("No se pudo copiar. Intenta de nuevo.");
  }
});