import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';
import { AuthService } from '../../core/services/auth.service';
import { Producto } from '../../core/models/models';
import { ClpPipe } from '../../core/pipes/clp.pipe';

interface FormInventario {
  id: string;
  nombre: string;
  categoria: string;
  precio: number | null;
  stock: number | null;
  descripcion: string;
  etiqueta: string;
}

function slugify(valor: string): string {
  return valor
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [FormsModule, ClpPipe],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-inventario">
      <h2 id="titulo-inventario">Gestión de inventario</h2>
      <p class="descripcion-registro">
        Vista exclusiva para administrador con un CRUD simulado sobre el inventario.
      </p>

      <!-- Formulario CRUD -->
      <form (ngSubmit)="onSubmit()" class="row g-3" novalidate>
        <div class="col-12 col-md-4">
          <label class="form-label" for="inventarioNombre">Nombre del juego</label>
          <input class="form-control" type="text" id="inventarioNombre"
                 name="nombre" [(ngModel)]="form.nombre" required>
        </div>

        <div class="col-12 col-md-3">
          <label class="form-label" for="inventarioCategoria">Categoría</label>
          <input class="form-control" type="text" id="inventarioCategoria"
                 name="categoria" [(ngModel)]="form.categoria" required>
        </div>

        <div class="col-12 col-md-2">
          <label class="form-label" for="inventarioPrecio">Precio</label>
          <input class="form-control" type="number" id="inventarioPrecio"
                 name="precio" [(ngModel)]="form.precio" min="0" required>
        </div>

        <div class="col-12 col-md-3">
          <label class="form-label" for="inventarioStock">Stock</label>
          <input class="form-control" type="number" id="inventarioStock"
                 name="stock" [(ngModel)]="form.stock" min="0" required>
        </div>

        <div class="col-12 col-lg-8">
          <label class="form-label" for="inventarioDescripcion">Descripción</label>
          <input class="form-control" type="text" id="inventarioDescripcion"
                 name="descripcion" [(ngModel)]="form.descripcion" required>
        </div>

        <div class="col-12 col-lg-4">
          <label class="form-label" for="inventarioEtiqueta">Etiqueta comercial</label>
          <input class="form-control" type="text" id="inventarioEtiqueta"
                 name="etiqueta" [(ngModel)]="form.etiqueta"
                 placeholder="Ej: Novedad de la semana">
        </div>

        <div class="col-12 d-flex flex-wrap gap-2 mt-1">
          <button class="btn btn-primary" type="submit">
            {{ form.id ? 'Actualizar juego' : 'Guardar juego' }}
          </button>
          <button class="btn btn-outline-secondary" type="button" (click)="limpiarForm()">
            Limpiar
          </button>
        </div>
      </form>

      @if (mensaje()) {
        <p class="mensaje-formulario"
           [class.ok]="mensajeTipo() === 'ok'"
           [class.error]="mensajeTipo() === 'error'"
           role="status" aria-live="polite">
          {{ mensaje() }}
        </p>
      }

      <!-- Tabla de inventario -->
      <div class="table-responsive mt-3">
        <table class="table align-middle tabla-panel">
          <thead>
            <tr>
              <th>Juego</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Etiqueta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (item of inventario(); track item.id) {
              <tr>
                <td>{{ item.nombre }}</td>
                <td>{{ item.categoria }}</td>
                <td>{{ item.precio | clp }}</td>
                <td>{{ item.stock }}</td>
                <td>{{ item.etiqueta || 'Sin etiqueta' }}</td>
                <td class="acciones-tabla">
                  <button type="button" class="btn btn-sm btn-outline-secondary"
                          (click)="editar(item)">Editar</button>
                  <button type="button" class="btn btn-sm btn-outline-danger"
                          (click)="eliminar(item.id)">Eliminar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class InventarioComponent implements OnInit {
  private storage = inject(StorageService);
  private auth = inject(AuthService);

  inventario = signal<Producto[]>([]);
  mensaje = signal('');
  mensajeTipo = signal<'ok' | 'error' | ''>('');

  form: FormInventario = this.formVacio();

  ngOnInit(): void {
    this.inventario.set(this.storage.getInventory());
  }

  private formVacio(): FormInventario {
    return { id: '', nombre: '', categoria: '', precio: null, stock: null, descripcion: '', etiqueta: '' };
  }

  limpiarForm(): void {
    this.form = this.formVacio();
    this.mensaje.set('');
    this.mensajeTipo.set('');
  }

  editar(item: Producto): void {
    this.form = {
      id: item.id,
      nombre: item.nombre,
      categoria: item.categoria,
      precio: item.precio,
      stock: item.stock,
      descripcion: item.descripcion,
      etiqueta: item.etiqueta ?? ''
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: string): void {
    if (!this.auth.isAdmin()) return;
    const actualizado = this.inventario().filter(i => i.id !== id);
    this.storage.saveInventory(actualizado);
    this.inventario.set(actualizado);
    this.mensaje.set('Juego eliminado del inventario.');
    this.mensajeTipo.set('ok');
  }

  onSubmit(): void {
    if (!this.auth.isAdmin()) {
      this.mensaje.set('Solo un administrador puede gestionar inventario.');
      this.mensajeTipo.set('error');
      return;
    }

    const nombre = this.form.nombre.trim();
    const categoria = this.form.categoria.trim();
    const descripcion = this.form.descripcion.trim();
    const precio = Number(this.form.precio);
    const stock = Number(this.form.stock);

    if (!nombre || !categoria || !descripcion || precio < 0 || stock < 0) {
      this.mensaje.set('Completa todos los campos obligatorios del inventario.');
      this.mensajeTipo.set('error');
      return;
    }

    const id = this.form.id || slugify(nombre);
    const item: Producto = {
      id,
      nombre,
      categoria,
      precio,
      stock,
      descripcion,
      etiqueta: this.form.etiqueta.trim(),
      imagen: `assets/img/juego-${categoria.toLowerCase()}.svg`
    };

    const lista = [...this.inventario()];
    const idx = lista.findIndex(i => i.id === id);

    if (idx >= 0) {
      lista[idx] = item;
      this.mensaje.set('Juego actualizado correctamente.');
    } else {
      lista.push(item);
      this.mensaje.set('Juego agregado al inventario.');
    }

    this.storage.saveInventory(lista);
    this.inventario.set(lista);
    this.mensajeTipo.set('ok');
    this.limpiarForm();
  }
}
