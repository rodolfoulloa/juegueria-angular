# La Jueguería — Angular v22

Conversión del proyecto original HTML/JS a **Angular v22** con:
- Componentes standalone
- Rutas con lazy loading
- Signals (`signal`, `computed`)
- Control flow moderno (`@if`, `@for`, `@switch`)
- `ngModel` para formularios template-driven
- Guards de autenticación y rol
- Servicios inyectados con `inject()`
- Pipe `clp` para formateo de pesos chilenos
- Bootstrap 5 via npm

---

## Requisitos previos

- [Node.js](https://nodejs.org/) 22.x o superior (incluye npm)
- Angular CLI (`npm install -g @angular/cli`)

---

## Instalación

```bash
# Desde la carpeta juegueria-angular/
npm install
ng serve
```

Abre el navegador en `http://localhost:4200`.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── app.component.ts          # Raíz (header + navbar + router-outlet + footer)
│   ├── app.config.ts             # Providers (router con hash location)
│   ├── app.routes.ts             # Definición de rutas con lazy loading
│   ├── components/
│   │   └── navbar/               # Barra de navegación reactiva (signals)
│   ├── core/
│   │   ├── data/
│   │   │   └── catalogo.data.ts  # Datos estáticos: productos, categorías, destacados
│   │   ├── guards/
│   │   │   ├── auth.guard.ts     # Protege rutas que requieren sesión activa
│   │   │   └── admin.guard.ts    # Protege rutas exclusivas de administrador
│   │   ├── models/
│   │   │   └── models.ts         # Interfaces TypeScript
│   │   ├── pipes/
│   │   │   └── clp.pipe.ts       # Formatea precios en CLP
│   │   └── services/
│   │       ├── auth.service.ts   # Login, logout, updateProfile (signals)
│   │       ├── cart.service.ts   # Carrito reactivo (signals)
│   │       └── storage.service.ts# Capa sobre localStorage/sessionStorage
│   ├── pages/
│   │   ├── catalogo/             # Destacados + grilla de categorías
│   │   ├── categoria/            # Vista dinámica por slug (1 componente para 4 categorías)
│   │   ├── registro/             # Formulario con validación manual + ngModel
│   │   ├── login/                # Login con ngModel
│   │   ├── recuperacion/         # Recuperación de contraseña simulada
│   │   ├── perfil/               # Perfil de usuario (auth guard)
│   │   ├── carrito/              # Carrito con tabla reactiva
│   │   ├── historial/            # Historial de órdenes (auth guard)
│   │   ├── confirmacion/         # Confirmación de compra (auth guard)
│   │   ├── inventario/           # CRUD inventario (admin guard)
│   │   └── clientes/             # Lista clientes (admin guard)
│   └── shared/
│       └── ficha-juego/          # Tarjeta de producto reutilizable (input signals)
└── styles.css                    # Estilos globales
```

---

## Usuarios de prueba

| Usuario | Contraseña | Rol           |
|---------|------------|---------------|
| admin   | admin123   | administrador |

También puedes registrar un nuevo usuario desde `/registro`.

---

## Rutas

| URL                       | Componente        | Acceso     |
|---------------------------|-------------------|------------|
| `/`                       | → `/catalogo`     | Libre      |
| `/catalogo`               | CatalogoComponent | Libre      |
| `/categoria/:slug`        | CategoriaComponent| Libre      |
| `/registro`               | RegistroComponent | Libre      |
| `/login`                  | LoginComponent    | Libre      |
| `/recuperacion`           | RecuperacionComponent | Libre  |
| `/perfil`                 | PerfilComponent   | Auth       |
| `/carrito`                | CarritoComponent  | Libre      |
| `/historial`              | HistorialComponent| Auth       |
| `/confirmacion`           | ConfirmacionComponent | Auth   |
| `/inventario`             | InventarioComponent | Admin    |
| `/clientes`               | ClientesComponent | Admin      |
