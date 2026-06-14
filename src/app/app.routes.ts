import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalogo/catalogo.component').then(m => m.CatalogoComponent)
  },
  {
    path: 'categoria/:slug',
    loadComponent: () =>
      import('./pages/categoria/categoria.component').then(m => m.CategoriaComponent)
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'recuperacion',
    loadComponent: () =>
      import('./pages/recuperacion/recuperacion.component').then(m => m.RecuperacionComponent)
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/perfil/perfil.component').then(m => m.PerfilComponent)
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/carrito/carrito.component').then(m => m.CarritoComponent)
  },
  {
    path: 'historial',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/historial/historial.component').then(m => m.HistorialComponent)
  },
  {
    path: 'confirmacion',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/confirmacion/confirmacion.component').then(m => m.ConfirmacionComponent)
  },
  {
    path: 'inventario',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/inventario/inventario.component').then(m => m.InventarioComponent)
  },
  {
    path: 'clientes',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/clientes/clientes.component').then(m => m.ClientesComponent)
  },
  { path: '**', redirectTo: '/catalogo' }
];
