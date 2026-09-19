const formSolicitud = document.getElementById("form-solicitud");
const mensajeExito = document.getElementById("mensaje-exito");

function mostrarErrorSolicitud(id, mensaje) {
  const elemento = document.getElementById(id);
  if (mensaje) {
    elemento.textContent = mensaje;
    elemento.classList.remove("hidden");
  } else {
    elemento.classList.add("hidden");
  }
}

// Valida un teléfono salvadoreño: 8 dígitos que empiezan con 6 o 7
function telefonoValido(telefono) {
  const soloNumeros = telefono.replace(/\D/g, ""); // quita guiones y espacios
  return /^[67]\d{7}$/.test(soloNumeros);
}

formSolicitud.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById("sol-nombre").value.trim();
  const telefono = document.getElementById("sol-telefono").value.trim();
  const producto = document.getElementById("sol-producto").value.trim();
  const marca = document.getElementById("sol-marca").value.trim();
  const detalle = document.getElementById("sol-detalle").value.trim();

  let hayErrores = false;

  if (nombre.length < 3) {
    mostrarErrorSolicitud("error-sol-nombre", "Mínimo 3 caracteres.");
    hayErrores = true;
  } else {
    mostrarErrorSolicitud("error-sol-nombre", "");
  }

  if (!telefonoValido(telefono)) {
    mostrarErrorSolicitud("error-sol-telefono", "Debe ser un número salvadoreño de 8 dígitos que inicie con 6 o 7.");
    hayErrores = true;
  } else {
    mostrarErrorSolicitud("error-sol-telefono", "");
  }

  if (producto.length < 3) {
    mostrarErrorSolicitud("error-sol-producto", "Indica qué producto buscas.");
    hayErrores = true;
  } else {
    mostrarErrorSolicitud("error-sol-producto", "");
  }

  if (detalle.length < 10) {
    mostrarErrorSolicitud("error-sol-detalle", "Cuéntanos un poco más (mínimo 10 caracteres).");
    hayErrores = true;
  } else {
    mostrarErrorSolicitud("error-sol-detalle", "");
  }

  if (hayErrores) return;

  // Guardamos la solicitud
  const solicitudes = JSON.parse(localStorage.getItem("solicitudes") || "[]");

  solicitudes.push({
    id: Date.now(), // un id único basado en la hora actual
    nombre,
    telefono,
    producto,
    marca: marca || "Sin especificar",
    detalle,
    fecha: new Date().toLocaleDateString("es-SV"),
  });

  localStorage.setItem("solicitudes", JSON.stringify(solicitudes));

  formSolicitud.reset();
  mensajeExito.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});