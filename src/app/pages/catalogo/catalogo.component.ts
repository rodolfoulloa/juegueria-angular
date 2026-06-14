import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  PRODUCTOS,
  CATEGORIAS,
  IDS_DESTACADOS,
  ETIQUETAS_DESTACADOS
} from '../../core/data/catalogo.data';
import { FichaJuegoComponent } from '../../shared/ficha-juego/ficha-juego.component';
import { Producto } from '../../core/models/models';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink, FichaJuegoComponent],
  template: `
    <!-- ── Sección Destacados ──────────────────────────────────────────── -->
    <section class="categoria-detalle" aria-labelledby="titulo-destacados">
      <h2 id="titulo-destacados">Juegos destacados</h2>
      <div class="grilla-juegos">
        @for (producto of destacados; track producto.id) {
          <app-ficha-juego
            [producto]="producto"
            [etiqueta]="etiquetaDestacada(producto.id)" />
        }
      </div>
    </section>

    <!-- ── Sección Categorías ──────────────────────────────────────────── -->
    <section class="categorias" aria-labelledby="titulo-categorias">
      <h2 id="titulo-categorias">Categorías de juegos</h2>
      <div class="grilla-categorias">
        @for (cat of categorias; track cat.slug) {
          <article class="tarjeta-categoria">
            <img [src]="cat.imagen" [alt]="'Categoría de juegos ' + cat.nombre">
            <h3>{{ cat.nombre }}</h3>
            <a [routerLink]="['/categoria', cat.slug]">Ver juegos</a>
          </article>
        }
      </div>
    </section>
  `
})
export class CatalogoComponent {
  readonly categorias = CATEGORIAS;
  readonly destacados: Producto[] = PRODUCTOS.filter(p =>
    IDS_DESTACADOS.includes(p.id)
  );

  etiquetaDestacada(id: string): string {
    return ETIQUETAS_DESTACADOS[id] ?? '';
  }
}
