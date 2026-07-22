import { Pipe, PipeTransform } from '@angular/core';
import { Release } from '../enums';

@Pipe({
  name: 'release',
})
export class ReleasePipe implements PipeTransform {
  transform(value: Release): string {
    switch (value) {
      case Release.JAN26:
        return 'Enero 2026';
      case Release.APR26:
        return 'Abril 2026';
      case Release.JUL26:
        return 'Julio 2026';
      case Release.OCT26:
        return 'Octubre 2026';
      case Release.CURRENT:
        return 'Número actual';
      default:
        return '';
    }
  }
}
