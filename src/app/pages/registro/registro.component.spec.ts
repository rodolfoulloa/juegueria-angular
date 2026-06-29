import { TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { StorageService } from '../../core/services/storage.service';
import { Usuario } from '../../core/models/models';

describe('RegistroComponent', () => {
  let component: RegistroComponent;

  const storageMock: Pick<StorageService, 'getUsers' | 'upsertUser'> = {
    getUsers: jasmine.createSpy('getUsers').and.returnValue([] as Usuario[]),
    upsertUser: jasmine.createSpy('upsertUser')
  };

  function birthDateForAge(age: number, dayOffset = 0): string {
    const today = new Date();
    return new Date(
      today.getFullYear() - age,
      today.getMonth(),
      today.getDate() + dayOffset
    )
      .toISOString()
      .slice(0, 10);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegistroComponent],
      providers: [{ provide: StorageService, useValue: storageMock }]
    });

    const fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
  });

  it('should mark email as invalid when format is incorrect', () => {
    component.form.patchValue({ email: 'correo-invalido' });
    component.email.markAsTouched();

    expect(component.email.hasError('email')).toBeTrue();
    expect(component.email.invalid).toBeTrue();
  });

  it('should fail when password does not include uppercase and number', () => {
    component.form.patchValue({ clave: 'password' });
    component.clave.markAsTouched();

    expect(component.clave.hasError('passwordPattern')).toBeTrue();
    expect(component.clave.invalid).toBeTrue();
  });

  it('should set form tooYoung error when age is less than 13', () => {
    component.form.patchValue({ fechaNacimiento: birthDateForAge(12) });
    component.fechaNacimiento.markAsTouched();
    component.form.updateValueAndValidity();

    expect(component.form.hasError('tooYoung')).toBeTrue();
    expect(component.form.invalid).toBeTrue();
  });

  it('should set form passwordMismatch error when passwords do not match', () => {
    component.form.patchValue({
      clave: 'Password1',
      repetirClave: 'Password2'
    });
    component.repetirClave.markAsTouched();
    component.form.updateValueAndValidity();

    expect(component.form.hasError('passwordMismatch')).toBeTrue();
    expect(component.form.invalid).toBeTrue();
  });

  it('should reset all fields and ui state on limpiar', () => {
    component.form.patchValue({
      nombre: 'Ana Perez',
      usuario: 'anap',
      email: 'ana@mail.com',
      fechaNacimiento: birthDateForAge(20),
      clave: 'Password1',
      repetirClave: 'Password1',
      direccion: 'Santiago'
    });
    component.mensaje.set('Error');
    component.mensajeTipo.set('error');
    component.exitoso.set(true);

    component.limpiar();

    expect(component.form.getRawValue()).toEqual({
      nombre: '',
      usuario: '',
      email: '',
      fechaNacimiento: '',
      clave: '',
      repetirClave: '',
      direccion: ''
    });
    expect(component.mensaje()).toBe('');
    expect(component.mensajeTipo()).toBe('');
    expect(component.exitoso()).toBeFalse();
  });
});
