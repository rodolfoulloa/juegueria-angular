import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { Orden } from '../../core/models/models';
import { ClpPipe } from '../../core/pipes/clp.pipe';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [ClpPipe],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-historial">
      <h2 id="titulo-historial">Historial de compras</h2>
      <p class="descripcion-registro">
        Revisa las compras simuladas asociadas a tu sesión.
      </p>

      @if (ordenes().length === 0) {
        <div class="seccion-vacia">Todavía no tienes compras registradas.</div>
      } @else {
        <div class="grilla-resumen">
          @for (orden of ordenes(); track orden.id) {
            <article class="tarjeta-resumen">
              <h3>Compra {{ orden.id }}</h3>
              <p><strong>Fecha:</strong> {{ orden.fecha }}</p>
              <p><strong>Total:</strong> {{ orden.total | clp }}</p>
              <p>
                <strong>Productos:</strong>
                @for (item of orden.items; track item.id; let last = $last) {
                  {{ item.nombre }} x{{ item.cantidad }}{{ last ? '' : ', ' }}
                }
              </p>
            </article>
          }
        </div>
      }
    </section>
  `
})
export class HistorialComponent implements OnInit {
  private auth = inject(AuthService);
  private storage = inject(StorageService);

  ordenes = signal<Orden[]>([]);

  ngOnInit(): void {
    const usuario = this.auth.currentUser();
    if (usuario) {
      this.ordenes.set(this.storage.getOrders(usuario.usuario));
    }
  }
}
