import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Catalogo from "./pages/Catalogo";
import Dashboard from "./pages/Dashboard";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import MisPedidos from "./pages/MisPedidos";
import NoEncontrada from "./pages/NoEncontrada";
import Nosotros from "./pages/Nosotros";
import Solicitudes from "./pages/Solicitudes";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="solicitudes" element={<Solicitudes />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="login" element={<Login />} />
        <Route
          path="mis-pedidos"
          element={
            <ProtectedRoute rol="cliente">
              <MisPedidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute rol="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}
