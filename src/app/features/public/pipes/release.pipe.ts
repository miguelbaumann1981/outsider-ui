import { Pipe, PipeTransform } from '@angular/core';
import { Release } from '../enums';
import es from '@/i18n/es.json';

@Pipe({
  name: 'release',
})
export class ReleasePipe implements PipeTransform {
  protected readonly i18n = es;
  transform(value: Release): string {
    switch (value) {
      case Release.CURRENT:
        return this.i18n.releases.current;
      case Release.JAN26:
        return this.i18n.releases.jan26;
      case Release.APR26:
        return this.i18n.releases.apr26;
      case Release.JUL26:
        return this.i18n.releases.jul26;
      case Release.OCT26:
        return this.i18n.releases.oct26;
      default:
        return value;
    }
  }
}
