import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-login">
      <h2 id="titulo-login">Inicio de sesión</h2>
      <p class="descripcion-registro">
        Accede con un usuario registrado o con la cuenta de prueba
        <strong>admin / admin123</strong>.
      </p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="row g-3" novalidate>
        <div class="col-12 col-lg-6">
          <label class="form-label" for="loginIdentificador">Usuario o correo</label>
          <input class="form-control" type="text" id="loginIdentificador"
                 formControlName="identificador"
                 [class.is-valid]="identificador.valid && identificador.touched"
                 [class.is-invalid]="identificador.invalid && identificador.touched">
          <div class="invalid-feedback">Ingresa tu usuario o correo.</div>
        </div>

        <div class="col-12 col-lg-6">
          <label class="form-label" for="loginClave">Contraseña</label>
          <input class="form-control" type="password" id="loginClave"
                 formControlName="clave"
                 [class.is-valid]="clave.valid && clave.touched"
                 [class.is-invalid]="clave.invalid && clave.touched">
          <div class="invalid-feedback">Ingresa tu contraseña.</div>
        </div>

        <div class="col-12 d-flex flex-wrap gap-2 mt-1">
          <button class="btn btn-primary" type="submit">Ingresar</button>
          <a class="btn btn-outline-secondary" routerLink="/recuperacion">
            Olvidé mi contraseña
          </a>
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
export class LoginComponent {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    identificador: ['', Validators.required],
    clave: ['', Validators.required]
  });

  mensaje = signal('');
  mensajeTipo = signal<'ok' | 'error' | ''>('');

  get identificador() {
    return this.form.get('identificador')!;
  }

  get clave() {
    return this.form.get('clave')!;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.setMensaje('Debes completar ambos campos para iniciar sesión.', 'error');
      return;
    }

    const { identificador, clave } = this.form.getRawValue();
    const resultado = this.auth.login(String(identificador).trim(), String(clave));

    if (!resultado.ok) {
      this.setMensaje(resultado.message ?? 'Error al iniciar sesión.', 'error');
      return;
    }

    const usuario = this.auth.currentUser()!;
    this.cart.mergeGuestCart(usuario.usuario);
    this.setMensaje('Inicio de sesión correcto.', 'ok');

    const destino = usuario.rol === 'administrador' ? '/inventario' : '/perfil';
    setTimeout(() => this.router.navigate([destino]), 600);
  }

  private setMensaje(texto: string, tipo: 'ok' | 'error'): void {
    this.mensaje.set(texto);
    this.mensajeTipo.set(tipo);
  }
}
