const sesionActiva = obtenerSesion();
const enlaceLogin = document.getElementById("enlace-login");

if (sesionActiva && enlaceLogin) {
  const esAdmin = sesionActiva.rol === "admin";
  const destino = esAdmin ? "dashboard.html" : "catalogo.html";
  // Si por alguna razón no hay nombre, mostramos el correo o "Mi cuenta"
  const etiqueta = sesionActiva.nombre || sesionActiva.correo || "Mi cuenta";

  enlaceLogin.outerHTML = `
    <div class="flex items-center gap-3 text-sm">
      <a href="${destino}" class="hover:text-pink-600">${etiqueta}</a>
      <button id="btn-cerrar-sesion" class="border border-neutral-300 px-4 py-2 rounded-full hover:border-neutral-900">
        Salir
      </button>
    </div>
  `;

  document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
    localStorage.removeItem("sesion");
    window.location.reload();
  });
}