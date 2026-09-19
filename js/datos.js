// ===== DATOS INICIALES =====
// Estos productos se cargan la primera vez que se abre el sitio.
const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Labial mate NYX", categoria: "Labios", precio: 8.50, marca: "NYX", stock: 12 },
  { id: 2, nombre: "Paleta de sombras Elf", categoria: "Ojos", precio: 15.00, marca: "Elf", stock: 5 },
  { id: 3, nombre: "Base Infallible", categoria: "Rostro", precio: 12.75, marca: "L'Oréal", stock: 8 },
  { id: 4, nombre: "Máscara Sky High", categoria: "Ojos", precio: 11.00, marca: "Maybelline", stock: 15 },
  { id: 5, nombre: "Gel para cejas", categoria: "Cejas", precio: 6.25, marca: "Elf", stock: 20 },
  { id: 6, nombre: "Set de brochas", categoria: "Brochas", precio: 20.00, marca: "Elf", stock: 4 },
  { id: 7, nombre: "Iluminador líquido", categoria: "Rostro", precio: 9.99, marca: "NYX", stock: 7 },
  { id: 8, nombre: "Delineador retráctil", categoria: "Ojos", precio: 5.50, marca: "Maybelline", stock: 18 },
];

const CATEGORIAS = ["Todos", "Labios", "Ojos", "Rostro", "Cejas", "Brochas", "Accesorios"];

// ===== FUNCIONES DE ALMACENAMIENTO =====
// localStorage solo guarda texto, por eso usamos JSON para convertir.

function obtenerProductos() {
  const guardados = localStorage.getItem("productos");
  if (guardados) {
    return JSON.parse(guardados);
  }
  // Primera visita: guardamos los productos iniciales
  localStorage.setItem("productos", JSON.stringify(PRODUCTOS_INICIALES));
  return PRODUCTOS_INICIALES;
}

function guardarProductos(productos) {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function obtenerCarrito() {
  const guardado = localStorage.getItem("carrito");
  return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function obtenerSesion() {
  const guardada = localStorage.getItem("sesion");
  return guardada ? JSON.parse(guardada) : null;
}

// Formatea un número como precio: 8.5 → $8.50
function formatearPrecio(numero) {
  return "$" + numero.toFixed(2);
}