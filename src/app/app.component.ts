import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StorageService } from './core/services/storage.service';
import { PRODUCTOS } from './core/data/catalogo.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <a class="skip-link" href="#contenidoPrincipal">Saltar al contenido principal</a>

    <header class="encabezado">
      <h1>La Jueguería</h1>
      <p>Convierte cualquier día en una gran partida con los mejores juegos de mesa.</p>
    </header>

    <app-navbar />

    <main id="contenidoPrincipal" class="container py-3">
      <router-outlet />
    </main>

    <footer>
      <p>&copy; 2026 La Jueguería - Catálogo de Juegos de Mesa</p>
    </footer>
  `
})
export class AppComponent implements OnInit {
  private storage = inject(StorageService);

  ngOnInit(): void {
    // Semilla de inventario al iniciar la app si está vacío
    this.storage.ensureInventorySeed(PRODUCTOS);
  }
}
