import Swal from "sweetalert2";

// Todas las alertas del sistema pasan por aquí para tener un estilo único
// y respetar el modo oscuro.
function estilo() {
  const oscuro = document.documentElement.classList.contains("modo-oscuro");
  return {
    background: oscuro ? "#171717" : "#ffffff",
    color: oscuro ? "#f5f5f5" : "#171717",
    confirmButtonColor: oscuro ? "#ec4899" : "#171717",
  };
}

export const exito = (titulo, texto) => Swal.fire({ icon: "success", title: titulo, text: texto, ...estilo() });
export const aviso = (titulo, texto) => Swal.fire({ icon: "warning", title: titulo, text: texto, ...estilo() });
export const error = (titulo, texto) => Swal.fire({ icon: "error", title: titulo, text: texto, ...estilo() });

// Mensaje pequeño que desaparece solo (para acciones rápidas como guardar o cambiar estado)
export const toast = (icon, title) =>
  Swal.fire({
    toast: true,
    position: "top-end",
    timer: 2400,
    timerProgressBar: true,
    showConfirmButton: false,
    icon,
    title,
    ...estilo(),
  });

// Pide confirmación antes de una acción delicada. Devuelve true si la persona confirma.
export async function confirmar({ titulo, texto, textoConfirmar = "Sí, continuar", peligro = false }) {
  const respuesta = await Swal.fire({
    icon: "warning",
    title: titulo,
    text: texto,
    showCancelButton: true,
    confirmButtonText: textoConfirmar,
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    focusCancel: true,
    ...estilo(),
    confirmButtonColor: peligro ? "#dc2626" : estilo().confirmButtonColor,
  });
  return respuesta.isConfirmed;
}
