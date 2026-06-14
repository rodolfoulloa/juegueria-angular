import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { Orden } from '../../core/models/models';
import { ClpPipe } from '../../core/pipes/clp.pipe';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [RouterLink, ClpPipe],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-confirmacion">
      <h2 id="titulo-confirmacion">Confirmación de compra</h2>
      <p class="descripcion-registro">Tu compra simulada fue procesada correctamente.</p>

      @if (orden(); as o) {
        <div class="resumen-estado">
          <p><strong>N° de orden:</strong> {{ o.id }}</p>
          <p><strong>Fecha:</strong> {{ o.fecha }}</p>
          <p><strong>Total:</strong> {{ o.total | clp }}</p>
        </div>
      } @else {
        <p class="seccion-vacia">No se encontró información de la compra.</p>
      }

      <div class="d-flex flex-wrap gap-2 mt-3">
        <a class="btn btn-primary" routerLink="/historial">Ver historial</a>
        <a class="btn btn-outline-secondary" routerLink="/catalogo">Seguir comprando</a>
      </div>
    </section>
  `
})
export class ConfirmacionComponent implements OnInit {
  private cart = inject(CartService);
  private auth = inject(AuthService);
  private storage = inject(StorageService);

  orden = signal<Orden | null>(null);

  ngOnInit(): void {
    // Prioridad 1: última orden del servicio (recién comprada)
    const ultima = this.cart.lastOrder();
    if (ultima) {
      this.orden.set(ultima);
      return;
    }

    // Prioridad 2: última orden guardada en historial
    const usuario = this.auth.currentUser();
    if (usuario) {
      const ordenes = this.storage.getOrders(usuario.usuario);
      if (ordenes.length > 0) {
        this.orden.set(ordenes[ordenes.length - 1]);
      }
    }
  }
}
