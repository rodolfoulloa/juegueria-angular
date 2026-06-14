import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { ClpPipe } from '../../core/pipes/clp.pipe';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterLink, ClpPipe],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-carrito">
      <h2 id="titulo-carrito">Carrito de compras</h2>
      <p class="descripcion-registro">
        Agrega juegos desde el catálogo y simula una compra completa.
      </p>

      @if (cart.cart().length === 0) {
        <div class="seccion-vacia">Todavía no agregas juegos al carrito.</div>
      } @else {
        <div class="table-responsive">
          <table class="table align-middle tabla-panel">
            <thead>
              <tr>
                <th>Juego</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (item of cart.cart(); track item.id) {
                <tr>
                  <td>{{ item.nombre }}</td>
                  <td>{{ item.precio | clp }}</td>
                  <td><span class="cantidad-badge">{{ item.cantidad }}</span></td>
                  <td>{{ item.precio * item.cantidad | clp }}</td>
                  <td class="acciones-tabla">
                    <button type="button" class="btn btn-sm btn-outline-secondary"
                            (click)="cart.decrement(item.id)">−</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary"
                            (click)="cart.increment(item.id)">+</button>
                    <button type="button" class="btn btn-sm btn-outline-danger"
                            (click)="cart.remove(item.id)">Eliminar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="resumen-estado">
          <p><strong>Total:</strong> {{ cart.total() | clp }}</p>
          <button class="btn btn-primary" type="button" (click)="simularCompra()">
            Simular compra
          </button>
        </div>
      }

      @if (mensaje()) {
        <p class="mensaje-formulario"
           [class.ok]="mensajeTipo() === 'ok'"
           [class.error]="mensajeTipo() === 'error'"
           role="status" aria-live="polite">
          {{ mensaje() }}
        </p>
      }
    </section>
  `
})
export class CarritoComponent {
  cart = inject(CartService);
  private auth = inject(AuthService);
  private router = inject(Router);

  mensaje = signal('');
  mensajeTipo = signal<'ok' | 'error' | ''>('');

  simularCompra(): void {
    if (!this.auth.isLoggedIn()) {
      this.mensaje.set(
        'Debes iniciar sesión para simular la compra y guardar tu historial.'
      );
      this.mensajeTipo.set('error');
      return;
    }

    const orden = this.cart.buy();
    if (!orden) {
      this.mensaje.set('Tu carrito está vacío.');
      this.mensajeTipo.set('error');
      return;
    }

    this.router.navigate(['/confirmacion']);
  }
}
