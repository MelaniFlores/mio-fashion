// ===== USUARIOS =====
// El admin viene precargado; los clientes se registran.
function obtenerUsuarios() {
  const guardados = localStorage.getItem("usuarios");
  if (guardados) {
    return JSON.parse(guardados);
  }
  const iniciales = [
    {
      nombre: "Administradora",
      correo: "admin@miofashion.com",
      password: "Admin123",
      rol: "admin",
    },
  ];
  localStorage.setItem("usuarios", JSON.stringify(iniciales));
  return iniciales;
}

function guardarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// ===== VALIDACIONES =====
function correoValido(correo) {
  // Debe tener texto, arroba, texto, punto y al menos 2 letras
  const patron = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return patron.test(correo);
}

function passwordValida(password) {
  // Al menos 6 caracteres, una mayúscula y un número
  const patron = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  return patron.test(password);
}

// Muestra u oculta un mensaje de error bajo un campo
function mostrarError(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  if (mensaje) {
    elemento.textContent = mensaje;
    elemento.classList.remove("hidden");
  } else {
    elemento.classList.add("hidden");
  }
}

// ===== PESTAÑAS =====
const tabLogin = document.getElementById("tab-login");
const tabRegistro = document.getElementById("tab-registro");
const formLogin = document.getElementById("form-login");
const formRegistro = document.getElementById("form-registro");

tabLogin.addEventListener("click", () => {
  formLogin.classList.remove("hidden");
  formRegistro.classList.add("hidden");
  tabLogin.className = "pb-3 text-sm border-b-2 border-neutral-900";
  tabRegistro.className = "pb-3 text-sm text-neutral-500 border-b-2 border-transparent";
});

tabRegistro.addEventListener("click", () => {
  formRegistro.classList.remove("hidden");
  formLogin.classList.add("hidden");
  tabRegistro.className = "pb-3 text-sm border-b-2 border-neutral-900";
  tabLogin.className = "pb-3 text-sm text-neutral-500 border-b-2 border-transparent";
});

// ===== LOGIN =====
formLogin.addEventListener("submit", (evento) => {
  evento.preventDefault(); // evita que la página se recargue

  const correo = document.getElementById("login-correo").value.trim();
  const password = document.getElementById("login-password").value;

  let hayErrores = false;

  if (!correo) {
    mostrarError("error-login-correo", "El correo es obligatorio.");
    hayErrores = true;
  } else if (!correoValido(correo)) {
    mostrarError("error-login-correo", "Formato de correo inválido.");
    hayErrores = true;
  } else {
    mostrarError("error-login-correo", "");
  }

  if (!password) {
    mostrarError("error-login-password", "La contraseña es obligatoria.");
    hayErrores = true;
  } else {
    mostrarError("error-login-password", "");
  }

  if (hayErrores) return;

  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(
    (u) => u.correo === correo && u.password === password
  );

  if (!usuario) {
    mostrarError("error-login-general", "Correo o contraseña incorrectos.");
    return;
  }

  mostrarError("error-login-general", "");

  // Guardamos la sesión (sin la contraseña)
  localStorage.setItem(
    "sesion",
    JSON.stringify({ nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol })
  );

  // Navegación diferenciada según el rol
  if (usuario.rol === "admin") {
    window.location.href = "dashboard.html";
  } else {
    window.location.href = "catalogo.html";
  }
});

// ===== REGISTRO =====
formRegistro.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById("reg-nombre").value.trim();
  const correo = document.getElementById("reg-correo").value.trim();
  const password = document.getElementById("reg-password").value;
  const password2 = document.getElementById("reg-password2").value;

  let hayErrores = false;

  if (nombre.length < 3) {
    mostrarError("error-reg-nombre", "El nombre debe tener al menos 3 caracteres.");
    hayErrores = true;
  } else {
    mostrarError("error-reg-nombre", "");
  }

  const usuarios = obtenerUsuarios();

  if (!correoValido(correo)) {
    mostrarError("error-reg-correo", "Formato de correo inválido.");
    hayErrores = true;
  } else if (usuarios.find((u) => u.correo === correo)) {
    mostrarError("error-reg-correo", "Ya existe una cuenta con este correo.");
    hayErrores = true;
  } else {
    mostrarError("error-reg-correo", "");
  }

  if (!passwordValida(password)) {
    mostrarError("error-reg-password", "Debe tener 6+ caracteres, una mayúscula y un número.");
    hayErrores = true;
  } else {
    mostrarError("error-reg-password", "");
  }

  if (password !== password2) {
    mostrarError("error-reg-password2", "Las contraseñas no coinciden.");
    hayErrores = true;
  } else {
    mostrarError("error-reg-password2", "");
  }

  if (hayErrores) return;

  // Los que se registran son clientes
  usuarios.push({ nombre, correo, password, rol: "cliente" });
  guardarUsuarios(usuarios);

  localStorage.setItem(
    "sesion",
    JSON.stringify({ nombre, correo, rol: "cliente" })
  );

  window.location.href = "catalogo.html";
});