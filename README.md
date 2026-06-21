# La Juegueria - Angular v22

Aplicacion ecommerce de juegos de mesa desarrollada en Angular 22 (standalone), migrada desde una base HTML/JS e implementada con enfoque SPA.

Incluye catalogo, categorias dinamicas, detalle de producto, registro/login, recuperacion de clave, perfil, carrito, historial de compras, confirmacion de pedido y panel administrador (inventario y clientes).

## Tecnologias y enfoques del proyecto

- Angular 22 con componentes standalone
- Router con lazy loading por ruta
- Signals para estado reactivo (signal, computed)
- Control flow moderno de Angular (@if, @for)
- Formularios reactivos (Reactive Forms)
- Guards para autenticacion y autorizacion por rol
- Servicios inyectados con inject()
- Persistencia con localStorage y sessionStorage
- Bootstrap 5 via npm
- Pruebas unitarias con Karma + Jasmine

## Requisitos previos

- Node.js 22.x o superior
- npm 10.x o superior

## Instalacion

Desde la carpeta raiz del proyecto (juegueria-angular):

1. npm install

## Ejecucion en desarrollo

1. npm start
2. Abrir http://localhost:4200

Comando equivalente:

- npm run ng -- serve

## Compilacion

- npm run build

Salida de build:

- dist/juegueria

## Scripts disponibles

- npm start: inicia servidor de desarrollo
- npm run build: compila para produccion
- npm run watch: compila en modo watch (development)
- npm test: ejecuta pruebas unitarias en modo watch
- npm run test:ci: ejecuta pruebas unitarias en una sola pasada (headless)

## Funcionalidades principales

### Catalogo y navegacion

- Vista de catalogo con categorias y productos destacados
- Vista dinamica por categoria usando slug (/categoria/:slug)
- Vista de detalle de producto (/producto/:id)
- Tarjetas de producto con accion de agregar al carrito

### Autenticacion y usuarios

- Registro de usuarios cliente
- Login por usuario o correo
- Recuperacion de contrasena simulada
- Perfil de usuario editable
- Guard de autenticacion para rutas privadas
- Guard de administrador para rutas de gestion

### Carrito y compras

- Carrito reactivo por usuario
- Merge automatico de carrito visitante al iniciar sesion
- Confirmacion de compra
- Historial de ordenes por usuario

### Panel administrador

- CRUD de inventario
- Vista de clientes registrados

## Formularios reactivos implementados

Los formularios se implementan con FormBuilder/FormGroup en:

- Login
- Registro
- Perfil
- Recuperacion
- Inventario

Se mantienen validaciones funcionales de negocio: obligatorios, formato correo, reglas de contrasena, coincidencia de claves, edad minima para registro y reglas de inventario.

## Persistencia y estado

- localStorage:
	- usuarios
	- inventario
	- carritos por propietario
	- historial de ordenes
- sessionStorage:
	- sesion activa

## Usuarios de prueba

| Usuario | Contrasena | Rol |
|---|---|---|
| admin | admin123 | administrador |

Tambien puedes crear usuarios desde /registro.

## Rutas del sistema

| URL | Componente | Acceso |
|---|---|---|
| / | redirige a /catalogo | Libre |
| /catalogo | CatalogoComponent | Libre |
| /categoria/:slug | CategoriaComponent | Libre |
| /producto/:id | ProductoDetalleComponent | Libre |
| /registro | RegistroComponent | Libre |
| /login | LoginComponent | Libre |
| /recuperacion | RecuperacionComponent | Libre |
| /perfil | PerfilComponent | Auth |
| /carrito | CarritoComponent | Libre |
| /historial | HistorialComponent | Auth |
| /confirmacion | ConfirmacionComponent | Auth |
| /inventario | InventarioComponent | Admin |
| /clientes | ClientesComponent | Admin |
| ** | redirige a /catalogo | Libre |

## Estructura base del proyecto

src/
- app/
	- app.component.ts
	- app.config.ts
	- app.routes.ts
	- components/
		- navbar/
	- core/
		- data/
		- guards/
		- models/
		- pipes/
		- services/
	- pages/
		- catalogo/
		- categoria/
		- producto-detalle/
		- registro/
		- login/
		- recuperacion/
		- perfil/
		- carrito/
		- historial/
		- confirmacion/
		- inventario/
		- clientes/
	- shared/
		- ficha-juego/
- styles.css

## Pruebas unitarias

Pruebas incluidas actualmente:

- src/app/core/services/cart.service.spec.ts
- src/app/pages/categoria/categoria.component.spec.ts

Cobertura actual:

- CartService
	- agregar producto
	- acumulacion de cantidad
	- calculo de total
	- merge de carrito invitado con carrito de usuario
- CategoriaComponent
	- filtrado por slug de ruta
	- comportamiento cuando el slug no existe

### Como ejecutar pruebas

Modo desarrollo (watch):

1. npm test

Modo una sola ejecucion (ideal CI/local rapido):

1. npm run test:ci

Resultado esperado actual: 4 pruebas exitosas.

## Notas para Windows PowerShell

Si PowerShell bloquea scripts y npm no se ejecuta, puedes usar:

- cmd /c npm install
- cmd /c npm start
- cmd /c npm run test:ci

Alternativamente, ajustar ExecutionPolicy de tu entorno segun politicas de tu equipo.
