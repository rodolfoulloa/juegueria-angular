import { Component, inject, input } from '@angular/core';
import { Producto } from '../../core/models/models';
import { CartService } from '../../core/services/cart.service';
import { ClpPipe } from '../../core/pipes/clp.pipe';

/**
 * Tarjeta reutilizable de producto.
 * Se usa en Catálogo, sección Destacados y en cada página de categoría.
 */
@Component({
  selector: 'app-ficha-juego',
  standalone: true,
  imports: [ClpPipe],
  template: `
    <article class="ficha-juego">
      <img [src]="producto().imagen" [alt]="'Juego ' + producto().nombre">
      <h3>{{ producto().nombre }}</h3>
      <p>{{ producto().descripcion }}</p>
      <p class="precio">{{ producto().precio | clp }}</p>
      @if (etiqueta() || producto().etiqueta) {
        <p class="descuento">{{ etiqueta() || producto().etiqueta }}</p>
      }
      <button type="button" class="btn btn-primary mt-2 w-100"
              (click)="agregarAlCarrito()">
        Agregar al carrito
      </button>
    </article>
  `
})
export class FichaJuegoComponent {
  /** Producto a mostrar. */
  producto = input.required<Producto>();

  /** Etiqueta destacada opcional (sobreescribe la del producto). */
  etiqueta = input('');

  private cartService = inject(CartService);

  agregarAlCarrito(): void {
    this.cartService.addProduct(this.producto());
  }
}
