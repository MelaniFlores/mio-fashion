// ===== SUBIDA DE IMÁGENES =====
// Si hay credenciales de Cloudinary en el archivo .env, la imagen se sube a
// Cloudinary (API externa) y se guarda solo su URL. Si no, se comprime y se
// guarda en el navegador para poder probar sin cuenta.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigurado = Boolean(CLOUD_NAME && UPLOAD_PRESET);

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];
const PESO_MAXIMO = 5 * 1024 * 1024; // 5 MB

async function subirACloudinary(archivo) {
  const datos = new FormData();
  datos.append("file", archivo);
  datos.append("upload_preset", UPLOAD_PRESET);
  datos.append("folder", "mio-fashion");

  const respuesta = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: datos,
  });
  if (!respuesta.ok) {
    throw new Error("No se pudo subir la imagen a Cloudinary. Revisa el cloud name y el upload preset.");
  }
  const json = await respuesta.json();
  // f_auto,q_auto,w_700 → formato y calidad automáticos, y ancho máximo de 700 px
  return json.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_700/");
}

function comprimirALocal(archivo, ladoMaximo = 700) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const imagen = new Image();
    imagen.onload = () => {
      const escala = Math.min(1, ladoMaximo / Math.max(imagen.width, imagen.height));
      const lienzo = document.createElement("canvas");
      lienzo.width = Math.round(imagen.width * escala);
      lienzo.height = Math.round(imagen.height * escala);
      lienzo.getContext("2d").drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
      URL.revokeObjectURL(url);
      resolve(lienzo.toDataURL("image/jpeg", 0.8));
    };
    imagen.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen."));
    };
    imagen.src = url;
  });
}

export async function procesarImagen(archivo) {
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    throw new Error("Usa una imagen JPG, PNG o WEBP.");
  }
  if (archivo.size > PESO_MAXIMO) {
    throw new Error("La imagen no debe pesar más de 5 MB.");
  }
  return cloudinaryConfigurado ? subirACloudinary(archivo) : comprimirALocal(archivo);
}
