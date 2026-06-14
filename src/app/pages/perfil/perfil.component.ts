import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-perfil">
      <h2 id="titulo-perfil">Modificación de perfil</h2>
      <p class="descripcion-registro">Actualiza tu información desde la sesión activa.</p>

      <form (ngSubmit)="onSubmit()" class="row g-3" novalidate>

        <div class="col-12 col-md-6">
          <label class="form-label" for="perfilNombre">Nombre completo</label>
          <input class="form-control" type="text" id="perfilNombre"
                 name="nombre" [(ngModel)]="form.nombre" required>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="perfilUsuario">Nombre de usuario</label>
          <input class="form-control" type="text" id="perfilUsuario"
                 name="usuario" [ngModel]="form.usuario" readonly>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="perfilCorreo">Correo electrónico</label>
          <input class="form-control" type="email" id="perfilCorreo"
                 name="correo" [(ngModel)]="form.correo" required>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="perfilDireccion">Dirección de despacho</label>
          <input class="form-control" type="text" id="perfilDireccion"
                 name="direccion" [(ngModel)]="form.direccion">
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="perfilClave">Nueva contraseña</label>
          <input class="form-control" type="password" id="perfilClave"
                 name="clave" [(ngModel)]="form.clave"
                 placeholder="Deja vacío para conservar la actual">
          <div class="form-text">Si la cambias, debe incluir una mayúscula y un número.</div>
        </div>

        <div class="col-12 d-flex flex-wrap gap-2 mt-1">
          <button class="btn btn-primary" type="submit">Guardar cambios</button>
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
    </section>
  `
})
export class PerfilComponent implements OnInit {
  private auth = inject(AuthService);

  form = {
    nombre: '',
    usuario: '',
    correo: '',
    direccion: '',
    clave: ''
  };

  mensaje = signal('');
  mensajeTipo = signal<'ok' | 'error' | ''>('');

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    const usuario = this.auth.currentUser();
    if (!usuario) return;
    this.form = {
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      correo: usuario.correo,
      direccion: usuario.direccion,
      clave: ''
    };
  }

  private correoValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private claveValida(clave: string): boolean {
    return /^(?=.*[A-Z])(?=.*\d).{6,18}$/.test(clave);
  }

  onSubmit(): void {
    if (!this.form.nombre.trim() || !this.correoValido(this.form.correo.trim())) {
      this.mensaje.set('Revisa nombre y correo antes de guardar tu perfil.');
      this.mensajeTipo.set('error');
      return;
    }

    if (this.form.clave && !this.claveValida(this.form.clave)) {
      this.mensaje.set('La nueva contraseña no cumple los requisitos.');
      this.mensajeTipo.set('error');
      return;
    }

    const resultado = this.auth.updateProfile({
      nombre: this.form.nombre.trim(),
      correo: this.form.correo.trim(),
      direccion: this.form.direccion.trim(),
      contrasena: this.form.clave || undefined
    });

    if (!resultado.ok) {
      this.mensaje.set(resultado.message ?? 'Error al guardar el perfil.');
      this.mensajeTipo.set('error');
      return;
    }

    this.form.clave = '';
    this.mensaje.set('Perfil actualizado correctamente.');
    this.mensajeTipo.set('ok');
  }
}
