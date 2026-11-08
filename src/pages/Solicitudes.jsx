import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import FieldError from "../components/FieldError";
import { useOrders } from "../context/OrdersContext";
import { exito } from "../lib/alertas";
import { MENSAJE_TELEFONO, telefonoValido } from "../lib/validaciones";

const CLASE_INPUT = "w-full border border-neutral-300 rounded-lg px-3 py-2";

export default function Solicitudes() {
  const { agregarSolicitud } = useOrders();
  const [parametros] = useSearchParams();

  // Si vienes desde "Inspiración internacional" el producto y la marca ya vienen escritos
  const vacio = { nombre: "", telefono: "", producto: parametros.get("producto") ?? "", marca: parametros.get("marca") ?? "", detalle: "" };
  const [datos, setDatos] = useState(vacio);
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = {};
    if (datos.nombre.trim().length < 3) nuevos.nombre = "Mínimo 3 caracteres.";
    if (!telefonoValido(datos.telefono.trim())) nuevos.telefono = MENSAJE_TELEFONO;
    if (datos.producto.trim().length < 3) nuevos.producto = "Indica qué producto buscas.";
    if (datos.detalle.trim().length < 10) nuevos.detalle = "Cuéntanos un poco más (mínimo 10 caracteres).";
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;

    agregarSolicitud({
      nombre: datos.nombre.trim(),
      telefono: datos.telefono.trim(),
      producto: datos.producto.trim(),
      marca: datos.marca.trim() || "Sin especificar",
      detalle: datos.detalle.trim(),
    });
    setDatos({ nombre: "", telefono: "", producto: "", marca: "", detalle: "" });
    exito("¡Solicitud enviada!", "Tu solicitud fue registrada. El equipo de Mío Fashion te contactará pronto.");
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">¿No encuentras un producto?</h1>
      <p className="text-neutral-600 mb-10">
        Pídelo por encargo. Trabajamos con marcas como Dior, Estée Lauder y Too Faced que no siempre están en stock inmediato.
      </p>

      <form onSubmit={enviar} noValidate>
        <label htmlFor="sol-nombre" className="block text-sm mb-1">Tu nombre</label>
        <input id="sol-nombre" type="text" value={datos.nombre} onChange={cambiar("nombre")} className={CLASE_INPUT} />
        <FieldError mensaje={errores.nombre} />

        <label htmlFor="sol-telefono" className="block text-sm mb-1 mt-4">Número de WhatsApp</label>
        <input id="sol-telefono" type="tel" placeholder="7777-7777" value={datos.telefono} onChange={cambiar("telefono")} className={CLASE_INPUT} />
        <FieldError mensaje={errores.telefono} />

        <label htmlFor="sol-producto" className="block text-sm mb-1 mt-4">Producto que buscas</label>
        <input id="sol-producto" type="text" value={datos.producto} onChange={cambiar("producto")} className={CLASE_INPUT} />
        <FieldError mensaje={errores.producto} />

        <label htmlFor="sol-marca" className="block text-sm mb-1 mt-4">Marca (opcional)</label>
        <input id="sol-marca" type="text" value={datos.marca} onChange={cambiar("marca")} className={CLASE_INPUT} />

        <label htmlFor="sol-detalle" className="block text-sm mb-1 mt-4">Detalles</label>
        <textarea id="sol-detalle" rows={4} placeholder="Tono, presentación, cantidad..." value={datos.detalle} onChange={cambiar("detalle")} className={CLASE_INPUT} />
        <FieldError mensaje={errores.detalle} />

        <button type="submit" className="w-full bg-neutral-900 text-white py-3 rounded-full text-sm hover:bg-neutral-700 mt-6">
          Enviar solicitud
        </button>
      </form>
    </main>
  );
}
