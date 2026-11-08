import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { confirmar } from "../lib/alertas";
import ThemeSwitch from "./ThemeSwitch";

// Un solo menú para TODAS las páginas (antes estaba copiado a mano en cada HTML)
export default function Navbar() {
  const { sesion, esAdmin, cerrarSesion } = useAuth();
  const { unidades } = useCart();
  const [abierto, setAbierto] = useState(false);
  const ubicacion = useLocation();
  const navegar = useNavigate();

  // El menú móvil se cierra al cambiar de página
  useEffect(() => {
    setAbierto(false);
  }, [ubicacion.pathname]);

  // Mientras el menú móvil está abierto no se mueve el fondo
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  const enlaces = [
    { to: "/", texto: "Inicio", end: true },
    { to: "/catalogo", texto: "Catálogo", insignia: unidades },
    { to: "/solicitudes", texto: "Solicitudes" },
    { to: "/nosotros", texto: "Acerca de Nosotros" },
    esAdmin ? { to: "/dashboard", texto: "Panel" } : { to: "/mis-pedidos", texto: "Mis pedidos" },
  ];

  const salir = async () => {
    const acepto = await confirmar({ titulo: "¿Cerrar sesión?", textoConfirmar: "Sí, salir" });
    if (!acepto) return;
    cerrarSesion();
    navegar("/");
  };

  const claseEnlace = ({ isActive }) =>
    `block rounded-xl px-5 py-4 text-2xl hover:bg-[#FF8DA1] hover:text-[#ffffff] active:bg-[#FF8DA1] md:p-0 md:text-sm md:rounded-none md:hover:bg-transparent md:hover:text-pink-600 ${
      isActive ? "text-pink-600 font-semibold md:border-b-2 md:border-pink-600 md:pb-1" : "text-neutral-800"
    }`;

  return (
    <header className="border-b border-neutral-200 sticky top-0 bg-white z-20">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4" aria-label="Principal">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden text-3xl leading-none px-1"
            aria-label="Abrir menú"
            aria-expanded={abierto}
            onClick={() => setAbierto(true)}
          >
            ☰
          </button>
          <Link to="/" aria-label="Mío Fashion, ir al inicio">
            <img src="/img/logo.png" alt="Mío Fashion" className="h-12 w-auto" />
          </Link>
        </div>

        <ul
          className={`${
            abierto ? "flex" : "hidden"
          } flex-col items-center text-center fixed inset-0 z-50 bg-white justify-center gap-3 px-8 md:static md:z-auto md:inset-auto md:flex md:flex-row md:gap-8 md:p-0`}
        >
          <li className="absolute top-5 right-6 md:hidden">
            <button type="button" className="text-4xl leading-none" aria-label="Cerrar menú" onClick={() => setAbierto(false)}>
              ✕
            </button>
          </li>
          {enlaces.map((enlace) => (
            <li key={enlace.to}>
              <NavLink to={enlace.to} end={enlace.end} className={claseEnlace}>
                {enlace.texto}
                {enlace.insignia > 0 && (
                  <span className="ml-2 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-pink-600 px-1.5 text-xs text-[#ffffff] align-middle">
                    {enlace.insignia}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeSwitch />
          {sesion ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden sm:inline text-neutral-600 max-w-32 truncate">{sesion.nombre || sesion.correo}</span>
              <button
                type="button"
                onClick={salir}
                className="border border-neutral-300 px-4 py-2 rounded-full hover:border-neutral-900"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm border border-neutral-300 px-4 py-2 rounded-full hover:border-pink-600 hover:text-pink-600"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
