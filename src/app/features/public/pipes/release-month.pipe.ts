import { Pipe, PipeTransform } from '@angular/core';
import es from '@/i18n/es.json';
import { ReleaseMonth } from '../types';

@Pipe({
  name: 'releaseMonth',
})
export class ReleaseMonthPipe implements PipeTransform {
  protected readonly i18n = es;

  transform(value: ReleaseMonth): string {
    switch (value) {
      case '1':
        return this.i18n.months.january;
      case '2':
        return this.i18n.months.february;
      case '3':
        return this.i18n.months.march;
      case '4':
        return this.i18n.months.april;
      case '5':
        return this.i18n.months.may;
      case '6':
        return this.i18n.months.june;
      case '7':
        return this.i18n.months.july;
      case '8':
        return this.i18n.months.august;
      case '9':
        return this.i18n.months.september;
      case '10':
        return this.i18n.months.october;
      case '11':
        return this.i18n.months.november;
      case '12':
        return this.i18n.months.december;

      default:
        return value;
    }
  }
}
