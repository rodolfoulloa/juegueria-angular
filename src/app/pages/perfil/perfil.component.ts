import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="categoria-detalle" aria-labelledby="titulo-perfil">
      <h2 id="titulo-perfil">Modificación de perfil</h2>
      <p class="descripcion-registro">Actualiza tu información desde la sesión activa.</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="row g-3" novalidate>

        <div class="col-12 col-md-6">
          <label class="form-label" for="perfilNombre">Nombre completo</label>
          <input class="form-control" type="text" id="perfilNombre"
                 formControlName="nombre"
                 [class.is-valid]="nombre.valid && nombre.touched"
                 [class.is-invalid]="nombre.invalid && nombre.touched">
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="perfilUsuario">Nombre de usuario</label>
          <input class="form-control" type="text" id="perfilUsuario"
                 formControlName="usuario" readonly>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="perfilCorreo">Correo electrónico</label>
          <input class="form-control" type="email" id="perfilCorreo"
                 formControlName="correo"
                 [class.is-valid]="correo.valid && correo.touched"
                 [class.is-invalid]="correo.invalid && correo.touched">
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="perfilDireccion">Dirección de despacho</label>
          <input class="form-control" type="text" id="perfilDireccion"
                 formControlName="direccion">
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="perfilClave">Nueva contraseña</label>
          <input class="form-control" type="password" id="perfilClave"
                 formControlName="clave"
                 placeholder="Deja vacío para conservar la actual"
                 [class.is-valid]="clave.valid && clave.touched"
                 [class.is-invalid]="clave.invalid && clave.touched">
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
  private fb = inject(FormBuilder);

  form = this.fb.group({
    nombre: ['', Validators.required],
    usuario: [{ value: '', disabled: true }],
    correo: ['', [Validators.required, Validators.email]],
    direccion: [''],
    clave: ['', [this.passwordPatternValidator]]
  });

  mensaje = signal('');
  mensajeTipo = signal<'ok' | 'error' | ''>('');

  get nombre() {
    return this.form.get('nombre')!;
  }

  get correo() {
    return this.form.get('correo')!;
  }

  get clave() {
    return this.form.get('clave')!;
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    const usuario = this.auth.currentUser();
    if (!usuario) return;
    this.form.patchValue({
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      correo: usuario.correo,
      direccion: usuario.direccion || '',
      clave: ''
    });
    this.form.get('usuario')?.disable();
  }

  private passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value || '');
    if (!value) return null;
    return /^(?=.*[A-Z])(?=.*\d).{6,18}$/.test(value) ? null : { passwordPattern: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensaje.set('Revisa nombre y correo antes de guardar tu perfil.');
      this.mensajeTipo.set('error');
      return;
    }

    const rawValues = this.form.getRawValue();
    const resultado = this.auth.updateProfile({
      nombre: String(rawValues.nombre ?? '').trim(),
      correo: String(rawValues.correo ?? '').trim(),
      direccion: String(rawValues.direccion ?? '').trim(),
      contrasena: rawValues.clave ? String(rawValues.clave) : undefined
    });

    if (!resultado.ok) {
      this.mensaje.set(resultado.message ?? 'Error al guardar el perfil.');
      this.mensajeTipo.set('error');
      return;
    }

    this.form.get('clave')?.reset('');
    this.mensaje.set('Perfil actualizado correctamente.');
    this.mensajeTipo.set('ok');
  }
}
