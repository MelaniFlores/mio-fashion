export function correoValido(correo) {
  // Debe tener texto, arroba, texto, punto y al menos 2 letras
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(correo);
}

export function passwordValida(password) {
  // Al menos 6 caracteres, una mayúscula y un número
  return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
}

// Teléfono salvadoreño: 8 dígitos que empiezan con 6 o 7
export function telefonoValido(telefono) {
  const soloNumeros = String(telefono).replace(/\D/g, "");
  return /^[67]\d{7}$/.test(soloNumeros);
}

export const MENSAJE_TELEFONO = "Debe ser un número salvadoreño de 8 dígitos que inicie con 6 o 7.";
