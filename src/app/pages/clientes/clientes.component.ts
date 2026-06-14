import { Component, inject, OnInit, signal } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';
import { Usuario } from '../../core/models/models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-clientes">
      <h2 id="titulo-clientes">Mantenedor de clientes</h2>
      <p class="descripcion-registro">
        Listado de usuarios registrados para revisión administrativa.
      </p>

      @if (clientes().length === 0) {
        <p class="seccion-vacia">No hay clientes registrados todavía.</p>
      } @else {
        <div class="table-responsive">
          <table class="table align-middle tabla-panel">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Dirección</th>
              </tr>
            </thead>
            <tbody>
              @for (cliente of clientes(); track cliente.usuario) {
                <tr>
                  <td>{{ cliente.nombre }}</td>
                  <td>{{ cliente.usuario }}</td>
                  <td>{{ cliente.correo }}</td>
                  <td><span class="rol-chip">{{ cliente.rol }}</span></td>
                  <td>{{ cliente.direccion || 'Sin dirección' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `
})
export class ClientesComponent implements OnInit {
  private storage = inject(StorageService);

  clientes = signal<Usuario[]>([]);

  ngOnInit(): void {
    this.clientes.set(
      this.storage.getUsers().filter(u => u.rol === 'cliente')
    );
  }
}
