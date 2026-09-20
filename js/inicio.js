// Buscamos el contenedor vacío que dejamos en el HTML
const contenedorNuevos = document.getElementById("productos-nuevos");

const productos = obtenerProductos();
// slice(0, 4) toma solo los primeros 4 productos
const nuevos = productos.slice(0, 4);

// Construimos el HTML de cada tarjeta y lo juntamos
contenedorNuevos.innerHTML = nuevos
  .map(
    (producto) => `
    <article class="group">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-48 object-cover rounded-xl mb-3 bg-neutral-100">
      <p class="text-xs text-neutral-500">${producto.marca}</p>
      <h3 class="text-sm font-medium">${producto.nombre}</h3>
      <p class="text-sm mt-1">${formatearPrecio(producto.precio)}</p>
    </article>
  `
  )
  .join("");