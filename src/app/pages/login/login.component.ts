import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-login">
      <h2 id="titulo-login">Inicio de sesión</h2>
      <p class="descripcion-registro">
        Accede con un usuario registrado o con la cuenta de prueba
        <strong>admin / admin123</strong>.
      </p>

      <form (ngSubmit)="onSubmit()" class="row g-3" novalidate>
        <div class="col-12 col-lg-6">
          <label class="form-label" for="loginIdentificador">Usuario o correo</label>
          <input class="form-control" type="text" id="loginIdentificador"
                 name="identificador" [(ngModel)]="identificador" required>
        </div>

        <div class="col-12 col-lg-6">
          <label class="form-label" for="loginClave">Contraseña</label>
          <input class="form-control" type="password" id="loginClave"
                 name="clave" [(ngModel)]="clave" required>
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

  identificador = '';
  clave = '';

  mensaje = signal('');
  mensajeTipo = signal<'ok' | 'error' | ''>('');

  onSubmit(): void {
    if (!this.identificador.trim() || !this.clave) {
      this.setMensaje('Debes completar ambos campos para iniciar sesión.', 'error');
      return;
    }

    const resultado = this.auth.login(this.identificador, this.clave);

    if (!resultado.ok) {
      this.setMensaje(resultado.message ?? 'Error al iniciar sesión.', 'error');
      return;
    }

    const usuario = this.auth.currentUser()!;
    this.cart.mergeGuestCart(usuario.usuario);
    this.setMensaje('Inicio de sesión correcto.', 'ok');

    // Redirigir según rol
    const destino = usuario.rol === 'administrador' ? '/inventario' : '/perfil';
    setTimeout(() => this.router.navigate([destino]), 600);
  }

  private setMensaje(texto: string, tipo: 'ok' | 'error'): void {
    this.mensaje.set(texto);
    this.mensajeTipo.set(tipo);
  }
}
