import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav id="menuPrincipal" class="navegacion navbar navbar-expand-lg"
         aria-label="Navegación principal">
      <div class="container-fluid px-0">

        <button class="navbar-toggler" type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarContenido"
                aria-controls="navbarContenido"
                aria-expanded="false"
                aria-label="Mostrar navegación">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContenido">

          <!-- Categorías -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 menu-categorias">
            <li class="nav-item">
              <a class="nav-link" routerLink="/catalogo" routerLinkActive="activo">
                Catálogo
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categoria/estrategia" routerLinkActive="activo">
                Estrategia
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categoria/familiares" routerLinkActive="activo">
                Familiares
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categoria/infantiles" routerLinkActive="activo">
                Infantiles
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categoria/fiesta" routerLinkActive="activo">
                Fiesta
              </a>
            </li>
          </ul>

          <!-- Acciones de usuario -->
          <ul class="navbar-nav ms-auto menu-usuario" aria-label="Opciones de usuario">

            <!-- Botón carrito rápido -->
            <li class="nav-item">
              <a class="btn btn-carrito-rapido" routerLink="/carrito" aria-label="Ver carrito">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                     fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16"
                     aria-hidden="true" focusable="false">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1
                           .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L1.01 2H.5A.5.5
                           0 0 1 0 1.5M3.102 4l1.313 7h8.17l1.313-7zM5 12.5a1.5 1.5 0 1 0 0 3 1.5
                           1.5 0 0 0 0-3m7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                </svg>
                <span>Carro</span>
                @if (cart.itemCount() > 0) {
                  <span class="cantidad-badge">({{ cart.itemCount() }})</span>
                }
              </a>
            </li>

            <!-- Menú usuario dropdown -->
            <li class="nav-item dropdown">
              <button class="btn usuario-trigger dropdown-toggle" type="button"
                      data-bs-toggle="dropdown" aria-expanded="false">
                Mi cuenta
                <span class="badge-usuario-menu" [class.logueado]="auth.isLoggedIn()">
                  {{ badgeTexto() }}
                </span>
              </button>

              <ul class="dropdown-menu dropdown-menu-end submenu-contenido"
                  aria-labelledby="submenuUsuarioTrigger">

                @if (!auth.isLoggedIn()) {
                  <li>
                    <a class="dropdown-item" routerLink="/registro">Registro</a>
                  </li>
                  <li>
                    <a class="dropdown-item" routerLink="/login">Login</a>
                  </li>
                  <li>
                    <a class="dropdown-item" routerLink="/recuperacion">Recuperar clave</a>
                  </li>
                }

                @if (auth.isLoggedIn()) {
                  <li>
                    <a class="dropdown-item" routerLink="/perfil">Mi perfil</a>
                  </li>
                }

                @if (auth.isLoggedIn() && !auth.isAdmin()) {
                  <li>
                    <a class="dropdown-item" routerLink="/carrito">Carrito</a>
                  </li>
                  <li>
                    <a class="dropdown-item" routerLink="/historial">Historial</a>
                  </li>
                }

                @if (auth.isAdmin()) {
                  <li>
                    <a class="dropdown-item" routerLink="/inventario">Gestión de inventario</a>
                  </li>
                  <li>
                    <a class="dropdown-item" routerLink="/clientes">Mantenedor de clientes</a>
                  </li>
                }

                @if (auth.isLoggedIn()) {
                  <li>
                    <button type="button" class="dropdown-item nav-boton" (click)="cerrarSesion()">
                      Cerrar sesión
                    </button>
                  </li>
                }

              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  private router = inject(Router);

  badgeTexto = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return 'Invitado';
    return user.rol === 'administrador' ? 'Admin' : user.nombre.split(' ')[0];
  });

  cerrarSesion(): void {
    this.auth.logout();
    this.cart.loadCart();
    this.router.navigate(['/catalogo']);
  }
}
