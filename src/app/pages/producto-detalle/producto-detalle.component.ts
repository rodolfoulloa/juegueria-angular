import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PRODUCTOS, CATEGORIAS, Categoria } from '../../core/data/catalogo.data';
import { Producto } from '../../core/models/models';
import { CartService } from '../../core/services/cart.service';
import { ClpPipe } from '../../core/pipes/clp.pipe';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [RouterLink, ClpPipe],
  template: `
    @if (producto(); as prod) {
      <section class="categoria-detalle" aria-labelledby="titulo-producto">
        <div class="detalle-producto">
          <img [src]="prod.imagen" [alt]="'Juego ' + prod.nombre" class="detalle-imagen">
          <div>
            <h2 id="titulo-producto">{{ prod.nombre }}</h2>
            <p class="precio-detalle">{{ prod.precio | clp }}</p>
            @if (prod.etiqueta) {
              <p class="descuento">{{ prod.etiqueta }}</p>
            }
            <p>{{ prod.descripcion }}</p>
            <p><strong>Categoría:</strong> {{ categoria()?.nombre || 'Sin categoría' }}</p>
            <p><strong>Stock:</strong> {{ prod.stock }}</p>
            <div class="d-flex gap-2 flex-wrap mt-3">
              <button type="button" class="btn btn-primary" (click)="agregarAlCarrito()">
                Agregar al carrito
              </button>
              <a class="btn btn-outline-secondary" [routerLink]="['/categoria', categoria()?.slug || '']">
                Volver a la categoría
              </a>
              <a class="btn btn-outline-secondary" routerLink="/catalogo">
                Volver al catálogo
              </a>
            </div>
          </div>
        </div>
      </section>
    } @else {
      <section class="categoria-detalle">
        <p class="seccion-vacia">Producto no encontrado.</p>
        <a class="btn btn-primary" routerLink="/catalogo">Volver al catálogo</a>
      </section>
    }
  `
})
export class ProductoDetalleComponent {
  private route = inject(ActivatedRoute);
  private cart = inject(CartService);

  private id = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? '')),
    { initialValue: '' }
  );

  producto = computed<Producto | null>(() =>
    PRODUCTOS.find(item => item.id === this.id()) ?? null
  );

  categoria = computed<Categoria | null>(() => {
    const prod = this.producto();
    return prod ? (CATEGORIAS.find(cat => cat.slug === prod.categoria) ?? null) : null;
  });

  agregarAlCarrito(): void {
    const prod = this.producto();
    if (!prod) return;
    this.cart.addProduct(prod);
  }
}
