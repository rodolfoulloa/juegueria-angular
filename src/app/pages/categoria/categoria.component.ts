import { Component, inject, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PRODUCTOS, CATEGORIAS, Categoria } from '../../core/data/catalogo.data';
import { FichaJuegoComponent } from '../../shared/ficha-juego/ficha-juego.component';
import { Producto } from '../../core/models/models';

/**
 * Vista dinámica de categoría.
 * Recibe el parámetro de ruta :slug y filtra los productos del catálogo en memoria.
 * Reemplaza las 4 secciones estáticas (estrategia, familiares, infantiles, fiesta).
 */
@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [RouterLink, FichaJuegoComponent],
  template: `
    @if (categoria(); as cat) {
      <section class="categoria-detalle"
               [attr.aria-labelledby]="'titulo-' + cat.slug">
        <h2 [id]="'titulo-' + cat.slug">{{ cat.nombre }}</h2>

        <div class="grilla-juegos">
          @for (producto of productos(); track producto.id) {
            <app-ficha-juego [producto]="producto" />
          }
        </div>

        <nav class="enlaces-internos"
             [attr.aria-label]="'Navegación categoría ' + cat.nombre">
          <a [routerLink]="['/categoria', cat.siguiente]">
            Siguiente: {{ nombreSiguiente() }}
          </a>
          <a routerLink="/catalogo">Volver al catálogo</a>
        </nav>
      </section>
    } @else {
      <p class="seccion-vacia">Categoría no encontrada.</p>
    }
  `
})
export class CategoriaComponent {
  private route = inject(ActivatedRoute);

  /** Slug actual desde la URL, reactivo. */
  private slug = toSignal(
    this.route.paramMap.pipe(map(params => params.get('slug') ?? '')),
    { initialValue: '' }
  );

  /** Datos de la categoría actual. */
  categoria = computed<Categoria | null>(
    () => CATEGORIAS.find(c => c.slug === this.slug()) ?? null
  );

  /** Productos filtrados por la categoría. */
  productos = computed<Producto[]>(() => {
    const cat = this.categoria();
    return cat ? PRODUCTOS.filter(p => p.categoria === cat.slug) : [];
  });

  /** Nombre de la categoría siguiente para el enlace de navegación. */
  nombreSiguiente = computed<string>(() => {
    const cat = this.categoria();
    return cat
      ? (CATEGORIAS.find(c => c.slug === cat.siguiente)?.nombre ?? '')
      : '';
  });
}
