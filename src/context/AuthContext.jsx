import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

// El admin viene precargado; los clientes se registran.
const ADMIN_INICIAL = {
  nombre: "Administradora",
  correo: "admin@miofashion.com",
  password: "Admin123",
  rol: "admin",
};

const mismoCorreo = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useLocalStorage("usuarios", [ADMIN_INICIAL]);
  const [sesion, setSesion] = useLocalStorage("sesion", null);

  const iniciarSesion = useCallback(
    (correo, password) => {
      const usuario = usuarios.find((u) => mismoCorreo(u.correo, correo) && u.password === password);
      if (!usuario) return { ok: false, error: "Correo o contraseña incorrectos." };
      // Guardamos la sesión sin la contraseña
      const nueva = { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
      setSesion(nueva);
      return { ok: true, sesion: nueva };
    },
    [usuarios, setSesion]
  );

  const registrar = useCallback(
    ({ nombre, correo, password }) => {
      if (usuarios.some((u) => mismoCorreo(u.correo, correo))) {
        return { ok: false, error: "Ya existe una cuenta con este correo." };
      }
      // Los que se registran son clientes
      setUsuarios([...usuarios, { nombre, correo, password, rol: "cliente" }]);
      const nueva = { nombre, correo, rol: "cliente" };
      setSesion(nueva);
      return { ok: true, sesion: nueva };
    },
    [usuarios, setUsuarios, setSesion]
  );

  const cerrarSesion = useCallback(() => setSesion(null), [setSesion]);

  const valor = useMemo(
    () => ({ sesion, esAdmin: sesion?.rol === "admin", iniciarSesion, registrar, cerrarSesion }),
    [sesion, iniciarSesion, registrar, cerrarSesion]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return contexto;
}
