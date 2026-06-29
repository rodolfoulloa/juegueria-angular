import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import {
  minimumAgeValidator,
  noWhitespaceValidator,
  passwordMatchValidator,
  passwordPatternValidator
} from '../../core/validators/registro.validators';

interface ResumenRegistro {
  nombre: string;
  usuario: string;
  email: string;
  fechaNacimiento: string;
  direccion: string;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-registro">
      <h2 id="titulo-registro">Registro de compradores</h2>
      <p class="descripcion-registro">
        Completa tus datos para participar en recompensas por compras frecuentes.
      </p>

      @if (!exitoso()) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()"
              class="row g-3" novalidate>

          <!-- Nombre completo -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="nombreCompleto">Nombre completo</label>
            <input class="form-control" type="text" id="nombreCompleto"
                   formControlName="nombre"
                   [class.is-valid]="nombre.valid && nombre.touched"
                   [class.is-invalid]="nombre.invalid && nombre.touched">
            <div class="invalid-feedback">Ingresa tu nombre completo.</div>
          </div>

          <!-- Usuario -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="usuario">Nombre de usuario</label>
            <input class="form-control" type="text" id="usuario"
                   formControlName="usuario"
                   [class.is-valid]="usuario.valid && usuario.touched"
                   [class.is-invalid]="usuario.invalid && usuario.touched">
            <div class="invalid-feedback">
              Ingresa un nombre de usuario (mínimo 3 caracteres, sin espacios) y que no esté en uso.
            </div>
          </div>

          <!-- Correo -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="email">Correo electrónico</label>
            <input class="form-control" type="email" id="email"
                   formControlName="email"
                   [class.is-valid]="email.valid && email.touched"
                   [class.is-invalid]="email.invalid && email.touched">
            <div class="invalid-feedback">Ingresa un correo válido y que no esté en uso.</div>
          </div>

          <!-- Fecha de nacimiento -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="fechaNacimiento">Fecha de nacimiento</label>
            <input class="form-control" type="date" id="fechaNacimiento"
                   formControlName="fechaNacimiento"
                   [class.is-valid]="fechaNacimiento.valid && !form.hasError('tooYoung') && fechaNacimiento.touched"
                   [class.is-invalid]="(fechaNacimiento.invalid || form.hasError('tooYoung')) && fechaNacimiento.touched">
            <div class="invalid-feedback">
              @if (form.hasError('tooYoung') && fechaNacimiento.touched) {
                Debes tener al menos 13 años para registrarte.
              } @else {
                Ingresa una fecha de nacimiento válida.
              }
            </div>
          </div>

          <!-- Contraseña -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="clave">Contraseña</label>
            <input class="form-control" type="password" id="clave"
                   formControlName="clave"
                   [class.is-valid]="clave.valid && clave.touched"
                   [class.is-invalid]="clave.invalid && clave.touched">
            <div class="form-text">Debe incluir al menos una mayúscula y un número (6 a 18 caracteres).</div>
            <div class="invalid-feedback">La contraseña no cumple los requisitos.</div>
          </div>

          <!-- Repetir contraseña -->
          <div class="col-12 col-md-6">
            <label class="form-label" for="repetirClave">Repetir contraseña</label>
            <input class="form-control" type="password" id="repetirClave"
                   formControlName="repetirClave"
                   [class.is-valid]="repetirClave.valid && !form.hasError('passwordMismatch') && repetirClave.touched"
                   [class.is-invalid]="(repetirClave.invalid || form.hasError('passwordMismatch')) && repetirClave.touched">
            <div class="invalid-feedback">
              @if (form.hasError('passwordMismatch') && repetirClave.touched) {
                Las contraseñas deben coincidir.
              } @else {
                Confirma tu contraseña para continuar.
              }
            </div>
          </div>

          <!-- Dirección -->
          <div class="col-12">
            <label class="form-label" for="direccion">Dirección de despacho (opcional)</label>
            <textarea class="form-control" id="direccion" formControlName="direccion"
                      rows="2"
                      placeholder="Ejemplo: Av. Siempre Viva 742, Santiago"></textarea>
          </div>

          <div class="col-12 d-flex flex-wrap gap-2 mt-1">
            <button class="btn btn-primary" type="submit">Enviar formulario</button>
            <button class="btn btn-outline-secondary" type="button"
                    (click)="limpiar()">Limpiar formulario</button>
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
  private fb = inject(FormBuilder);

  form = this.fb.group({
    nombre: ['', Validators.required],
    usuario: ['', [Validators.required, Validators.minLength(3), noWhitespaceValidator]],
    email: ['', [Validators.required, Validators.email]],
    fechaNacimiento: ['', Validators.required],
    clave: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18), passwordPatternValidator]],
    repetirClave: ['', Validators.required],
    direccion: ['']
  }, { validators: [passwordMatchValidator(), minimumAgeValidator(13)] });

  exitoso = signal(false);
  resumen = signal<ResumenRegistro | null>(null);
  mensaje = signal('');
  mensajeTipo = signal<'ok' | 'error' | ''>('');

  get nombre() {
    return this.form.get('nombre')!;
  }

  get usuario() {
    return this.form.get('usuario')!;
  }

  get email() {
    return this.form.get('email')!;
  }

  get fechaNacimiento() {
    return this.form.get('fechaNacimiento')!;
  }

  get clave() {
    return this.form.get('clave')!;
  }

  get repetirClave() {
    return this.form.get('repetirClave')!;
  }

  onSubmit(): void {
    this.mensaje.set('');
    this.mensajeTipo.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const usuarioValue = this.usuario.value?.trim() ?? '';
      const emailValue = this.email.value?.trim() ?? '';

      if (usuarioValue && !this.usuarioDisponible(usuarioValue)) {
        this.mensaje.set('Ese nombre de usuario ya está registrado. Elige otro distinto.');
      } else if (emailValue && !this.correoDisponible(emailValue)) {
        this.mensaje.set('Ese correo ya está registrado. Usa otro o inicia sesión.');
      } else {
        this.mensaje.set('Revisa los campos en rojo para completar tu registro.');
      }
      this.mensajeTipo.set('error');
      return;
    }

    const values = this.form.getRawValue();
    this.storage.upsertUser({
      nombre: String(values.nombre ?? '').trim(),
      usuario: String(values.usuario ?? '').trim(),
      correo: String(values.email ?? '').trim(),
      contrasena: String(values.clave ?? ''),
      direccion: String(values.direccion ?? '').trim(),
      rol: 'cliente'
    });

    const fechaTexto = new Date(String(values.fechaNacimiento ?? '') + 'T00:00:00').toLocaleDateString('es-CL');
    this.resumen.set({
      nombre: String(values.nombre ?? '').trim(),
      usuario: String(values.usuario ?? '').trim(),
      email: String(values.email ?? '').trim(),
      fechaNacimiento: fechaTexto,
      direccion: String(values.direccion ?? '').trim() || 'Sin dirección registrada'
    });

    this.exitoso.set(true);
  }

  limpiar(): void {
    this.form.reset({
      nombre: '',
      usuario: '',
      email: '',
      fechaNacimiento: '',
      clave: '',
      repetirClave: '',
      direccion: ''
    });
    this.mensaje.set('');
    this.mensajeTipo.set('');
    this.exitoso.set(false);
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
}
