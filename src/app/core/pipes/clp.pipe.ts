import { Pipe, PipeTransform } from '@angular/core';

/** Formatea un número como precio en pesos chilenos (CLP). */
@Pipe({ name: 'clp', standalone: true })
export class ClpPipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(value);
  }
}
