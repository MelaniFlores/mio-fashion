import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import FieldError from "../components/FieldError";
import { useAuth } from "../context/AuthContext";
import { toast } from "../lib/alertas";
import { correoValido, passwordValida } from "../lib/validaciones";

const CLASE_INPUT = "w-full border border-neutral-300 rounded-lg px-3 py-2";

function FormLogin({ alEntrar }) {
  const { iniciarSesion } = useAuth();
  const [datos, setDatos] = useState({ correo: "", password: "" });
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = {};
    const correo = datos.correo.trim();
    if (!correo) nuevos.correo = "El correo es obligatorio.";
    else if (!correoValido(correo)) nuevos.correo = "Formato de correo inválido.";
    if (!datos.password) nuevos.password = "La contraseña es obligatoria.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;

    const resultado = iniciarSesion(correo, datos.password);
    if (!resultado.ok) {
      setErrores({ general: resultado.error });
      return;
    }
    alEntrar(resultado.sesion);
  };

  return (
    <form onSubmit={enviar} noValidate>
      <label htmlFor="login-correo" className="block text-sm mb-1">Correo electrónico</label>
      <input id="login-correo" type="email" autoComplete="email" value={datos.correo} onChange={cambiar("correo")} className={CLASE_INPUT} />
      <FieldError mensaje={errores.correo} />

      <label htmlFor="login-password" className="block text-sm mb-1 mt-3">Contraseña</label>
      <input id="login-password" type="password" autoComplete="current-password" value={datos.password} onChange={cambiar("password")} className={CLASE_INPUT} />
      <FieldError mensaje={errores.password} />
      <FieldError mensaje={errores.general} />

      <button type="submit" className="w-full bg-neutral-900 text-white py-3 rounded-full text-sm hover:bg-neutral-700 mt-4">
        Entrar
      </button>
    </form>
  );
}

function FormRegistro({ alEntrar }) {
  const { registrar } = useAuth();
  const [datos, setDatos] = useState({ nombre: "", correo: "", password: "", password2: "" });
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = {};
    const nombre = datos.nombre.trim();
    const correo = datos.correo.trim();
    if (nombre.length < 3) nuevos.nombre = "El nombre debe tener al menos 3 caracteres.";
    if (!correoValido(correo)) nuevos.correo = "Formato de correo inválido.";
    if (!passwordValida(datos.password)) nuevos.password = "Debe tener 6+ caracteres, una mayúscula y un número.";
    if (datos.password !== datos.password2) nuevos.password2 = "Las contraseñas no coinciden.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;

    const resultado = registrar({ nombre, correo, password: datos.password });
    if (!resultado.ok) {
      setErrores({ correo: resultado.error });
      return;
    }
    alEntrar(resultado.sesion, true);
  };

  return (
    <form onSubmit={enviar} noValidate>
      <label htmlFor="reg-nombre" className="block text-sm mb-1">Nombre completo</label>
      <input id="reg-nombre" type="text" autoComplete="name" value={datos.nombre} onChange={cambiar("nombre")} className={CLASE_INPUT} />
      <FieldError mensaje={errores.nombre} />

      <label htmlFor="reg-correo" className="block text-sm mb-1 mt-3">Correo electrónico</label>
      <input id="reg-correo" type="email" autoComplete="email" value={datos.correo} onChange={cambiar("correo")} className={CLASE_INPUT} />
      <FieldError mensaje={errores.correo} />

      <label htmlFor="reg-password" className="block text-sm mb-1 mt-3">Contraseña</label>
      <input id="reg-password" type="password" autoComplete="new-password" value={datos.password} onChange={cambiar("password")} className={CLASE_INPUT} />
      <p className="text-xs text-neutral-500 mt-1">Mínimo 6 caracteres, una mayúscula y un número.</p>
      <FieldError mensaje={errores.password} />

      <label htmlFor="reg-password2" className="block text-sm mb-1 mt-3">Confirmar contraseña</label>
      <input id="reg-password2" type="password" autoComplete="new-password" value={datos.password2} onChange={cambiar("password2")} className={CLASE_INPUT} />
      <FieldError mensaje={errores.password2} />

      <button type="submit" className="w-full bg-neutral-900 text-white py-3 rounded-full text-sm hover:bg-neutral-700 mt-4">
        Crear cuenta
      </button>
    </form>
  );
}

export default function Login() {
  const { sesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [pestana, setPestana] = useState("login");

  // Si ya hay sesión no tiene sentido ver el login
  if (sesion) return <Navigate to={sesion.rol === "admin" ? "/dashboard" : "/catalogo"} replace />;

  const alEntrar = (nuevaSesion, esRegistro = false) => {
    toast("success", esRegistro ? `¡Cuenta creada! Hola, ${nuevaSesion.nombre}` : `¡Hola, ${nuevaSesion.nombre}!`);
    // Navegación diferenciada según el rol. Si venía de una página protegida, regresa a ella.
    if (nuevaSesion.rol === "admin") navegar("/dashboard", { replace: true });
    else navegar(ubicacion.state?.desde && ubicacion.state.desde !== "/dashboard" ? ubicacion.state.desde : "/catalogo", { replace: true });
  };

  const claseTab = (activa) =>
    `pb-3 text-sm border-b-2 ${activa ? "border-neutral-900" : "text-neutral-500 border-transparent"}`;

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-8">{pestana === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>

      <div className="flex gap-6 mb-8 border-b border-neutral-200" role="tablist">
        <button type="button" role="tab" aria-selected={pestana === "login"} className={claseTab(pestana === "login")} onClick={() => setPestana("login")}>
          Iniciar sesión
        </button>
        <button type="button" role="tab" aria-selected={pestana === "registro"} className={claseTab(pestana === "registro")} onClick={() => setPestana("registro")}>
          Registrarme
        </button>
      </div>

      {pestana === "login" ? <FormLogin alEntrar={alEntrar} /> : <FormRegistro alEntrar={alEntrar} />}
    </main>
  );
}
