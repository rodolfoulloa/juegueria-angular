import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value || '');
  return value.trim().length === value.length ? null : { whitespace: true };
}

export function passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value || '');
  return /^(?=.*[A-Z])(?=.*\d).{6,18}$/.test(value) ? null : { passwordPattern: true };
}

export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const clave = group.get('clave')?.value;
    const repetir = group.get('repetirClave')?.value;
    return clave && repetir && clave !== repetir ? { passwordMismatch: true } : null;
  };
}

export function minimumAgeValidator(minAge = 13): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fecha = group.get('fechaNacimiento')?.value;
    if (!fecha) return null;

    const hoy = new Date();
    const nac = new Date(fecha + 'T00:00:00');
    if (isNaN(nac.getTime())) return { invalidDate: true };

    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) {
      edad--;
    }

    return edad >= minAge ? null : { tooYoung: true };
  };
}
