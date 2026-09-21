# Mío Fashion — Aplicación Web

Proyecto de cátedra, Etapa 2 (Desarrollo Base del Proyecto).
Asignatura: Desarrollo de Aplicaciones Web con Software Interpretados en el Cliente (DAW901).
Universidad Don Bosco.

**Estudiante:** Melani Adriana Flores Mendoza — FM250096
**Docente:** Alexander Alberto Siguenza

## Enlace del despliegue

https://mio-fashion.vercel.app

## Descripción

Aplicación web para Mío Fashion, emprendimiento salvadoreño de venta de maquillaje que
opera a través de redes sociales. La plataforma centraliza el catálogo de productos,
permite armar pedidos que se envían por WhatsApp y gestiona solicitudes de productos
fuera de catálogo.

## Tecnologías

- HTML5
- CSS3 con Tailwind
- JavaScript vanilla
- localStorage para persistencia de datos
- Chart.js para el módulo de reportes

## Módulos implementados

1. **Autenticación**: login y registro con validación de campos, manejo de sesiones en
   localStorage y dos roles diferenciados.
2. **Catálogo y pedidos**: filtrado por categoría, buscador, carrito con cálculo automático
   de totales y generación de pedido por WhatsApp o copiado al portapapeles.
3. **Solicitudes especiales**: formulario validado para productos fuera de catálogo.
4. **Dashboard de administrador**: CRUD completo de productos (crear, listar, actualizar,
   eliminar), métricas del negocio, gráfica de pedidos y solicitudes por mes, y listado de
   solicitudes recibidas.

## Roles y credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@miofashion.com | Admin123 |
| Cliente | Registrarse desde la aplicación | — |

El administrador accede al dashboard; el cliente al catálogo. Las rutas del panel están
protegidas: sin sesión de administrador se redirige al login.

## Vistas

- `index.html` — Inicio
- `catalogo.html` — Catálogo y carrito
- `login.html` — Login y registro
- `solicitudes.html` — Solicitudes especiales
- `dashboard.html` — Panel de administración
- `nosotros.html` — Acerca de nosotros

## Estructura del proyecto
```
mio-fashion/
├── index.html          Inicio
├── catalogo.html       Catálogo y carrito
├── login.html          Login y registro
├── solicitudes.html    Solicitudes especiales
├── dashboard.html      Panel de administración
├── nosotros.html       Acerca de nosotros
├── img/                Imágenes de productos
├── js/
│   ├── datos.js        Productos iniciales y utilidades de localStorage
│   ├── navbar.js       Navbar dinámico según la sesión
│   ├── inicio.js       Lógica de la página de inicio
│   ├── catalogo.js     Filtros, buscador, carrito y pedido por WhatsApp
│   ├── auth.js         Login, registro y protección de rutas
│   ├── solicitudes.js  Formulario de solicitudes especiales
│   └── dashboard.js    CRUD de productos, métricas y gráfica
└── README.md
```