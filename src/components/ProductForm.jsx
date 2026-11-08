import { useState } from "react";
import { useProducts } from "../context/ProductsContext";
import { CATEGORIAS } from "../data/productosIniciales";
import { toast } from "../lib/alertas";
import FieldError from "./FieldError";
import ImageUploader from "./ImageUploader";

const CATEGORIAS_PRODUCTO = CATEGORIAS.filter((c) => c !== "Todos");
const CLASE_INPUT = "w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm";

const VACIO = { nombre: "", marca: "", categoria: CATEGORIAS_PRODUCTO[0], precio: "", stock: "", imagen: "", destacado: false };

// Crea o edita un producto. El padre le pone key={id} para que se reinicie al cambiar de producto.
export default function ProductForm({ editando, alTerminar }) {
  const { agregarProducto, actualizarProducto } = useProducts();
  const [datos, setDatos] = useState(
    editando
      ? { ...editando, precio: String(editando.precio), stock: String(editando.stock) }
      : VACIO
  );
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const nombre = datos.nombre.trim();
    const marca = datos.marca.trim();
    const precio = parseFloat(datos.precio);
    const stock = Number(datos.stock);

    const nuevos = {};
    if (nombre.length < 3) nuevos.nombre = "Mínimo 3 caracteres.";
    if (marca.length < 2) nuevos.marca = "Mínimo 2 caracteres.";
    if (isNaN(precio) || precio <= 0) nuevos.precio = "Debe ser mayor que 0.";
    if (datos.stock === "" || !Number.isInteger(stock) || stock < 0) nuevos.stock = "Debe ser un número entero, 0 o más.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;

    const producto = { nombre, marca, categoria: datos.categoria, precio, stock, imagen: datos.imagen, destacado: datos.destacado };

    if (editando) {
      actualizarProducto({ ...producto, id: editando.id });
      toast("success", "Producto actualizado");
      alTerminar();
    } else {
      agregarProducto(producto);
      toast("success", "Producto agregado al catálogo");
      setDatos(VACIO);
    }
  };

  return (
    <form onSubmit={enviar} noValidate className="grid md:grid-cols-5 gap-4">
      <div>
        <label htmlFor="producto-nombre" className="block text-xs text-neutral-500 mb-1">Nombre</label>
        <input id="producto-nombre" type="text" value={datos.nombre} onChange={cambiar("nombre")} className={CLASE_INPUT} />
        <FieldError mensaje={errores.nombre} />
      </div>

      <div>
        <label htmlFor="producto-marca" className="block text-xs text-neutral-500 mb-1">Marca</label>
        <input id="producto-marca" type="text" value={datos.marca} onChange={cambiar("marca")} className={CLASE_INPUT} />
        <FieldError mensaje={errores.marca} />
      </div>

      <div>
        <label htmlFor="producto-categoria" className="block text-xs text-neutral-500 mb-1">Categoría</label>
        <select id="producto-categoria" value={datos.categoria} onChange={cambiar("categoria")} className={CLASE_INPUT}>
          {CATEGORIAS_PRODUCTO.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="producto-precio" className="block text-xs text-neutral-500 mb-1">Precio</label>
        <input id="producto-precio" type="number" step="0.01" min="0" value={datos.precio} onChange={cambiar("precio")} className={CLASE_INPUT} />
        <FieldError mensaje={errores.precio} />
      </div>

      <div>
        <label htmlFor="producto-stock" className="block text-xs text-neutral-500 mb-1">Stock</label>
        <input id="producto-stock" type="number" min="0" step="1" value={datos.stock} onChange={cambiar("stock")} className={CLASE_INPUT} />
        <FieldError mensaje={errores.stock} />
      </div>

      <div className="md:col-span-5">
        <ImageUploader valor={datos.imagen} alCambiar={(imagen) => setDatos((d) => ({ ...d, imagen }))} />
      </div>

      <div className="md:col-span-5">
        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={datos.destacado}
            onChange={(e) => setDatos({ ...datos, destacado: e.target.checked })}
            className="h-4 w-4 accent-pink-600"
          />
          Destacar en el carrusel de la página de inicio
        </label>
      </div>

      <div className="md:col-span-5 flex gap-3">
        <button type="submit" className="bg-neutral-900 text-white px-6 py-2.5 rounded-full text-sm hover:bg-neutral-700">
          {editando ? "Guardar cambios" : "Agregar producto"}
        </button>
        {editando && (
          <button type="button" onClick={alTerminar} className="border border-neutral-300 px-6 py-2.5 rounded-full text-sm">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
