// Formatea un número como precio: 8.5 → $8.50
export function formatearPrecio(numero) {
  return "$" + Number(numero || 0).toFixed(2);
}

// Las imágenes del proyecto original se guardaban como "img/archivo.jpg".
// En React las rutas deben empezar con "/" para funcionar en cualquier página.
export function normalizarImagen(ruta) {
  if (!ruta) return "";
  return /^(https?:|data:|blob:|\/)/.test(ruta) ? ruta : "/" + ruta;
}
