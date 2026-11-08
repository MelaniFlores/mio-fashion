// Mensaje de error bajo un campo de formulario
export default function FieldError({ id, mensaje }) {
  if (!mensaje) return null;
  return (
    <p id={id} role="alert" className="text-xs text-red-600 mt-1 mb-2">
      {mensaje}
    </p>
  );
}
