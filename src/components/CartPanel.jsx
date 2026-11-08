import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useProducts } from "../context/ProductsContext";
import { NUMERO_NEGOCIO } from "../data/config";
import { aviso, exito, toast } from "../lib/alertas";
import { formatearPrecio } from "../lib/formato";
import { telefonoValido } from "../lib/validaciones";
import FieldError from "./FieldError";

export default function CartPanel() {
  const { items, total, cambiar, vaciar } = useCart();
  const { productos } = useProducts();
  const { sesion } = useAuth();
  const { registrarPedido } = useOrders();
  const [telefono, setTelefono] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const [copiado, setCopiado] = useState(false);

  const construirMensaje = () => {
    let texto = "¡Hola Mío Fashion! Quiero hacer este pedido:\n\n";
    items.forEach((item) => {
      texto += `• ${item.nombre} x${item.cantidad} — ${formatearPrecio(item.precio * item.cantidad)}\n`;
    });
    texto += `\nTotal: ${formatearPrecio(total)}`;
    texto += `\nMi número: +503 ${telefono}`;
    return texto;
  };

  const sumar = (item) => {
    const producto = productos.find((p) => p.id === item.id);
    if (producto && item.cantidad >= producto.stock) {
      aviso("Sin existencias", `Solo quedan ${producto.stock} unidades de ${item.nombre}.`);
      return;
    }
    cambiar(item.id, 1);
  };

  const enviarWhatsapp = () => {
    if (items.length === 0) {
      aviso("Carrito vacío", "Agrega productos antes de enviar tu pedido.");
      return;
    }
    if (!telefono.trim()) {
      setErrorTelefono("Ingresa tu número de WhatsApp.");
      return;
    }
    if (!telefonoValido(telefono)) {
      setErrorTelefono("Debe ser un número de 8 dígitos que inicie con 6 o 7.");
      return;
    }
    setErrorTelefono("");

    const mensaje = encodeURIComponent(construirMensaje());
    registrarPedido({ cliente: sesion ? sesion.correo : "invitado", items, telefono });
    window.open(`https://wa.me/${NUMERO_NEGOCIO}?text=${mensaje}`, "_blank", "noopener,noreferrer");
    vaciar();
    exito("¡Pedido listo!", "Te redirigimos a WhatsApp para confirmar tu compra.");
  };

  const copiarPedido = async () => {
    if (items.length === 0) {
      setErrorTelefono("Agrega productos al carrito antes de copiar.");
      return;
    }
    try {
      await navigator.clipboard.writeText(construirMensaje());
      setCopiado(true);
      toast("success", "Pedido copiado");
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {
      setErrorTelefono("No se pudo copiar. Intenta de nuevo.");
    }
  };

  return (
    <aside className="border border-neutral-200 rounded-xl p-5 h-fit lg:sticky lg:top-24" aria-label="Tu pedido">
      <h2 className="font-semibold mb-4">Tu pedido</h2>

      <div className="flex flex-col gap-3 mb-4">
        {items.length === 0 && <p className="text-sm text-neutral-500">Tu carrito está vacío.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="flex-1">
              <p className="text-sm">{item.nombre}</p>
              <p className="text-xs text-neutral-500">{formatearPrecio(item.precio * item.cantidad)}</p>
            </div>
            <button
              type="button"
              aria-label={`Quitar una unidad de ${item.nombre}`}
              onClick={() => cambiar(item.id, -1)}
              className="w-6 h-6 border border-neutral-300 rounded text-sm"
            >
              −
            </button>
            <span className="text-sm w-4 text-center">{item.cantidad}</span>
            <button
              type="button"
              aria-label={`Agregar una unidad de ${item.nombre}`}
              onClick={() => sumar(item)}
              className="w-6 h-6 border border-neutral-300 rounded text-sm"
            >
              +
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-200 pt-4 flex justify-between font-semibold mb-4">
        <span>Total</span>
        <span>{formatearPrecio(total)}</span>
      </div>

      <label htmlFor="telefono" className="text-xs text-neutral-500">
        Tu número de WhatsApp
      </label>
      <input
        id="telefono"
        type="tel"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="7777-7777"
        className="w-full text-sm border border-neutral-300 rounded-lg px-3 py-2 mt-1"
      />
      <FieldError mensaje={errorTelefono} />
      <div className="mb-2" />

      <button
        type="button"
        onClick={enviarWhatsapp}
        className="w-full bg-neutral-900 text-white py-3 rounded-full text-sm hover:bg-neutral-700 mb-2"
      >
        Enviar pedido por WhatsApp
      </button>
      <button
        type="button"
        onClick={copiarPedido}
        className="w-full border border-neutral-300 py-3 rounded-full text-sm hover:border-neutral-900"
      >
        {copiado ? "¡Pedido copiado!" : "Copiar pedido"}
      </button>
    </aside>
  );
}
