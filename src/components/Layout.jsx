import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();

  // Al cambiar de página volvemos arriba
  // Con llaves {} el efecto no devuelve nada (algunas extensiones del navegador
  // modifican scrollTo para que devuelva un valor, y React no lo acepta como retorno)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
