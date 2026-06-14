import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';

interface FormRegistro {
  nombre: string;
  usuario: string;
  email: string;
  fechaNacimiento: string;
  clave: string;
  repetirClave: string;
  direccion: string;
}

interface ResumenRegistro {
  nombre: string;
  usuario: string;
  email: string;
  fechaNacimiento: string;
  direccion: string;
}

interface EstadoCampos {
  nombre: boolean | null;
  usuario: boolean | null;
  email: boolean | null;
  fechaNacimiento: boolean | null;
  clave: boolean | null;
  repetirClave: boolean | null;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-registro">
      <h2 id="titulo-registro">Registro de compradores</h2>
      <p class="descripcion-registro">
        Completa tus datos para participar en recompensas por compras frecuentes.
      </p>

      @if (!exitoso()) {
        <form #regForm="ngForm" (ngSubmit)="onSubmit(regForm)"
              class="row g-3" novalidate>

          <!-- Nombre completo -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="nombreCompleto">Nombre completo</label>
            <input class="form-control" type="text" id="nombreCompleto"
                   name="nombreCompleto" [(ngModel)]="form.nombre" required
                   [class.is-valid]="estado.nombre === true"
                   [class.is-invalid]="estado.nombre === false">
            <div class="invalid-feedback">Ingresa tu nombre completo.</div>
          </div>

          <!-- Usuario -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="usuario">Nombre de usuario</label>
            <input class="form-control" type="text" id="usuario"
                   name="usuario" [(ngModel)]="form.usuario" minlength="3" required
                   [class.is-valid]="estado.usuario === true"
                   [class.is-invalid]="estado.usuario === false">
            <div class="invalid-feedback">
              Ingresa un nombre de usuario (mínimo 3 caracteres, sin espacios) y que no esté en uso.
            </div>
          </div>

          <!-- Correo -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="email">Correo electrónico</label>
            <input class="form-control" type="email" id="email"
                   name="email" [(ngModel)]="form.email" required
                   [class.is-valid]="estado.email === true"
                   [class.is-invalid]="estado.email === false">
            <div class="invalid-feedback">Ingresa un correo válido y que no esté en uso.</div>
          </div>

          <!-- Fecha de nacimiento -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="fechaNacimiento">Fecha de nacimiento</label>
            <input class="form-control" type="date" id="fechaNacimiento"
                   name="fechaNacimiento" [(ngModel)]="form.fechaNacimiento" required
                   [class.is-valid]="estado.fechaNacimiento === true"
                   [class.is-invalid]="estado.fechaNacimiento === false">
            <div class="invalid-feedback">Debes tener al menos 13 años para registrarte.</div>
          </div>

          <!-- Contraseña -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="clave">Contraseña</label>
            <input class="form-control" type="password" id="clave"
                   name="clave" [(ngModel)]="form.clave"
                   minlength="6" maxlength="18" required
                   [class.is-valid]="estado.clave === true"
                   [class.is-invalid]="estado.clave === false">
            <div class="form-text">Debe incluir al menos una mayúscula y un número (6 a 18 caracteres).</div>
            <div class="invalid-feedback">La contraseña no cumple los requisitos.</div>
          </div>

          <!-- Repetir contraseña -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="repetirClave">Repetir contraseña</label>
            <input class="form-control" type="password" id="repetirClave"
                   name="repetirClave" [(ngModel)]="form.repetirClave"
                   minlength="6" maxlength="18" required
                   [class.is-valid]="estado.repetirClave === true"
                   [class.is-invalid]="estado.repetirClave === false">
            <div class="invalid-feedback">Las contraseñas deben coincidir.</div>
          </div>

          <!-- Dirección -->
          <div class="col-12">
            <label class="form-label" for="direccion">Dirección de despacho (opcional)</label>
            <textarea class="form-control" id="direccion" name="direccion"
                      [(ngModel)]="form.direccion" rows="2"
                      placeholder="Ejemplo: Av. Siempre Viva 742, Santiago"></textarea>
          </div>

          <div class="col-12 d-flex flex-wrap gap-2 mt-1">
            <button class="btn btn-primary" type="submit">Enviar formulario</button>
            <button class="btn btn-outline-secondary" type="button"
                    (click)="limpiar(regForm)">Limpiar formulario</button>
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
      }

      <!-- Resumen post-registro -->
      @if (exitoso() && resumen()) {
        <div class="resumen-registro">
          <h3>Resumen de registro</h3>
          <ul class="mb-0">
            <li><strong>Nombre:</strong> {{ resumen()!.nombre }}</li>
            <li><strong>Usuario:</strong> {{ resumen()!.usuario }}</li>
            <li><strong>Correo:</strong> {{ resumen()!.email }}</li>
            <li><strong>Fecha de nacimiento:</strong> {{ resumen()!.fechaNacimiento }}</li>
            <li><strong>Dirección:</strong> {{ resumen()!.direccion }}</li>
          </ul>
          <a class="btn btn-primary btn-sm mt-3" routerLink="/login">Ir a Login</a>
        </div>
        <p class="mensaje-formulario ok" role="status">
          Registro enviado correctamente. ¡Bienvenido a La Jueguería!
        </p>
      }
    </section>
  `
})
export class RegistroComponent {
  private storage = inject(StorageService);

  form: FormRegistro = {
    nombre: '',
    usuario: '',
    email: '',
    fechaNacimiento: '',
    clave: '',
    repetirClave: '',
    direccion: ''
  };

  estado: EstadoCampos = {
    nombre: null,
    usuario: null,
    email: null,
    fechaNacimiento: null,
    clave: null,
    repetirClave: null
  };

  exitoso = signal(false);
  resumen = signal<ResumenRegistro | null>(null);
  mensaje = signal('');
  mensajeTipo = signal<'ok' | 'error' | ''>('');

  // ─── Validaciones ────────────────────────────────────────────────────────────

  private edadValida(fecha: string): boolean {
    if (!fecha) return false;
    const hoy = new Date();
    const nac = new Date(fecha + 'T00:00:00');
    if (isNaN(nac.getTime())) return false;
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad >= 13;
  }

  private correoValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private claveValida(clave: string): boolean {
    return /^(?=.*[A-Z])(?=.*\d).{6,18}$/.test(clave);
  }

  private usuarioValido(usuario: string): boolean {
    return /^\S{3,}$/.test(usuario);
  }

  private usuarioDisponible(usuario: string): boolean {
    return !this.storage.getUsers().some(u => u.usuario === usuario);
  }

  private correoDisponible(email: string): boolean {
    const norm = email.trim().toLowerCase();
    return !this.storage.getUsers().some(
      u => (u.correo ?? '').trim().toLowerCase() === norm
    );
  }

  private validar(): boolean {
    const nombreOk = this.form.nombre.trim().length > 0;
    const usuarioOk =
      this.usuarioValido(this.form.usuario) &&
      this.usuarioDisponible(this.form.usuario.trim());
    const emailOk =
      this.correoValido(this.form.email) &&
      this.correoDisponible(this.form.email);
    const fechaOk = this.edadValida(this.form.fechaNacimiento);
    const claveOk = this.claveValida(this.form.clave);
    const repetirOk =
      this.form.repetirClave.length > 0 &&
      this.form.repetirClave === this.form.clave;

    this.estado = {
      nombre: nombreOk,
      usuario: usuarioOk,
      email: emailOk,
      fechaNacimiento: fechaOk,
      clave: claveOk,
      repetirClave: repetirOk
    };

    return nombreOk && usuarioOk && emailOk && fechaOk && claveOk && repetirOk;
  }

  onSubmit(_form: NgForm): void {
    const ok = this.validar();

    if (!ok) {
      if (!this.usuarioDisponible(this.form.usuario.trim())) {
        this.mensaje.set('Ese nombre de usuario ya está registrado. Elige otro distinto.');
      } else if (!this.correoDisponible(this.form.email)) {
        this.mensaje.set('Ese correo ya está registrado. Usa otro o inicia sesión.');
      } else {
        this.mensaje.set('Revisa los campos en rojo para completar tu registro.');
      }
      this.mensajeTipo.set('error');
      return;
    }

    this.storage.upsertUser({
      nombre: this.form.nombre.trim(),
      usuario: this.form.usuario.trim(),
      correo: this.form.email.trim(),
      contrasena: this.form.clave,
      direccion: this.form.direccion.trim(),
      rol: 'cliente'
    });

    const fechaTexto = new Date(
      this.form.fechaNacimiento + 'T00:00:00'
    ).toLocaleDateString('es-CL');

    this.resumen.set({
      nombre: this.form.nombre.trim(),
      usuario: this.form.usuario.trim(),
      email: this.form.email.trim(),
      fechaNacimiento: fechaTexto,
      direccion: this.form.direccion.trim() || 'Sin dirección registrada'
    });

    this.exitoso.set(true);
  }

  limpiar(form: NgForm): void {
    form.resetForm();
    this.form = {
      nombre: '',
      usuario: '',
      email: '',
      fechaNacimiento: '',
      clave: '',
      repetirClave: '',
      direccion: ''
    };
    this.estado = {
      nombre: null, usuario: null, email: null,
      fechaNacimiento: null, clave: null, repetirClave: null
    };
    this.mensaje.set('');
    this.mensajeTipo.set('');
  }
}
