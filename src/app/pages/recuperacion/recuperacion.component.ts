import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-recuperacion',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-recuperacion">
      <h2 id="titulo-recuperacion">Recuperación de contraseña</h2>
      <p class="descripcion-registro">
        Ingresa tu correo y te mostraremos una confirmación simulada en pantalla.
      </p>

      <form (ngSubmit)="onSubmit()" class="row g-3" novalidate>
        <div class="col-12 col-lg-7">
          <label class="form-label" for="recuperacionEmail">Correo electrónico</label>
          <input class="form-control" type="email" id="recuperacionEmail"
                 name="email" [(ngModel)]="email" required>
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

  email = '';
  mensaje = signal('');
  mensajeTipo = signal<'ok' | 'error' | ''>('');

  private correoValido(valor: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  onSubmit(): void {
    const emailLimpio = this.email.trim();

    if (!this.correoValido(emailLimpio)) {
      this.mensaje.set('Ingresa un correo válido para recuperar tu acceso.');
      this.mensajeTipo.set('error');
      return;
    }

    const usuario = this.storage.findUserByEmail(emailLimpio);

    if (!usuario) {
      this.mensaje.set(
        'Si el correo existe en el sistema, enviamos instrucciones de recuperación simuladas.'
      );
      this.mensajeTipo.set('ok');
      this.email = '';
      return;
    }

    this.mensaje.set(
      `Tu contraseña es: <strong>${usuario.contrasena}</strong>. ` +
      `Usa esta clave junto con tu usuario <strong>${usuario.usuario}</strong> para iniciar sesión.`
    );
    this.mensajeTipo.set('ok');
    this.email = '';
  }
}
