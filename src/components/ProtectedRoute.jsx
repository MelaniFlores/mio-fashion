import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protege una ruta según el rol ("admin" o "cliente").
// Sin sesión → login (y al entrar regresa aquí). Con otro rol → a su página.
export default function ProtectedRoute({ rol, children }) {
  const { sesion } = useAuth();
  const ubicacion = useLocation();

  if (!sesion) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  if (sesion.rol !== rol) return <Navigate to={sesion.rol === "admin" ? "/dashboard" : "/"} replace />;
  return children;
}
