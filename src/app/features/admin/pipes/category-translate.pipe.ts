import { Pipe, PipeTransform } from '@angular/core';
import es from '@/i18n/es.json';

@Pipe({
  name: 'category',
})
export class CategoryTranslatePipe implements PipeTransform {
  protected readonly i18n = es;

  transform(value: string): string {
    return this.i18n.category[value as keyof typeof this.i18n.category];
  }
}
