import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-recuperacion',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-recuperacion">
      <h2 id="titulo-recuperacion">Recuperación de contraseña</h2>
      <p class="descripcion-registro">
        Ingresa tu correo y te mostraremos una confirmación simulada en pantalla.
      </p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="row g-3" novalidate>
        <div class="col-12 col-lg-7">
          <label class="form-label" for="recuperacionEmail">Correo electrónico</label>
          <input class="form-control" type="email" id="recuperacionEmail"
                 formControlName="email"
                 [class.is-valid]="email.valid && email.touched"
                 [class.is-invalid]="email.invalid && email.touched">
          <div class="invalid-feedback">Ingresa un correo válido para recuperar tu acceso.</div>
        </div>
        <div class="col-12 col-lg-5 d-flex align-items-end">
          <button class="btn btn-primary w-100" type="submit">Recuperar acceso</button>
        </div>
      </form>

      @if (mensaje()) {
        <p class="mensaje-formulario"
           [class.ok]="mensajeTipo() === 'ok'"
           [class.error]="mensajeTipo() === 'error'"
           role="status" aria-live="polite"
           [innerHTML]="mensaje()">
        </p>
      }
    </section>
  `
})
export class RecuperacionComponent {
  private storage = inject(StorageService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  mensaje = signal('');
  mensajeTipo = signal<'ok' | 'error' | ''>('');

  get email() {
    return this.form.get('email')!;
  }

  onSubmit(): void {
    this.mensaje.set('');
    this.mensajeTipo.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensaje.set('Ingresa un correo válido para recuperar tu acceso.');
      this.mensajeTipo.set('error');
      return;
    }

    const emailLimpio = String(this.email.value ?? '').trim();
    const usuario = this.storage.findUserByEmail(emailLimpio);

    if (!usuario) {
      this.mensaje.set(
        'Si el correo existe en el sistema, enviamos instrucciones de recuperación simuladas.'
      );
      this.mensajeTipo.set('ok');
      this.form.reset();
      return;
    }

    this.mensaje.set(
      `Tu contraseña es: <strong>${usuario.contrasena}</strong>. ` +
      `Usa esta clave junto con tu usuario <strong>${usuario.usuario}</strong> para iniciar sesión.`
    );
    this.mensajeTipo.set('ok');
    this.form.reset();
  }
}
