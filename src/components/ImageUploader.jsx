import { useState } from "react";
import { cloudinaryConfigurado, procesarImagen } from "../lib/cloudinary";

// Permite a la administradora subir la foto de un producto desde su computadora o celular
export default function ImageUploader({ valor, alCambiar }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  const elegirArchivo = async (e) => {
    const entrada = e.target;
    const archivo = entrada.files?.[0];
    if (!archivo) return;
    setSubiendo(true);
    setError("");
    try {
      alCambiar(await procesarImagen(archivo));
    } catch (err) {
      setError(err.message || "No se pudo subir la imagen.");
    } finally {
      setSubiendo(false);
      entrada.value = ""; // permite volver a elegir el mismo archivo
    }
  };

  return (
    <div>
      <p className="block text-xs text-neutral-500 mb-1">Imagen del producto</p>
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden">
          {valor ? (
            <img src={valor} alt="Vista previa del producto" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-neutral-400 text-center px-1">Sin imagen</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer text-sm border border-neutral-300 px-4 py-2 rounded-full hover:border-neutral-900">
              {subiendo ? "Subiendo..." : valor ? "Cambiar imagen" : "Subir imagen"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={elegirArchivo}
                disabled={subiendo}
                className="sr-only"
              />
            </label>
            {valor && !subiendo && (
              <button type="button" onClick={() => alCambiar("")} className="text-sm text-neutral-500 hover:text-red-600">
                Quitar
              </button>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            JPG, PNG o WEBP de hasta 5 MB.{" "}
            {cloudinaryConfigurado
              ? "Se guarda en Cloudinary."
              : "Cloudinary no está configurado: la imagen se guarda solo en este navegador (modo de prueba)."}
          </p>
          {error && (
            <p role="alert" className="text-xs text-red-600 mt-1">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
